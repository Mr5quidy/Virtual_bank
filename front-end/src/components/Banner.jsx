import React from "react"; // Importing React library
import { Link } from "react-router-dom"; // Importing Link for navigation between routes
import axios from "axios"; // Importing Axios for making HTTP requests

/**
 * Banner Component
 * This component serves as a navigation banner for the application.
 * It includes links to create a client, view the client list, and log out.
 *
 * Props:
 * - user (Object): The current user's information (used for conditional rendering if needed).
 * - setUser (Function): A function to update the user state, typically to null on logout.
 *
 * Usage:
 * <Banner user={user} setUser={setUser} />
 */

const Banner = ({ user, setUser }) => {
  /**
   * handleLogout function
   * This asynchronous function handles the logout process by sending a POST request
   * to the server endpoint for logging out. It also updates the user state to null
   * upon successful logout or shows an error alert in case of failure.
   */
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/logout", // URL for the logout endpoint
        null, // No body required for logout
        {
          withCredentials: true, // Include credentials (cookies) with the request
        }
      );
      alert(response.data.message); // Display logout success message
      setUser(null); // Update user state to null
    } catch (error) {
      console.error("Logout error:", error); // Log error to console for debugging
      alert("Failed to log out. Please try again."); // Show error alert
    }
  };

  return (
    <div className="bg-primary text-white text-center py-3 d-flex justify-content-center gap-1 p-1">
      {/* Container for the banner with Bootstrap styling */}
      <Link to="/create-client" className="btn btn-light">
        Create Client
      </Link>
      <br />
      <Link to="/client-list" className="btn btn-light">
        Client List
      </Link>
      <br />
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
};

export default Banner; // Exporting the Banner component for use in other parts of the application
