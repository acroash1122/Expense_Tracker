const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: String,                // Raw input
  amount: Number,
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  category: String,            // AI-predicted category
  rawCategory: String,         // (optional) User-provided category or AI keyword used
  date: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
