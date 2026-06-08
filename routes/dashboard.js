const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/authMiddleware');

router.get('/totals', auth, dashboardController.totals);
router.get('/monthly-revenue', auth, dashboardController.monthlyRevenue);

module.exports = router;
