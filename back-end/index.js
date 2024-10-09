import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import user from "./controllers/user.js";
import client from "./controllers/client.js";

const config = dotenv.config().parsed;

const startServer = async () => {
  // Bandome prisijungti prie duomenų bazės
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("Connected to the database!");
  } catch (error) {
    console.error("Prisijungimas nepavyko:", error);
  }

  // Express aplikacijos iniciavimas
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    })
  );

  // x-www-formurlencoded duomenu priėmimo registravimas
  app.use(express.urlencoded({ extended: true }));

  // json duomenu priemimo registravimas
  app.use(express.json());

  // CORS configuration
  app.use(
    cors({
      origin: config.DEV_CLIENT_URL, // Allow your frontend origin
      credentials: true, // Allow credentials to be sent
    })
  );

  // Failų direktorijos priėjimo priskyrimas
  app.use("/photos", express.static("./uploads"));

  // Controllerio priskyrimas prie express'o
  app.use("/api/user", user);
  app.use("/api/client", client);

  // Serverio paleidimas
  app.listen(config.DEV_PORT, () => {
    console.log(`Server running on port ${config.DEV_PORT}`);
  });
};

// Paleisti serverį
startServer();
