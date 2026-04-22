import User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    const savedUser = await newUser.save();

    // Don't return the password in the response
    const { password: _, ...userResponse } = savedUser.toObject();
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (password !== undefined) updateData.password = password;
    if (role !== undefined) updateData.role = role;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't return the password in the response
    const { password: _, ...userResponse } = updatedUser.toObject();

    res.json({
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};
