import React, { useEffect, useState } from "react"; // Importing React and hooks
import { useParams, useNavigate } from "react-router-dom"; // Importing hooks for routing
import axios from "axios"; // Importing Axios for HTTP requests

/**
 * DeductBalance Page
 * This page allows the user to deduct a specified amount from a client's balance.
 * It fetches client data based on the client ID from the URL and updates the balance.
 *
 * Usage:
 * <DeductBalance />
 */

const DeductBalance = () => {
  const { id } = useParams(); // Get client ID from the URL
  const [amount, setAmount] = useState(""); // State to hold the amount to be deducted
  const [client, setClient] = useState(null); // State to hold client data
  const [error, setError] = useState(""); // State to hold error messages
  const [successMessage, setSuccessMessage] = useState(""); // State to hold success messages
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
        setError("Error fetching client data. Please try again."); // Set error state
      }
    };

    fetchClientData(); // Call the function to fetch client data
  }, [id]); // Dependency array ensures this runs when `id` changes

  /**
   * handleDeductBalance function
   * This function handles deducting balance from the client's wallet.
   */
  const handleDeductBalance = async () => {
    try {
      // Check if the amount to deduct is greater than the current balance
      if (+amount > client.wallet) {
        setError("Insufficient balance. Please try again."); // Set error message for insufficient balance
        return; // Exit the function if there is an insufficient balance
      }
      await axios.put(
        `http://localhost:3000/api/client/${id}/balance`, // API endpoint to update the client's balance
        {
          wallet: -amount, // Deduct balance (send negative amount)
        },
        {
          withCredentials: true, // Include credentials for session management
        }
      );
      setSuccessMessage("Balance deducted successfully!"); // Set a success message
      setTimeout(() => {
        navigate("/client-list"); // Redirect to the client list after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Error deducting balance:", error); // Log any errors encountered
      setError("Please enter a valid amount to deduct."); // Set error message for invalid amount
    }
  };

  return (
    <div className="d-flex justify-content-center p-1">
      <div className="card p-4">
        <h2 className="text-center">Deduct Balance</h2>
        {error && <p className="text-danger text-center">{error}</p>}{" "}
        {/* Display error message if it exists */}
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
            type="number" // Input for the amount to be deducted
            placeholder="Enter amount" // Placeholder text for input
            value={amount} // Bind the value to the state
            onChange={(e) => setAmount(e.target.value)} // Update state on input change
            className="form-control"
          />
          <button
            className="btn btn-primary" // Button to trigger balance deduction
            type="button"
            onClick={handleDeductBalance} // Call handleDeductBalance on click
          >
            Deduct Balance
          </button>
        </div>
        {successMessage && (
          <p className="text-success text-center">{successMessage}</p> // Display success message
        )}
      </div>
    </div>
  );
};

export default DeductBalance; // Export the DeductBalance component for use in other parts of the application
