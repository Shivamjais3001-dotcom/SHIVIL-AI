# API Endpoint Reference

Every request to secured API endpoints requires the header `Authorization: Bearer <token>`.

---

## 🔐 Auth Endpoints

### User Login
*   **POST** `/api/auth/login`
    *   *Input Payload*:
        ```json
        {
          "email": "shivamjais3001@gmail.com",
          "password": "password123"
        }
        ```
    *   *Output Payload (Success)*:
        ```json
        {
          "success": true,
          "message": "User session authenticated successfully.",
          "data": {
            "accessToken": "eyJhbGciOiJIUzI1Ni...",
            "user": {
              "id": "u-mock-99",
              "email": "shivamjais3001@gmail.com",
              "role": "SUPER_ADMIN"
            }
          }
        }
        ```

---

## 📊 Operations Endpoints

### Server Health Check
*   **GET** `/health`
    *   *Output Payload*: Returns process uptime statistics and PostgreSQL link status.

### Dashboard Metrics
*   **GET** `/dashboard/metrics`
    *   *Output Payload*:
        ```json
        {
          "success": true,
          "data": {
            "studentsCount": 1240,
            "facultyCount": 142,
            "departmentsCount": 4,
            "averageAttendance": 94.2
          }
        }
        ```
