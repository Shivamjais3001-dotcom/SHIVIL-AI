# SHIVIL AI ERP API Documentation - Sprint 3 Database Transition

All endpoints support a unified JSON response envelope:
```json
{
  "success": true,
  "message": "Response status message description",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 120,
    "pages": 12,
    "sort": "createdAt",
    "order": "desc"
  },
  "errors": null
}
```

---

## 1. Dashboard Metrics API
* **Route**: `GET /api/dashboard/metrics`
* **Authentication**: `Bearer JWT`
* **Response Status**: `200 OK`
* **Description**: Aggregates tenant-specific stats: total students, total faculty, active departments, average attendance percentage, today's schedule timeslots, pending tasks count, and active AI conversation logs.

---

## 2. Students Registry CRUD APIs

### List Students
* **Route**: `GET /api/students`
* **Parameters**:
  - `page`: default `1`
  - `limit`: default `10`
  - `sort`: default `rollNo`
  - `order`: `asc` | `desc`
  - `search`: filters by student `name` or `rollNo`
  - `branch`: branch name filter
  - `semester`: semester filter
* **Authentication**: `Bearer JWT` (Roles: `SUPER_ADMIN`, `UNIVERSITY_ADMIN`, `FACULTY`)
* **Response Status**: `200 OK`

### Create Student
* **Route**: `POST /api/students`
* **Authentication**: `Bearer JWT` (Roles: `SUPER_ADMIN`, `UNIVERSITY_ADMIN`)
* **Body Validation (Zod)**:
  ```typescript
  {
    userId: string (UUID),
    rollNo: string,
    name: string,
    branch: string,
    semester: string,
    academicYear: string,
    parentName?: string,
    parentContact?: string,
    photoUrl?: string (URL)
  }
  ```
* **Response Status**: `210 Created`

### Update Student
* **Route**: `PUT /api/students/:id`
* **Authentication**: `Bearer JWT` (Roles: `SUPER_ADMIN`, `UNIVERSITY_ADMIN`)
* **Body Validation (Zod)**: Partial matching fields from creation schema.
* **Response Status**: `200 OK`

### Delete Student (Soft Delete)
* **Route**: `DELETE /api/students/:id`
* **Authentication**: `Bearer JWT` (Roles: `SUPER_ADMIN`, `UNIVERSITY_ADMIN`)
* **Response Status**: `200 OK` (sets `deletedAt` timestamp)

---

## 3. Faculty Directory CRUD APIs

### List Faculty Profiles
* **Route**: `GET /api/faculty`
* **Parameters**:
  - `page`, `limit`, `sort`, `order`, `search`, `department`
* **Authentication**: `Bearer JWT` (Roles: `SUPER_ADMIN`, `UNIVERSITY_ADMIN`)
* **Response Status**: `200 OK`

### Create Faculty Profile
* **Route**: `POST /api/faculty`
* **Body Validation (Zod)**:
  ```typescript
  {
    userId: string (UUID),
    name: string,
    department: string,
    specialty?: string
  }
  ```
* **Response Status**: `210 Created`

---

## 4. Academic Departments CRUD APIs

### List Departments
* **Route**: `GET /api/departments`
* **Parameters**: `page`, `limit`, `sort`, `order`, `search`
* **Authentication**: `Bearer JWT`
* **Response Status**: `200 OK`

### Create Department
* **Route**: `POST /api/departments`
* **Authentication**: `Bearer JWT` (Roles: `SUPER_ADMIN`, `UNIVERSITY_ADMIN`)
* **Body Validation (Zod)**:
  ```typescript
  {
    name: string,
    code: string (unique)
  }
  ```
* **Response Status**: `210 Created`

---

## 5. Course Catalog CRUD APIs

### List Courses
* **Route**: `GET /api/courses`
* **Parameters**: `page`, `limit`, `sort`, `order`, `search`, `semester`
* **Response Status**: `200 OK`

### Create Course
* **Route**: `POST /api/courses`
* **Authentication**: `Bearer JWT` (Roles: `SUPER_ADMIN`, `UNIVERSITY_ADMIN`)
* **Body Validation (Zod)**:
  ```typescript
  {
    code: string,
    name: string,
    credits?: number,
    semester: string
  }
  ```
* **Response Status**: `210 Created`

---

## 6. Subject Registry CRUD APIs

### List Subjects
* **Route**: `GET /api/subjects`
* **Parameters**: `page`, `limit`, `sort`, `order`, `search`, `courseId`, `facultyId`
* **Response Status**: `200 OK`

### Create Subject
* **Route**: `POST /api/subjects`
* **Authentication**: `Bearer JWT` (Roles: `SUPER_ADMIN`, `UNIVERSITY_ADMIN`)
* **Body Validation (Zod)**:
  ```typescript
  {
    code: string,
    name: string,
    courseId: string (UUID),
    facultyId?: string (UUID)
  }
  ```
* **Response Status**: `210 Created`

---

## 7. Attendance Registry APIs

### List Attendance History
* **Route**: `GET /api/attendance`
* **Parameters**: `page`, `limit`, `sort`, `order`, `search`, `studentId`, `subjectId`, `status`
* **Authentication**: `Bearer JWT`
* **Response Status**: `200 OK`

### Mark/Log Attendance
* **Route**: `POST /api/attendance`
* **Authentication**: `Bearer JWT` (Roles: `SUPER_ADMIN`, `UNIVERSITY_ADMIN`, `FACULTY`)
* **Body Validation (Zod)**:
  ```typescript
  {
    date: string,
    status: "PRESENT" | "ABSENT",
    studentId: string (UUID),
    subjectId: string (UUID)
  }
  ```
* **Response Status**: `201 Created`

---

## 8. AI Conversations APIs

### List Chat History
* **Route**: `GET /api/ai/conversations`
* **Authentication**: `Bearer JWT`
* **Response Status**: `200 OK`

### Save Chat logs
* **Route**: `POST /api/ai/conversations`
* **Authentication**: `Bearer JWT`
* **Body Validation**:
  ```typescript
  {
    history: Array<{ role: string, text: string }>,
    context?: string
  }
  ```
* **Response Status**: `210 Created`
