import {
  ProgramRepository,
  ClassroomRepository,
  CourseOfferingRepository,
  EnrollmentRepository,
  AcademicCalendarRepository
} from "../repositories/academic.repository";
import { ApiError } from "../utils/api-error";
import { PaginationParams, buildPaginatedMeta } from "../utils/pagination";
import prisma from "../config/database";

const programRepo = new ProgramRepository();
const classroomRepo = new ClassroomRepository();
const offeringRepo = new CourseOfferingRepository();
const enrollmentRepo = new EnrollmentRepository();
const calendarRepo = new AcademicCalendarRepository();

export class AcademicService {
  async createProgram(data: any, universityId: string | null) {
    return programRepo.create({
      ...data,
      universityId
    });
  }

  async getPrograms(params: { page: number; limit: number; universityId: string | null }) {
    const { total, data } = await programRepo.findAndCount(params);
    const meta = buildPaginatedMeta(total, { page: params.page, limit: params.limit, sort: "code", order: "asc", search: "" });
    return { data, meta };
  }

  async createClassroom(data: any, universityId: string | null) {
    return classroomRepo.create({
      ...data,
      universityId
    });
  }

  async getClassrooms(params: { page: number; limit: number; universityId: string | null }) {
    const { total, data } = await classroomRepo.findAndCount(params);
    const meta = buildPaginatedMeta(total, { page: params.page, limit: params.limit, sort: "building", order: "asc", search: "" });
    return { data, meta };
  }

  async createOffering(data: any) {
    return offeringRepo.create(data);
  }

  async getOfferings(params: {
    page: number;
    limit: number;
    subjectId?: string;
    facultyId?: string;
    semester?: string;
    universityId: string | null;
  }) {
    const { total, data } = await offeringRepo.findAndCount(params);
    const meta = buildPaginatedMeta(total, { page: params.page, limit: params.limit, sort: "section", order: "asc", search: "" });
    return { data, meta };
  }

  // --- AUTOMATED ENROLLMENT & WAITLIST ENGINE ---
  async enrollStudent(studentId: string, offeringId: string) {
    // Enforce database level transaction boundary
    return prisma.$transaction(async (tx) => {
      // 1. Get Offering and current enrollments count
      const offering = await tx.courseOffering.findUnique({
        where: { id: offeringId },
        include: { _count: { select: { enrollments: true } } }
      } as any);

      if (!offering) {
        throw ApiError.notFound("Course offering not found.");
      }

      // Check if student is already enrolled
      const existing = await tx.enrollment.findFirst({
        where: { studentId, offeringId, status: "ENROLLED" }
      } as any);

      if (existing) {
        throw ApiError.conflict("Student is already enrolled in this course offering.");
      }

      const activeEnrollCount = await tx.enrollment.count({
        where: { offeringId, status: "ENROLLED" }
      } as any);

      let status = "ENROLLED";
      if (activeEnrollCount >= (offering as any).maxCapacity) {
        status = "WAITLISTED";
      }

      const enrollmentRecord = await tx.enrollment.create({
        data: {
          studentId,
          offeringId,
          status
        },
        include: { student: true }
      } as any);

      return enrollmentRecord;
    });
  }

  async dropStudent(studentId: string, offeringId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Find the student's active enrollment
      const activeEnroll = await tx.enrollment.findFirst({
        where: { studentId, offeringId, status: "ENROLLED" }
      } as any);

      if (!activeEnroll) {
        throw ApiError.notFound("No active enrollment found for this student.");
      }

      // 2. Mark dropped
      await tx.enrollment.update({
        where: { id: (activeEnroll as any).id },
        data: { status: "DROPPED" }
      } as any);

      // 3. Automated Waitlist promotion
      const nextInWaitlist = await tx.enrollment.findFirst({
        where: { offeringId, status: "WAITLISTED" },
        orderBy: { createdAt: "asc" } // FIFO: First-in, first-out waitlist queue
      } as any);

      if (nextInWaitlist) {
        await tx.enrollment.update({
          where: { id: (nextInWaitlist as any).id },
          data: { status: "ENROLLED" }
        } as any);
      }

      return { status: "SUCCESS", message: "Student dropped. Waitlist updated." };
    });
  }

  async getEnrollments(params: {
    page: number;
    limit: number;
    studentId?: string;
    offeringId?: string;
    universityId: string | null;
  }) {
    const { total, data } = await enrollmentRepo.findAndCount(params);
    const meta = buildPaginatedMeta(total, { page: params.page, limit: params.limit, sort: "createdAt", order: "desc", search: "" });
    return { data, meta };
  }

  // --- CALENDAR EVENTS ---
  async createCalendarEvent(data: any, universityId: string | null) {
    return calendarRepo.create({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      universityId
    });
  }

  async getCalendarEvents(params: { page: number; limit: number; universityId: string | null }) {
    const { total, data } = await calendarRepo.findAndCount(params);
    const meta = buildPaginatedMeta(total, { page: params.page, limit: params.limit, sort: "startDate", order: "asc", search: "" });
    return { data, meta };
  }

  // --- ACADEMIC DASHBOARD & UTILIZATION RATES ---
  async getAcademicDashboard(universityId: string | null) {
    const filter: any = {};
    if (universityId) {
      filter.universityId = universityId;
    }

    const [
      programsCount,
      classroomsCount,
      offeringsCount,
      enrollmentsCount
    ] = await Promise.all([
      prisma.program.count({ where: filter } as any),
      prisma.classroom.count({ where: filter } as any),
      prisma.courseOffering.count({
        where: universityId ? { subject: { course: { universityId } } as any } : {}
      } as any),
      prisma.enrollment.count({
        where: universityId ? { student: { user: { universityId } } as any } : {}
      } as any)
    ]);

    // Room utilization rate: count classrooms with at least one active offering
    const activeRoomsCount = await prisma.classroom.count({
      where: {
        ...filter,
        offerings: { some: {} }
      }
    } as any);

    const roomUtilization = classroomsCount > 0
      ? `${((activeRoomsCount / classroomsCount) * 100).toFixed(1)}%`
      : "0.0%";

    return {
      totalPrograms: programsCount,
      totalClassrooms: classroomsCount,
      totalOfferings: offeringsCount,
      totalEnrollments: enrollmentsCount,
      roomUtilizationRate: roomUtilization
    };
  }
}
