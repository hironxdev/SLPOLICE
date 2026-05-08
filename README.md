# CSEU Case Management Portal

A minimal, functional government-style application structure for citizens to report complaints and CSEU administrators to manage them.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Auth:** JWT and User Roles

## Project Setup

### 1. Prerequisites

- [Node.js](https://nodejs.org/en/) installed.
- [MongoDB](https://www.mongodb.com/) installed locally and running (or provide a remote URI).

### 2. Backend Initialization

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   node server.js
   ```
   _The server defaults to port `5000` and locally connects to MongoDB. Ensure your MongoDB server is up._

### 3. Frontend Initialization

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   _The frontend typically starts at `http://localhost:5173`._

### 4. How to create an Admin Account (Initial Setup)

Currently, public registration only creates `user` role accounts for citizens. To access the admin portal:

1. Register normally through the frontend UI (`http://localhost:5173/register`).
2. Open your MongoDB command line, Compass, or shell.
3. Run the following update against the **ccid_portal** database:
   ```javascript
   use ccid_portal
   db.users.updateOne({ email: "youradmin@email.com" }, { $set: { role: "admin" } });
   ```
4. Log back in to the interface. You will be redirected to the secure Admin Dashboard.
