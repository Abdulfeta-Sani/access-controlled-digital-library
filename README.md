# 📚 Access-Controlled Digital Library

## 🚀 Overview

This project is a full-stack digital library system that enforces **Role-Based Access Control (RBAC)** using **JWT authentication**.

Users are assigned roles (**Admin, Editor, Viewer**), and each role determines what actions they can perform within the system.

---

## 🧩 Problem Statement

Build a system that:

* Authenticates users using JWT
* Enforces role-based permissions (RBAC)
* Allows document management based on roles
* Provides a secure frontend with controlled UI actions

---

## 👥 Roles & Permissions

| Role   | Permissions                             |
| ------ | --------------------------------------- |
| Admin  | Manage users, upload & delete documents |
| Editor | Upload documents, edit metadata         |
| Viewer | View and download documents             |

---

## 🛠 Tech Stack

### Backend

* FastAPI (Python)
* PyJWT (Authentication)
* Custom RBAC Middleware

### Frontend

* React (Vite) + TypeScript
* TailwindCSS

### Database

* SQLite (Planned for next phase)

---

## 📂 Project Structure

```
backend/
│
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   │
│   ├── models/
│   │   └── user.py
│   │
│   ├── api/
│   │   └── routes/
│   │       └── auth.py
│   │
│   └── middleware/
│       └── rbac.py
│
frontend/
```

---

## 🔐 Authentication & Authorization

### 🔑 JWT Authentication

* Users log in via:

```
POST /auth/login
```

* The server returns a JWT token containing:

  * `sub` → User email
  * `role` → User role (admin, editor, viewer)
  * `exp` → Expiration timestamp

---

### 🛡️ RBAC (Role-Based Access Control)

* Custom RBAC middleware is implemented
* Each protected route defines allowed roles
* Access is validated using the role inside the JWT payload

Example:

```python
@rbac_required(["admin"])
```

* Unauthorized access returns:

  * `403 Forbidden`

---

## 🔐 Swagger Authentication Usage

1. Open Swagger UI:

```
http://127.0.0.1:8000/docs
```

2. Click **Authorize 🔒**

3. Enter token in this format:

```
Bearer <your_token>
```

4. Access protected endpoints

---

## 🧪 Test Users (Mock Data)

| Email                                           | Password  | Role   |
| ----------------------------------------------- | --------- | ------ |
| [admin@example.com](mailto:admin@example.com)   | adminexample123  | Admin  |
| [editor@example.com](mailto:editor@example.com) | editorexample123 | Editor |
| [viewer@example.com](mailto:viewer@example.com) | viewerexample123 | Viewer |

---

## 📌 Available Endpoints (Phase 2)

| Method | Endpoint    | Description           |
| ------ | ----------- | --------------------- |
| POST   | /auth/login | User login (JWT)      |
| GET    | /           | Health check          |
| GET    | /protected  | Authenticated route   |
| GET    | /admin-only | Admin-only test route |

---

## 📌 Current Status

🟢 Phase 2 — Authentication & RBAC Completed

✔ FastAPI backend initialized
✔ JWT authentication implemented
✔ Swagger authorization enabled
✔ Custom RBAC middleware created
✔ Role-protected routes working

---

## ⏭️ Next Phase

➡ Phase 3:

* SQLite database integration
* Document API (CRUD)
* Full RBAC enforcement on endpoints

---

## 📎 Notes

* JWT is currently validated using a mock user database
* SQLite and persistent storage will be added in the next phase
* RBAC will be refactored into dependency-based enforcement for better scalability

---
