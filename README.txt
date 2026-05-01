# Team Task Manager

A full-stack MERN application for managing teams, projects, and tasks. Team Task Manager helps admins organize projects, assign work to team members, and track task progress through a clean dashboard.

## Live Demo

- Frontend: https://celebrated-creation-production.up.railway.app
- Backend API: https://team-task-manager-production-6fe2.up.railway.app/

## Tech Stack

### Frontend

- React.js
- Vite
- Axios
- React Router
- Plain CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js
- CORS
- dotenv

## Features

- Secure user signup and login with JWT authentication
- Role-based access control for admin and member users
- Admin users can create projects and manage project members
- Admin users can create, assign, and prioritize tasks
- Members can view assigned tasks and update task status
- Dashboard displays total tasks, task status counts, tasks per user, and overdue tasks
- MongoDB relationships connect users, projects, and tasks with ObjectId references
- Centralized backend error handling with consistent API responses
- Fully deployed on Railway with separate frontend and backend services

## Folder Structure

```bash
TaskManager/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd TaskManager
```

### 2. Setup Backend

```bash
cd server
npm install
npm run dev
```

The backend runs locally on:

```bash
http://localhost:5000
```

### 3. Setup Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend runs locally on:

```bash
http://localhost:5173
```

## Environment Variables

### Backend `.env`

Create a `.env` file inside the `server` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
```

For production:

```env
CLIENT_URL=https://celebrated-creation-production.up.railway.app
```

### Frontend `.env`

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_URL=https://team-task-manager-production-6fe2.up.railway.app/api
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user and return JWT |

### Projects

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/projects` | Create a project, admin only |
| GET | `/api/projects` | Get projects for the logged-in user |
| PUT | `/api/projects/:id/members` | Add or remove project members, admin only |

### Tasks

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/tasks` | Create and assign a task, admin only |
| GET | `/api/tasks` | Get tasks for the logged-in user |
| PUT | `/api/tasks/:id/status` | Update task status, assigned user only |

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/dashboard` | Get task statistics and dashboard data |



## Future Improvements

- Add user search for easier project member management
- Add task comments and activity history
- Add file attachments for tasks
- Add advanced task filtering and sorting
- Add email notifications for assigned tasks
- Add password reset functionality
- Add project-level analytics and progress charts

## Author

**Rishabh Vyas**

- GitHub: <https://github.com/devR1shabh>
- LinkedIn: <https://www.linkedin.com/in/rishabhvyas-dev>
