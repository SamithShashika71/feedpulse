const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
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

const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    data: null,
    error: 'Too Many Requests',
    message: 'Too many submissions from this IP. Please try again after an hour.',
  },
});

// Public — rate limited
router.post('/', feedbackLimiter, submitFeedback);

// Admin only
router.get('/summary', protect, getAISummary);
router.get('/stats', protect, getStats);
router.get('/', protect, getAllFeedback);
router.get('/:id', protect, getFeedbackById);
router.patch('/:id', protect, updateFeedbackStatus);
router.delete('/:id', protect, deleteFeedback);
router.post('/:id/reanalyze', protect, reanalyzeWithAI);

module.exports = router;