import mongoose, { Schema } from "mongoose";

// Client modelis
export default mongoose.model(
  "Client",
  new Schema({
    // Vartotojo vardas
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    // Vartotojo pavarde
    secondName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    // Saskaitos numeris
    iban: {
      type: String, // Changed to String since IBAN may contain letters and leading zeros
      unique: true,
      required: true,
      minLength: 20,
      maxLength: 34, // IBANs can be up to 34 characters, so adjusted maxLength
    },
    // Asmens kodas
    idNumber: {
      type: String,
      unique: true,
      required: true,
      minLength: 11,
      maxLength: 11,
    },
    // Asmens paso nuotrauka
    idPhoto: {
      type: String,
      required: true,
    },
    // User reference (the one who created the client)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  })
);
