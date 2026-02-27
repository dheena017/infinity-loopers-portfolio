# 🎨 Cosmic Frontier - Frontend

React + Vite frontend for the Squad 139 Infinity Loopers portfolio platform.

## ✨ Features

- **Professional Loading Screen** - Meteor shower with twinkling stars and progress tracking
- **Animated UI** - Framer Motion transitions and interactions
- **3D Backgrounds** - Three.js space effects
- **Dark Cosmic Theme** - Tailwind CSS with custom space aesthetic
- **Role-Based Dashboards** - Student and Teacher views
- **Real-time Data** - Direct Supabase integration
- **Responsive Design** - Mobile-first approach
- **Profile Management** - Edit profiles, change passwords, manage portfolios

## 🗺️ Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Landing page with hero and navigation |
| `/login` | Login | Authentication with role selection |
| `/forgot-password` | ForgotPassword | Password recovery flow |
| `/reset-password` | ResetPassword | Password reset with token |
| `/student` | StudentDashboard | Student profile and portfolio management |
| `/admin` | TeacherDashboard | Teacher/admin control panel |
| `/operatives` | Operatives | Team operatives showcase |
| `/mentors` | Mentors | Mentors and advisors display |
| `/expeditions` | Expeditions | Missions and projects |
| `/team` | Collective | Full team collective view |
| `/transmissions` | Transmissions | Communications and updates |

## 🚀 Development

### From Repository Root

```bash
# Install all dependencies
npm run install:all

# Run dev server
npm run dev

# Push Supabase migrations to remote database
npx supabase login
npx supabase link --project-ref arniiywzkkizgocnkuqy
npx supabase db push

# Deploy to Netlify production
npm run deploy:netlify
```

### From Client Directory

```bash
cd client

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔧 Environment Variables

Create `.env` for local development:

```env
VITE_SUPABASE_URL=https://arniiywzkkizgocnkuqy.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Create `.env.production` for production builds:

```env
VITE_SUPABASE_URL=https://arniiywzkkizgocnkuqy.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Note:** These are already configured in Netlify for production deployment.

## 🗄️ Supabase Integration

The frontend connects **directly** to Supabase - no Express backend needed!

### Supabase Client Setup

**File:** [src/lib/supabase.js](src/lib/supabase.js)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Example Usage

**Fetch data:**
```javascript
import { supabase } from '../lib/supabase';

const { data, error } = await supabase
  .from('students')
  .select('*')
  .order('created_at', { ascending: false });
```

**Update data:**
```javascript
const { data, error } = await supabase
  .from('students')
  .update({ name, bio })
  .eq('id', studentId)
  .select();
```

## 📦 Key Dependencies

- **react** (19.x) - UI library
- **react-router-dom** (7.x) - Client-side routing
- **framer-motion** (12.x) - Animation library
- **three** & **@react-three/fiber** - 3D graphics
- **@supabase/supabase-js** (2.x) - Supabase client
- **tailwindcss** (4.x) - CSS framework
- **lucide-react** - Icon library
- **vite** (7.x) - Build tool

## 🎨 Component Structure

```
src/
├── components/
│   ├── Loading.jsx          # Space-themed loading screen
│   ├── HUD.jsx              # Navigation header
│   ├── ThreeScene.jsx       # 3D background effects
│   ├── ProfileCard.jsx      # User profile cards
│   ├── SquadLogo.jsx        # Squad branding
│   └── dashboard/
│       └── OperativeCard.jsx
├── pages/
│   ├── Home.jsx             # Landing page
│   ├── Login.jsx            # Authentication
│   ├── StudentDashboard.jsx # Student portal
│   ├── TeacherDashboard.jsx # Teacher portal
│   ├── Mentors.jsx          # Mentors showcase
│   ├── Collective.jsx       # Team overview
│   ├── Operatives.jsx       # Team operatives
│   ├── Expeditions.jsx      # Missions
│   └── Transmissions.jsx    # Updates
├── lib/
│   └── supabase.js          # Supabase client config
├── data/
│   └── team.js              # Static team data fallback
└── App.jsx                  # Main app with routing
```

## 🎭 Loading Screen

**File:** [src/components/Loading.jsx](src/components/Loading.jsx)

Features:
- 100 randomly positioned twinkling stars
- 5 diagonal meteor streaks with animation
- Rotating spinner with red accent dot
- Progress bar with live percentage
- 2-second minimum display time
- SQUAD_139 branding
- "INFINITY LOOPERS" tagline

## 🚀 Build & Deploy

### Production Build

```bash
npm run build
```

Output: `dist/` directory with optimized assets

### Deploy to Netlify

From root directory:

```bash
npm run deploy:netlify
```

To update database schema before deployment (from root):

```bash
npx supabase db push
```

Or enable auto-deploy from GitHub (see [NETLIFY_AUTO_DEPLOY.md](../NETLIFY_AUTO_DEPLOY.md))

## 🔍 Development Tips

### Hot Module Replacement (HMR)

Vite provides instant HMR - changes appear immediately without refresh.

### Port Configuration

Default port: **5173**  
If busy, Vite auto-switches to 5174, 5175, etc.

### Clearing Cache

```bash
rm -rf node_modules dist .vite
npm install
```

### Debugging Supabase

Add console logs to check connection:

```javascript
if (!supabase) {
  console.error('❌ Supabase not initialized');
} else {
  console.log('✅ Supabase connected');
}
```

## 📱 Responsive Breakpoints

Tailwind CSS breakpoints used:

- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

## 🎨 Theme Colors

```css
/* Primary Colors */
--red-500: #EF4444  /* Accent */
--slate-900: #0F172A /* Dark background */
--slate-100: #F1F5F9 /* Light text */

/* Background */
--bg-primary: #030305  /* Deep space */
--bg-secondary: #0a0a0f /* Slightly lighter */
```

## 📄 License

Part of Squad 139 - Infinity Loopers portfolio project.

---

**Built with ❤️ by Squad 139**

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
- If student password change fails, ensure `supabase/migrations/20260222120000_setup.sql` has been applied
