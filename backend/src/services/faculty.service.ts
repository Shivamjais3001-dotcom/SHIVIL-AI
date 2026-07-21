import { FacultyRepository } from "../repositories/faculty.repository";
import { ApiError } from "../utils/api-error";
import { PaginationParams, buildPaginatedMeta } from "../utils/pagination";
import bcrypt from "bcryptjs";
import prisma from "../config/database";

const facultyRepository = new FacultyRepository();

export class FacultyService {
  constructor(private readonly facultyRepo: FacultyRepository = facultyRepository) {}
  async getFaculty(
    params: PaginationParams & { 
      department?: string; 
      designation?: string; 
      status?: string; 
      universityId?: string | null; 
    }
  ) {
    const { total, data, nextCursor } = await facultyRepository.findAndCount(params);
    const meta = buildPaginatedMeta(total, params, nextCursor);
    return { data, meta };
  }

  async getFacultyById(id: string, universityId?: string | null) {
    const faculty = await facultyRepository.findById(id, universityId);
    if (!faculty) {
      throw ApiError.notFound("Faculty profile not found or access unauthorized.");
    }
    return faculty;
  }

  async createFaculty(data: any, defaultUniversityId?: string | null) {
    const existingEmp = await facultyRepository.findByEmployeeId(data.employeeId, defaultUniversityId);
    if (existingEmp) {
      throw ApiError.conflict("A faculty record with this Employee ID already exists.");
    }

    const timeline = [
      {
        type: "JOINING",
        title: "Joined University",
        description: `Faculty profile created and registered successfully on ${new Date().toLocaleDateString()}`,
        date: new Date()
      }
    ];

    const leaveManagement = {
      leaveBalance: 30,
      leaveRequests: []
    };

    const workload = {
      teachingHours: data.workload?.teachingHours || 12,
      extraDuties: data.workload?.extraDuties || [],
      committeeAssignments: data.workload?.committeeAssignments || []
    };

    const performance = {
      teachingScore: 9.0,
      feedbackRating: 4.5,
      studentFeedbackCount: 0,
      aiPerformanceInsights: "Strong student feedback rating. Recommend assigned mentoring duties."
    };

    const facultyData = {
      userId: data.userId,
      employeeId: data.employeeId || null,
      name: data.name,
      department: data.department,
      designation: data.designation || "Assistant Professor",
      joiningDate: data.joiningDate ? new Date(data.joiningDate) : new Date(),
      qualification: data.qualification || "PhD",
      experienceYears: data.experienceYears || 0,
      status: data.status || "Active",
      specialty: data.specialty || null,
      researchArea: data.researchArea || null,
      officeInfo: data.officeInfo || null,
      researchModule: data.researchModule || { papers: [], patents: [], projects: [], grants: [] },
      workload,
      leaveManagement,
      performance,
      documents: data.documents || [],
      timeline
    };

    return facultyRepository.create(facultyData);
  }

  async updateFaculty(id: string, universityId: string | null, data: any) {
    const faculty = await this.getFacultyById(id, universityId);

    const existingTimeline = Array.isArray((faculty as any).timeline) ? ((faculty as any).timeline as any[]) : [];
    const timelineUpdates = [...existingTimeline];

    if (data.designation && data.designation !== faculty.designation) {
      timelineUpdates.push({
        type: "PROMOTION",
        title: "Promotion Registered",
        description: `Promoted from ${faculty.designation} to ${data.designation}`,
        date: new Date()
      });
    }

    if (data.department && data.department !== faculty.department) {
      timelineUpdates.push({
        type: "DEPARTMENT_TRANSFER",
        title: "Department Transfer",
        description: `Transferred from ${faculty.department} to ${data.department}`,
        date: new Date()
      });
    }

    return facultyRepository.update(id, {
      ...data,
      timeline: timelineUpdates
    });
  }

  async archiveFaculty(id: string, universityId: string | null) {
    const faculty = await this.getFacultyById(id, universityId);
    const existingTimeline = Array.isArray((faculty as any).timeline) ? ((faculty as any).timeline as any[]) : [];
    const timelineUpdates = [
      ...existingTimeline,
      {
        type: "ARCHIVE",
        title: "Profile Archived",
        description: "Faculty registry profile set to Archived status",
        date: new Date()
      }
    ];

    return facultyRepository.update(id, {
      status: "Archived",
      timeline: timelineUpdates
    });
  }

  async restoreFaculty(id: string, universityId: string | null) {
    await this.getFacultyById(id, universityId);
    return facultyRepository.restore(id);
  }

  async deleteFaculty(id: string, universityId: string | null) {
    await this.getFacultyById(id, universityId);
    return facultyRepository.delete(id);
  }

  async getTimeline(id: string, universityId: string | null) {
    const faculty = await this.getFacultyById(id, universityId);
    return (faculty as any).timeline || [];
  }

  async getSummaryMetrics(universityId: string | null) {
    return facultyRepository.getSummaryMetrics(universityId);
  }

