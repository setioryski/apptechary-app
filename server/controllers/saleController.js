const Sale = require('../models/Sale');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
exports.addSale = async (req, res) => {
  const { items, totalAmount, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // Decrease stock for each item first
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        if (product.stock < item.quantity) {
          // Not enough stock, so we stop the process before creating a sale record
          return res.status(400).json({ message: `Not enough stock for ${product.name}` });
        }
        product.stock -= item.quantity;
        await product.save();
      } else {
        // If any product is not found, we stop the process
        return res.status(404).json({ message: `Product with id ${item.productId} not found` });
      }
    }

    // If all stock updates are successful, create the sale
    const sale = new Sale({
      items,
      cashierId: req.user._id,
      totalAmount,
      paymentMethod,
    });

    const createdSale = await sale.save();

    // Populate cashier and product details for the invoice
    const populatedSale = await Sale.findById(createdSale._id)
        .populate('cashierId', 'username')
        .populate('items.productId', 'name sku');

    res.status(201).json(populatedSale);

  } catch (error) {
    // This will catch any other errors during the process
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};


// @desc    Get all sales
// @route   GET /api/sales
// @access  Private/Admin
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find({}).populate('cashierId', 'username').sort({ createdAt: -1 });
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
        const sale = await Sale.findById(req.params.id)
            .populate('cashierId', 'username')
            .populate('items.productId', 'name sku');
        if (sale) {
            res.json(sale);
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};