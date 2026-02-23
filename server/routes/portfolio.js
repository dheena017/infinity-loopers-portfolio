import express from 'express';
import { getAllPortfolios, getPortfolioByVersion, getPortfolioWithMissions } from '../queries.js';
import { handleSupabaseError } from '../supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await getAllPortfolios();
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/:version', async (req, res) => {
    try {
        const data = await getPortfolioByVersion(req.params.version);
        if (!data) return res.status(404).json({ success: false, error: 'Portfolio version not found' });
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/:id/with-missions', async (req, res) => {
    try {
        const data = await getPortfolioWithMissions(req.params.id);
        if (!data) return res.status(404).json({ success: false, error: 'Portfolio not found' });
        res.json({ success: true, ...data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
