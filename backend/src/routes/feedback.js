const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  submitFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
  getAISummary,
  reanalyzeWithAI,
  getStats,
} = require('../controllers/feedbackController');

// Public
router.post('/', submitFeedback);

// Admin only
router.get('/summary', protect, getAISummary);
router.get('/stats', protect, getStats);
router.get('/', protect, getAllFeedback);
router.get('/:id', protect, getFeedbackById);
router.patch('/:id', protect, updateFeedbackStatus);
router.delete('/:id', protect, deleteFeedback);
router.post('/:id/reanalyze', protect, reanalyzeWithAI);

module.exports = router;