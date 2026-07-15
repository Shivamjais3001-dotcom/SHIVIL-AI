import { PrismaClient, Role, AttendanceStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("[SEED] Initializing seed execution...");

  // 1. Clean Database (Avoid duplicate constraints on multiple seed runs)
  await prisma.auditLog.deleteMany();
  await prisma.session.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.feeReceipt.deleteMany();
  await prisma.libraryIssue.deleteMany();
  await prisma.hostelRoom.deleteMany();
  await prisma.result.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.course.deleteMany();
  await prisma.department.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.user.deleteMany();
  await prisma.university.deleteMany();

  console.log("[SEED] Existing records cleared.");

  // 2. Hash Password templates
  const passwordHash = await bcrypt.hash("Password123!", 12);

  // 3. Seed Universities (Tenants)
  const apexTech = await prisma.university.create({
    data: {
      name: "Apex Tech University",
      domain: "apex.edu"
    }
  });

  const nexusGlobal = await prisma.university.create({
    data: {
      name: "Nexus Global Academy",
      domain: "nexus.edu"
    }
  });

  console.log("[SEED] Universities seeded.");

  // 4. Seed Global Super Admin (Operates cross-tenant, no university binding)
  const superAdmin = await prisma.user.create({
    data: {
      email: "superadmin@shivil.ai",
      passwordHash,
      role: Role.SUPER_ADMIN,
      isVerified: true
    }
  });

  // 5. Seed University Admins
  const apexAdmin = await prisma.user.create({
    data: {
      email: "admin@apex.edu",
      passwordHash,
      role: Role.UNIVERSITY_ADMIN,
      isVerified: true,
      universityId: apexTech.id
    }
  });

  const nexusAdmin = await prisma.user.create({
    data: {
      email: "admin@nexus.edu",
      passwordHash,
      role: Role.UNIVERSITY_ADMIN,
      isVerified: true,
      universityId: nexusGlobal.id
    }
  });

  console.log("[SEED] Administrator accounts seeded.");

  // 6. Seed Departments
  const csDept = await prisma.department.create({
    data: {
      name: "Computer Science and Engineering",
      code: "CSE"
    }
  });

  const itDept = await prisma.department.create({
    data: {
      name: "Information Technology",
      code: "IT"
    }
  });

  console.log("[SEED] Departments seeded.");

  // 7. Seed Faculty Users & Profiles
  const facultyUser1 = await prisma.user.create({
    data: {
      email: "jenkins@apex.edu",
      passwordHash,
      role: Role.FACULTY,
      isVerified: true,
      universityId: apexTech.id
    }
  });

  const faculty1 = await prisma.faculty.create({
    data: {
      userId: facultyUser1.id,
      name: "Dr. Sarah Jenkins",
      department: "CSE",
      specialty: "Machine Learning & AI"
    }
  });

  const facultyUser2 = await prisma.user.create({
    data: {
      email: "vance@apex.edu",
      passwordHash,
      role: Role.FACULTY,
      isVerified: true,
      universityId: apexTech.id
    }
  });

  const faculty2 = await prisma.faculty.create({
    data: {
      userId: facultyUser2.id,
      name: "Prof. Marcus Vance",
      department: "IT",
      specialty: "Cloud Architecture"
    }
  });

  console.log("[SEED] Faculty profiles seeded.");

  // 8. Seed Courses
  const course1 = await prisma.course.create({
    data: {
      code: "CS-101",
      name: "B.Tech Computer Science and Engineering",
      credits: 4,
      semester: "Semester 5"
    }
  });

  const course2 = await prisma.course.create({
    data: {
      code: "IT-201",
      name: "B.Tech Information Technology",
      credits: 3,
      semester: "Semester 3"
    }
  });

  console.log("[SEED] Courses seeded.");

  // 9. Seed Subjects linked to Courses and Faculty
  const subject1 = await prisma.subject.create({
    data: {
      code: "CS-301",
      name: "Artificial Intelligence",
      courseId: course1.id,
      facultyId: faculty1.id
    }
  });

  const subject2 = await prisma.subject.create({
    data: {
      code: "IT-302",
      name: "Cloud Application Development",
      courseId: course2.id,
      facultyId: faculty2.id
    }
  });

  console.log("[SEED] Subjects cataloged.");

  // 10. Seed Students
  const studentUser1 = await prisma.user.create({
    data: {
      email: "shivam@apex.edu",
      passwordHash,
      role: Role.STUDENT,
      isVerified: true,
      universityId: apexTech.id
    }
  });

  const student1 = await prisma.student.create({
    data: {
      userId: studentUser1.id,
      rollNo: "APEX-2026-001",
      name: "Shivam Jaiswal",
      branch: "CSE",
      semester: "Semester 5",
      academicYear: "2024-2028",
      status: "Active",
      parentName: "Rajesh Jaiswal",
      parentContact: "+919876543210"
    }
  });

  const studentUser2 = await prisma.user.create({
    data: {
      email: "rohit@apex.edu",
      passwordHash,
      role: Role.STUDENT,
      isVerified: true,
      universityId: apexTech.id
    }
  });

  const student2 = await prisma.student.create({
    data: {
      userId: studentUser2.id,
      rollNo: "APEX-2026-002",
      name: "Rohit Sharma",
      branch: "IT",
      semester: "Semester 3",
      academicYear: "2025-2029",
      status: "Active",
      parentName: "Vijay Sharma",
      parentContact: "+919876543211"
    }
  });

  console.log("[SEED] Student profiles seeded.");

  // 11. Seed Attendance logs
  await prisma.attendance.createMany({
    data: [
      {
        date: new Date(),
        status: AttendanceStatus.PRESENT,
        studentId: student1.id,
        subjectId: subject1.id
      },
      {
        date: new Date(),
        status: AttendanceStatus.ABSENT,
        studentId: student2.id,
        subjectId: subject2.id
      }
    ]
  });

  // 12. Seed Timetables (Schedules representing today's classes)
  await prisma.timetable.createMany({
    data: [
      {
        dayOfWeek: new Date().getDay() || 7, // Today
        startTime: "09:00",
        endTime: "10:30",
        subjectId: subject1.id,
        facultyId: faculty1.id
      },
      {
        dayOfWeek: new Date().getDay() || 7, // Today
        startTime: "11:00",
        endTime: "12:30",
        subjectId: subject2.id,
        facultyId: faculty2.id
      }
    ]
  });

  // 13. Seed Results (Exam samples)
  await prisma.result.createMany({
    data: [
      {
        marks: 88.5,
        grade: "A",
        examType: "MID_TERM",
        studentId: student1.id
      },
      {
        marks: 79.0,
        grade: "B",
        examType: "MID_TERM",
        studentId: student2.id
      }
    ]
  });

  // 14. Seed Fee receipts
  await prisma.feeReceipt.createMany({
    data: [
      {
        amount: 45000,
        status: "PAID",
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        studentId: student1.id
      },
      {
        amount: 45000,
        status: "PENDING",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        studentId: student2.id
      }
    ]
  });

  // 15. Seed Library book issues
  await prisma.libraryIssue.create({
    data: {
      bookTitle: "Introduction to Algorithms (CLRS)",
      issueDate: new Date(),
      studentId: student1.id
    }
  });

  // 16. Seed HostelRoom allocations
  await prisma.hostelRoom.create({
    data: {
      roomNo: "302B",
      block: "C-Block",
      studentId: student1.id
    }
  });

  // 17. Seed AI Conversations
  await prisma.aIConversation.create({
    data: {
      userId: studentUser1.id,
      history: [
        { role: "user", text: "What is my current CGPA?" },
        { role: "model", text: "Based on your MID_TERM exam results, your grade is A." }
      ],
      context: "student-portal"
    }
  });

  // 18. Seed Notifications
  await prisma.notification.create({
    data: {
      title: "Semester Fees Due Notice",
      content: "Fees receipt of $45,000 is pending. Please clear before the due date.",
      type: "IN_APP",
      userId: studentUser2.id
    }
  });

  console.log("[SEED] Transactional and mock history data seeded.");
  console.log("[SEED] Seed operation completed successfully. 🌱");
}

main()
  .catch((e) => {
    console.error("[SEED ERROR] Database seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
