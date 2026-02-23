import express from 'express';
import { getAllStudents, getStudentById, getStudentsByTerm, updateStudent } from '../queries.js';
import { handleSupabaseError } from '../supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await getAllStudents();
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await getStudentById(parseInt(req.params.id));
        if (!data) return res.status(404).json({ success: false, error: 'Student not found' });
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/term/:term', async (req, res) => {
    try {
        const data = await getStudentsByTerm(req.params.term);
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const data = await updateStudent(parseInt(req.params.id), req.body);
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
