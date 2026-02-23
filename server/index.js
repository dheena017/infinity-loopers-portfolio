import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSupabase } from './supabaseClient.js';

// Import Routes
import studentRoutes from './routes/students.js';
import operativeRoutes from './routes/operatives.js';
import missionRoutes from './routes/missions.js';
import archiveRoutes from './routes/archives.js';
import portfolioRoutes from './routes/portfolio.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
try {
    initSupabase();
    console.log('✅ Supabase Connection Initialized');
} catch (error) {
    console.warn('⚠️ Supabase credentials missing or invalid:', error.message);
}

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Space Portfolio Backend API Running' });
});

// Register Routes
app.use('/api/students', studentRoutes);
app.use('/api/operatives', operativeRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/archives', archiveRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Auth Route (Keeping for now as it's simple)
app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;

    if (role === 'teacher' && username === 'admin' && password === 'password123') {
        return res.json({ success: true, user: { username: 'admin', role: 'teacher' } });
    } else if (role === 'student' && username === 'student' && password === 'student123') {
        return res.json({ success: true, user: { username: 'student', role: 'student', studentId: 1 } });
    } else if (role === 'visitor') {
        return res.json({ success: true, user: { username: 'visitor', role: 'visitor' } });
    }

    res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
