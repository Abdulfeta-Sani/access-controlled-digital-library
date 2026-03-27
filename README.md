# 📚 Access-Controlled Digital Library

## 🚀 Overview

This project is a full-stack digital library system that enforces **Role-Based Access Control (RBAC)** using **JWT authentication**.

It allows users with different roles (**Admin, Editor, Viewer**) to interact with documents based on their permissions, ensuring secure and controlled access.

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
| Editor | Upload documents                        |
| Viewer | View documents                          |

---

## 🛠 Tech Stack

### Backend

* FastAPI (Python)
* PyJWT (JWT Authentication)
* SQLAlchemy (ORM)
* SQLite (Database)
* Passlib (bcrypt hashing)

### Frontend

* React (Vite)
* TypeScript
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
│   │
│   └── schemas/
│       └── auth.py
│
frontend/
│
├── src/
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   └── Documents.tsx
│   └── App.tsx
```

---

## 🔐 Authentication & Authorization

### 🔑 JWT Authentication

* Endpoint:

```
POST /auth/login
```

* Request Body:

```json
{
  "email": "admin@example.com",
  "password": "******"
}
```

* Response:

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

* Ensures clean and reusable access control across endpoints

---

## 🔐 Security Features

* JWT configuration via environment variables:

  * `SECRET_KEY`
  * `ALGORITHM`
  * `ACCESS_TOKEN_EXPIRE_MINUTES`
* Proper `401 Unauthorized` handling
* Strict Bearer token validation
* Password hashing using bcrypt

---

## 📄 Document Data Format

```json
{
  "id": 1,
  "title": "System Design Guide",
  "uploaded_by": "admin@example.com",
  "role_access": ["admin", "editor", "viewer"],
  "uploaded_at": "2026-03-13T09:30:00Z"
}
```

---

## 📌 API Endpoints

### 🔐 Authentication

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

## 🖥️ Frontend Features

* Login page with authentication
* JWT stored securely in memory (React Context)
* Document listing UI
* Role-based UI rendering:

  * Admin → can delete documents
  * Editor → can upload documents
  * Viewer → read-only access

---

## 🔄 Application Flow

1. User logs in via frontend
2. Backend returns JWT + role
3. Frontend stores token in memory
4. Requests include:

   ```
   Authorization: Bearer <token>
   ```
5. Backend validates token and enforces RBAC
6. UI updates based on user role

---

## 🧪 Running the Project

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Current Status

🟢 Phase 4 — Full-Stack Integration Completed

✔ Backend fully implemented (Auth + RBAC + Database)
✔ Frontend implemented (Login + Document UI)
✔ Role-based UI behavior working
✔ Secure authentication flow established

---

## ⏭️ Next Phase

➡ Phase 5: