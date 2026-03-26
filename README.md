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
* SQLAlchemy (ORM)
* SQLite (Database)
* Passlib (bcrypt hashing)

### Frontend

* React (Vite) + TypeScript
* TailwindCSS

---

## 📂 Project Structure

```bash
backend/
│
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── database.py
│   │   └── deps.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   └── document.py
│   │
│   ├── api/
│   │   └── routes/
│   │       ├── auth.py
│   │       ├── documents.py
│   │       └── users.py
│
frontend/
```

---

## 🔐 Authentication & Authorization

### 🔑 JWT Authentication

* Endpoint:

```
POST /auth/login
```

* Accepts JSON body:

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

* Returns:

```json
{
  "access_token": "...",
  "token_type": "bearer",
  "role": "admin"
}
```

* Passwords are securely hashed using **bcrypt**

---

### 🛡️ RBAC (Role-Based Access Control)

* Implemented using **FastAPI dependency injection**
* Centralized logic via:

```python
require_role(["admin", "editor"])
```

* Ensures:

  * Clean, reusable access control
  * No duplication across endpoints

---

## 🔐 Security Improvements

* JWT configuration via environment variables:

  * `SECRET_KEY`
  * `ALGORITHM`
  * `ACCESS_TOKEN_EXPIRE_MINUTES`
* Proper `401 Unauthorized` responses for authentication failures
* Strict Bearer token validation
* Password hashing using bcrypt

---

## 📄 Document Model

```json
{
  "id": 22,
  "title": "System Architecture Guide",
  "uploaded_by": "editor@example.com",
  "role_access": ["admin", "editor", "viewer"],
  "uploaded_at": "2026-03-13T09:30:00Z"
}
```

---

## 📌 API Endpoints

### 🔐 Auth

| Method | Endpoint    | Access |
| ------ | ----------- | ------ |
| POST   | /auth/login | Public |

---

### 📄 Documents

| Method | Endpoint        | Access        |
| ------ | --------------- | ------------- |
| GET    | /documents      | Public        |
| GET    | /documents/{id} | Public        |
| POST   | /documents      | Admin, Editor |
| DELETE | /documents/{id} | Admin         |

---

### 👥 Users

| Method | Endpoint | Access |
| ------ | -------- | ------ |
| GET    | /users   | Admin  |

---

## 🧪 Testing via Swagger

1. Open:

```
http://127.0.0.1:8000/docs
```

2. Login → get token
3. Click **Authorize 🔒**
4. Enter:

```
Bearer <your_token>
```

---

## 📌 Current Status

🟢 Phase 3 — Backend Completed

✔ SQLite database integrated
✔ Full document API implemented
✔ JWT authentication secured
✔ Password hashing enabled
✔ RBAC implemented using dependencies
✔ Public and protected endpoints correctly separated

---

## ⏭️ Next Phase

➡ Phase 4:

* React frontend (Vite + TypeScript + Tailwind)
* JWT stored in memory
* Role-based UI rendering

---
