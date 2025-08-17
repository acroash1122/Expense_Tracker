const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// ✅ Load .env from server folder
require('dotenv').config({ path: __dirname + '/server/.env' });

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes (now pointing inside server folder)
const authRoutes = require('./server/routes/auth');
app.use('/api/auth', authRoutes);

const transactionRoutes = require('./server/routes/transaction');
app.use('/api/transactions', transactionRoutes);

// ✅ Serve dashboard static HTML
app.use('/dashboard', express.static(path.join(__dirname, 'expense-ui')));

// ✅ Optional: Home Route
const title = process.env.SITE_TITLE || 'Default Site';
app.get('/', (req, res) => {
  res.send(`<h1>${title}</h1><p>Welcome to my app</p>`);
});

// ✅ MongoDB + Server Start
const PORT = process.env.PORT || 5000;

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
