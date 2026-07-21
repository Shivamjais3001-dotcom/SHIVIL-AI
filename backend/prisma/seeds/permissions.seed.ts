import { PrismaClient } from "@prisma/client";
import { SeedResult } from "./roles.seed";

export interface PermissionDefinition {
  code: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export const PRODUCTION_PERMISSIONS: PermissionDefinition[] = [
  // User & Identity Management (users.*)
  { code: "users:create", name: "Create User", resource: "users", action: "create", description: "Create new identity credentials" },
  { code: "users:read", name: "Read User", resource: "users", action: "read", description: "View user profile and authentication status" },
  { code: "users:update", name: "Update User", resource: "users", action: "update", description: "Modify user status, credentials, and settings" },
  { code: "users:delete", name: "Delete User", resource: "users", action: "delete", description: "Soft delete or suspend user account" },
  { code: "users:role:assign", name: "Assign Role", resource: "users", action: "assign_role", description: "Assign or revoke user roles" },

  // Student Subsystem (students.*)
  { code: "students:create", name: "Create Student Profile", resource: "students", action: "create", description: "Register new student record" },
  { code: "students:read", name: "Read Student Profiles", resource: "students", action: "read", description: "View student directory and academic information" },
  { code: "students:update", name: "Update Student Profile", resource: "students", action: "update", description: "Modify student academic or personal details" },
  { code: "students:delete", name: "Delete Student Record", resource: "students", action: "delete", description: "Remove student record from catalog" },

  // Faculty Subsystem (faculty.*)
  { code: "faculty:create", name: "Create Faculty Profile", resource: "faculty", action: "create", description: "Register new faculty staff member" },
  { code: "faculty:read", name: "Read Faculty Profiles", resource: "faculty", action: "read", description: "View faculty directory and department assignments" },
  { code: "faculty:update", name: "Update Faculty Profile", resource: "faculty", action: "update", description: "Modify faculty details, designation, and specialty" },
  { code: "faculty:delete", name: "Delete Faculty Profile", resource: "faculty", action: "delete", description: "Remove faculty staff member" },

  // Course & Curriculum Subsystem (courses.*)
  { code: "courses:create", name: "Create Course", resource: "courses", action: "create", description: "Add new course syllabus to catalog" },
  { code: "courses:read", name: "Read Courses", resource: "courses", action: "read", description: "View course catalog, subjects, and prerequisites" },
  { code: "courses:update", name: "Update Course", resource: "courses", action: "update", description: "Edit course details and syllabus" },
  { code: "courses:delete", name: "Delete Course", resource: "courses", action: "delete", description: "Remove course from catalog" },

  // Attendance Subsystem (attendance.*)
  { code: "attendance:mark", name: "Mark Attendance", resource: "attendance", action: "mark", description: "Mark student lecture attendance" },
  { code: "attendance:read", name: "Read Attendance Records", resource: "attendance", action: "read", description: "View attendance logs and shortage reports" },
  { code: "attendance:update", name: "Modify Attendance", resource: "attendance", action: "update", description: "Edit historical attendance logs" },

  // Examination & Results (exams.*)
  { code: "exams:create", name: "Schedule Examination", resource: "exams", action: "create", description: "Create exam schedule and room allocations" },
  { code: "exams:marks:submit", name: "Submit Exam Marks", resource: "exams", action: "submit_marks", description: "Enter student exam scores" },
  { code: "exams:marks:approve", name: "Approve Exam Marks", resource: "exams", action: "approve_marks", description: "Lock and publish official exam grades" },

  // Analytics & Insights (analytics.*)
  { code: "analytics:view", name: "View Executive Dashboard Analytics", resource: "analytics", action: "view", description: "View university-wide attendance, financial, and academic insights" },

  // AI Orchestration Engine (ai.*)
  { code: "ai:query", name: "Query AI Assistant", resource: "ai", action: "query", description: "Interact with Campus AI Assistant" },
  { code: "ai:insights:generate", name: "Generate AI Academic Insights", resource: "ai", action: "generate_insights", description: "Execute automated attendance shortage predictions" },

  // System Settings & Security (settings.*)
  { code: "settings:read", name: "View System Settings", resource: "settings", action: "read", description: "View system configurations" },
  { code: "settings:update", name: "Modify System Settings", resource: "settings", action: "update", description: "Update university branding, tenant parameters, and security policies" },

  // Notifications (notifications.*)
  { code: "notifications:send", name: "Send Notification", resource: "notifications", action: "send", description: "Broadcast announcements and alert messages" },
  { code: "notifications:read", name: "Read Notifications", resource: "notifications", action: "read", description: "View inbox notifications" }
];

export async function seedPermissions(prisma: PrismaClient): Promise<SeedResult> {
  const result: SeedResult = { category: "Permissions", created: 0, skipped: 0, failed: 0 };

  for (const permData of PRODUCTION_PERMISSIONS) {
    try {
      const existing = await prisma.permission.findUnique({
        where: { code: permData.code }
      });

      if (existing) {
        result.skipped++;
      } else {
        await prisma.permission.create({
          data: permData
        });
        result.created++;
      }
    } catch (error) {
      console.error(`[SEED ERROR] Failed to seed permission ${permData.code}:`, error);
      result.failed++;
    }
  }

  return result;
}
