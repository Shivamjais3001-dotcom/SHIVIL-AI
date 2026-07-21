import { PrismaClient } from "@prisma/client";
import { prismaClient as singletonPrismaClient } from "../database/client/prisma.client";

const globalForPrisma = global as unknown as { prisma: any };

// Hashed version of "password123"
const MOCK_PASSWORD_HASH = "$2a$10$DN0cb0bVcWhZw/6S0UQLPerPzinowZabp83dexrtl9P4K9z/adovO";

class MockPrismaClient {
  constructor() {
    console.log("🛠️  [SHIVIL ERP] MockPrismaClient instantiated. Operating database in mock/simulated mode.");
  }

  $connect() {
    return Promise.resolve();
  }

  $disconnect() {
    return Promise.resolve();
  }

  $queryRaw(strings: TemplateStringsArray, ...values: any[]) {
    console.log("[MockPrismaClient] $queryRaw called with:", strings, values);
    return Promise.resolve([{ 1: 1 }]);
  }

  $transaction(callback: any) {
    if (typeof callback === 'function') {
      return callback(this);
    }
    return Promise.resolve(callback);
  }

  get user() {
    return {
      findUnique: async (args: any) => {
        const email = args?.where?.email || "";
        const id = args?.where?.id || "";
        console.log(`[MockPrismaClient] user.findUnique: email=${email}, id=${id}`);
        
        let role = "SUPER_ADMIN";
        let targetEmail = email || "shivamjais3001@gmail.com";
        if (targetEmail.includes("faculty")) role = "FACULTY";
        if (targetEmail.includes("student")) role = "STUDENT";

        return {
          id: id || "u-mock-99",
          email: targetEmail,
          passwordHash: MOCK_PASSWORD_HASH,
          role: role,
          isVerified: true,
          universityId: "univ-shivil",
          university: {
            id: "univ-shivil",
            name: "SHIVIL AI University OS",
            domain: "university.edu",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
      },
      findFirst: async () => null,
      findMany: async () => [],
      create: async (args: any) => ({ id: "u-mock-created", ...args.data }),
      update: async (args: any) => ({ id: args.where.id, ...args.data }),
    };
  }

  get session() {
    return {
      create: async (args: any) => ({ id: "s-mock-123", ...args.data }),
      findUnique: async (args: any) => {
        const token = args?.where?.refreshToken || "";
        return {
          id: "s-mock-123",
          refreshToken: token,
          userId: "u-mock-99",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          user: {
            id: "u-mock-99",
            email: "shivamjais3001@gmail.com",
            role: "SUPER_ADMIN",
            universityId: "univ-shivil",
            university: {
              id: "univ-shivil",
              name: "SHIVIL AI University OS"
            }
          }
        };
      },
      delete: async () => ({ id: "s-mock-123" }),
      deleteMany: async () => ({ count: 1 })
    };
  }

  get auditLog() {
    return {
      create: async (args: any) => ({ id: "audit-mock-123", ...args.data })
    };
  }

  get student() {
    return {
      count: async () => 1240,
      findUnique: async (args: any) => ({
        id: "s-1",
        userId: "u-mock-99",
        rollNo: "APEX-2026-002",
        name: "Neha Reddy",
        branch: "Computer Science",
        semester: "6th",
        academicYear: "2026",
        status: "Active"
      }),
      findMany: async () => []
    };
  }

  get faculty() {
    return {
      count: async () => 142,
      findUnique: async () => ({
        id: "f-1",
        userId: "u-mock-99",
        employeeId: "EMP-2026-08",
        name: "Dr. Sarah Jenkins",
        department: "Computer Science",
        status: "Active"
      })
    };
  }

  get department() {
    return {
      count: async () => 4
    };
  }

  get course() {
    return {
      count: async () => 8
    };
  }

  get attendance() {
    return {
      count: async (args: any) => {
        if (args?.where?.status === "PRESENT") {
          return 942;
        }
        return 1000;
      }
    };
  }

  get timetable() {
    return {
      findMany: async () => [
        {
          id: "t-1",
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "10:30",
          subject: {
            code: "CS-302",
            name: "Analysis of Algorithms",
            course: { name: "B.Tech Computer Science" }
          },
          faculty: { name: "Dr. Sarah Jenkins" }
        }
      ]
    };
  }

  get notification() {
    return {
      findMany: async () => [
        {
          id: "n-1",
          title: "Exam schedule published",
          content: "Mid-semester examination schedule has been released.",
          createdAt: new Date()
        }
      ]
    };
  }

  get aIConversation() {
    return {
      count: async () => 12,
      findMany: async () => [
        {
          id: "ai-1",
          userId: "u-mock-99",
          history: [{ role: "assistant", text: "Hello! Shivil AI OS Terminal is ready." }],
          context: "",
          updatedAt: new Date()
        }
      ],
      create: async (args: any) => ({
        id: "ai-new",
        ...args.data,
        updatedAt: new Date()
      })
    };
  }

  get feeReceipt() {
    return {
      count: async () => 3
    };
  }
}

// Check if we should run in Mock mode
const useMockDatabase = process.env.MOCK_DATABASE === "true";

let prismaInstance: any;

if (useMockDatabase) {
  const handler = {
    get: (target: any, prop: string) => {
      if (prop in target) {
        return target[prop];
      }
      return new Proxy({}, {
        get: (modelTarget, modelProp) => {
          return (...args: any[]) => {
            console.log(`[MockPrismaClient (Proxy)]: Missing model "${prop}" -> method "${String(modelProp)}" called`);
            if (String(modelProp).includes("count")) {
              return Promise.resolve(5);
            }
            if (String(modelProp).includes("findMany")) {
              return Promise.resolve([]);
            }
            if (String(modelProp).includes("findUnique") || String(modelProp).includes("findFirst")) {
              return Promise.resolve(null);
            }
            return Promise.resolve({ id: "mock-id-proxy" });
          };
        }
      });
    }
  };
  prismaInstance = new Proxy(new MockPrismaClient(), handler);
} else {
  prismaInstance = singletonPrismaClient;
}

export const prisma = prismaInstance as unknown as PrismaClient;
export default prisma;
