import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getSupabase, initSupabase } from './supabaseClient.js';

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

// ==================== STUDENTS ====================

// GET /api/students - Get all students
app.get('/api/students', async (req, res) => {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('id', { ascending: true });

        if (error) throw error;
        res.json({ success: true, data: data || [] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/students/:id - Get student by ID
app.get('/api/students/:id', async (req, res) => {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', parseInt(req.params.id))
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (!data) return res.status(404).json({ success: false, error: 'Student not found' });

        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT /api/students/:id - Update student
app.put('/api/students/:id', async (req, res) => {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('students')
            .update(req.body)
            .eq('id', parseInt(req.params.id))
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== OPERATIVES ====================

// GET /api/operatives - Get all operatives
app.get('/api/operatives', async (req, res) => {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('operatives')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, data: data || [] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== MISSIONS ====================

// GET /api/missions - Get all missions
app.get('/api/missions', async (req, res) => {
    try {
        const supabase = getSupabase();
        // Join with operatives via mission_operatives if needed, but for now simple select
        const { data, error } = await supabase
            .from('missions')
            .select(`
                *,
                operatives:mission_operatives(
                    operative:operatives(*)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform data to flattening the structure if desired, or keep as is
        const transformedData = data.map(mission => ({
            ...mission,
            assigned_operatives: mission.operatives.map(mo => mo.operative)
        }));

        res.json({ success: true, data: transformedData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== ARCHIVES ====================

// GET /api/archives - Get all archives
app.get('/api/archives', async (req, res) => {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('archives')
            .select(`
                *,
                mission:missions(title)
            `)
            .order('date_recorded', { ascending: false });

        if (error) throw error;
        res.json({ success: true, data: data || [] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== PORTFOLIO ====================

// GET /api/portfolio - Get portfolio versions
app.get('/api/portfolio', async (req, res) => {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from('portfolio')
            .select(`
                *,
                missions:portfolio_missions(
                    mission:missions(title, status)
                )
            `)
            .order('release_date', { ascending: false });

        if (error) throw error;

         // Transform data
         const transformedData = data.map(item => ({
            ...item,
            linked_missions: item.missions.map(pm => pm.mission)
        }));

        res.json({ success: true, data: transformedData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== AUTH ====================

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

