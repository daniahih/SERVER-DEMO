import express from "express";
const router = express.Router();
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { autenticateUser, authorize } from "../middleware/auth.js";

router.get("/", getAllProducts); // public
router.get("/:id", getProductById); // public
router.post(
  "/",
  autenticateUser,
  authorize("createAny", "Product"),
  createProduct,
); // admin
router.put(
  "/:id",
  autenticateUser,
  authorize("updateAny", "Product"),
  updateProduct,
); // admin
router.delete(
  "/:id",
  autenticateUser,
  authorize("deleteAny", "Product"),
  deleteProduct,
); // admin

export default router;
