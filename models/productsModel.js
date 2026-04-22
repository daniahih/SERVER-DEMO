// schema -- shape , type , rules , structure
import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [100, "Name must be no more than 100 characters"],
    minlength: [2, "Name must be at least 2 characters"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    max: [99999999, "Price must be no more than 99,999,999"],
    min: [0, "Price must be positive"],
  },
  size: {
    type: String,
    required: [true, "Size is required"],
    enum: {
      values: ["S", "M", "L", "XL"],
      message: "Size should be S, M, L, or XL",
    },
    uppercase: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productsSchema);
export default Product;
