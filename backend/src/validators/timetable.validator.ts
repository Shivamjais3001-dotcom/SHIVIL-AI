import { z } from "zod";

export const createTimetableSchema = z.object({
  body: z.object({
    dayOfWeek: z.number({ required_error: "Day of week is required" }).int().min(1).max(7),
    startTime: z.string({ required_error: "Start time is required" }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid start time format (HH:MM)"),
    endTime: z.string({ required_error: "End time is required" }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid end time format (HH:MM)"),
    subjectId: z.string({ required_error: "Subject ID is required" }).uuid("Invalid subject ID format"),
    facultyId: z.string({ required_error: "Faculty ID is required" }).uuid("Invalid faculty ID format")
  })
});
