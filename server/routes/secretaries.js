import express from 'express';
import { getAllSecretaries, getSecretaryById, updateSecretary, createSecretary } from '../queries.js';

const router = express.Router();

// Get all secretaries
router.get('/', async (req, res) => {
    try {
        const secretaries = await getAllSecretaries();
        res.json(secretaries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get secretary by ID
router.get('/:id', async (req, res) => {
    try {
        const secretary = await getSecretaryById(req.params.id);
        if (!secretary) return res.status(404).json({ message: 'Secretary not found' });
        res.json(secretary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update secretary
router.put('/:id', async (req, res) => {
    try {
        const updated = await updateSecretary(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

// Create secretary (used as teacher endpoint by admin form)
router.post('/', async (req, res) => {
    try {
        const payload = req.body || {};
        const created = await createSecretary(payload);
        res.status(201).json({ success: true, data: created });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
