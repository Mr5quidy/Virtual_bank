// Import necessary modules
import { Router } from "express";
import multer from "multer"; // Import multer for file handling
import Client from "../models/client.js";
import { upload } from "../middleware/upload.js";
import { checkAuth } from "../middleware/auth.js"; // Assuming you have this middleware

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

// Route to fetch clients for the authenticated user, sorted by last name (secondName)
router.get("/clients", checkAuth, async (req, res) => {
  try {
    const clients = await Client.find({ user: req.session.user.id }).sort({
      secondName: 1,
    }); // Sort by last name (secondName) in ascending order (1 for ascending, -1 for descending)

    res.status(200).json(clients); // Return the list of sorted clients
  } catch (error) {
    console.error("Error fetching clients:", error);
    res
      .status(500)
      .json({ message: "Unable to reach server", error: error.message });
  }
});
router.delete("/:id", checkAuth, async (req, res) => {
  const { id } = req.params; // Get the client ID from the request parameters

  try {
    const client = await Client.findById(id); // Fetch the client by ID

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Ensure the client can only be deleted if the wallet balance is 0
    if (client.wallet !== 0) {
      return res.status(400).json({
        message: "Client cannot be deleted unless the balance is 0",
      });
    }

    // If the balance is 0, delete the client
    await Client.findByIdAndDelete(id);

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ message: "Error deleting client" });
  }
});

router.get("/:id", checkAuth, async (req, res) => {
  const { id } = req.params; // Extract client ID from parameters
  try {
    const client = await Client.findById(id); // Fetch client by ID
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json(client); // Return client data
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ message: "Error fetching client data" });
  }
});

router.put("/:id/balance", async (req, res) => {
  const { id } = req.params;
  console.log(`Received request to update balance for client ID: ${id}`); // Log ID

  const { wallet } = req.body;

  try {
    const client = await Client.findById(id); // Find the client
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    client.wallet += wallet; // Update the wallet
    await client.save(); // Save changes
    res.status(200).json(client); // Send back updated client data
  } catch (error) {
    console.error("Error in updating balance:", error); // Log errors
    res.status(500).json({ message: "Error updating balance" });
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
