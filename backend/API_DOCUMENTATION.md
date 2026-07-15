# SHIVIL AI - Sprint 2 API Documentation
## Authentication & Authorization Module

This module exposes endpoints for tenancy registration, user authentication, session refresh with token rotation, email verification, and password management.

---

### Endpoint Catalog

| Method | Route | Authentication Required | Role Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register-university` | No | None | Registers a new university tenant and its root administrator account. |
| `POST` | `/api/auth/register-admin` | Yes | `SUPER_ADMIN` | Registers a new administrator (or other staff role) within a specific tenant. |
| `POST` | `/api/auth/login` | No | None | Authenticates user credentials and issues JWT tokens. |
| `POST` | `/api/auth/refresh` | No | None | Rotates refresh token and issues a new access token. |
| `POST` | `/api/auth/logout` | No | None | Revokes refresh token session and clears authentication cookies. |
| `POST` | `/api/auth/forgot-password` | No | None | Dispatches password recovery link/token to user's email address. |
| `POST` | `/api/auth/reset-password` | No | None | Updates password using validation token. |
| `POST` | `/api/auth/verify-email` | No | None | Verifies user's email address using onboarding token. |
| `POST` | `/api/auth/change-password` | Yes | Any | Updates password of the currently authenticated session. |

---

### 1. Register University
* **Route**: `/api/auth/register-university`
* **Method**: `POST`
* **Auth Required**: No
* **Request Body** (JSON):
```json
{
  "name": "State University of Technology",
  "domain": "sut.edu.in",
  "adminEmail": "admin@sut.edu.in",
  "adminPassword": "SecurePassword123!"
}
```
* **Success Response** (`201 Created`):
```json
{
  "success": true,
  "message": "University tenant and administrator account initialized successfully.",
  "data": {
    "university": {
      "id": "a9b8c7d6-e5f4-3c2b-1a0z-9876543210ab",
      "name": "State University of Technology",
      "domain": "sut.edu.in",
      "createdAt": "2026-07-16T00:45:00.000Z",
      "updatedAt": "2026-07-16T00:45:00.000Z"
    },
    "admin": {
      "id": "b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e",
      "email": "admin@sut.edu.in",
      "role": "UNIVERSITY_ADMIN",
      "isVerified": false
    }
  },
  "meta": null,
  "errors": null
}
```
* **Error Response** (`409 Conflict`):
```json
{
  "success": false,
  "message": "A university with this domain is already registered.",
  "data": null,
  "meta": null,
  "errors": {
    "message": "A university with this domain is already registered.",
    "statusCode": 409
  }
}
```

---

### 2. Register Admin
* **Route**: `/api/auth/register-admin`
* **Method**: `POST`
* **Auth Required**: Yes (`SUPER_ADMIN` check)
* **Headers**:
  * `Authorization: Bearer <SUPER_ADMIN_ACCESS_TOKEN>`
* **Request Body** (JSON):
```json
{
  "email": "dean@sut.edu.in",
  "password": "DeanPassword2026!",
  "universityId": "a9b8c7d6-e5f4-3c2b-1a0z-9876543210ab",
  "role": "UNIVERSITY_ADMIN"
}
```
* **Success Response** (`201 Created`):
```json
{
  "success": true,
  "message": "User account created successfully within the university tenant.",
  "data": {
    "id": "c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
    "email": "dean@sut.edu.in",
    "role": "UNIVERSITY_ADMIN",
    "universityId": "a9b8c7d6-e5f4-3c2b-1a0z-9876543210ab",
    "isVerified": false
  },
  "meta": null,
  "errors": null
}
```

---

### 3. Login
* **Route**: `/api/auth/login`
* **Method**: `POST`
* **Auth Required**: No
* **Request Body** (JSON):
```json
{
  "email": "admin@sut.edu.in",
  "password": "SecurePassword123!"
}
```
* **Success Response** (`200 OK`):
* *Note: Sets an HTTP-only cookie named `refreshToken` containing the rotated refresh token.*
```json
{
  "success": true,
  "message": "User session authenticated successfully.",
  "data": {
    "user": {
      "id": "b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e",
      "email": "admin@sut.edu.in",
      "role": "UNIVERSITY_ADMIN",
      "universityId": "a9b8c7d6-e5f4-3c2b-1a0z-9876543210ab",
      "universityName": "State University of Technology",
      "isVerified": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "meta": null,
  "errors": null
}
```

---

### 4. Refresh Token
* **Route**: `/api/auth/refresh`
* **Method**: `POST`
* **Auth Required**: No (Uses HTTP-only Cookie or Body payload)
* **Request Body** (Optional if using Cookies):
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
* **Success Response** (`200 OK`):
* *Note: Rotates the refresh token and sets a new HTTP-only `refreshToken` cookie.*
```json
{
  "success": true,
  "message": "Access token rotated successfully.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new_access_token..."
  },
  "meta": null,
  "errors": null
}
```

---

### 5. Logout
* **Route**: `/api/auth/logout`
* **Method**: `POST`
* **Auth Required**: No (Uses HTTP-only Cookie or Body payload)
* **Success Response** (`200 OK`):
* *Note: Deletes session from the database and clears cookie.*
```json
{
  "success": true,
  "message": "User logged out and session revoked successfully.",
  "data": null,
  "meta": null,
  "errors": null
}
```

---

### 6. Forgot Password
* **Route**: `/api/auth/forgot-password`
* **Method**: `POST`
* **Auth Required**: No
* **Request Body** (JSON):
```json
{
  "email": "admin@sut.edu.in"
}
```
* **Success Response** (`200 OK`):
* *Note: Always returns success to prevent user enumeration attacks.*
```json
{
  "success": true,
  "message": "If the email address exists in our system, a password reset link has been dispatched.",
  "data": null,
  "meta": null,
  "errors": null
}
```

---

### 7. Reset Password
* **Route**: `/api/auth/reset-password`
* **Method**: `POST`
* **Auth Required**: No
* **Request Body** (JSON):
```json
{
  "token": "4e78a632b55f11...",
  "newPassword": "MyNewSecurePassword2026!"
}
```
* **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Password has been successfully updated.",
  "data": null,
  "meta": null,
  "errors": null
}
```

---

### 8. Verify Email
* **Route**: `/api/auth/verify-email`
* **Method**: `POST` or `GET`
* **Auth Required**: No
* **Parameters** (Query or Body):
  * `token`: `5f98a211e403d...`
* **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Email address has been successfully verified.",
  "data": null,
  "meta": null,
  "errors": null
}
```

---

### 9. Change Password
* **Route**: `/api/auth/change-password`
* **Method**: `POST`
* **Auth Required**: Yes
* **Headers**:
  * `Authorization: Bearer <ACCESS_TOKEN>`
* **Request Body** (JSON):
```json
{
  "oldPassword": "SecurePassword123!",
  "newPassword": "BrandNewSecurePassword2026!"
}
```
* **Success Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Password has been updated. Please sign in again.",
  "data": null,
  "meta": null,
  "errors": null
}
```
