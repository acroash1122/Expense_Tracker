const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const predictCategory = require('../utils/predictCategory');

// ✅ Create transaction with AI-powered category
router.post('/add', async (req, res) => {
  try {
    const { title, amount, type, userId } = req.body;

    console.log("📥 Transaction incoming:", req.body);

    // 👇 Predict category from title
   console.log("📥 New Transaction:", req.body);

    // 🧠 Predict category using AI
    const { category, rawCategory } = await predictCategory(title);
    console.log("🔮 AI predicted:", category);

    const txn = new Transaction({
      title,
      amount,
      type,
      category,
      rawCategory,
      userId
    });

    await txn.save();
    res.status(201).json({ message: 'Transaction saved', txn });
  } catch (err) {
    console.error("❌ Error in /add:", err.message);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Transaction.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error("❌ Delete route error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all transactions for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📊 Summary stats: total income, expense, and category breakdown
router.get('/summary/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });

    let income = 0, expense = 0;
    const categoryStats = {};

    transactions.forEach(txn => {
      if (txn.type === 'income') income += txn.amount;
      else expense += txn.amount;

      if (!categoryStats[txn.category]) categoryStats[txn.category] = 0;
      categoryStats[txn.category] += txn.amount;
    });

    res.json({
      income,
      expense,
      balance: income - expense,
      categoryStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
