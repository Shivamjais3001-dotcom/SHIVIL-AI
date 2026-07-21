import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import { env } from "../../config/env.config";

export const securityMiddleware = (app: express.Application) => {
  // Trust Proxy for behind a reverse proxy (e.g. Nginx, Load Balancer)
  app.set("trust proxy", 1);

  // Helmet helps secure Express apps by setting various HTTP headers
  app.use(helmet());

  // Compress response bodies
  app.use(compression());

  // Disable 'x-powered-by' header specifically (helmet does this, but good to be explicit)
  app.disable("x-powered-by");

  // CORS configuration
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    })
  );

  // Rate Limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    limit: 100, // Limit each IP to 100 requests per window
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests from this IP terminal session. Rate limit reached.",
      data: null
    }
  });

  // Apply rate limiter specifically to API routes
  app.use("/api", limiter);
};
