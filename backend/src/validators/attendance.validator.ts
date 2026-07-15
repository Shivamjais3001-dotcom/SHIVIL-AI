import { z } from "zod";

export const startSessionSchema = z.object({
  body: z.object({
    subjectId: z.string({ required_error: "Subject ID is required" }).uuid("Invalid subject ID"),
    facultyId: z.string({ required_error: "Faculty ID is required" }).uuid("Invalid faculty ID"),
    section: z.string({ required_error: "Section is required" }),
    semester: z.string({ required_error: "Semester is required" }),
    classroom: z.string().optional(),
    startTime: z.string({ required_error: "Start time is required" }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format must be HH:MM"),
    endTime: z.string({ required_error: "End time is required" }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format must be HH:MM"),
    method: z.string().optional(),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
      radius: z.number().int()
    }).optional()
  })
});

export const studentCheckinSchema = z.object({
  body: z.object({
    sessionId: z.string({ required_error: "Session ID is required" }).uuid(),
    studentId: z.string({ required_error: "Student ID is required" }).uuid(),
    status: z.enum(["PRESENT", "ABSENT", "LATE", "MEDICAL_LEAVE", "OFFICIAL_LEAVE", "HOLIDAY", "CANCELLED", "EXCUSED"]),
    method: z.string().optional(),
    remarks: z.string().optional(),
    qrCode: z.string().optional(),
    metadata: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
      faceConfidence: z.number().optional(),
      deviceId: z.string().optional()
    }).optional()
  })
});

export const facultyCheckinSchema = z.object({
  body: z.object({
    facultyId: z.string({ required_error: "Faculty ID is required" }).uuid(),
    checkIn: z.string().datetime().optional(),
    checkOut: z.string().datetime().optional(),
    status: z.string().optional(),
    metadata: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
      ipAddress: z.string().optional(),
      deviceId: z.string().optional()
    }).optional()
  })
});

export const bulkUpdateAttendanceSchema = z.object({
  body: z.object({
    records: z.array(z.object({
      studentId: z.string().uuid(),
      subjectId: z.string().uuid(),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "MEDICAL_LEAVE", "OFFICIAL_LEAVE", "HOLIDAY", "CANCELLED", "EXCUSED"]),
      remarks: z.string().optional()
    }))
  })
});
