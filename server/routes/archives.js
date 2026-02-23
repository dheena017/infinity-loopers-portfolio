import express from 'express';
import { getArchivesByMission, createArchive } from '../queries.js';
import { handleSupabaseError } from '../supabaseClient.js';

const router = express.Router();

router.get('/mission/:id', async (req, res) => {
    try {
        const data = await getArchivesByMission(req.params.id);
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const data = await createArchive(req.body);
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
