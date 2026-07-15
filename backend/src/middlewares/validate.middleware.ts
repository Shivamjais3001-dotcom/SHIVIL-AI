import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { CustomError } from "../utils/custom-error";

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors.map(issue => ({
          field: issue.path.join("."),
          message: issue.message
        }));
        return next(new CustomError("Request parameter validation failed", 400, issues));
      }
      return next(error);
    }
  };
}
