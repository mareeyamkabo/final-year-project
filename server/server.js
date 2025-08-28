// server/server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');  // 👈 FIXED PATH
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://127.0.0.1:5500'],
  credentials: true
}));
app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});
