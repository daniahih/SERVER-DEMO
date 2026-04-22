import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name must be no more than 50 characters"],
    minlength: [2, "Name must be at least 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  try {
    const saltRound = 12;
    this.password = await bcrypt.hash(this.password, saltRound);
    console.log("Password hashed successfully");
  } catch (error) {
    console.error("❌ Password hashing error:", error);
    throw error;
  }
});

const User = mongoose.model("User", userSchema);
export default User;
