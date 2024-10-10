import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Banner = ({ user, setUser }) => {
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/logout",
        null,
        {
          withCredentials: true,
        }
      );
      alert(response.data.message);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="bg-primary text-white text-center py-3">
      <Link to="/create-client" className="btn btn-light mt-2">
        Go to Create Client
      </Link>
      <br />
      <Link to="/client-list" className="btn btn-light mt-2">
        Go to Client List
      </Link>
      <br />
      <button onClick={handleLogout} className="btn btn-light mt-2 ml-2">
        Logout
      </button>
    </div>
  );
};

export default Banner;
