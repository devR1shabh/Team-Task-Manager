# Team Task Manager Frontend

React frontend for the Team Task Manager backend API.

## Setup

```bash
cd client
npm install
npm run dev
```

The local API URL is configured in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, set `VITE_API_URL` to the deployed backend API URL.

## Build

```bash
npm run build
```

## Test Flow

1. Start the backend from `server`.
2. Start the frontend from `client`.
3. Create an admin account from `/signup`.
4. Create a member account from `/signup` and copy the member ID shown in the header after signup.
5. Login as admin.
6. Create a project and add the member ID.
7. Create a task assigned to a project member.
8. Login as the member.
9. Open Tasks and update the assigned task status.
10. Open Dashboard to confirm totals and status counts changed.

The backend does not expose a user listing API, so admin member management uses user IDs.
