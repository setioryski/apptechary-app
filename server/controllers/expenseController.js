const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private/Admin
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({}).populate('createdBy', 'username');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create an expense
// @route   POST /api/expenses
// @access  Private/Admin
exports.createExpense = async (req, res) => {
  try {
    const expense = new Expense({
      description: req.body.description,
      amount: req.body.amount,
      category: req.body.category,
      createdBy: req.user._id,
    });
    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};