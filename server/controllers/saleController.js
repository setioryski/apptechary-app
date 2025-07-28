const Sale = require('../models/Sale');

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
exports.addSale = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      const sale = new Sale({
        items,
        cashierId: req.user._id,
        totalAmount,
        paymentMethod,
      });

      const createdSale = await sale.save();
      res.status(201).json(createdSale);
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private/Admin
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find({}).populate('cashierId', 'username');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get sale by ID
// @route   GET /api/sales/:id
// @access  Private/Admin
exports.getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id).populate('cashierId', 'username').populate('items.productId', 'sku');
        if (sale) {
            res.json(sale);
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};