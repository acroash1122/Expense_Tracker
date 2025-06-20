const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ✅ Home Route (optional test)
app.get('/', (req, res) => {
  res.send('🚀 Expense Tracker API is running!');
});

// ✅ MongoDB + Server Start
const PORT = process.env.PORT || 5000;
// Serve dashboard static HTML
app.use('/dashboard', express.static(path.join(__dirname, '../expense-ui')));
const transactionRoutes = require('./routes/transaction');
app.use('/api/transactions', transactionRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log('📡 Ready to accept API calls like: POST /api/auth/login');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });
