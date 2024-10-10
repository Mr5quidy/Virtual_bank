import { Router } from "express";
import Client from "../models/client.js";
import { upload } from "../middleware/upload.js";
import { checkAuth } from "../middleware/auth.js";

const router = Router();

// Multer upload error handler
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer-specific error occurred
    return res
      .status(400)
      .json({ message: `File upload error: ${err.message}` });
  } else if (err) {
    // Any other unknown error occurred
    return res
      .status(500)
      .json({ message: "An unknown error occurred during file upload" });
  }
  next();
};
router.get("/clients", checkAuth, async (req, res) => {
  try {
    const clients = await Client.find({ user: req.session.user.id }); // Fetch clients for the logged-in user
    res.status(200).json(clients); // Return the list of clients
  } catch (error) {
    console.error("Error fetching clients:", error);
    res
      .status(500)
      .json({ message: "Unable to reach server", error: error.message });
  }
});

// New client creation route
router.post(
  "/create-client",
  checkAuth, // Ensure user is authenticated
  upload.single("idPhoto"), // Handle file upload
  uploadErrorHandler, // Handle multer errors
  async (req, res) => {
    try {
      // Ensure all required fields are present
      const { firstName, secondName, iban, idNumber } = req.body;

      if (!firstName || !secondName || !iban || !idNumber || !req.file) {
        return res.status(400).json({
          message:
            "All fields (firstName, secondName, iban, idNumber, idPhoto) are required",
        });
      }

      // Create new client object
      const newClient = new Client({
        firstName,
        secondName,
        iban,
        idNumber,
        idPhoto: req.file.filename, // File uploaded by multer
        user: req.session.user.id, // User ID from the session
      });

      // Save the new client in the database
      const savedClient = await newClient.save();

      // Send success response
      res.status(201).json({
        data: savedClient,
        message: "Client successfully created",
      });
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({
        message: "Unable to reach server",
        error: error.message,
      });
    }
  }
);

export default router;
