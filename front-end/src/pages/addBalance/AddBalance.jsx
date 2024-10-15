import React, { useEffect, useState } from "react"; // Importing React and hooks
import { useParams, useNavigate } from "react-router-dom"; // Importing hooks for routing
import axios from "axios"; // Importing Axios for HTTP requests

/**
 * AddBalance Page
 * This page allows the user to add a specified amount to a client's balance.
 * It fetches client data based on the client ID from the URL and updates the balance.
 *
 * Usage:
 * <AddBalance />
 */

const AddBalance = () => {
  // State variables
  const [amount, setAmount] = useState(""); // State to hold the amount to be added
  const [client, setClient] = useState(null); // State to hold client data
  const [successMessage, setSuccessMessage] = useState(""); // State to hold success messages
  const { id } = useParams(); // Fetch client ID from the URL parameters
  const navigate = useNavigate(); // Hook for programmatic navigation

  /**
   * useEffect Hook
   * This hook fetches client data when the component mounts or when the ID changes.
   */
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/client/${id}`, // API endpoint to fetch client data
          {
            withCredentials: true, // Include credentials for session management
          }
        );
        setClient(response.data); // Set the retrieved client data
      } catch (error) {
        console.error(
          "Error fetching client data:",
          error.response?.data || error.message // Log any errors encountered
        );
      }
    };

    fetchClientData(); // Call the function to fetch client data
  }, [id]); // Dependency array ensures this runs when `id` changes

  /**
   * handleAddBalance function
   * This function handles adding balance to the client's wallet.
   */
  const handleAddBalance = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/client/${id}/balance`, // API endpoint to update the client's balance
        {
          wallet: +amount, // Convert the amount to a number and send it in the request
        },
        {
          withCredentials: true, // Include credentials for session management
        }
      );
      setSuccessMessage("Balance added successfully!"); // Set a success message
      setTimeout(() => {
        navigate("/client-list"); // Redirect to the client list after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Error adding balance:", error); // Log any errors encountered
    }
  };

  return (
    <div className="d-flex justify-content-center p-1">
      <div className="card p-4">
        <h2 className="text-center">Add Balance</h2>
        {client ? ( // Conditional rendering based on whether client data is available
          <div>
            <p>
              <strong>First Name:</strong> {client.firstName}{" "}
              {/* Display first name */}
            </p>
            <p>
              <strong>Second Name:</strong> {client.secondName}{" "}
              {/* Display second name */}
            </p>
            <p>
              <strong>Current Balance:</strong> {client.wallet} €{" "}
              {/* Display current balance */}
            </p>
          </div>
        ) : (
          <p>No client data available.</p> // Message if client data is not available
        )}
        <div className="input-group mb-3">
          <input
            type="number" // Input for the amount to be added
            value={amount} // Bind the value to the state
            onChange={(e) => setAmount(e.target.value)} // Update state on input change
            className="form-control"
            placeholder="Enter amount" // Placeholder text for input
          />
          <button
            className="btn btn-primary" // Button to trigger balance addition
            type="button"
            onClick={handleAddBalance} // Call handleAddBalance on click
          >
            Add Balance
          </button>
        </div>
        {successMessage && (
          <p className="text-success text-center">{successMessage}</p> // Display success message
        )}
      </div>
    </div>
  );
};

export default AddBalance; // Export the AddBalance component for use in other parts of the application
