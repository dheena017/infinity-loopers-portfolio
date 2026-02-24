# 🚀 Cosmic Frontier Portfolio | Squad 139

A professional space-themed portfolio platform built with React + Vite and powered by Supabase. Features stunning animations, interactive 3D backgrounds, and a cosmic loading experience.

**🌐 Live Site:** [https://infinity-loopers-portfolio.netlify.app](https://infinity-loopers-portfolio.netlify.app)

## ✨ Features

- 🎨 **Professional Loading Screen** - Meteor shower animation with twinkling stars and progress tracking
- 🌌 **Space Theme** - Dark cosmic aesthetic with Three.js 3D backgrounds
- 🔐 **Authentication System** - Role-based login (Student, Teacher, Secretary)
- 📊 **Dynamic Dashboards** - Personalized dashboards for different user roles
- 📝 **Profile Management** - Students can edit profiles, change passwords, and manage portfolios
- 👥 **Team Showcase** - Display mentors, students, and team members
- 🚀 **Missions & Archives** - Track projects and expeditions
- ⚡ **Real-time Data** - Direct Supabase integration for instant updates

## 🏗️ Project Structure

```
portfolio-/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components (Loading, HUD, ThreeScene, etc.)
│   │   ├── pages/              # Route pages (Home, Login, Dashboards, etc.)
│   │   ├── lib/                # Supabase client configuration
│   │   └── App.jsx             # Main app with routing
│   ├── .env                    # Local development environment variables
│   └── .env.production         # Production environment variables
├── server/                      # Express API (legacy - optional for local dev)
├── supabase/                    # Database setup
│   ├── migrations/             # Database schema
│   ├── add_auth_columns.sql   # Authentication setup
│   └── ensure_passwords.sql   # Password verification
├── netlify.toml                # Netlify deployment config
├── NETLIFY_AUTO_DEPLOY.md     # Auto-deployment guide
└── SUPABASE_AUTH_SETUP.md     # Authentication setup guide
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Framer Motion 12** - Animations and transitions
- **Tailwind CSS 4** - Styling framework
- **Three.js** - 3D backgrounds and effects
- **React Router 7** - Client-side routing

### Backend & Database
- **Supabase** - Postgres database with real-time features
- **Direct Client Integration** - No Express middleware needed

### Deployment
- **Netlify** - Frontend hosting and serverless functions
- **GitHub** - Version control and CI/CD

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Supabase account and project
- Netlify account (for deployment)

### 1. Clone and Install

```bash
git clone https://github.com/dheena017/portfolio-.git
cd portfolio-
npm run install:all
```

### 2. Configure Environment Variables

**For local development:**

Create `client/.env`:

```env
VITE_SUPABASE_URL=https://arniiywzkkizgocnkuqy.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Setup Supabase Database

Open [Supabase SQL Editor](https://supabase.com/dashboard) and run:

```sql
-- Run the schema migration
supabase/migrations/20260222120000_setup.sql

-- Then run authentication setup
supabase/add_auth_columns.sql
```

Or follow the detailed guide: [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md)

### 4. Run Locally

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000 (optional, for local testing)

## 📦 Deployment

### Deploy to Netlify (Automatic)

The site is already deployed and configured on Netlify.

#### Quick Deploy (Manual)

```bash
npm run deploy:netlify
```

#### Enable Auto-Deploy from GitHub

Follow the guide: [NETLIFY_AUTO_DEPLOY.md](NETLIFY_AUTO_DEPLOY.md)

Once setup, every `git push` will automatically deploy to production!

```bash
git add .
git commit -m "Your changes"
git push origin main
# ✨ Auto-deploys to https://infinity-loopers-portfolio.netlify.app
```

### Environment Variables on Netlify

Already configured in Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🔐 Authentication

### Default Login Credentials

After running the Supabase setup scripts, all users have the default password:

```
Password: kalvium@123
```

### Login by Role

**Student Login:**
- Email: Any student email from your database
- Password: `kalvium@123`
- Role: Select "Student"

**Teacher/Mentor Login:**
- Email: Any mentor email from your database
- Password: `kalvium@123`
- Role: Select "Teacher"

**Secretary Login:**
- Email: Any secretary email from your database
- Password: `kalvium@123`
- Role: Select "Secretary"

### Security Notes

⚠️ **Current Setup:** Demo authentication using plain text passwords stored in Supabase.

**For Production:**
- Implement password hashing (bcrypt/argon2)
- Use Supabase Auth built-in authentication
- Enable Row Level Security (RLS) policies
- Create unique passwords for each user
- Implement JWT token refresh

## 🗄️ Database Schema

### Main Tables

- **students** - Student profiles, portfolios, and authentication
- **mentors** - Teachers and mentors information
- **secretaries** - Administrative staff
- **operatives** - Team members and roles
- **missions** - Projects and expeditions
- **archives** - Mission records and documentation
- **portfolio** - Portfolio versions and releases

See full schema: [supabase/migrations/20260222120000_setup.sql](supabase/migrations/20260222120000_setup.sql)

## 📡 API Routes (Supabase Direct)

The frontend now connects directly to Supabase. No Express API needed for production.

### Example Queries

**Fetch all students:**
```javascript
const { data, error } = await supabase
  .from('students')
  .select('*')
  .order('created_at', { ascending: false });
```

**Update student profile:**
```javascript
const { data, error } = await supabase
  .from('students')
  .update({ name, bio, linkedin, github })
  .eq('id', studentId)
  .select();
```

**Authenticate user:**
```javascript
const { data, error } = await supabase
  .from('students')
  .select('*')
  .eq('email', email)
  .single();

// Verify password (demo - use proper auth in production)
if (data?.password === password) {
  // Login successful
}
```

## 💻 Development Commands

### Root Commands

```bash
# Install all dependencies (client + server)
npm run install:all

# Run both client and server (local dev)
npm run dev

# Build production client
npm run build

# Deploy to Netlify (manual)
npm run deploy:netlify

# Clean deploy (kills stuck ports first)
npm run dev:clean
```

### Client Commands

```bash
cd client

# Start dev server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Server Commands (Optional - Legacy)

```bash
cd server

# Start Express API server
npm run dev

# Run tests
npm test
```

## 🎯 Key Features Breakdown

### 1. Loading Page
- **File:** [client/src/components/Loading.jsx](client/src/components/Loading.jsx)
- 100 twinkling stars animation
- 5 diagonal meteor streaks
- Rotating spinner with red accent
- Live progress bar with percentage
- 2-second minimum display time
- SQUAD branding and tagline

### 2. Authentication System
- **Files:** [client/src/pages/Login.jsx](client/src/pages/Login.jsx)
- Role-based login (Student/Teacher/Secretary)
- Direct Supabase authentication
- Email + password validation
- Remember me functionality
- Forgot password flow

### 3. Student Dashboard
- **File:** [client/src/pages/StudentDashboard.jsx](client/src/pages/StudentDashboard.jsx)
- Profile editing (name, bio, links, photo)
- Password change functionality
- Resume upload link
- Portfolio projects showcase
- Course information display
- Archives access

### 4. Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Framer Motion animations
- Dark theme optimized
- Touch-friendly interfaces

## 🐛 Troubleshooting

### Build Errors

**Issue:** Vite build fails
```bash
# Clear cache and rebuild
cd client
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working

**Issue:** `supabase is null` error
1. Check `client/.env` exists with correct values
2. Restart dev server after changing `.env`
3. Verify environment variables in Netlify dashboard

### Port Already in Use

**Issue:** Port 5173 or 5000 already in use
```bash
# Windows
npm run dev:clean

# Or manually
netstat -ano | findstr :5173
taskkill /F /PID <PID>
```

### Supabase Connection Errors

**Issue:** Database queries failing
1. Verify Supabase project is active
2. Check anon key is correct (not expired)
3. Ensure tables exist (run migration scripts)
4. Check RLS policies if enabled

## 📚 Documentation

- **[NETLIFY_AUTO_DEPLOY.md](NETLIFY_AUTO_DEPLOY.md)** - Enable automatic Netlify deployments from GitHub
- **[SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md)** - Setup authentication in Supabase (2 minutes)
- **[server/API_DOCUMENTATION.md](server/API_DOCUMENTATION.md)** - Legacy Express API reference
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Integration patterns and examples

## 🔧 Configuration Files

- **netlify.toml** - Netlify build and deployment settings
- **vite.config.js** - Vite bundler configuration
- **tailwind.config.js** - Tailwind CSS customization
- **eslint.config.js** - Code linting rules

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is part of Squad 139 - Infinity Loopers portfolio.

## 🙏 Acknowledgments

- **Supabase** - Database and authentication platform
- **Netlify** - Hosting and deployment
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics
- **Tailwind CSS** - Styling framework

## 📧 Contact

**Squad 139 - Infinity Loopers**

- Website: [https://infinity-loopers-portfolio.netlify.app](https://infinity-loopers-portfolio.netlify.app)
- GitHub: [@dheena017](https://github.com/dheena017)

---

**Built with ❤️ and ☕ by Squad 139**