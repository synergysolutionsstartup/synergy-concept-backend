import mongoose from "mongoose";

export const dbClient = mongoose;

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("Missing MongoDB connection URI. Set MONGODB_URI or DATABASE_URL.");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully!");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
    });
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:", error?.message ?? error);
    throw error;
  }
}

export async function shutdownDB() {
  try {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected successfully");
  } catch (error: any) {
    console.error("Error disconnecting from MongoDB:", error?.message ?? error);
  }
}

export function parseDbError(error: any) {
  if (!error) {
    return { message: "Database error", statusCode: 500 };
  }

  if (error.code === 11000) {
    return { message: "Unique constraint failed", statusCode: 409 };
  }

  if (error.name === "ValidationError") {
    return { message: error.message || "Validation error", statusCode: 400 };
  }

  if (error.name === "CastError") {
    return { message: "Invalid database value", statusCode: 400 };
  }

  return { message: error.message || "Database error", statusCode: 500 };
}
