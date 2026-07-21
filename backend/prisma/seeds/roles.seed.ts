import { PrismaClient, Role } from "@prisma/client";

export interface SeedResult {
  category: string;
  created: number;
  skipped: number;
  failed: number;
}

export const DEFAULT_ROLES = [
  {
    code: Role.SUPER_ADMIN,
    name: "Super Administrator",
    description: "Full global system access across all universities and microservices",
    isSystem: true
  },
  {
    code: Role.UNIVERSITY_ADMIN,
    name: "University Administrator",
    description: "Full administrative access within assigned university tenant",
    isSystem: true
  },
  {
    code: Role.HOD,
    name: "Head of Department",
    description: "Departmental academic oversight, course approval, and faculty management",
    isSystem: true
  },
  {
    code: Role.FACULTY,
    name: "Faculty Member",
    description: "Course management, grading, syllabus authoring, and attendance marking",
    isSystem: true
  },
  {
    code: Role.STUDENT,
    name: "Student",
    description: "Course viewing, attendance tracking, exam results, and AI assistant access",
    isSystem: true
  },
  {
    code: Role.ACCOUNTANT,
    name: "University Accountant",
    description: "Fee management, payment receipts, and financial reporting",
    isSystem: true
  },
  {
    code: Role.LIBRARIAN,
    name: "Librarian",
    description: "Library catalog management and book issue tracking",
    isSystem: true
  },
  {
    code: Role.EXAM_CONTROLLER,
    name: "Controller of Examinations",
    description: "Exam schedule publishing, grade locking, and re-evaluation resolution",
    isSystem: true
  },
  {
    code: Role.PLACEMENT_OFFICER,
    name: "Placement Officer",
    description: "Campus drive organization, student resume verification, and recruiter portals",
    isSystem: true
  },
  {
    code: Role.HOSTEL_ADMIN,
    name: "Hostel Warden / Administrator",
    description: "Hostel room allocation and student residence management",
    isSystem: true
  },
  {
    code: Role.PARENT,
    name: "Parent / Guardian",
    description: "Read-only access to ward attendance, fee status, and result summaries",
    isSystem: true
  }
];

export async function seedRoles(prisma: PrismaClient): Promise<SeedResult> {
  const result: SeedResult = { category: "Roles", created: 0, skipped: 0, failed: 0 };

  for (const roleData of DEFAULT_ROLES) {
    try {
      const existing = await prisma.roleEntity.findUnique({
        where: { code: roleData.code }
      });

      if (existing) {
        result.skipped++;
      } else {
        await prisma.roleEntity.create({
          data: roleData
        });
        result.created++;
      }
    } catch (error) {
      console.error(`[SEED ERROR] Failed to seed role ${roleData.code}:`, error);
      result.failed++;
    }
  }

  return result;
}
