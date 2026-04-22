import Product from "../models/productsModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // return all docs
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.id);

    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(foundProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, size, price, inStock } = req.body;

    if (!name || !size || price === undefined) {
      return res.status(400).json({
        message: "Name, size, and price are required",
      });
    }

    const newProduct = new Product({
      name,
      price,
      size,
      inStock: inStock !== undefined ? inStock : true,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, size, inStock } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (size !== undefined) updateData.size = size;
    if (price !== undefined) updateData.price = price;
    if (inStock !== undefined) updateData.inStock = inStock;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};
