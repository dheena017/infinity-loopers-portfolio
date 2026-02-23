import express from 'express';
import { getAllOperatives, getActiveOperatives, getOperativeById, createOperative, updateOperative, deleteOperative } from '../queries.js';
import { handleSupabaseError } from '../supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await getAllOperatives();
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/active', async (req, res) => {
    try {
        const data = await getActiveOperatives();
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await getOperativeById(req.params.id);
        if (!data) return res.status(404).json({ success: false, error: 'Operative not found' });
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const data = await createOperative(req.body);
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const data = await updateOperative(req.params.id, req.body);
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteOperative(req.params.id);
        res.json({ success: true, message: 'Operative deleted' });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
