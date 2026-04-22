import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      max: [100, "Quantity cannot exceed 100"],
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "processing", "shipped", "delivered", "cancelled"],
        message:
          "Status must be: pending, processing, shipped, delivered, or cancelled",
      },
      default: "pending",
    },
    shippingAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true, default: "USA" },
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
