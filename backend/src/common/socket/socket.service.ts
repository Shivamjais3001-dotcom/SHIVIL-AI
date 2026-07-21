import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { logger } from "../logger/winston.logger";

let io: SocketIOServer | null = null;

export function initSocketServer(server: HTTPServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Restricted via Express CORS middleware in production
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {
    logger.info(`🔌 [WEBSOCKET] Client connected. Socket ID: ${socket.id}`);

    // Join tenant room for targeted university broadcasts
    socket.on("join-tenant", (tenantId: string) => {
      if (tenantId) {
        socket.join(`tenant:${tenantId}`);
        logger.info(`🔌 [WEBSOCKET] Socket ${socket.id} joined room: tenant:${tenantId}`);
      }
    });

    socket.on("disconnect", (reason) => {
      logger.info(`🔌 [WEBSOCKET] Client disconnected. Socket ID: ${socket.id}, Reason: ${reason}`);
    });
  });

  logger.info("🚀 [WEBSOCKET] Socket.io Real-time Server initialized successfully.");
  return io;
}

export function getSocketIO(): SocketIOServer | null {
  return io;
}

export function emitToTenant(tenantId: string, event: string, data: any): void {
  if (io) {
    io.to(`tenant:${tenantId}`).emit(event, data);
  }
}
