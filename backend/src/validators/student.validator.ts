import { z } from "zod";

export const createStudentSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: "User ID is required" }).uuid("Invalid user ID format"),
    rollNo: z.string({ required_error: "Roll number is required" }).min(3, "Roll number must be at least 3 characters"),
    enrollmentNo: z.string().min(3).optional(),
    registrationNo: z.string().min(3).optional(),
    name: z.string({ required_error: "Name is required" }).min(2, "Name must be at least 2 characters"),
    branch: z.string({ required_error: "Branch is required" }),
    semester: z.string({ required_error: "Semester is required" }),
    academicYear: z.string({ required_error: "Academic year is required" }),
    status: z.string().optional(),
    category: z.string().optional(),
    scholarship: z.string().optional(),
    transport: z.boolean().optional(),
    photoUrl: z.string().url("Invalid photo URL format").or(z.literal("")).optional(),
    parentName: z.string().optional(),
    parentContact: z.string().optional(),
    guardianDetails: z.object({
      guardianName: z.string().min(2),
      guardianPhone: z.string(),
      guardianEmail: z.string().email().optional().or(z.literal("")),
      relation: z.string()
    }).optional(),
    emergencyContact: z.object({
      contactName: z.string().min(2),
      contactPhone: z.string(),
      relation: z.string()
    }).optional(),
    medicalInfo: z.object({
      bloodGroup: z.string(),
      allergies: z.string().optional(),
      conditions: z.string().optional()
    }).optional(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string()
    }).optional(),
    documents: z.array(z.object({
      documentType: z.string(),
      fileUrl: z.string().url("Invalid document URL"),
      sizeBytes: z.number().int().optional()
    })).optional()
  })
});

export const updateStudentSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    rollNo: z.string().min(3).optional(),
    enrollmentNo: z.string().min(3).optional(),
    registrationNo: z.string().min(3).optional(),
    branch: z.string().optional(),
    semester: z.string().optional(),
    academicYear: z.string().optional(),
    status: z.string().optional(),
    category: z.string().optional(),
    scholarship: z.string().optional(),
    transport: z.boolean().optional(),
    photoUrl: z.string().url("Invalid photo URL format").or(z.literal("")).optional(),
    parentName: z.string().optional(),
    parentContact: z.string().optional(),
    guardianDetails: z.object({
      guardianName: z.string().min(2),
      guardianPhone: z.string(),
      guardianEmail: z.string().email().optional().or(z.literal("")),
      relation: z.string()
    }).optional(),
    emergencyContact: z.object({
      contactName: z.string().min(2),
      contactPhone: z.string(),
      relation: z.string()
    }).optional(),
    medicalInfo: z.object({
      bloodGroup: z.string(),
      allergies: z.string().optional(),
      conditions: z.string().optional()
    }).optional(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string()
    }).optional(),
    documents: z.array(z.object({
      documentType: z.string(),
      fileUrl: z.string().url("Invalid document URL"),
      sizeBytes: z.number().int().optional()
    })).optional()
  })
});
