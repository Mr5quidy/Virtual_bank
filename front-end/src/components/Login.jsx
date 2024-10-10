import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { BASE_URL } from "../utils/config.js";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  // Accept setUser as a prop
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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
          withCredentials: true,
        }
      );

      setUser({ id: response.data.id, userName: response.data.userName });
      setMessage("Login successful!");
      setUserName("");
      setPassword("");
    } catch (error) {
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
