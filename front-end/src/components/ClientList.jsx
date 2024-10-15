import React, { useEffect, useState } from "react"; // Importing React and necessary hooks
import { useNavigate } from "react-router-dom"; // Importing useNavigate for client-side navigation
import axios from "axios"; // Importing Axios for making HTTP requests

/**
 * ClientList Component
 * This component fetches and displays a list of clients.
 * It allows the user to add or deduct balance for each client and delete clients if their wallet balance is zero.
 *
 * Usage:
 * <ClientList />
 */

const ClientList = () => {
  const [clients, setClients] = useState([]); // State to hold the list of clients
  const [error, setError] = useState(""); // State to hold error messages
  const navigate = useNavigate(); // Hook for navigation

  /**
   * useEffect Hook
   * This hook is used to fetch the clients' data from the server when the component mounts.
   */
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/client/clients", // API endpoint to fetch clients
          {
            withCredentials: true, // Include credentials (cookies) in the request
          }
        );

        // Optionally sort clients by second name
        const sortedClients = response.data.sort(
          (a, b) => a.secondName.localeCompare(b.secondName) // Sort by second name
        );

        setClients(sortedClients); // Update state with sorted clients
      } catch (err) {
        setError("Unable to fetch clients"); // Set error message on failure
      }
    };

    fetchClients(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  /**
   * deleteClient function
   * This asynchronous function handles the deletion of a client by sending a DELETE request to the server.
   * @param {string} clientId - The ID of the client to delete.
   */
  const deleteClient = async (clientId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/client/${clientId}`, // API endpoint for deleting a client
        { withCredentials: true } // Include credentials (cookies) in the request
      );
      alert(response.data.message); // Show success message after deletion

      // Refresh the client list after successful deletion
      setClients(clients.filter((client) => client._id !== clientId)); // Update state to remove deleted client
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to delete client. Try again." // Display error message
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>Client List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message if exists */}
      {clients.length === 0 ? ( // Check if there are clients to display
        <p>No clients found.</p> // Display message if no clients
      ) : (
        <div>
          {clients.map(
            (
              client // Map through the clients array to display each client
            ) => (
              <div key={client._id} style={styles.clientCard}>
                {" "}
                {/* Unique key for each client card */}
                <p>
                  <strong>First Name:</strong> {client.firstName}
                </p>
                <p>
                  <strong>Last Name:</strong> {client.secondName}
                </p>
                <p>
                  <strong>IBAN:</strong> {client.iban}
                </p>
                <p>
                  <strong>ID Number:</strong> {client.idNumber}
                </p>
                <p>
                  <strong>Total Balance:</strong> {client.wallet} €
                </p>
                <div className="d-flex gap-3 justify-content-flex-end">
                  {/* Navigate to AddBalance or DeductBalance based on button clicked */}
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/add-balance/${client._id}`)} // Navigate to Add Balance page
                  >
                    Add Balance
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/deduct-balance/${client._id}`)} // Navigate to Deduct Balance page
                  >
                    Deduct Balance
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteClient(client._id)} // Delete client on button click
                    disabled={client.wallet !== 0} // Disable button if wallet balance is not 0
                  >
                    Delete Client
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

/**
 * styles object
 * This object contains styles for the client card.
 */
const styles = {
  clientCard: {
    border: "1px solid #ccc", // Border style
    borderRadius: "5px", // Rounded corners
    padding: "15px", // Padding inside card
    marginBottom: "10px", // Space below each card
    backgroundColor: "#f9f9f9", // Light background color
  },
};

export default ClientList; // Exporting the ClientList component for use in other parts of the application
