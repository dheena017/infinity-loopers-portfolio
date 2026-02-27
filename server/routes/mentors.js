import express from 'express';
import { getAllMentors, createMentor, updateMentor } from '../queries.js';
import { requireCoreLeadership } from '../middleware/coreLeadershipAuth.js';

const router = express.Router();

// GET /api/mentors - return all mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await getAllMentors();
    res.json({ success: true, data: mentors });
  } catch (err) {
    console.error('Failed to fetch mentors:', err.message || err);
    res.status(500).json({ success: false, message: 'Failed to fetch mentors' });
  }
});

// POST /api/mentors - create a new mentor
router.post('/', requireCoreLeadership, async (req, res) => {
  try {
    const payload = req.body || {};
    const newMentor = await createMentor(payload);
    res.status(201).json({ success: true, data: newMentor });
  } catch (err) {
    console.error('Failed to create mentor:', err.message || err);
    res.status(500).json({ success: false, message: 'Failed to create mentor' });
  }
});

// PUT /api/mentors/:id - update mentor
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const updated = await updateMentor(id, updates);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Failed to update mentor:', err.message || err);
    res.status(500).json({ success: false, message: 'Failed to update mentor' });
  }
});

export default router;
