
![Architecture Diagram](./screenshots/Architecture%20Diagram.png)

## Architecture Diagram Description
This diagram shows the overall structure of the Access-Controlled Digital Library system. It explains how the frontend, backend, database, and file storage work together. The React frontend handles user interaction, the FastAPI backend manages authentication and authorization, SQLite stores document metadata, and the uploads folder stores document files. The diagram gives a high-level view of how the main parts of the system are connected.

![Authentication Flow Diagram](./screenshots/Authentication%20Flow%20Diagram.png)

## Authentication Flow Diagram Description
This diagram explains how user authentication works in the system. It shows the process from login to access control: the user enters credentials, the backend verifies them, a JWT token is generated, and the frontend stores the token for future requests. It also shows how protected requests include the bearer token and how the backend validates the token before allowing access. This helps show how authentication supports secure access to the system.