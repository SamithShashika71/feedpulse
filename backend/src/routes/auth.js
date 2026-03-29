const express = require('express');
const router = express.Router();

// Routes will be added in Step 2
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth route works' });
});

module.exports = router;