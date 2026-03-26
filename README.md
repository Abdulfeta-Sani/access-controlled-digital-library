# 📚 Access-Controlled Digital Library

## 🚀 Overview

This project is a full-stack digital library system that enforces role-based access control (RBAC) using JWT authentication. Users are assigned roles (Admin, Editor, Viewer), and each role determines what actions they can perform within the system.

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
* JWT Authentication (PyJWT)
* Custom RBAC Middleware


### Frontend

* React + TypeScript
* TailwindCSS

### Database

* SQLite

---

## 📂 Project Structure

```
backend/   → FastAPI application
frontend/  → React application
```

---

## 📌 Current Status

🟡 Phase 1 — Project Setup & Planning
