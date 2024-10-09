import mongoose, { Schema } from "mongoose";

// Users modelis
export default mongoose.model(
  "User",
  new Schema({
    // Prisijungimo vardas
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    // Prisijungimo slaptazodis
    password: {
      type: String,
      required: true,
    },
  })
);
