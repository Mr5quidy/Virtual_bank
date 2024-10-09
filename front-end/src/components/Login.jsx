import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { BASE_URL } from "../utils/config.js";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/api/user/login`,
        {
          userName,
          password,
        },
        {
          withCredentials: true, // Include cookies for session
        }
      );

      setMessage("Login successful!");
      // Optionally, redirect to another page or reset the form
      setUserName("");
      setPassword("");
    } catch (error) {
      // Check if there's a response from the server
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage("Unable to reach server");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>

      {message && <div className="alert alert-info mt-4">{message}</div>}
    </div>
  );
};

export default Login;
