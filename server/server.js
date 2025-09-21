// server/server.js
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/claims", require("./routes/claimRoutes")); 

const claimRoutes = require("./routes/claimRoutes");
app.use("/api/claims", claimRoutes);


// Start server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
