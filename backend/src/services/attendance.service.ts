import { AttendanceRepository } from "../repositories/attendance.repository";
import { ApiError } from "../utils/api-error";
import { PaginationParams, buildPaginatedMeta } from "../utils/pagination";

const attendanceRepository = new AttendanceRepository();

export class AttendanceService {
  async getAttendance(
    params: {
      page: number;
      limit: number;
      studentId?: string;
      subjectId?: string;
      sessionId?: string;
      status?: string;
      universityId?: string | null;
    }
  ) {
    const { total, data } = await attendanceRepository.findAndCount(params);
    const paginationParams = { page: params.page, limit: params.limit, sort: "date", order: "desc" as const, search: "" };
    const meta = buildPaginatedMeta(total, paginationParams);
    return { data, meta };
  }

  async startSession(data: any) {
    const qrCode = `qr_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const sessionData = {
      subjectId: data.subjectId,
      facultyId: data.facultyId,
      section: data.section,
      semester: data.semester,
      classroom: data.classroom || null,
      startTime: data.startTime,
      endTime: data.endTime,
      status: "Active",
      method: data.method || "Manual",
      qrCode,
      location: data.location || null
    };

    return attendanceRepository.createSession(sessionData);
  }

  async closeSession(id: string) {
    return attendanceRepository.updateSessionStatus(id, "Closed");
  }

  async studentCheckin(data: any) {
    const session = await attendanceRepository.findSessionById(data.sessionId);
    if (!session) {
      throw ApiError.notFound("Attendance session not found.");
    }

    if (session.status !== "Active") {
      throw ApiError.badRequest("This attendance session is no longer active.");
    }

    let remarks = data.remarks || null;

    // 1. Geofence validation
    if (session.location && typeof session.location === "object" && data.metadata?.lat && data.metadata?.lng) {
      const sLoc = session.location as any;
      const distance = this.calculateDistance(
        sLoc.lat,
        sLoc.lng,
        data.metadata.lat,
        data.metadata.lng
      );

      if (distance > (sLoc.radius || 50)) {
        remarks = remarks 
          ? `${remarks} | GPS geofence breached: ${distance.toFixed(1)}m from class`
          : `GPS geofence breached: ${distance.toFixed(1)}m from class`;
      }
    }

    // 2. Face recognition verification
    if (data.metadata?.faceConfidence !== undefined && data.metadata.faceConfidence < 0.70) {
      remarks = remarks
        ? `${remarks} | Face identification low confidence (${(data.metadata.faceConfidence * 100).toFixed(0)}%)`
        : `Face identification low confidence (${(data.metadata.faceConfidence * 100).toFixed(0)}%)`;
    }

    // 3. QR token verification
    if (session.method === "QR" && data.qrCode && data.qrCode !== session.qrCode) {
      throw ApiError.badRequest("Invalid QR code token. Session code expired or invalid.");
    }

    // Evaluate exam eligibility and risk levels based on previous entries
    const riskLevel = remarks ? "Medium" : "Low";

    const attendanceRecord = {
      date: new Date(),
      status: data.status || "PRESENT",
      studentId: data.studentId,
      subjectId: session.subjectId,
      sessionId: session.id,
      method: data.method || session.method,
      remarks,
      metadata: data.metadata || null,
      riskLevel,
      examEligible: !remarks // flag at-risk on geofence/face breaches
    };

    return attendanceRepository.markStudentAttendance(attendanceRecord);
  }

  async facultyCheckinCheckout(data: any) {
    const today = new Date();
    const existing = await attendanceRepository.findFacultyAttendance(data.facultyId, today);

    if (existing) {
      // 1. If check-in exists, treat as checkout event
      const checkInTime = new Date((existing as any).checkIn);
      const checkOutTime = new Date();
      const workingHours = Math.ceil((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60) * 10) / 10;

      return attendanceRepository.updateFacultyAttendance((existing as any).id, {
        checkOut: checkOutTime,
        workingHours,
        metadata: {
          ...((existing as any).metadata as any || {}),
          checkoutDetails: data.metadata || {}
        }
      });
    } else {
      // 2. Register first check-in
      const checkInRecord = {
        facultyId: data.facultyId,
        date: today,
        checkIn: new Date(),
        status: data.status || "Present",
        metadata: data.metadata || null
      };

      return attendanceRepository.markFacultyAttendance(checkInRecord);
    }
  }

  async getAnomalies(universityId: string | null) {
    return attendanceRepository.findAnomalies(universityId);
  }

  async getAtRiskStudents(universityId: string | null, threshold?: number) {
    return attendanceRepository.findAtRiskStudents(universityId, threshold);
  }

  async getSummaryMetrics(universityId: string | null) {
    return attendanceRepository.getSummaryMetrics(universityId);
  }

  async getReports(type: "student" | "subject" | "faculty", scopeId: string, universityId: string | null) {
    const { data } = await attendanceRepository.findAndCount({
      page: 1,
      limit: 100000,
      studentId: type === "student" ? scopeId : undefined,
      subjectId: type === "subject" ? scopeId : undefined,
      universityId
    });

    const headers = "Date,Student Name,Roll No,Subject Code,Status,Method,Remarks,Risk Level,Exam Eligible\n";
    const rows = data.map((a: any) => {
      const dateStr = a.date.toISOString().split("T")[0];
      return `"${dateStr}","${a.student.name}","${a.student.rollNo}","${a.subject.code}","${a.status}","${a.method}","${a.remarks || ""}","${a.riskLevel}","${a.examEligible}"`;
    }).join("\n");

    return headers + rows;
  }

  // --- HELPER GEOLOCATION DISTANCE (HAVERSINE FORMULA) ---
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
}
