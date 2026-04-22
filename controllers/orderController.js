import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productsModel.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email")
      .populate("productId", "name price size")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("productId", "name price size");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ userId })
      .populate("productId", "name price size")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { userId, productId, quantity, shippingAddress, notes } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        message: "User ID and Product ID are required",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newOrder = new Order({
      userId,
      productId,
      quantity,
      shippingAddress: shippingAddress || {},
      notes: notes || "",
    });

    const savedOrder = await newOrder.save();
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("userId", "name email")
      .populate("productId", "name price size");

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { status, quantity, notes, shippingAddress } = req.body;

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (notes !== undefined) updateData.notes = notes;
    if (shippingAddress !== undefined)
      updateData.shippingAddress = shippingAddress;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("userId", "name email")
      .populate("productId", "name price size");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating order",
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order deleted successfully",
      order: deletedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting order",
      error: error.message,
    });
  }
};
