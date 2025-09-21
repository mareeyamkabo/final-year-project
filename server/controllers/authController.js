// server/controllers/authController.js
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// server/controllers/authController.js
exports.register = async (req, res) => {
  const { name, email, password, nin } = req.body;
  try {
    // Validate name (no numbers)
    if (!/^[A-Za-z\s]+$/.test(name)) {
      return res.status(400).json({ message: "Name must contain only letters" });
    }

    // Email check
    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    // NIN check (ignore "0")
    if (nin && nin !== "0") {
      const ninExist = await User.findOne({ where: { nin } });
      if (ninExist) {
        return res.status(400).json({ message: "NIN already registered" });
      }
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      nin,
      role: "student",
    });

    res.status(201).json({ message: "Student registered", user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error registering student" });
  }
};


// Login admin or student
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,  // ✅ FIX: use env var
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
