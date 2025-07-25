const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true, enum: ['Cash', 'Card', 'Digital'] }
}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema);