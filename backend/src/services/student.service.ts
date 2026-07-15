import { StudentRepository } from "../repositories/student.repository";
import { ApiError } from "../utils/api-error";
import { PaginationParams, buildPaginatedMeta } from "../utils/pagination";
import bcrypt from "bcryptjs";
import prisma from "../config/database";

const studentRepository = new StudentRepository();

export class StudentService {
  async getStudents(
    params: PaginationParams & { 
      branch?: string; 
      semester?: string; 
      status?: string; 
      category?: string; 
      scholarship?: string; 
      hostel?: boolean; 
      universityId?: string | null; 
    }
  ) {
    const { total, data, nextCursor } = await studentRepository.findAndCount(params);
    const meta = buildPaginatedMeta(total, params, nextCursor);
    return { data, meta };
  }

  async getStudentById(id: string, universityId?: string | null) {
    const student = await studentRepository.findById(id, universityId);
    if (!student) {
      throw ApiError.notFound("Student record not found or access unauthorized.");
    }
    return student;
  }

  async createStudent(data: any, defaultUniversityId?: string | null) {
    // 1. Verify roll/enrollment unique constraints
    const existingRoll = await studentRepository.findByRoll(data.rollNo, defaultUniversityId);
    if (existingRoll) {
      throw ApiError.conflict("A student with this roll number already exists.");
    }

    if (data.enrollmentNo) {
      const existingEnroll = await studentRepository.findByEnrollment(data.enrollmentNo, defaultUniversityId);
      if (existingEnroll) {
        throw ApiError.conflict("A student with this enrollment number already exists.");
      }
    }

    // 2. Set default structured fields if missing
    const timeline = [
      {
        type: "ADMISSION",
        title: "Admission Registered",
        description: `Student admission profile registered successfully on ${new Date().toLocaleDateString()}`,
        date: new Date()
      }
    ];

    const analytics = {
      cgpa: 0.0,
      gpa: 0.0,
      creditsEarned: 0,
      dropoutRisk: "Low",
      placementProbability: "Medium",
      learningAnalytics: { engagementRate: "100%", assessmentAverage: "0%" },
      aiSummary: "New admission student profile created. Waiting for semester marks ingestion.",
      aiRecommendations: ["Complete library card issuance.", "Verify scholarship documents eligibility."]
    };

    // 3. Create Student profile
    const studentData = {
      userId: data.userId,
      rollNo: data.rollNo,
      enrollmentNo: data.enrollmentNo || null,
      registrationNo: data.registrationNo || null,
      name: data.name,
      branch: data.branch,
      semester: data.semester,
      academicYear: data.academicYear,
      status: data.status || "Active",
      category: data.category || "General",
      scholarship: data.scholarship || "None",
      transport: data.transport || false,
      photoUrl: data.photoUrl || null,
      parentName: data.parentName || null,
      parentContact: data.parentContact || null,
      guardianDetails: data.guardianDetails || null,
      emergencyContact: data.emergencyContact || null,
      medicalInfo: data.medicalInfo || null,
      address: data.address || null,
      documents: data.documents || [],
      timeline,
      analytics
    };

    return studentRepository.create(studentData);
  }

  async updateStudent(id: string, universityId: string | null, data: any) {
    const student = await this.getStudentById(id, universityId);

    // Timeline updates mapping
    const existingTimeline = Array.isArray((student as any).timeline) ? ((student as any).timeline as any[]) : [];
    const timelineUpdates = [...existingTimeline];

    // Log key profile changes to audit timeline
    if (data.semester && data.semester !== student.semester) {
      timelineUpdates.push({
        type: "SEMESTER_PROMOTION",
        title: "Semester Promotion",
        description: `Promoted from ${student.semester} to ${data.semester}`,
        date: new Date()
      });
    }

    if (data.status && data.status !== student.status) {
      timelineUpdates.push({
        type: "STATUS_CHANGE",
        title: "Status Update",
        description: `Status changed from ${student.status} to ${data.status}`,
        date: new Date()
      });
    }

    return studentRepository.update(id, {
      ...data,
      timeline: timelineUpdates
    });
  }

  async archiveStudent(id: string, universityId: string | null) {
    const student = await this.getStudentById(id, universityId);
    const existingTimeline = Array.isArray((student as any).timeline) ? ((student as any).timeline as any[]) : [];
    const timelineUpdates = [
      ...existingTimeline,
      {
        type: "ARCHIVE",
        title: "Record Archived",
        description: "Student registry profile set to Archived status",
        date: new Date()
      }
    ];

    return studentRepository.update(id, {
      status: "Archived",
      timeline: timelineUpdates
    });
  }

  async restoreStudent(id: string, universityId: string | null) {
    await this.getStudentById(id, universityId);
    return studentRepository.restore(id);
  }

  async deleteStudent(id: string, universityId: string | null) {
    await this.getStudentById(id, universityId);
    return studentRepository.delete(id);
  }

  async getTimeline(id: string, universityId: string | null) {
    const student = await this.getStudentById(id, universityId);
    return (student as any).timeline || [];
  }

  async getAnalytics(id: string, universityId: string | null) {
    const student = await this.getStudentById(id, universityId);
    return (student as any).analytics || {};
  }

  async getSummaryMetrics(universityId: string | null) {
    return studentRepository.getSummaryMetrics(universityId);
  }

  // --- BULK OPERATIONS ---
  async bulkImport(studentsList: any[], universityId: string | null) {
    const results = {
      imported: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Use transaction scope to execute batch operations safely
    await prisma.$transaction(async (tx) => {
      const passwordHash = await bcrypt.hash("StudentPassword123!", 12);

      for (const item of studentsList) {
        try {
          if (!item.rollNo || !item.name || !item.email || !item.branch || !item.semester || !item.academicYear) {
            throw new Error(`Missing mandatory columns for student: ${item.name || "Unknown"}`);
          }

          // 1. Check if user already exists
          let userRecord = await tx.user.findUnique({
            where: { email: item.email }
          });

          if (!userRecord) {
            userRecord = await tx.user.create({
              data: {
                email: item.email,
                passwordHash,
                role: "STUDENT",
                isVerified: true,
                universityId
              } as any
            });
          }

          // 2. Validate roll duplicate
          const existingRoll = await tx.student.findFirst({
            where: { rollNo: item.rollNo, deletedAt: null }
          });
          if (existingRoll) {
            throw new Error(`Roll no ${item.rollNo} already registered`);
          }

          // 3. Create Student profile
          const timeline = [
            {
              type: "ADMISSION",
              title: "Admission Imported",
              description: `Admission profile imported via batch process on ${new Date().toLocaleDateString()}`,
              date: new Date()
            }
          ];

          const analytics = {
            cgpa: parseFloat(item.cgpa) || 0.0,
            gpa: parseFloat(item.gpa) || 0.0,
            creditsEarned: parseInt(item.creditsEarned) || 0,
            dropoutRisk: "Low",
            placementProbability: "Medium",
            learningAnalytics: { engagementRate: "100%", assessmentAverage: "0%" },
            aiSummary: "Profile created via bulk migration.",
            aiRecommendations: ["Verify certificates."]
          };

          await tx.student.create({
            data: {
              userId: userRecord.id,
              rollNo: item.rollNo,
              enrollmentNo: item.enrollmentNo || null,
              registrationNo: item.registrationNo || null,
              name: item.name,
              branch: item.branch,
              semester: item.semester,
              academicYear: item.academicYear,
              status: item.status || "Active",
              category: item.category || "General",
              scholarship: item.scholarship || "None",
              transport: item.transport === "true" || item.transport === true,
              parentName: item.parentName || null,
              parentContact: item.parentContact || null,
              timeline,
              analytics
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
    const { data } = await studentRepository.findAndCount({
      page: 1,
      limit: 100000,
      sort: "rollNo",
      order: "asc",
      search: "",
      universityId
    });

    const headers = "Name,Roll No,Enrollment No,Registration No,Branch,Semester,Academic Year,Status,Category,Scholarship,Transport,Parent Name,Parent Contact\n";
    const rows = data.map((s: any) => {
      return `"${s.name}","${s.rollNo}","${s.enrollmentNo || ""}","${s.registrationNo || ""}","${s.branch}","${s.semester}","${s.academicYear}","${s.status}","${s.category}","${s.scholarship}","${s.transport}","${s.parentName || ""}","${s.parentContact || ""}"`;
    }).join("\n");

    return headers + rows;
  }
}
