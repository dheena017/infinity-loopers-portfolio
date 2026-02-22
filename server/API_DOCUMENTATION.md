# API Documentation - Cosmic Frontier Backend

## Base URL
```
http://localhost:5000
```

## Endpoints

### 🔴 OPERATIVES

**GET** `/api/operatives` - Get all operatives
```bash
curl http://localhost:5000/api/operatives
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Astra Voss",
      "role": "Systems Architect",
      "skills": ["Postgres", "Supabase", "Security"],
      "status": "active",
      "created_at": "2026-02-15T10:00:00Z"
    }
  ]
}
```

**GET** `/api/operatives/active` - Get active operatives only
```bash
curl http://localhost:5000/api/operatives/active
```

**GET** `/api/operatives/:id` - Get operative by ID
```bash
curl http://localhost:5000/api/operatives/11111111-1111-1111-1111-111111111111
```

**POST** `/api/operatives` - Create new operative
```bash
curl -X POST http://localhost:5000/api/operatives \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Echo Rivera",
    "role": "Frontend Specialist",
    "skills": ["React", "TypeScript", "Design"],
    "status": "active"
  }'
```

**PUT** `/api/operatives/:id` - Update operative
```bash
curl -X PUT http://localhost:5000/api/operatives/11111111-1111-1111-1111-111111111111 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'
```

**DELETE** `/api/operatives/:id` - Delete operative
```bash
curl -X DELETE http://localhost:5000/api/operatives/11111111-1111-1111-1111-111111111111
```

---

### 🚀 MISSIONS

**GET** `/api/missions` - Get all missions
```bash
curl http://localhost:5000/api/missions
```

**GET** `/api/missions/status/ongoing` - Get ongoing missions
```bash
curl http://localhost:5000/api/missions/status/ongoing
```

**GET** `/api/missions/:id` - Get mission with assigned operatives
```bash
curl http://localhost:5000/api/missions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
```
Response includes `operatives` array of assigned team members.

**POST** `/api/missions` - Create new mission
```bash
curl -X POST http://localhost:5000/api/missions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Operation Zenith",
    "description": "Deep space exploration initiative",
    "start_date": "2026-03-15",
    "end_date": "2026-06-30",
    "status": "planned"
  }'
```

**POST** `/api/missions/:id/assign` - Assign operative to mission
```bash
curl -X POST http://localhost:5000/api/missions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/assign \
  -H "Content-Type: application/json" \
  -d '{
    "operative_id": "11111111-1111-1111-1111-111111111111",
    "role_in_mission": "Lead Architect"
  }'
```

**PUT** `/api/missions/:id` - Update mission
```bash
curl -X PUT http://localhost:5000/api/missions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ongoing"
  }'
```

**DELETE** `/api/missions/:id` - Delete mission
```bash
curl -X DELETE http://localhost:5000/api/missions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
```

---

### 📚 STUDENTS

**GET** `/api/students` - Get all students
```bash
curl http://localhost:5000/api/students
```

**GET** `/api/students/:id` - Get student by ID
```bash
curl http://localhost:5000/api/students/5
```

**GET** `/api/students/term/:term` - Get students by term
```bash
curl http://localhost:5000/api/students/term/Term%201
```

**PUT** `/api/students/:id` - Update student info
```bash
curl -X PUT http://localhost:5000/api/students/5 \
  -H "Content-Type: application/json" \
  -d '{
    "linkedin": "https://linkedin.com/in/kamala",
    "github": "https://github.com/kamala"
  }'
```

---

### 🗂️ ARCHIVES

**GET** `/api/archives/mission/:missionId` - Get mission archives
```bash
curl http://localhost:5000/api/archives/mission/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
```

**POST** `/api/archives` - Create archive entry
```bash
curl -X POST http://localhost:5000/api/archives \
  -H "Content-Type: application/json" \
  -d '{
    "mission_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    "summary": "Mission completed with 95% success rate"
  }'
```

---

### 📦 PORTFOLIO

**GET** `/api/portfolio` - Get all portfolio versions
```bash
curl http://localhost:5000/api/portfolio
```

**GET** `/api/portfolio/:version` - Get portfolio by version
```bash
curl http://localhost:5000/api/portfolio/v3.0.0
```

**GET** `/api/portfolio/:id/with-missions` - Get portfolio with linked missions
```bash
curl http://localhost:5000/api/portfolio/99999999-9999-9999-9999-999999999999/with-missions
```
Response:
```json
{
  "success": true,
  "data": {
    "portfolio": { ... },
    "missions": [ ... ]
  }
}
```

---

## Common Query Patterns

### Get all active operatives in ongoing missions
```javascript
const activeOperatives = await fetch('http://localhost:5000/api/operatives/active')
  .then(r => r.json())
  .then(data => data.data);

const ongoingMissions = await fetch('http://localhost:5000/api/missions/status/ongoing')
  .then(r => r.json())
  .then(data => data.data);
```

### Create a new mission and assign operatives
```javascript
// 1. Create mission
const mission = await fetch('http://localhost:5000/api/missions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Initiative',
    description: 'Strategic planning',
    status: 'planned'
  })
}).then(r => r.json());

// 2. Assign operatives
await fetch(`http://localhost:5000/api/missions/${mission.data.id}/assign`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    operative_id: 'operative-uuid-here',
    role_in_mission: 'Lead'
  })
});
```

### Get portfolio version and its missions
```javascript
const response = await fetch('http://localhost:5000/api/portfolio/v3.0.0/with-missions');
const { portfolio, missions } = await response.json();
```

---

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request (missing fields)
- `404` - Resource not found
- `500` - Server error

---

## Environment Setup

Create a `.env` file in the `server/` directory:
```
SUPABASE_URL=https://arniiywzkkizgocnkuqy.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
PORT=5000
```

Then run:
```bash
npm run dev
```
