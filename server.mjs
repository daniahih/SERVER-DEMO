// import express
import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/database.js";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
import productRoutes from "./routes/productsRoute.js";
import userRoutes from "./routes/usersRoute.js";
import orderRoutes from "./routes/ordersRoute.js";
import logger from "./middleware/logger.js";
// middle // convert json format
import authRoutes from "./routes/authRoutes.js";
import { autenticateUser } from "./middleware/auth.js";
app.use(express.json());
app.use(logger); //morgan
app.use("/auth", authRoutes);
app.use("/products", autenticateUser, productRoutes);
app.use("/users", autenticateUser, userRoutes);
app.use("/orders", autenticateUser, orderRoutes);

// build path for /products  json()
// middleware

// where to call it ,,
// listening to the port

try {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`server connecting to ${PORT}`);
  });
} catch (error) {
  console.error("failed to connect to db ", error);
  process.exit(1);
}
