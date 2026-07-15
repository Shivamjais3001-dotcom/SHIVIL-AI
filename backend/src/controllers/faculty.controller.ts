import { Response, NextFunction } from "express";
import { FacultyService } from "../services/faculty.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { sendSuccessResponse } from "../utils/response";
import { parsePaginationParams } from "../utils/pagination";
import { ApiError } from "../utils/api-error";

const facultyService = new FacultyService();

export class FacultyController {
  async getFaculty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const pagination = parsePaginationParams(req.query, "name");
      
      const { data, meta } = await facultyService.getFaculty({
        ...pagination,
        department: req.query.department as string || undefined,
        designation: req.query.designation as string || undefined,
        status: req.query.status as string || undefined,
        universityId
      });

      return sendSuccessResponse(res, data, "Faculty registry retrieved successfully.", 200, meta);
    } catch (error) {
      next(error);
    }
  }

  async getFacultyById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await facultyService.getFacultyById(id, universityId);

      return sendSuccessResponse(res, result, "Faculty details retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async createFaculty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await facultyService.createFaculty(req.body, universityId);
      return sendSuccessResponse(res, result, "Faculty profile registered successfully.", 210);
    } catch (error) {
      next(error);
    }
  }

  async updateFaculty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await facultyService.updateFaculty(id, universityId, req.body);

      return sendSuccessResponse(res, result, "Faculty profile modified successfully.");
    } catch (error) {
      next(error);
    }
  }

  async archiveFaculty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await facultyService.archiveFaculty(id, universityId);

      return sendSuccessResponse(res, result, "Faculty profile archived successfully.");
    } catch (error) {
      next(error);
    }
  }

  async restoreFaculty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await facultyService.restoreFaculty(id, universityId);

      return sendSuccessResponse(res, result, "Faculty profile restored successfully.");
    } catch (error) {
      next(error);
    }
  }

  async deleteFaculty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      await facultyService.deleteFaculty(id, universityId);

      return sendSuccessResponse(res, null, "Faculty record soft-deleted from registry.");
    } catch (error) {
      next(error);
    }
  }

  async getFacultyTimeline(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await facultyService.getTimeline(id, universityId);

      return sendSuccessResponse(res, result, "Faculty lifecycle timeline log retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async getFacultyDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const result = await facultyService.getSummaryMetrics(universityId);

      return sendSuccessResponse(res, result, "Faculty dashboard stats aggregated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async applyLeave(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const { type, startDate, endDate, reason } = req.body;

      if (!type || !startDate || !endDate || !reason) {
        throw ApiError.badRequest("Missing mandatory fields to apply for leave.");
      }

      const result = await facultyService.applyLeave(id, universityId, { type, startDate, endDate, reason });
      return sendSuccessResponse(res, result, "Leave application submitted successfully.", 201);
    } catch (error) {
      next(error);
    }
  }

  async approveRejectLeave(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id, requestId } = req.params;
      const { action } = req.body; // APPROVED or REJECTED

      if (action !== "APPROVED" && action !== "REJECTED") {
        throw ApiError.badRequest("Action must be APPROVED or REJECTED.");
      }

      const result = await facultyService.approveRejectLeave(id, universityId, requestId, action);
      return sendSuccessResponse(res, result, `Leave request has been ${action.toLowerCase()} successfully.`);
    } catch (error) {
      next(error);
    }
  }

  async getWorkload(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const { id } = req.params;
      const result = await facultyService.getWorkload(id, universityId);

      return sendSuccessResponse(res, result, "Faculty workload & timetables retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async bulkImport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const facultiesList = req.body.faculties;

      if (!Array.isArray(facultiesList)) {
        throw ApiError.badRequest("Bulk import expects 'faculties' as an array.");
      }

      const result = await facultyService.bulkImport(facultiesList, universityId);
      return sendSuccessResponse(res, result, "Batch faculty records processed.", 201);
    } catch (error) {
      next(error);
    }
  }

  async bulkExport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const universityId = req.user?.universityId || null;
      const csvData = await facultyService.bulkExport(universityId);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=faculty_export.csv");
      return res.status(200).send(csvData);
    } catch (error) {
      next(error);
    }
  }
}
