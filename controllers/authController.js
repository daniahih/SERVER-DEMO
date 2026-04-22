import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.log("Registration failed");
      return res
        .status(400)
        .json({ message: "pealse provie email , name , password " });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email already exists " });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(201).json({
      message: "user created Succesfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email address already in use",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("❌ Login failed: Missing credentials");
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!user) {
      console.log("❌ Login failed: User not found");
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("❌ Login failed: Invalid password");
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("❌ STEP 3B FAILED: Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};
