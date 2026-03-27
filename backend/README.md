# TaskTrack — Backend

The Spring Boot REST API for TaskTrack, providing authentication, task management, and user management with role-based access control.

## Tech Stack

- **Spring Boot 4.0.4** with Spring MVC
- **Spring Security** — Session-based authentication
- **Spring Data JPA** with Hibernate 7
- **MySQL 8.0** — Relational database
- **Lombok** — Boilerplate reduction
- **Bean Validation** — Request validation via Jakarta Validation

## API Documentation

> 📘 **Full interactive API documentation is available on Postman:**
>
> **[View API Documentation →](https://documenter.getpostman.com/view/27122690/2sBXikorL1#239a70c9-4645-4ee8-940a-9b30873205f0)**

## API Routes

### Authentication — `/auth`

| Method | Endpoint         | Description                    | Auth Required |
| ------ | ---------------- | ------------------------------ | ------------- |
| POST   | `/auth/register` | Register a new user            | No            |
| POST   | `/auth/login`    | Login with email and password  | No            |
| GET    | `/auth/logout`   | Logout and invalidate session  | Yes           |
| GET    | `/auth/me`       | Get current user info          | Yes           |

#### `POST /auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### `POST /auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### `GET /auth/me` — Response
```json
{
  "email": "john@example.com",
  "role": "ROLE_USER"
}
```

---

### Tasks — `/api/tasks`

| Method | Endpoint          | Description                              | Auth Required |
| ------ | ----------------- | ---------------------------------------- | ------------- |
| POST   | `/api/tasks`      | Create a new task                        | Yes           |
| GET    | `/api/tasks`      | Get all tasks (with optional filters)    | Yes           |
| GET    | `/api/tasks/{id}` | Get a specific task by ID                | Yes           |
| PUT    | `/api/tasks/{id}` | Update a task                            | Yes           |
| DELETE | `/api/tasks/{id}` | Delete a task                            | Yes           |

#### Query Parameters for `GET /api/tasks`

| Parameter    | Type   | Description                     |
| ------------ | ------ | ------------------------------- |
| `status`     | String | Filter by status: `TODO`, `IN_PROGRESS`, `DONE` |
| `assignedTo` | Long   | Filter by assigned user ID      |
| `createdBy`  | Long   | Filter by creator user ID       |

#### `POST /api/tasks` — Request Body
```json
{
  "title": "Implement login page",
  "description": "Create the login page with email and password fields",
  "status": "TODO",
  "assignedTo": { "id": 2 }
}
```

#### Task Response
```json
{
  "id": 1,
  "title": "Implement login page",
  "description": "Create the login page with email and password fields",
  "status": "TODO",
  "assignedTo": { "id": 2, "name": "Jane", "email": "jane@example.com", "roles": [...] },
  "createdBy": { "id": 1, "name": "John", "email": "john@example.com", "roles": [...] },
  "createdAt": "2026-03-27T10:00:00",
  "updatedAt": "2026-03-27T10:00:00"
}
```

---

### Users — `/api/users`

| Method | Endpoint                      | Description                    | Auth Required |
| ------ | ----------------------------- | ------------------------------ | ------------- |
| GET    | `/api/users`                  | Get all users                  | Yes           |
| GET    | `/api/users/{id}`             | Get user by ID                 | Yes           |
| GET    | `/api/users?email={email}`    | Get user by email              | Yes           |
| PUT    | `/api/users/{id}?role={role}` | Update user role               | Yes (Admin)   |

#### User Response
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "roles": [
    { "id": 1, "name": "ROLE_USER" }
  ]
}
```

---

## Data Models

### User
| Field        | Type           | Constraints                    |
| ------------ | -------------- | ------------------------------ |
| id           | Long           | Auto-generated                 |
| name         | String         | Required                       |
| email        | String         | Required, unique               |
| passwordHash | String         | Required, JSON-ignored         |
| roles        | Set\<Role\>    | Many-to-Many, eager fetch      |

### Task
| Field       | Type           | Constraints                      |
| ----------- | -------------- | -------------------------------- |
| id          | Long           | Auto-generated                   |
| title       | String         | Required, min 5 chars            |
| description | String         | Required, min 10 chars           |
| status      | Status (enum)  | `TODO`, `IN_PROGRESS`, `DONE`    |
| assignedTo  | User           | Optional                         |
| createdBy   | User           | Required, immutable              |
| createdAt   | LocalDateTime  | Auto-generated                   |
| updatedAt   | LocalDateTime  | Auto-updated                     |

### Role
| Field | Type   | Constraints          |
| ----- | ------ | -------------------- |
| id    | Long   | Auto-generated       |
| name  | String | Required, unique (`ROLE_USER`, `ROLE_ADMIN`) |

## Error Handling

The API uses a `GlobalExceptionHandler` (`@ControllerAdvice`) to provide consistent, structured error responses across all endpoints. Every error returns a JSON object with `timestamp`, `status`, `error`, `message`, and `path` fields — ensuring clients always receive predictable, parseable responses regardless of the exception type.

Handled exceptions include `ResourceNotFoundException` (404) for missing users/tasks, `UsernameNotFoundException` (404) for invalid login credentials, `IllegalArgumentException` (400) for duplicate emails, `SecurityException` (403) for unauthorized actions, and a catch-all handler (500) for unexpected errors. Stack traces are never exposed to clients.

## Deployment

### Prerequisites

- Java 21
- Maven 3.9+
- MySQL 8.0

### Local Development

**1. Set up environment variables**

Create a `.env` file in the project root:

```env
MYSQL_DB_URL=jdbc:mysql://localhost:3306/tasktrackerdb?createDatabaseIfNotExist=true
MYSQL_DB_NAME=tasktrackerdb
MYSQL_DB_USERNAME=your_username
MYSQL_DB_PASSWORD=your_password
MYSQL_ROOT_PASSWORD=your_root_password
```

The backend's `application.properties` imports this file via:
```properties
spring.config.import=optional:file:../../.env[.properties]
```

**2. Build and run**

```bash
cd backend
./mvnw spring-boot:run
```

Or with explicit env vars:

```bash
DB_URL="jdbc:mysql://localhost:3306/tasktrackerdb?createDatabaseIfNotExist=true" \
DB_USERNAME="your_username" \
DB_PASSWORD="your_password" \
./mvnw spring-boot:run
```

The API starts at `http://localhost:8080`.

