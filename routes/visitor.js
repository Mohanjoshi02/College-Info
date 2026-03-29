const express = require('express');
const router = express.Router();

// Visitors page (public route)
router.get('/', (req, res) => {
  res.render('visitors/index');
});

module.exports = router;