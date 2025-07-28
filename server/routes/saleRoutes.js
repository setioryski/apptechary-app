const express = require('express');
const router = express.Router();
const { addSale, getSales, getSaleById } = require('../controllers/saleController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addSale).get(protect, isAdmin, getSales);
router.route('/:id').get(protect, isAdmin, getSaleById);

module.exports = router;