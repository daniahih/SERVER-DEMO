import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { autenticateUser, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", autenticateUser, authorize("readAny", "User"), getAllUsers); // admin
router.get("/:id", autenticateUser, authorize("readOwn", "User"), getUserById); // owner or admin
router.post("/", autenticateUser, authorize("createAny", "User"), createUser); // admin
router.put("/:id", autenticateUser, authorize("updateOwn", "User"), updateUser); // owner or admin
router.delete(
  "/:id",
  autenticateUser,
  authorize("deleteAny", "User"),
  deleteUser,
); // admin

export default router;
