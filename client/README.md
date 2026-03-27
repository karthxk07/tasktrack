# TaskTrack — Client

The React frontend for TaskTrack, a task management system with role-based access control.

## Tech Stack

- **React 19** with Create React App
- **Bootstrap 5** for UI components
- **Axios** for HTTP requests
- **React Router v7** for client-side routing
- **Nginx** for serving the production build in Docker

## Application Flow

```
┌──────────────────────────────────────────────────────┐
│                      App.js                          │
│                                                      │
│  PublicRoute (unauthenticated)                       │
│  ├── /          → LoginPage                          │
│  └── /login     → LoginPage                          │
│                                                      │
│  ProtectedRoute (authenticated)                      │
│  ├── /tasks     → TaskListPage                       │
│  └── /users     → UsersListPage (admin only)         │
└──────────────────────────────────────────────────────┘
```

### Authentication Flow

1. User visits `/login` → `LoginForm` sends credentials to `POST /auth/login`
2. Backend creates a session cookie (`JSESSIONID`)
3. All subsequent API calls include `withCredentials: true` to send the cookie
4. `ProtectedRoute` checks session via `GET /auth/me` — redirects to `/login` if unauthenticated
5. `PublicRoute` redirects already-authenticated users to `/tasks`

### Pages

| Page             | Route    | Description                              |
| ---------------- | -------- | ---------------------------------------- |
| `LoginPage`      | `/login` | Login form with branding                 |
| `TaskListPage`   | `/tasks` | Task list with filters, create, edit, delete |
| `UsersListPage`  | `/users` | User management with search and role editing (admin) |

### Components

| Component        | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| `Topbar`         | Navigation bar with user info and logout          |
| `LoginForm`      | Email/password login form                         |
| `TaskTable`      | Renders the task list table                       |
| `TaskTableRow`   | Individual task row with inline edit and delete   |
| `TaskFilter`     | Filter tasks by status, assignee, creator         |
| `TaskFormModal`  | Modal form to create new tasks                    |
| `UserTable`      | Renders the user list with role management        |
| `UserSearch`     | Search users by email or ID                       |
| `AddUserModal`   | Modal form to register new users                  |
| `ProtectedRoute` | Route guard — requires authentication             |
| `PublicRoute`    | Route guard — redirects if already authenticated  |

## Runtime Configuration

Environment variables are injected at **runtime** (not build time) so the same Docker image works in any environment.

**How it works:**

1. `public/env-config.js` — Loaded via a `<script>` tag in `index.html`
2. At container startup, the Dockerfile's `CMD` generates `env-config.js` from all `REACT_APP_*` environment variables
3. `src/config.js` reads from `window._env_` with a localhost fallback

```
Docker Compose env → Container startup → env-config.js → window._env_ → config.js
```

### Environment Variables

| Variable                 | Description       | Default                  |
| ------------------------ | ----------------- | ------------------------ |
| `REACT_APP_API_BASE_URL` | Backend API URL   | `http://localhost:8080`  |

## Deployment

### Local Development

```bash
cd client

# Create .env (optional, config.js has a localhost fallback)
echo "REACT_APP_API_BASE_URL=http://localhost:8080" > .env

# Install dependencies
npm install

# Start dev server
npm start
```

The app runs at `http://localhost:3000` and proxies API calls to `http://localhost:8080`.

### Docker (Standalone)

```bash
cd client

docker build -t tasktrack-client .

docker run -p 3000:80 \
  -e REACT_APP_API_BASE_URL=http://localhost:8080 \
  tasktrack-client
```

### Docker Compose (Full Stack)

From the project root:

```bash
docker compose up --build
```

The client is available at `http://localhost:3000`. See the [root README](../README.md) for full setup instructions.

## Project Structure

```
client/
├── public/
│   ├── index.html          # Entry HTML with env-config.js script tag
│   └── env-config.js       # Runtime env vars (generated in Docker)
├── src/
│   ├── config.js           # Central config (window._env_ → process.env → fallback)
│   ├── App.js              # Router setup
│   ├── index.js             # React entry point
│   ├── index.css            # Global styles
│   ├── components/          # Reusable UI components
│   │   ├── AddUserModal/
│   │   ├── LoginForm/
│   │   ├── ProtectedRoute/
│   │   ├── PublicRoute/
│   │   ├── TaskFilter/
│   │   ├── TaskFormModal/
│   │   ├── TaskTable/
│   │   ├── TaskTableRow/
│   │   ├── Topbar/
│   │   ├── UserSearch/
│   │   └── UserTable/
│   └── pages/               # Page-level components
│       ├── LoginPage/
│       ├── TaskListPage/
│       └── UsersListPage/
├── Dockerfile
├── nginx.conf
├── .dockerignore
└── package.json
```
