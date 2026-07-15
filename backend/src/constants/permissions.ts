export enum Permission {
  // University Management
  UNIVERSITY_MANAGE = "UNIVERSITY_MANAGE",
  
  // User & Faculty Management
  FACULTY_CREATE = "FACULTY_CREATE",
  FACULTY_READ = "FACULTY_READ",
  FACULTY_UPDATE = "FACULTY_UPDATE",
  FACULTY_DELETE = "FACULTY_DELETE",
  
  // Student Management
  STUDENT_CREATE = "STUDENT_CREATE",
  STUDENT_READ = "STUDENT_READ",
  STUDENT_UPDATE = "STUDENT_UPDATE",
  STUDENT_DELETE = "STUDENT_DELETE",
  
  // Course Management
  COURSE_CREATE = "COURSE_CREATE",
  COURSE_READ = "COURSE_READ",
  COURSE_UPDATE = "COURSE_UPDATE",
  COURSE_DELETE = "COURSE_DELETE",
  
  // Attendance Management
  ATTENDANCE_MARK = "ATTENDANCE_MARK",
  ATTENDANCE_VIEW = "ATTENDANCE_VIEW",
  
  // Financial/Fees Management
  FEES_MANAGE = "FEES_MANAGE",
  
  // Library Management
  LIBRARY_MANAGE = "LIBRARY_MANAGE",
  
  // Hostel Management
  HOSTEL_MANAGE = "HOSTEL_MANAGE",
  
  // Exam Management — Granular Sprint 8
  EXAM_CREATE = "EXAM_CREATE",
  EXAM_SCHEDULE = "EXAM_SCHEDULE",
  EXAM_LOCK = "EXAM_LOCK",
  EXAM_VIEW = "EXAM_VIEW",
  EXAM_DELETE = "EXAM_DELETE",

  // Marks Management
  MARKS_ENTER = "MARKS_ENTER",
  MARKS_MODERATE = "MARKS_MODERATE",
  MARKS_APPROVE = "MARKS_APPROVE",
  MARKS_VIEW = "MARKS_VIEW",
  MARKS_LOCK = "MARKS_LOCK",

  // Result Management
  RESULT_PROCESS = "RESULT_PROCESS",
  RESULT_VIEW = "RESULT_VIEW",
  TRANSCRIPT_VIEW = "TRANSCRIPT_VIEW",

  // Grading Policy
  GRADING_POLICY_MANAGE = "GRADING_POLICY_MANAGE",
  GRADING_POLICY_VIEW = "GRADING_POLICY_VIEW",

  // Re-evaluation
  REEVALUATION_REQUEST = "REEVALUATION_REQUEST",
  REEVALUATION_PROCESS = "REEVALUATION_PROCESS",

  // Placement Management
  PLACEMENT_MANAGE = "PLACEMENT_MANAGE",
  
  // AI Integrations
  AI_CHAT = "AI_CHAT"
}

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: Object.values(Permission),
  
  UNIVERSITY_ADMIN: [
    Permission.FACULTY_CREATE, Permission.FACULTY_READ, Permission.FACULTY_UPDATE, Permission.FACULTY_DELETE,
    Permission.STUDENT_CREATE, Permission.STUDENT_READ, Permission.STUDENT_UPDATE, Permission.STUDENT_DELETE,
    Permission.COURSE_CREATE, Permission.COURSE_READ, Permission.COURSE_UPDATE, Permission.COURSE_DELETE,
    Permission.ATTENDANCE_VIEW, Permission.FEES_MANAGE, Permission.LIBRARY_MANAGE, Permission.HOSTEL_MANAGE,
    Permission.EXAM_CREATE, Permission.EXAM_SCHEDULE, Permission.EXAM_LOCK, Permission.EXAM_VIEW, Permission.EXAM_DELETE,
    Permission.MARKS_ENTER, Permission.MARKS_MODERATE, Permission.MARKS_APPROVE, Permission.MARKS_VIEW, Permission.MARKS_LOCK,
    Permission.RESULT_PROCESS, Permission.RESULT_VIEW, Permission.TRANSCRIPT_VIEW,
    Permission.GRADING_POLICY_MANAGE, Permission.GRADING_POLICY_VIEW,
    Permission.REEVALUATION_REQUEST, Permission.REEVALUATION_PROCESS,
    Permission.PLACEMENT_MANAGE, Permission.AI_CHAT
  ],
  
  HOD: [
    Permission.FACULTY_READ, Permission.STUDENT_READ, Permission.STUDENT_UPDATE,
    Permission.COURSE_READ, Permission.COURSE_CREATE, Permission.COURSE_UPDATE,
    Permission.ATTENDANCE_MARK, Permission.ATTENDANCE_VIEW,
    Permission.EXAM_CREATE, Permission.EXAM_SCHEDULE, Permission.EXAM_VIEW,
    Permission.MARKS_ENTER, Permission.MARKS_MODERATE, Permission.MARKS_VIEW,
    Permission.RESULT_VIEW, Permission.GRADING_POLICY_VIEW,
    Permission.REEVALUATION_PROCESS,
    Permission.AI_CHAT
  ],

  FACULTY: [
    Permission.FACULTY_READ, Permission.STUDENT_READ, Permission.COURSE_READ,
    Permission.ATTENDANCE_MARK, Permission.ATTENDANCE_VIEW,
    Permission.EXAM_VIEW, Permission.EXAM_SCHEDULE,
    Permission.MARKS_ENTER, Permission.MARKS_VIEW,
    Permission.RESULT_VIEW, Permission.GRADING_POLICY_VIEW,
    Permission.AI_CHAT
  ],

  STUDENT: [
    Permission.STUDENT_READ, Permission.COURSE_READ, Permission.ATTENDANCE_VIEW,
    Permission.EXAM_VIEW, Permission.MARKS_VIEW, Permission.RESULT_VIEW,
    Permission.TRANSCRIPT_VIEW, Permission.REEVALUATION_REQUEST,
    Permission.AI_CHAT
  ],

  ACCOUNTANT: [
    Permission.FEES_MANAGE, Permission.STUDENT_READ
  ],

  LIBRARIAN: [
    Permission.LIBRARY_MANAGE, Permission.STUDENT_READ
  ],

  EXAM_CONTROLLER: [
    Permission.EXAM_CREATE, Permission.EXAM_SCHEDULE, Permission.EXAM_LOCK, Permission.EXAM_VIEW, Permission.EXAM_DELETE,
    Permission.MARKS_ENTER, Permission.MARKS_MODERATE, Permission.MARKS_APPROVE, Permission.MARKS_VIEW, Permission.MARKS_LOCK,
    Permission.RESULT_PROCESS, Permission.RESULT_VIEW, Permission.TRANSCRIPT_VIEW,
    Permission.GRADING_POLICY_MANAGE, Permission.GRADING_POLICY_VIEW,
    Permission.REEVALUATION_REQUEST, Permission.REEVALUATION_PROCESS,
    Permission.STUDENT_READ, Permission.COURSE_READ
  ],

  PLACEMENT_OFFICER: [
    Permission.PLACEMENT_MANAGE, Permission.STUDENT_READ
  ],

  HOSTEL_ADMIN: [
    Permission.HOSTEL_MANAGE, Permission.STUDENT_READ
  ],

  PARENT: [
    Permission.STUDENT_READ, Permission.ATTENDANCE_VIEW,
    Permission.RESULT_VIEW, Permission.TRANSCRIPT_VIEW
  ]
};

