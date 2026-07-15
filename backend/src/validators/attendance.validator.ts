import { z } from "zod";
import { AttendanceStatus } from "@prisma/client";

export const createAttendanceSchema = z.object({
  body: z.object({
    date: z.string({ required_error: "Date is required" }),
    status: z.nativeEnum(AttendanceStatus, { required_error: "Status must be PRESENT or ABSENT" }),
    studentId: z.string({ required_error: "Student ID is required" }).uuid("Invalid student ID"),
    subjectId: z.string({ required_error: "Subject ID is required" }).uuid("Invalid subject ID")
  })
});
