import React, { useEffect, useState } from "react";
import axios from "axios";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/client/clients",
          {
            withCredentials: true, // Include cookies for session
          }
        );
        setClients(response.data); // Set clients data from the response
      } catch (err) {
        setError("Unable to fetch clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients(); // Fetch clients on component mount
  }, []);

  return (
    <div className="container mt-5">
      <h2>Client List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error if any */}
      {clients.length === 0 ? (
        <p>No clients found.</p> // No clients message
      ) : (
        <div>
          {clients.map((client) => (
            <div key={client._id} style={styles.clientCard}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple styles
const styles = {
  clientCard: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "15px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100px",
    height: "auto",
    display: "block",
    marginTop: "10px",
  },
};

export default ClientList;
