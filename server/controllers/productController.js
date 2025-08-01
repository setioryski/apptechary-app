const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Private
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      sku: req.body.sku,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      expiryDate: req.body.expiryDate,
      supplier: req.body.supplier,
    });
    const createdProduct = await product.save();
    const populatedProduct = await Product.findById(createdProduct._id).populate('category', 'name');
    res.status(201).json(populatedProduct);
  } catch (error)
 {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const { name, sku, category, price, stock, expiryDate, supplier } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.sku = sku;
      product.category = category;
      product.price = price;
      product.stock = stock;
      product.expiryDate = expiryDate;
      product.supplier = supplier;

      const updatedProduct = await product.save();
      const populatedProduct = await Product.findById(updatedProduct._id).populate('category', 'name');
      res.json(populatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};