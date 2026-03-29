# Report: Explanation of the RBAC Design

## Abstract

This project is an **Access-Controlled Digital Library** developed with **FastAPI** for the backend and **React** for the frontend. Its main purpose is to control access to documents in a secure and organized way. The system uses **JWT authentication** to verify users and **Role-Based Access Control (RBAC)** to decide what each user is allowed to do.

The design is based on three roles: `admin`, `editor`, and `viewer`. Each role has a different level of permission. This approach makes the application easier to manage because permissions are assigned to roles instead of individual users. The main focus of this report is to explain how the RBAC design works in the project.

## System Design

The system follows a simple full-stack structure with a frontend, a backend, and storage components.

The **frontend** is built with React and provides the user interface for login and document actions. After login, it stores the JWT token and role in memory and shows different actions depending on the user role.

The **backend** is built with FastAPI and handles authentication, authorization, and document management. It verifies login credentials, creates JWT tokens, validates incoming tokens, and protects routes using role checks.

The project also uses **SQLite** to store document metadata and a local **uploads** folder to store uploaded files. Each document includes metadata such as title, uploader, upload time, and a `role_access` field.

This design separates responsibilities clearly:
- the frontend manages interaction
- the backend enforces security
- the database stores document information
- local storage keeps the uploaded files

## RBAC Design

The RBAC design is the core security feature of this project. Its purpose is to make sure that users can only perform actions allowed for their role.

The system uses three roles:

- `admin`
- `editor`
- `viewer`

Each role has different permissions. In the current implementation, the `admin` can upload and delete documents and access the users route. The `editor` can upload documents and update document metadata. The `viewer` has the most limited access and uses viewer-level actions in the interface.

Before RBAC is applied, the system must first authenticate the user. This happens during login. The user enters an email and password, and the backend checks these credentials. If they are correct, the backend creates a JWT token containing the user email and role. This token is then used in protected requests.

The RBAC logic is mainly implemented through two backend functions: `get_current_user` and `require_role`.

The `get_current_user` function is responsible for checking the bearer token sent with a request. It validates the token and returns the decoded payload. If the token is missing, invalid, or expired, the system returns `401 Unauthorized`. This step identifies the user.

The `require_role` function is the main RBAC helper. It receives a list of allowed roles and checks whether the current user's role is included in that list. If the role is not allowed, the system returns `403 Forbidden`. For example, if a route uses `require_role(["admin", "editor"])`, only users with either of those roles can access it.

The current implementation enforces RBAC mainly at the route level, while the `role_access` field on each document provides a foundation for more detailed document-level authorization.


This design is effective because it keeps authorization logic centralized and reusable. Instead of writing role checks separately in every route, the project uses one clean helper that can be applied wherever needed.

Another important part of the design is the `role_access` field stored in each document. This field contains a list of roles linked to that document, such as `["admin", "editor", "viewer"]`. In the current project, this field is stored in the database, returned by the API, editable by the update route, and shown in the frontend. This adds a document-level access structure on top of the route-level RBAC design.

The frontend also supports the RBAC model by showing different actions to different roles. For example, the admin sees delete actions, the editor sees edit actions, and the viewer sees download actions. This improves usability, but the real security still comes from the backend, where the actual access checks happen.

Overall, the RBAC design in this project is simple, clear, and practical. It is easy to understand, easy to maintain, and suitable for a learning project that demonstrates secure access control.

## Conclusion

In conclusion, the RBAC design is the main element that controls access in this project. The system first authenticates the user with JWT, then checks the user role before allowing protected actions. The use of centralized role checking makes the backend code cleaner and more secure.

What makes this design strong is that it combines authentication, backend route protection, and role-aware frontend behavior in one system.
