const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Cashiers and Admins can view products
router.route('/').get(protect, getProducts).post(protect, isAdmin, createProduct);
router
  .route('/:id')
  .get(protect, getProductById)
  .put(protect, isAdmin, updateProduct)
  .delete(protect, isAdmin, deleteProduct);

module.exports = router;