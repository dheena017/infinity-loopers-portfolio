import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export let supabase = null;

if (supabaseUrl && supabaseUrl.startsWith('http') && supabaseKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase Connection Initialized');
    } catch (error) {
        console.warn('⚠️ Failed to initialize Supabase client:', error.message);
    }
} else {
    console.warn('⚠️ Supabase credentials missing or invalid. Skipping client initialization.');
}

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Space Portfolio Backend API Running' });
});

// Example route for students (data that was in main.js)
app.get('/api/students', async (req, res) => {
    try {
        // If Supabase is initialized, try fetching from there
        if (supabase) {
            const { data, error } = await supabase.from('students').select('*').order('id', { ascending: true });
            if (!error && data && data.length > 0) {
                return res.json(data);
            }
            console.log('Supabase table empty or error, falling back to mock data');
        }

        // Fallback Mock Data
        const students = [
            { id: 1, name: 'hariz', linkedin: '', github: '' },
            { id: 2, name: 'sham', linkedin: '', github: '' },
            { id: 3, name: 'amarnath', linkedin: 'https://www.linkedin.com/in/amarnath-p-s-942782322/', github: 'https://github.com/amarnath-cdr' },
            { id: 4, name: 'arulananthan', linkedin: '', github: '' },
            { id: 5, name: 'kamala kiruthi', linkedin: 'https://www.linkedin.com/in/kamala-kiruthi/', github: 'https://github.com/kamalakiruthi8' },
            { id: 6, name: 'lohith', linkedin: 'https://www.linkedin.com/in/chinthalapalli-lohith-126447384/', github: 'https://github.com/lohithchinthalalpalli' },
            { id: 7, name: 'hari', linkedin: 'https://www.linkedin.com/in/hari-r-bb3181370/', github: 'https://github.com/harirs139-ui' },
            { id: 8, name: 'jayseelan', linkedin: 'https://www.linkedin.com/in/jayaseelan-d-1951952a6', github: 'https://www.linkedin.com/in/jayaseelan-d-1951952a6' },
            { id: 9, name: 'durga saranya', linkedin: 'https://www.linkedin.com/feed/', github: 'https://github.com/durgasaranyas139-lgtm' },
            { id: 10, name: 'gokul', linkedin: 'http://www.linkedin.com/in/gokul-raj95', github: 'https://www.linkedin.com/in/gokul-raj95' },
            { id: 11, name: 'joy arnold', linkedin: 'https://www.linkedin.com/in/joyarnold21?utm_source=share_via&utm_content=profile&utm_medium=member_android', github: '' },
            { id: 12, name: 'kathiravan', linkedin: 'https://www.linkedin.com/in/kathiravan-e-56688a39b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', github: 'https://github.com/ekathiravanelumalai71-a11y' },
            { id: 13, name: 'mosses', linkedin: 'https://www.linkedin.com/in/moses-acknal-7957973a4/', github: 'https://github.com/mosesacknals139' },
            { id: 14, name: 'priyadharsan', linkedin: 'http://www.linkedin.com/in/priyadharsan-s2007', github: 'https://github.com/Priyadharsan2911' },
            { id: 15, name: 'abinay', linkedin: 'https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit', github: '' },
            { id: 16, name: 'suriya', linkedin: '', github: '' },
            { id: 17, name: 'yakesh', linkedin: 'https://www.linkedin.com/in/yakesh-r-92648a383?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', github: 'https://github.com/yakpranu-design' },
            { id: 18, name: 'nanthakumar', linkedin: 'http://www.linkedin.com/in/nandhakumar-pm-8276b7381', github: 'https://github.com/nandhakumar1980' },
            { id: 19, name: 'srinithi', linkedin: 'https://www.linkedin.com/in/srinithi-vijayakumar-981785344/', github: 'https://github.com/srinithivijayakumars139-wq' },
            { id: 20, name: 'srimathi', linkedin: 'https://www.linkedin.com/in/srimathi-vijayakumar-10518a383/', github: 'https://github.com/srimajaya123-blip' },
            { id: 21, name: 'srinidthi', linkedin: 'https://www.linkedin.com/in/srinidhi-v-123193384/', github: 'https://github.com/srinidhivs139-ai' },
            { id: 22, name: 'mohan', linkedin: 'http://www.linkedin.com/in/mohan-e-b7945b2b2', github: 'https://github.com/mohanes139-cell' },
            { id: 23, name: 'nabi rasool', linkedin: 'http://www.linkedin.com/in/nabi-rasool-129494393', github: '' },
            { id: 24, name: 'keerthana', linkedin: 'https://www.linkedin.com/feed/', github: 'https://github.com/krishnakeerthanamitte-tech' }
        ];
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auth Route
app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;

    // Simple mock authentication
    if (role === 'teacher' && username === 'admin' && password === 'password123') {
        return res.json({ success: true, user: { username: 'admin', role: 'teacher' } });
    } else if (role === 'student' && username === 'student' && password === 'student123') {
        return res.json({ success: true, user: { username: 'student', role: 'student', studentId: 1 } });
    } else if (role === 'visitor') {
        return res.json({ success: true, user: { username: 'visitor', role: 'visitor' } });
    }

    res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Update Student Route
app.put('/api/students/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('students')
                .update(updatedData)
                .eq('id', id)
                .select();

            if (error) throw error;
            return res.json({ success: true, data });
        }

        // Mock success if no supabase
        console.log(`Mock Update: Student ${id} updated with:`, updatedData);
        res.json({ success: true, message: 'Student updated (Mock)' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