  // --- LEAVE MANAGEMENT ACTIONS ---
  async applyLeave(id: string, universityId: string | null, details: { type: string; startDate: string; endDate: string; reason: string }) {
    const faculty = await this.getFacultyById(id, universityId);
    const leaveData = (faculty as any).leaveManagement || { leaveBalance: 30, leaveRequests: [] };

    const start = new Date(details.startDate);
    const end = new Date(details.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (leaveData.leaveBalance < days) {
      throw ApiError.badRequest(`Insufficient leave balance. Requested: ${days}, Available: ${leaveData.leaveBalance}`);
    }

    const newRequest = {
      id: `req_${Math.random().toString(36).substr(2, 9)}`,
      type: details.type,
      startDate: details.startDate,
      endDate: details.endDate,
      reason: details.reason,
      days,
      status: "PENDING",
      createdAt: new Date()
    };

    const requests = Array.isArray(leaveData.leaveRequests) ? [...leaveData.leaveRequests] : [];
    requests.push(newRequest);

    return facultyRepository.update(id, {
      leaveManagement: {
        ...leaveData,
        leaveRequests: requests
      }
    });
  }

  async approveRejectLeave(id: string, universityId: string | null, requestId: string, action: "APPROVED" | "REJECTED") {
    const faculty = await this.getFacultyById(id, universityId);
    const leaveData = (faculty as any).leaveManagement || { leaveBalance: 30, leaveRequests: [] };
    const requests = Array.isArray(leaveData.leaveRequests) ? [...leaveData.leaveRequests] : [];
    
    const requestIndex = requests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) {
      throw ApiError.notFound("Leave request item not found.");
    }

    const request = requests[requestIndex];
    if (request.status !== "PENDING") {
      throw ApiError.badRequest(`Cannot update leave request with current status: ${request.status}`);
    }

    request.status = action;

    let balance = leaveData.leaveBalance;
    const existingTimeline = Array.isArray((faculty as any).timeline) ? ((faculty as any).timeline as any[]) : [];
    const timelineUpdates = [...existingTimeline];

    if (action === "APPROVED") {
      balance = Math.max(0, balance - request.days);
      timelineUpdates.push({
        type: "LEAVE_APPROVED",
        title: "Leave Approved",
        description: `Approved ${request.days} days of ${request.type} leave starting on ${request.startDate}`,
        date: new Date()
      });
    }

    return facultyRepository.update(id, {
      leaveManagement: {
        leaveBalance: balance,
        leaveRequests: requests
      },
      timeline: timelineUpdates
    });
  }

  async getWorkload(id: string, universityId: string | null) {
    const faculty = await this.getFacultyById(id, universityId);
    return {
      workload: (faculty as any).workload || {},
      schedules: (faculty as any).schedules || []
    };
  }

  // --- BULK OPERATIONS ---
  async bulkImport(facultiesList: any[], universityId: string | null) {
    const results = {
      imported: 0,
      failed: 0,
      errors: [] as string[]
    };

    await prisma.$transaction(async (tx) => {
      const passwordHash = await bcrypt.hash("FacultyPassword123!", 12);

      for (const item of facultiesList) {
        try {
          if (!item.employeeId || !item.name || !item.email || !item.department) {
            throw new Error(`Missing mandatory columns for faculty: ${item.name || "Unknown"}`);
          }

          let userRecord = await tx.user.findUnique({
            where: { email: item.email }
          });

          if (!userRecord) {
            userRecord = await tx.user.create({
              data: {
                email: item.email,
                passwordHash,
                role: "FACULTY",
                isVerified: true,
                universityId
              } as any
            });
          }

          const existingEmp = await tx.faculty.findFirst({
            where: { employeeId: item.employeeId, deletedAt: null }
          });
          if (existingEmp) {
            throw new Error(`Employee ID ${item.employeeId} already registered`);
          }

          const timeline = [
            {
              type: "JOINING",
              title: "Profile Imported",
              description: `Faculty profile imported via batch process on ${new Date().toLocaleDateString()}`,
              date: new Date()
            }
          ];

          await tx.faculty.create({
            data: {
              userId: userRecord.id,
              employeeId: item.employeeId,
              name: item.name,
              department: item.department,
              designation: item.designation || "Assistant Professor",
              qualification: item.qualification || "PhD",
              experienceYears: parseInt(item.experienceYears) || 0,
              status: item.status || "Active",
              specialty: item.specialty || null,
              researchArea: item.researchArea || null,
              workload: { teachingHours: 12, extraDuties: [], committeeAssignments: [] },
              leaveManagement: { leaveBalance: 30, leaveRequests: [] },
              performance: { teachingScore: 9.0, feedbackRating: 4.5, studentFeedbackCount: 0, aiPerformanceInsights: "Imported." },
              timeline
            } as any
          });

          results.imported += 1;
        } catch (err: any) {
          results.failed += 1;
          results.errors.push(`Row ${results.imported + results.failed}: ${err.message}`);
        }
      }
    });

    return results;
  }

  async bulkExport(universityId: string | null) {
    const { data } = await facultyRepository.findAndCount({
      page: 1,
      limit: 100000,
      sort: "name",
      order: "asc",
      search: "",
      universityId
    });

    const headers = "Name,Employee ID,Department,Designation,Qualification,Experience Years,Status,Research Area,Specialty\n";
    const rows = data.map((f: any) => {
      return `"${f.name}","${f.employeeId || ""}","${f.department}","${f.designation}","${f.qualification}","${f.experienceYears}","${f.status}","${f.researchArea || ""}","${f.specialty || ""}"`;
    }).join("\n");

    return headers + rows;
  }
}
