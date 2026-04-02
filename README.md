# Waste Record Management System

A full-stack CRUD application for managing waste collection records, built with Node.js, React.js, and MongoDB.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Deployment:** AWS EC2
- **CI/CD:** GitHub Actions

## Project Setup Instructions

### Prerequisites
- Node.js v18+
- npm
- MongoDB Atlas account

### 1. Clone the Repository
```bash
git clone https://github.com/KaranR03/app_IFN636.git
cd app_IFN636
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```
PORT=5001
MONGO_URI=mongodb_connection_string
JWT_SECRET=secret_key
```

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Run Tests
```bash
cd backend
npm test
```

## Public URL
```
http://54.79.173.237:3000
```

## Demo Credentials

To access the dashboard, register a new account or use:
```
Email: karan12345@gmail.com
Password: pass1
```

> Note: Register a new account if demo credentials don't work.

## Features

- User registration and login (JWT authentication)
- Add waste collection records (type, quantity, location, date)
- View all waste records
- Edit existing records
- Delete records (admin only)
- Role-based access (admin/staff)

## CI/CD Pipeline

This project uses GitHub Actions with a self-hosted runner on AWS EC2.
The pipeline automatically:
1. Installs dependencies
2. Runs backend tests
3. Builds frontend
4. Deploys to EC2 via PM2

## GitHub Repository

https://github.com/KaranR03/app_IFN636
