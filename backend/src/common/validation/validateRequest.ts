import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError, z } from "zod";
import { formatZodError, StandardValidationErrorPayload } from "./errors/validation.error";

export type RequestValidationSchema = AnyZodObject | z.ZodEffects<any>;

/**
 * Generic Express Middleware to validate incoming request body, params, query, or headers using Zod schemas.
 */
export function validateRequest(schema: RequestValidationSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
      });

      // Mutate request parameters with sanitized/coerced Zod output
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = formatZodError(error);
        const payload: StandardValidationErrorPayload = {
          success: false,
          statusCode: 400,
          message: "Validation failed on incoming request parameters.",
          errors: errorDetails,
          requestId: (req as any).id || (req.headers["x-request-id"] as string) || undefined,
          timestamp: new Date().toISOString(),
        };

        res.status(400).json(payload);
        return;
      }
      return next(error);
    }
  };
}
