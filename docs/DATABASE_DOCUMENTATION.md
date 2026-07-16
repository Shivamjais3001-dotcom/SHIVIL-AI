# Database Documentation & Schemas

We construct schemas using Prisma ORM mapping to PostgreSQL table spaces.

---

## 📊 Database Models

### 1. User Model
Tracks role classifications and credentials:
*   `id`: String (Primary Key)
*   `email`: String (Unique index)
*   `passwordHash`: String
*   `role`: Enum (`STUDENT`, `FACULTY`, `SUPER_ADMIN`)
*   `createdAt`: Timestamp

### 2. Student Model
Maintains active enrollment indices:
*   `id`: String (Primary Key)
*   `userId`: String (Foreign Key relation User)
*   `name`: String
*   `cgpa`: Float
*   `attendanceRate`: Float

### 3. Faculty Model
Stores instructor workload profiles:
*   `id`: String (Primary Key)
*   `userId`: String (Foreign Key relation User)
*   `name`: String
*   `department`: String
*   `teachingHours`: Integer

---

## ⚡ Index Optimizations
*   `User.email`: Unique database index to accelerate login lookup speed.
*   `Student.userId`: Index mapping relation lookups.
*   `Faculty.userId`: Index mapping workload allocation scans.
