# ⬡ TaskTrack

A full-stack task management system for teams to organize, assign, and track tasks with role-based access control.

## Tech Stack

| Layer     | Technology                                      |
| --------- | ----------------------------------------------- |
| Frontend  | React , Bootstrap                               |
| Backend   | Spring Boot                                     |
| Database  | MySQL                                           |
| DevOps    | Docker                                          |

## Demo Flows

### Admin Flow - Create Users and update user roles 
- registering users
- updating user roles
- searching users with - email and id 

https://github.com/user-attachments/assets/1dfe695a-9aa8-4436-a760-2f35de2e6dea

### Admin Flow - Manage tasks (Delete and update)
- delete excusively available to admin roles only

https://github.com/user-attachments/assets/ac22f26a-9ac9-4dd7-8b59-4c85605d4add

### User flow - create task
- create a task with an assigned user
- create a task without any assigned user
- Task details validation
  - Task title should be minimum 5 characters
  - Task description must be minimum 10 character
  - otherwise a error is thrown

https://github.com/user-attachments/assets/af391946-3401-465e-8d6f-7b540a4daf11

### User flow - update assigned task status
- update assigned task's status
- update protection if user is not a Admin/Creator/Asignee
- delete action exclusively for admins only

https://github.com/user-attachments/assets/1ffd0f7a-e7e4-448f-8779-43f04f833710

## Architecture

```
┌────────────┐      ┌────────────────┐      ┌──────────┐
│   Client   │─────▶│    Backend     │─────▶│  MySQL   │
│  (React)   │:3000 │ (Spring Boot)  │:8080 │   (DB)   │:3306
│   Nginx    │      │   Tomcat       │      │          │
└────────────┘      └────────────────┘      └──────────┘
```

## Features

- **Authentication** — Session-based login/register with Spring Security
- **Role-Based Access** — Admin and User roles with protected routes
- **Task Management** — Create, update, delete, and filter tasks by status/assignee/creator
- **User Management** — Admin panel to manage users and assign roles
- **Multi-Filter Search** — Search tasks and users by multiple criteria

## Project Structure

```
task-management-system/
├── backend/          # Spring Boot REST API
├── client/           # React SPA
├── docker-compose.yaml
├── .env              # Environment variables (git-ignored)
└── .env.example      # Template for .env
```

## Quick Start (Docker)

### 1. Clone the repository

```bash
git clone https://github.com/karthxk07/tasktrack.git
cd tasktrack
```

### 2. Create the environment file

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
MYSQL_DB_URL=jdbc:mysql://localhost:3306/tasktrackerdb?createDatabaseIfNotExist=true
MYSQL_DB_NAME=tasktrackerdb
MYSQL_DB_USERNAME=your_username
MYSQL_DB_PASSWORD=your_password
MYSQL_ROOT_PASSWORD=your_root_password
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin
```

### 3. Start all services

```bash
docker compose up --build
```

This starts three containers:

| Service   | URL                      |
| --------- | ------------------------ |
| Client    | http://localhost:3000     |
| Backend   | http://localhost:8080     |
| MySQL     | localhost:3306            |

### 4. Stop

```bash
docker compose down       # keep data
docker compose down -v    # delete volumes too
```

## Environment Variables

| Variable              | Description                  | Used By          |
| --------------------- | ---------------------------- | ---------------- |
| `MYSQL_DB_NAME`       | Database name                | Docker (MySQL)   |
| `MYSQL_DB_USERNAME`   | Database username            | Docker (MySQL, Backend) |
| `MYSQL_DB_PASSWORD`   | Database password            | Docker (MySQL, Backend) |
| `MYSQL_ROOT_PASSWORD` | MySQL root password          | Docker (MySQL)   |
| `ADMIN_EMAIL`         | Default Admin User Email     | Docker (Backend) |
| `ADMIN_PASSWORD`      | Default Admin User Password  | Docker (Backend) |

## Documentation

- [Client README](./client/README.md) — Frontend setup, architecture, and deployment
- [Backend README](./backend/README.md) — API routes, setup, and deployment
- [API Documentation (Postman)](https://documenter.getpostman.com/view/27122690/2sBXikorL1#239a70c9-4645-4ee8-940a-9b30873205f0)

## License

This project is for educational and portfolio purposes.
