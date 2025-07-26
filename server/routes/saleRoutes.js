const express = require('express');
const router = express.Router();
const { addSale, getSales } = require('../controllers/saleController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addSale).get(protect, isAdmin, getSales);

module.exports = router;