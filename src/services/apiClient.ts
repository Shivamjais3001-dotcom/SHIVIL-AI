import studentSeeds from "../../mock-data/students.json";
import facultySeeds from "../../mock-data/faculty.json";
import courseSeeds from "../../mock-data/courses.json";
import attendanceSeeds from "../../mock-data/attendance.json";

import type { Student } from "../types/student";
import type { Faculty } from "../types/faculty";
import type { CourseType } from "../types/course";

// Simulated network delay
export const sleep = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

// Database seeding engine
export function initializeSeedData() {
  const isSeeded = localStorage.getItem("shivil_seeded") === "true";
  if (isSeeded) return;

  // 1. Expand Students to exactly 327
  const studentsList: Student[] = [...studentSeeds];
  const firstNames = ["Rohan", "Anjali", "Vikram", "Neha", "Arjun", "Priya", "Kabir", "Anya", "Aditya", "Divya", "Siddharth", "Kiran", "Amit", "Sneha", "Rahul", "Tanvi", "Gautam", "Shreya", "Karan", "Ayesha"];
  const lastNames = ["Sharma", "Patel", "Gupta", "Reddy", "Sen", "Singh", "Nair", "Verma", "Rao", "Joshi", "Mehta", "Iyer", "Kumar", "Choudhury", "Bose", "Das", "Kapoor", "Mishra", "Saxena", "Chawla"];
  const branches = ["Computer Science", "Electrical Eng", "Mechanical Eng", "Electronics", "Mathematics"];
  const statuses = ["Active", "Active", "Active", "Shortage", "Active"];
  const semesters = ["Semester I", "Semester II", "Semester III", "Semester IV", "Semester V", "Semester VI", "Semester VII", "Semester VIII"];
  const years = ["1st", "2nd", "3rd", "4th"];

  while (studentsList.length < 327) {
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${fName} ${lName}`;
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const year = years[Math.floor(Math.random() * years.length)];
    const rollCode = branch === "Computer Science" ? "CS" : branch === "Electrical Eng" ? "EE" : branch === "Mechanical Eng" ? "ME" : branch === "Electronics" ? "EC" : "MA";
    const rollNo = `${rollCode}230${100 + studentsList.length}`;
    
    studentsList.push({
      id: 100 + studentsList.length,
      name,
      roll: rollNo,
      branch,
      year,
      status
    });
  }
  localStorage.setItem("students", JSON.stringify(studentsList));

  // 2. Expand Faculty to exactly 24
  const facultyList: Faculty[] = [...facultySeeds];
  const facultyNames = [
    "Dr. Rajesh Koothrappali", "Prof. Severus Snape", "Dr. Charles Xavier", "Prof. Minerva McGonagall", 
    "Dr. Bruce Banner", "Prof. Walter White", "Dr. Stephen Strange", "Dr. Otto Octavius",
    "Prof. Albus Dumbledore", "Dr. Reed Richards", "Dr. Tony Stark", "Prof. Charles Darwin",
    "Dr. Jane Goodall", "Prof. Stephen Hawking", "Dr. Rosalind Franklin", "Prof. Gregor Mendel",
    "Dr. Elizabeth Blackwell", "Dr. Jonas Salk"
  ];
  const depts = ["Computer Science", "Physics & EE", "Mechanical Eng", "Mathematics"];

  while (facultyList.length < 24) {
    const name = facultyNames[Math.floor(Math.random() * facultyNames.length)];
    const department = depts[Math.floor(Math.random() * depts.length)];
    const fNameClean = name.split(" ").slice(1).join(".").toLowerCase();
    const email = `${fNameClean}@university.edu`;

    facultyList.push({
      id: 200 + facultyList.length,
      name,
      department,
      email
    });
  }
  localStorage.setItem("faculty", JSON.stringify(facultyList));

  // 3. Expand Courses to exactly 18
  const coursesList: CourseType[] = [...courseSeeds];
  const courseNames = [
    { code: "CS-202", name: "Data Structures & Objects", dept: "Computer Science", cred: 4, sem: "Semester III" },
    { code: "CS-401", name: "Distributed Cloud Networks", dept: "Computer Science", cred: 4, sem: "Semester VII" },
    { code: "MA-201", name: "Discrete Structures & Logic", dept: "Mathematics", cred: 3, sem: "Semester III" },
    { code: "EE-102", name: "Basic Circuit Analysis Lab", dept: "Electrical Eng", cred: 2, sem: "Semester I" },
    { code: "ME-204", name: "Strength of Mechanical Solids", dept: "Mechanical Eng", cred: 3, sem: "Semester IV" },
    { code: "PHY-301", name: "Astrophysics Elective", dept: "Physics & EE", cred: 3, sem: "Semester V" },
    { code: "CS-305", name: "Database Operations Systems", dept: "Computer Science", cred: 4, sem: "Semester V" },
    { code: "EE-302", name: "Electromagnetics & Fields", dept: "Electrical Eng", cred: 3, sem: "Semester V" },
    { code: "MA-302", name: "Probability & Complex Stochastics", dept: "Mathematics", cred: 3, sem: "Semester VI" },
    { code: "ME-102", name: "Computer Aided Drafting CAD", dept: "Mechanical Eng", cred: 2, sem: "Semester II" },
    { code: "CS-451", name: "Machine Learning models", dept: "Computer Science", cred: 4, sem: "Semester VIII" },
    { code: "PHY-202", name: "Classical Mechanics Theory", dept: "Physics & EE", cred: 3, sem: "Semester III" }
  ];

  courseNames.forEach((item, idx) => {
    coursesList.push({
      id: 300 + coursesList.length,
      courseCode: item.code,
      courseName: item.name,
      department: item.dept,
      credits: item.cred,
      semester: item.sem
    });
  });
  localStorage.setItem("courses", JSON.stringify(coursesList));

  // 4. Save Attendance
  localStorage.setItem("attendance", JSON.stringify(attendanceSeeds));

  localStorage.setItem("shivil_seeded", "true");
}

// Initialise seeds immediately
initializeSeedData();

// Generic API Query wrapper with mock latency
export const apiClient = {
  get: async <T>(key: string): Promise<T> => {
    await sleep();
    const data = localStorage.getItem(key);
    if (!data) throw new Error(`Query failed: Collection ${key} not found.`);
    return JSON.parse(data) as T;
  },

  post: async <T>(key: string, record: any): Promise<T> => {
    await sleep();
    const data = localStorage.getItem(key) || "[]";
    const parsed = JSON.parse(data);
    const newRecord = { ...record, id: record.id || Date.now() };
    parsed.push(newRecord);
    localStorage.setItem(key, JSON.stringify(parsed));
    return newRecord as T;
  },

  put: async <T>(key: string, id: number, record: any): Promise<T> => {
    await sleep();
    const data = localStorage.getItem(key) || "[]";
    const parsed = JSON.parse(data) as any[];
    const idx = parsed.findIndex((item) => item.id === id);
    if (idx === -1) throw new Error(`Record with id ${id} not found in collection ${key}`);
    const updated = { ...parsed[idx], ...record };
    parsed[idx] = updated;
    localStorage.setItem(key, JSON.stringify(parsed));
    return updated as T;
  },

  delete: async (key: string, id: number): Promise<boolean> => {
    await sleep();
    const data = localStorage.getItem(key) || "[]";
    const parsed = JSON.parse(data) as any[];
    const filtered = parsed.filter((item) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
  }
};
