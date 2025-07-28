const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  expiryDate: { type: Date },
  supplier: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);