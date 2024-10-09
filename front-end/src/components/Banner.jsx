import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="bg-primary text-white text-center py-3">
      <h1>Create New Client</h1>
      <Link to="/create-client" className="btn btn-light mt-2">
        Go to Create Client
      </Link>
      <br></br>
      <Link to="/login" className="btn btn-light mt-2 ml-2">
        Login
      </Link>
    </div>
  );
};

export default Banner;
