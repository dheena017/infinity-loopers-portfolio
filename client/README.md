# Client App (React + Vite)

Frontend for the Cosmic Frontier portfolio platform.

## Features

- Animated React UI with Framer Motion
- Route-based pages for home, operatives, mentors, expeditions, collective, transmissions
- Login flow with role-based redirects (`student`, `teacher`, etc.)
- Student dashboard profile editing + password change flow
- Fallback behavior when backend is offline (for selected views)

## Routes

- `/` — Home
- `/login` — Login
- `/forgot-password` — Forgot password
- `/reset-password` — Reset password UI
- `/operatives`
- `/mentors`
- `/expeditions`
- `/team`
- `/secretary`
- `/student`
- `/admin`
- `/transmissions`

## Development

From repository root:

```bash
npm run client
```

From `client/` directly:

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Environment Variables

Optional `client/.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The frontend still primarily consumes backend REST endpoints on `http://localhost:5000`.

## Backend Dependency

Most pages rely on the server running at `http://localhost:5000`.

Important note:

- Some pages call absolute URLs (`http://localhost:5000/api/...`)
- `Mentors.jsx` currently calls relative `/api/...` URLs
- `vite.config.js` currently has no proxy, so relative `/api` calls can fail unless you add a proxy or serve behind one origin

## Login Notes (Current API behavior)

- Student login expects email + password
- Teacher login currently accepts hardcoded credentials on backend (`admin` / `password123`)
- Student default password is `kalvium@123` when DB patch has been applied

## Troubleshooting

- If login or data fetch fails, verify backend is running on port `5000`
- If `/api/mentors` fails from browser, it is likely a missing Vite proxy issue
- If student password change fails, ensure `ADD_PASSWORD_COLUMN.sql` has been executed
