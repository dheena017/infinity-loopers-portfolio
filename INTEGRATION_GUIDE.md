# Supabase Integration - Complete Setup Guide

## ✅ What's Been Set Up

You now have a fully-integrated **Express.js + Supabase + TypeScript** backend for your portfolio with the following:

### 📁 New Files Created

1. **[types.ts](types.ts)** - TypeScript interfaces for all tables:
   - `Operative`, `Mission`, `Archive`, `Portfolio`, `Student`, `MissionOperative`
   - Response types: `ApiResponse<T>`, `PaginatedResponse<T>`

2. **[supabaseClient.ts](supabaseClient.ts)** - Supabase setup & initialization:
   - `initSupabase()` - Initialize client with env vars
   - `getSupabase()` - Get singleton instance
   - `handleSupabaseError()` - Error handling utility

3. **[queries.ts](queries.ts)** - Database query functions (40+ functions):
   - Operatives: `getAllOperatives()`, `getActiveOperatives()`, `createOperative()`, `updateOperative()`, etc.
   - Missions: `getAllMissions()`, `getOngoingMissions()`, `assignOperativeToMission()`, etc.
   - Archives: `getArchivesByMission()`, `createArchive()`
   - Portfolio: `getPortfolioWithMissions()`
   - Students: `getAllStudents()`, `getStudentsByTerm()`, `updateStudent()`

4. **API Routes** - Express routers for each entity:
   - `[routes/operatives.ts](routes/operatives.ts)` - Full CRUD for operatives
   - `[routes/missions.ts](routes/missions.ts)` - Full CRUD + assign operatives
   - `[routes/archives.ts](routes/archives.ts)` - Archive management
   - `[routes/portfolio.ts](routes/portfolio.ts)` - Portfolio versions with missions
   - `[routes/students.ts](routes/students.ts)` - Student management

5. **[index.js](index.js)** - Updated server:
   - Imports & registers all route handlers
   - Initializes Supabase on startup
   - Keeps auth & login routes

6. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Complete API reference:
   - All endpoints with curl examples
   - Query patterns
   - Error handling guide

7. **[../client/src/components/API_Examples.tsx](../client/src/components/API_Examples.tsx)** - React examples:
   - `OperativesList` component
   - `MissionsWithOperatives` component
   - `StudentEditor` component

---

## 🚀 Quick Start

### 1. Finish Supabase Setup
You already have `.env` with:
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
PORT=5000
```

### 2. Run SQL Schema in Supabase
- Go to https://app.supabase.com → Your Project → SQL Editor
- Create a new query
- Copy all content from [`supabase_setup.sql`](../../supabase_setup.sql) and paste it
- Click **Run**

This will create:
- 7 tables: operatives, missions, mission_operatives, archives, portfolio, portfolio_missions, students
- 24 pre-populated students
- Row-level security policies
- Indexes for performance

### 3. Start the Server
```bash
cd server
npm run dev
```

You should see:
```
✅ Supabase Connection Initialized
Server is running on port 5000
```

### 4. Test an Endpoint
```bash
curl http://localhost:5000/api/students
```

Should return all 24 students as JSON.

---

## 📚 API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| **OPERATIVES** | | |
| GET | `/api/operatives` | Get all operatives |
| GET | `/api/operatives/active` | Get active only |
| GET | `/api/operatives/:id` | Get by ID |
| POST | `/api/operatives` | Create new |
| PUT | `/api/operatives/:id` | Update |
| DELETE | `/api/operatives/:id` | Delete |
| **MISSIONS** | | |
| GET | `/api/missions` | Get all missions |
| GET | `/api/missions/status/ongoing` | Get ongoing |
| GET | `/api/missions/:id` | Get with operatives |
| POST | `/api/missions` | Create new |
| POST | `/api/missions/:id/assign` | Assign operative |
| PUT | `/api/missions/:id` | Update |
| DELETE | `/api/missions/:id` | Delete |
| **STUDENTS** | | |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get by ID |
| GET | `/api/students/term/:term` | Filter by term |
| PUT | `/api/students/:id` | Update |
| **ARCHIVES** | | |
| GET | `/api/archives/mission/:id` | Get mission archives |
| POST | `/api/archives` | Create entry |
| **PORTFOLIO** | | |
| GET | `/api/portfolio` | Get all versions |
| GET | `/api/portfolio/:version` | Get by version |
| GET | `/api/portfolio/:id/with-missions` | Get with linked missions |

---

## 🔧 Development Workflow

### Using Queries from Frontend
All query functions are exported from `queries.ts`:

```typescript
import { getAllStudents, getOngoingMissions } from './queries.js';

const students = await getAllStudents();
const missions = await getOngoingMissions();
```

### Creating New Routes
1. Add query function to `queries.ts`
2. Create route handler in `routes/[entity].ts`
3. Register in `index.js`: `app.use('/api/[entity]', routerImport)`

### Error Handling
All routes use consistent error handling:
```typescript
try {
  // ... do something
} catch (error) {
  const err = handleSupabaseError(error);
  res.status(500).json({ success: false, error: err.message });
}
```

---

## 📖 Example Queries

### Fetch all active operatives in ongoing missions
```javascript
const active = await fetch('http://localhost:5000/api/operatives/active').then(r => r.json());
const missions = await fetch('http://localhost:5000/api/missions/status/ongoing').then(r => r.json());
```

### Create mission and assign operative
```javascript
// Create
const missionRes = await fetch('http://localhost:5000/api/missions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Operation Nexus',
    description: 'Launch next-gen platform',
    status: 'planned'
  })
});
const mission = await missionRes.json();

// Assign
await fetch(`http://localhost:5000/api/missions/${mission.data.id}/assign`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operative_id: 'uuid-here',
    role_in_mission: 'Lead Developer'
  })
});
```

### Get portfolio with missions
```javascript
const response = await fetch('http://localhost:5000/api/portfolio/v3.0.0/with-missions');
const { portfolio, missions } = await response.json();
```

---

## 🎯 Next Steps

1. ✅ Run the SQL schema in Supabase
2. ✅ Start the server (`npm run dev`)
3. Import the React examples in `client/src/components/API_Examples.tsx` to pages
4. Integrate operatives/missions data into your frontend components
5. Add authentication middleware for write operations (POST/PUT/DELETE)

---

## 📞 Troubleshooting

**"Supabase credentials missing"**
- Check `.env` file exists in `server/` directory
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- Restart the server

**"Table does not exist"**
- Run the SQL schema in Supabase SQL Editor
- Verify all tables were created (check Supabase dashboard)

**CORS errors in browser**
- Your React app is running on a different port than the server
- The server has `cors()` middleware - no additional setup needed
- Make sure API calls use `http://localhost:5000`

**"Cannot GET /api/[route]"**
- Make sure you've registered the route in `index.js`
- Check the route file exists in `routes/` folder
- Restart the server after changes
