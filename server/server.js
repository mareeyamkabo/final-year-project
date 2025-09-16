// server/server.js
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"], // ✅ Allow React & old HTML
  credentials: true,
}));

app.use(express.json());

// ✅ Serve static uploads
app.use("/uploads", express.static("uploads"));

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
