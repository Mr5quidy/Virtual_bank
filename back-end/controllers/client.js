import { Router } from "express";
import Client from "../models/client.js";
import { upload } from "../middleware/upload.js";
import { checkAuth } from "../middleware/auth.js";

const router = Router();

// New client creation
router.post(
  "/create-client",
  checkAuth, // Ensure that this middleware checks if the user is logged in
  upload.single("idPhoto"),
  async (req, res) => {
    try {
      // Check if user session exists
      if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Ensure all required fields are provided
      const { firstName, secondName, iban, idNumber } = req.body;

      if (!firstName || !secondName || !iban || !idNumber || !req.file) {
        return res.status(400).json({
          message:
            "All fields (firstName, secondName, iban, idNumber, idPhoto) are required",
        });
      }

      // Create new client object with the user ID from the session
      const newClient = new Client({
        firstName,
        secondName,
        iban,
        idNumber,
        idPhoto: req.file.filename, // Ensure your upload middleware is configured properly
        user: req.session.user.id, // Use the ID from the session
      });

      // Validate and save the client
      const savedClient = await newClient.save();

      res.status(201).json({
        data: savedClient,
        message: "Client successfully uploaded",
      });
    } catch (error) {
      console.error("Error creating client:", error);
      res
        .status(500)
        .json({ message: "Unable to reach server", error: error.message });
    }
  }
);

export default router;
