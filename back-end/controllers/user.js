import Router from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = Router();

// User registration
router.post("/register", async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Check if the username and password are provided
    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if the username meets length requirements
    if (userName.length < 3 || userName.length > 20) {
      return res
        .status(400)
        .json({ message: "Username must be between 3 and 20 characters" });
    }

    // Check if the password meets length requirements
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      userName,
      password: hashedPassword,
    });

    res.status(201).json({
      data: { id: user._id, userName: user.userName },
      message: "User successfully created",
    });
  } catch (e) {
    console.error("Error during registration:", e);
    res.status(500).json({ message: "Unable to reach server" });
  }
});

// User authentication
router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    // Check if the username and password are provided
    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find the user by username
    const user = await User.findOne({ userName });

    // Check user existence and password match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Incorrect login details" });
    }

    // Store the user ID and username in the session (without the password)
    req.session.user = { id: user._id, userName: user.userName };

    res.status(200).json({ message: "Login successful" });
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).json({ message: "Unable to reach server" });
  }
});

export default router;