### Docker (Standalone)

```bash
cd backend

docker build -t tasktrack-backend .

docker run -p 8080:8080 \
  -e DB_URL="jdbc:mysql://host.docker.internal:3306/tasktrackerdb?createDatabaseIfNotExist=true" \
  -e DB_USERNAME="your_username" \
  -e DB_PASSWORD="your_password" \
  tasktrack-backend
```

### Docker Compose (Full Stack)

From the project root:

```bash
docker compose up --build
```

Docker Compose handles MySQL startup, healthchecks, and environment variable injection automatically. See the [root README](../README.md) for full setup instructions.

## Project Structure

```
backend/
├── src/main/java/com/github/karthxk07/task_management_system/
│   ├── TaskManagementSystemApplication.java   # Entry point
│   ├── config/
│   │   └── SecurityConfiguration.java         # Spring Security config
│   ├── controller/
│   │   ├── AuthController.java                # /auth routes
│   │   ├── TaskController.java                # /api/tasks routes
│   │   └── UserController.java                # /api/users routes
│   ├── entity/
│   │   ├── User.java
│   │   ├── Task.java
│   │   └── Role.java
│   ├── enums/
│   │   └── Status.java                        # TODO, IN_PROGRESS, DONE
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   └── ResourceNotFoundException.java
│   ├── payload/
│   │   ├── LoginDto.java
│   │   ├── RegisterDto.java
│   │   └── ErrorDetail.java
│   ├── respository/
│   │   ├── UserRepository.java
│   │   ├── TaskRepository.java
│   │   └── RoleRespository.java
│   ├── security/
│   │   └── CustomUserDetailsService.java
│   └── service/
│       ├── AuthService.java
│       ├── TaskService.java
│       ├── UserService.java
│       └── impl/
│           ├── AuthServiceImpl.java
│           ├── TaskServiceImpl.java
│           └── UserServiceImpl.java
├── src/main/resources/
│   └── application.properties
├── Dockerfile
├── pom.xml
└── mvnw
```
