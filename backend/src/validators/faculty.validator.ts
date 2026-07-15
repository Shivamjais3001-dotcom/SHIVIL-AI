import { z } from "zod";

export const createFacultySchema = z.object({
  body: z.object({
    userId: z.string({ required_error: "User ID is required" }).uuid("Invalid user ID format"),
    employeeId: z.string().min(3).optional(),
    name: z.string({ required_error: "Name is required" }).min(2, "Name must be at least 2 characters"),
    department: z.string({ required_error: "Department code is required" }),
    designation: z.string().optional(),
    joiningDate: z.string().datetime().optional(),
    qualification: z.string().optional(),
    experienceYears: z.number().int().min(0).optional(),
    status: z.string().optional(),
    specialty: z.string().optional(),
    researchArea: z.string().optional(),
    officeInfo: z.object({
      officeRoom: z.string(),
      officeHours: z.string(),
      phoneExtension: z.string().optional()
    }).optional(),
    researchModule: z.object({
      papers: z.array(z.any()).optional(),
      patents: z.array(z.any()).optional(),
      projects: z.array(z.any()).optional(),
      grants: z.array(z.any()).optional()
    }).optional(),
    workload: z.object({
      teachingHours: z.number().int().optional(),
      extraDuties: z.array(z.string()).optional(),
      committeeAssignments: z.array(z.string()).optional()
    }).optional(),
    leaveManagement: z.object({
      leaveBalance: z.number().int().optional(),
      leaveRequests: z.array(z.any()).optional()
    }).optional(),
    performance: z.object({
      teachingScore: z.number().optional(),
      feedbackRating: z.number().optional(),
      studentFeedbackCount: z.number().int().optional()
    }).optional(),
    documents: z.array(z.object({
      documentType: z.string(),
      fileUrl: z.string().url("Invalid document URL"),
      sizeBytes: z.number().int().optional()
    })).optional()
  })
});

export const updateFacultySchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    department: z.string().optional(),
    designation: z.string().optional(),
    joiningDate: z.string().datetime().optional(),
    qualification: z.string().optional(),
    experienceYears: z.number().int().min(0).optional(),
    status: z.string().optional(),
    specialty: z.string().optional(),
    researchArea: z.string().optional(),
    officeInfo: z.object({
      officeRoom: z.string().optional(),
      officeHours: z.string().optional(),
      phoneExtension: z.string().optional()
    }).optional(),
    researchModule: z.object({
      papers: z.array(z.any()).optional(),
      patents: z.array(z.any()).optional(),
      projects: z.array(z.any()).optional(),
      grants: z.array(z.any()).optional()
    }).optional(),
    workload: z.object({
      teachingHours: z.number().int().optional(),
      extraDuties: z.array(z.string()).optional(),
      committeeAssignments: z.array(z.string()).optional()
    }).optional(),
    leaveManagement: z.object({
      leaveBalance: z.number().int().optional(),
      leaveRequests: z.array(z.any()).optional()
    }).optional(),
    performance: z.object({
      teachingScore: z.number().optional(),
      feedbackRating: z.number().optional(),
      studentFeedbackCount: z.number().int().optional()
    }).optional(),
    documents: z.array(z.object({
      documentType: z.string(),
      fileUrl: z.string().url("Invalid document URL"),
      sizeBytes: z.number().int().optional()
    })).optional()
  })
});
