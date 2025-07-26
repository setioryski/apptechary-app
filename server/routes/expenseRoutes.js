const express = require('express');
const router = express.Router();
const {
  getExpenses,
  createExpense,
} = require('../controllers/expenseController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/').get(protect, isAdmin, getExpenses).post(protect, isAdmin, createExpense);

module.exports = router;