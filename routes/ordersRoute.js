import express from "express";
import {
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

import { autenticateUser, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", autenticateUser, authorize("readAny", "Order"), getAllOrders); // admin
router.get(
  "/:id",
  autenticateUser,
  authorize("readOwn", "Order"),
  getOrderById,
); // owner or admin
router.get(
  "/user/:userId",
  autenticateUser,
  authorize("readAny", "Order"),
  getOrdersByUser,
); // admin
router.post("/", autenticateUser, authorize("createOwn", "Order"), createOrder); // any authenticated user
router.put(
  "/:id",
  autenticateUser,
  authorize("updateOwn", "Order"),
  updateOrder,
); // owner or admin
router.delete(
  "/:id",
  autenticateUser,
  authorize("deleteAny", "Order"),
  deleteOrder,
); // admin only

export default router;
