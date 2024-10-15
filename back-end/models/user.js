import mongoose, { Schema } from "mongoose";

// User model
export default mongoose.model(
  "User",
  new Schema({
    // Login
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    // Password
    password: {
      type: String,
      required: true,
    },
  })
);
