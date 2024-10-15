import React, { useState } from "react"; // Importing React and useState hook
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS for styling
import axios from "axios"; // Importing Axios for HTTP requests
import { BASE_URL } from "../utils/config.js"; // Importing base URL for API requests
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation after login

/**
 * Login Component
 * This component provides a login form for users to authenticate themselves.
 * It captures the username and password, sends a request to log in,
 * and updates the user state upon successful login.
 *
 * Usage:
 * <Login setUser={setUser} />
 */

const Login = ({ setUser }) => {
  // State variables to hold user input values and messages
  const [userName, setUserName] = useState(""); // State for the username input
  const [password, setPassword] = useState(""); // State for the password input
  const [message, setMessage] = useState(""); // State for messages to display to the user
  const navigate = useNavigate(); // Hook to programmatically navigate after login

  /**
   * handleSubmit function
   * This asynchronous function handles form submission.
   * It sends a POST request with the username and password to log the user in.
   * @param {Event} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/login`, // API endpoint for user login
        {
          userName, // Sending the username
          password, // Sending the password
        },
        {
          withCredentials: true, // Include cookies for session management
        }
      );

      // Set the user state with the response data
      setUser({ id: response.data.id, userName: response.data.userName });
      setMessage("Login successful!"); // Set success message
      setUserName(""); // Clear username input after successful login
      setPassword(""); // Clear password input after successful login

      // Optionally, navigate to a different page after login (uncomment the next line if needed)
      // navigate('/dashboard'); // Navigate to the dashboard or home page after successful login
    } catch (error) {
      // Handle errors from the login request
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`); // Set error message from server response
      } else {
        setMessage("Unable to reach server"); // Set generic error message
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {" "}
        {/* Form to capture login details */}
        <div className="form-group mb-3">
          <label>Username</label>
          <input
            type="text" // Input for username
            className="form-control"
            value={userName} // Bind value to state
            onChange={(e) => setUserName(e.target.value)} // Update state on input change
            required // Make field required
            placeholder="Enter your username" // Placeholder text
          />
        </div>
        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password" // Input for password
            className="form-control"
            value={password} // Bind value to state
            onChange={(e) => setPassword(e.target.value)} // Update state on input change
            required // Make field required
            placeholder="Enter your password" // Placeholder text
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {" "}
          {/* Submit button for the form */}
          Login
        </button>
      </form>
      {message && <div className="alert alert-info mt-4">{message}</div>}{" "}
      {/* Display any messages */}
    </div>
  );
};

export default Login; // Export the Login component for use in other parts of the application
