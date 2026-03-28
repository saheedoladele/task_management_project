# Task Management

A full-stack task management application: register and sign in, manage tasks in a dashboard, and user profile, history, and settings areas behind authentication.

## Stack

### Client (`client/`)

- **Runtime & language:** TypeScript, React 18
- **Build & dev:** Vite (with SWC React plugin)
- **Styling:** Tailwind CSS, Radix UI primitives, class-variance-authority / `tailwind-merge`
- **Data & forms:** TanStack Query, Axios, React Hook Form, Zod
- **Routing:** React Router
- **Other:** Drag-and-drop (`@hello-pangea/dnd`), Lucide icons, Sonner toasts

### Server (`server/`)

- **Runtime & language:** Node.js, TypeScript
- **API:** Express
- **Database:** PostgreSQL via TypeORM
- **Auth:** JWT, bcrypt
- **Validation / config:** Zod, dotenv

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [PostgreSQL](https://www.postgresql.org/) running locally or a hosted instance

## Getting started

### 1. API server

1. Create a database (e.g. `taskmgt_db`) in PostgreSQL.
2. From the repo root:

   ```bash
   cd server
   cp .env.example .env
   ```

3. Edit `server/.env`: set `DATABASE_URL` **or** `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and set `JWT_SECRET` to a long random string. Defaults match local Postgres on port `5432` with database `taskmanager` as in `.env.example`.
4. Install and run:

   ```bash
   npm install
   npm run dev
   ```

The API listens on the port in `PORT` (default **3001**). Health check: `GET http://localhost:3001/health`.

For production builds, use `npm run build` then `npm start`, and run migrations instead of relying on `DB_SYNCHRONIZE` (see `server/package.json` scripts).

### 2. Web client

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

The dev server runs on **8080** by default and proxies `/api` to `http://localhost:3001`, so start the API first (or expect proxy errors until it is up).
