import { Request, Response, NextFunction } from "express";

export function responseNormalizer(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json;

  res.json = function (body) {
    // If the body is already matching the 5-key envelope structure, send directly
    if (
      body &&
      typeof body === "object" &&
      "success" in body &&
      "message" in body &&
      "data" in body &&
      "meta" in body &&
      "errors" in body
    ) {
      return originalJson.call(this, body);
    }

    // Intercept error structures (success === false)
    if (body && body.success === false) {
      const errorPayload = body.error || body.errors || body;
      const message = body.message || errorPayload.message || "An unexpected error occurred";
      return originalJson.call(this, {
        success: false,
        message,
        data: null,
        meta: null,
        errors: errorPayload
      });
    }

    // Intercept success structures
    const success = body && typeof body === "object" && "success" in body ? body.success : true;
    const message = body && typeof body === "object" && "message" in body ? body.message : "Request completed successfully";
    const meta = body && typeof body === "object" && "meta" in body ? body.meta : null;
    
    let data = body;
    if (body && typeof body === "object") {
      if ("data" in body) {
        data = body.data;
      } else {
        const rest = { ...body } as Record<string, any>;
        delete rest.success;
        delete rest.message;
        delete rest.meta;
        data = Object.keys(rest).length > 0 ? rest : null;
      }
    }

    return originalJson.call(this, {
      success,
      message,
      data,
      meta,
      errors: null
    });
  };

  next();
}
