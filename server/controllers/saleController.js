const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
exports.addSale = async (req, res) => {
  const { items, totalAmount, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const productIds = items.map(item => item.productId);
    const products = await Product.find({ '_id': { $in: productIds } }).session(session);
    
    const saleItems = items.map(item => {
        const product = products.find(p => p._id.toString() === item.productId);
        if (!product) {
            throw new Error(`Product with id ${item.productId} not found.`);
        }
        return {
            ...item,
            basePrice: product.basePrice // Get basePrice from the database
        };
    });
    
    // Create the sale record
    const sale = new Sale({
      items: saleItems,
      cashierId: req.user._id,
      totalAmount,
      paymentMethod,
      status: 'Completed',
    });
    const createdSale = await sale.save({ session });

    // Decrease stock for each product
    for (const item of saleItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      }, { session });
    }

    await session.commitTransaction();
    
    // Populate cashier info for the response
    const populatedSale = await Sale.findById(createdSale._id).populate('cashierId', 'username');
    res.status(201).json(populatedSale);

  } catch (error) {
    await session.abortTransaction();
    console.error(`Sale creation error: ${error.message}`);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  } finally {
    session.endSession();
  }
};


// @desc    Retract a sale
// @route   PUT /api/sales/:id/retract
// @access  Private/Admin
exports.retractSale = async (req, res) => {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
        return res.status(404).json({ message: 'Sale not found' });
    }

    if (sale.status === 'Retracted') {
        return res.status(400).json({ message: 'Sale has already been retracted' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Restore stock for each item in the sale
        for (const item of sale.items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: +item.quantity }
            }, { session });
        }

        // Update the sale status
        sale.status = 'Retracted';
        const updatedSale = await sale.save({ session });

        await session.commitTransaction();
        
        const populatedSale = await Sale.findById(updatedSale._id).populate('cashierId', 'username');
        res.json(populatedSale);

    } catch (error) {
        await session.abortTransaction();
        console.error(`Sale retraction error: ${error.message}`);
        res.status(500).json({ message: `Server Error: ${error.message}` });
    } finally {
        session.endSession();
    }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private/Admin
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find({}).sort({ createdAt: -1 }).populate('cashierId', 'username');
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