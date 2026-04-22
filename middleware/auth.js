import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import ac from "../config/abilities.js";

export const autenticateUser = async (req, res, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Authentication failed: No valid authorization header");
      return res.status(401).json({
        success: false,
        message: "Access denied. No valid token provided.",
      });
    }
    const token = authHeader.substring(7);
    if (!token) {
      console.log("❌ Authentication failed: No token in Authorization header");
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing from Authorization header.",
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("✅ Token verification successful for user:", decoded.email);
    } catch (jwtError) {
      console.log("❌ JWT verification failed:", jwtError.message);

      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Access denied. Token has expired.",
          hint: "Please login again to get a new token",
        });
      }

      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Access denied. Invalid token.",
          hint: "Please login again to get a valid token",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Access denied. Token verification failed.",
      });
    }

    // Step 4d: Find user in database to ensure they still exist
    console.log("🔍 Looking up user in database...");
    const user = await User.findById(decoded.userId).select("-password"); // Exclude password from result

    if (!user) {
      console.log("❌ Authentication failed: User not found in database");
      return res.status(401).json({
        success: false,
        message: "Access denied. User account no longer exists.",
        hint: "Please register a new account",
      });
    }

    console.log("✅ STEP 4 COMPLETE: User authenticated successfully");

    // Step 4e: Add user information to request object
    // This makes user data available to the route handler
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Add the raw token data too (useful for some operations)
    req.tokenData = decoded;

    console.log(`👤 User attached to request: ${user.name} (${user.email})`);

    // Step 4f: Continue to the next middleware or route handler
    next();
  } catch (error) {}
};

export const requireAdmin = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: "theres no user",
        });
      }
      // user ==admin  not equal
      if (req.user.role !== role) {
        return res.status(404).json({
          success: false,
          message: "Access Denied ",
        });
      }
      console.log("authrization done");
      next();
    } catch (error) {
      console.log("authrization error", error);
      return res.status(400).json({
        message: "server error ",
      });
    }
  };
};

// ──────────────────────────────────────────────
// accesscontrol-based authorization middleware
// ──────────────────────────────────────────────

/**
 * Check if the current user's role is allowed to perform `action` on `resource`.
 *
 * action  : "createAny", "readAny", "updateAny", "deleteAny",
 *           "createOwn", "readOwn", "updateOwn", "deleteOwn"
 * resource: "Product", "Order", "User"
 *
 * Usage in routes:
 *   router.post("/", autenticateUser, authorize("createAny", "Product"), createProduct);
 *   router.get("/", autenticateUser, authorize("readOwn", "Order"),  getAllOrders);
 */
export const authorize = (action, resource) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Not authenticated" });
      }

      const permission = ac.can(req.user.role)[action](resource);

      if (!permission.granted) {
        console.log(
          `❌ Authorization failed: ${req.user.email} cannot ${action} ${resource}`,
        );
        return res.status(403).json({
          success: false,
          message: `Access Denied. You are not allowed to ${action} ${resource}.`,
        });
      }

      console.log(
        `✅ Authorization passed: ${req.user.email} can ${action} ${resource}`,
      );
      next();
    } catch (error) {
      console.log("❌ Authorization error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Authorization error" });
    }
  };
};
