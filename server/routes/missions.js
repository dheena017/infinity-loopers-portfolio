import express from 'express';
import { getAllMissions, getOngoingMissions, getMissionById, createMission, updateMission, deleteMission, assignOperativeToMission } from '../queries.js';
import { handleSupabaseError } from '../supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await getAllMissions();
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/status/ongoing', async (req, res) => {
    try {
        const data = await getOngoingMissions();
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await getMissionById(req.params.id);
        if (!data) return res.status(404).json({ success: false, error: 'Mission not found' });
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const data = await createMission(req.body);
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post('/:id/assign', async (req, res) => {
    try {
        const { operative_id, role_in_mission } = req.body;
        const data = await assignOperativeToMission(req.params.id, operative_id, role_in_mission);
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const data = await updateMission(req.params.id, req.body);
        res.json({ success: true, data });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteMission(req.params.id);
        res.json({ success: true, message: 'Mission deleted' });
    } catch (error) {
        const err = handleSupabaseError(error);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
