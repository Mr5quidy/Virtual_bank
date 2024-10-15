import mongoose, { Schema } from "mongoose";

// Client modelis
export default mongoose.model(
  "Client",
  new Schema({
    // Client Name
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    // Client Last Name
    secondName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    // Client IBAN
    iban: {
      type: String, // Changed to String since IBAN may contain letters and leading zeros
      unique: true,
      required: true,
      minLength: 20,
      maxLength: 34, // IBANs can be up to 34 characters, so adjusted maxLength
    },
    // Client ID
    idNumber: {
      type: String,
      unique: true,
      required: true,
      minLength: 11,
      maxLength: 11,
    },
    // Client ID Photo
    idPhoto: {
      type: String,
      required: true,
    },
    wallet: {
      type: Number,
      default: 0,
      min: 0,
    },
    // User reference (the one who created the client)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  })
);
