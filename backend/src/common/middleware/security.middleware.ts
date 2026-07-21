import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import { env } from "../../config/env.config";

export const securityMiddleware = (app: express.Application) => {
  // Trust Proxy for behind a reverse proxy (e.g. Nginx, AWS ALB, Cloudflare)
  app.set("trust proxy", 1);

  // Helmet sets secure HTTP headers (XSS, Content-Security-Policy, HSTS)
  app.use(helmet());

  // Gzip compression for API responses
  app.use(compression());

  // Disable explicit X-Powered-By header
  app.disable("x-powered-by");

  // Strict CORS configuration
  const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("CORS policy violation: Access denied for this origin."));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id", "X-Api-Key"],
    })
  );

  // Global Rate Limiter to protect against DDoS & brute force
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

  // Apply rate limiter to API endpoints
  app.use("/api", limiter);
};
