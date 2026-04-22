// Import Mongoose ODM (Object Document Mapper)
// Mongoose is a library that makes MongoDB easier to use with Node.js
import mongoose from "mongoose";

// Function to establish connection to MongoDB database
export async function connectToDatabase() {
  try {
    // MongoDB connection string - points to our database in the cloud
    // Format: mongodb+srv://username:password@cluster.mongodb.net/database_name
    const uri =
      "mongodb+srv://daniahih:dania123@newtech.vp3j5gh.mongodb.net/ecommerce";

    // mongoose.connect() establishes the connection to MongoDB
    // This connects our Node.js application to the MongoDB database
    await mongoose.connect(uri, {
      // These options help with connection reliability and performance:
      // maxPoolSize: 10, // Maximum number of connections in the pool
      // serverSelectionTimeoutMS: 5000, // How long to try connecting
      // socketTimeoutMS: 45000, // How long to wait for responses
      // bufferMaxEntries: 0 // Disable mongoose buffering
    });

    console.log("Connected to MongoDB with Mongoose!");
    return mongoose.connection; // Return the connection object
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error; // Re-throw error so calling code can handle it
  }
}

// Function to get the current database connection
// This allows other parts of our app to access the database
export function getDatabase() {
  return mongoose.connection.db;
}
