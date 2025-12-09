import express from 'express';
import {
  getUserProgress,
  updateProgress,
  getSubjectProgress,
  getOverallStats,
  logStudySession
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getUserProgress);
router.get('/stats', getOverallStats);
router.get('/subject/:subject', getSubjectProgress);
router.put('/update', updateProgress);
router.post('/session', logStudySession);

export default router;