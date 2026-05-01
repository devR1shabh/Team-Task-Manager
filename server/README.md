# Team Task Manager API

Backend for a simplified collaborative task management app. It uses Node.js, Express, MongoDB, Mongoose, JWT authentication, bcrypt password hashing, CORS, and centralized error handling.

## Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Set the values in `.env` before starting the server:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

For local development only, you may add `PORT=5000`. On Railway, do not set `PORT` manually; Railway injects it automatically. `CLIENT_URL` should be the deployed frontend URL in production. Production CORS only allows that configured origin.

## Scripts

```bash
npm start
npm run dev
```

Railway can run the backend with:

```bash
npm install && npm start
```

## Response Format

All endpoints return:

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

## Authentication

Protected endpoints require:

```http
Authorization: Bearer <jwt>
```

Users can register as `admin` or `member`. Admins can create projects, manage project members, and create tasks. Members can view their assigned tasks and update the status of tasks assigned to them.

## API Documentation

### Health

`GET /`

`GET /health`

### Auth

`POST /api/auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

`POST /api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Projects

`POST /api/projects`  
Admin only.

```json
{
  "name": "Website Launch",
  "description": "Launch project",
  "members": ["USER_ID"]
}
```

`GET /api/projects`  
Returns projects where the logged-in user is creator or member.

`PUT /api/projects/:id/members`  
Admin only.

```json
{
  "userId": "USER_ID",
  "action": "add"
}
```

Use `"remove"` to remove a member. Project creators cannot be removed.

### Tasks

`POST /api/tasks`  
Admin only.

```json
{
  "title": "Create wireframes",
  "description": "Homepage and dashboard",
  "projectId": "PROJECT_ID",
  "assignedTo": "USER_ID",
  "status": "To Do",
  "priority": "high",
  "dueDate": "2026-05-15"
}
```

`GET /api/tasks`  
Members receive assigned tasks. Admins receive tasks in projects they created or belong to.

`PUT /api/tasks/:id/status`  
Only the assigned user can update status.

```json
{
  "status": "In Progress"
}
```

### Dashboard

`GET /api/dashboard`

Returns:

```json
{
  "totalTasks": 3,
  "tasksByStatus": {
    "To Do": 1,
    "In Progress": 1,
    "Done": 1
  },
  "tasksPerUser": [],
  "overdueTasks": []
}
```

## Railway Deployment

1. Create a Railway project for the backend.
2. Set the root directory to `server` if deploying from a monorepo.
3. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
4. Do not add a manual `PORT` variable on Railway.
5. Use the start command:

```bash
npm start
```

6. After deploying the frontend, update `CLIENT_URL` to the frontend production URL.
