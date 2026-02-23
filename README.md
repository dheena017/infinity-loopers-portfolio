# Cosmic Frontier Portfolio

Full-stack portfolio platform with a React + Vite frontend and an Express + Supabase backend.

## Project Structure

- `client/` — React UI (Vite)
- `server/` — Express API with Supabase integration
- `supabase/migrations/20260222120000_setup.sql` — single database schema + seed source

## Tech Stack

- Frontend: React 19, Vite 7, Framer Motion, Tailwind CSS 4
- Backend: Express 5, Supabase JS, dotenv
- Database: Supabase Postgres

## Prerequisites

- Node.js 18+
- npm 9+
- Supabase project (for full backend persistence)

## Setup

### 1) Install dependencies

From repository root:

```bash
npm run install:all
```

### 2) Configure server environment

Create `server/.env`:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=5000
```

### 3) (Optional) Configure client Supabase env

Only needed for direct client-side Supabase usage:

Create `client/.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4) Initialize database

In Supabase SQL Editor, run:

1. `supabase/migrations/20260222120000_setup.sql`

## Run

### Start both apps (recommended)

```bash
npm run dev
```

- Client: `http://localhost:5173` (Vite may auto-switch to 5174/5175 if busy)
- Server: `http://localhost:5000`

### Start individually

```bash
npm run server
npm run client
```

## Authentication (Current Behavior)

- **Teacher**: username `admin`, password `password123`
- **Student**: username is student email; password is stored `students.password` (default `kalvium@123` from base migration)
- **Legacy student fallback**: `student` / `student123`
- **Secretary**: `secretary` / `sec123`
- **Visitor**: any username with role `visitor` succeeds

## API Overview

Base URL: `http://localhost:5000`

- `GET /api/students`
- `GET /api/students/:id`
- `PUT /api/students/:id`
- `POST /api/students/:id/change-password`
- `POST /api/login`
- `POST /api/forgot-password`
- `GET/POST /api/mentors`
- `GET/POST /api/secretaries`
- `GET/POST/PUT/DELETE /api/operatives`
- `GET/POST/PUT/DELETE /api/missions`
- `GET/POST /api/archives` (currently mission-specific `GET /api/archives/mission/:id` is implemented)
- `GET /api/portfolio`, `GET /api/portfolio/:version`, `GET /api/portfolio/:id/with-missions`

For detailed request examples, see `server/API_DOCUMENTATION.md`.

## Known Caveats

- `client/src/pages/Mentors.jsx` uses relative `/api/...` calls, but `client/vite.config.js` currently has **no proxy**. If frontend and backend run on different origins, those requests may fail.
- `client/src/pages/StudentDashboard.jsx` requests `GET /api/archives`, but server currently implements `GET /api/archives/mission/:id` (no list-all route in router).
- Root `npm run dev` may fail if dependencies were not installed in both `client/` and `server/`; use `npm run install:all` first.

## Useful Commands

From root:

```bash
npm run install:all
npm run dev
npm run dev:clean
```

From server:

```bash
npm run dev
```

From client:

```bash
npm run dev
npm run build
npm run preview
```