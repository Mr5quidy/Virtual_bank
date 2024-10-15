import React, { useState, useEffect } from "react"; // Importing React and hooks
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Importing routing components
import Banner from "./components/Banner"; // Importing the Banner component
import CreateClient from "./components/CreateClient"; // Importing the CreateClient component
import Login from "./components/Login"; // Importing the Login component
import axios from "axios"; // Importing Axios for making HTTP requests
import ClientList from "./components/ClientList"; // Importing the ClientList component
import AddBalance from "./pages/addBalance/AddBalance"; // Importing the AddBalance component
import DeductBalance from "./pages/deductBalance/DeductBalance"; // Importing the DeductBalance component

/**
 * App Component
 * This is the main component of the application, which handles routing and user authentication.
 * It conditionally renders different components based on user authentication status.
 *
 * Usage:
 * <App />
 */

function App() {
  const [user, setUser] = useState(null); // State to hold user information

  /**
   * useEffect Hook
   * This hook checks if a user is authenticated by making an API call.
   * It sets the user state based on the response received.
   */
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/user/check-user", {
        withCredentials: true, // Include credentials in the request
      })
      .then((resp) => {
        setUser(resp.data); // Set user if authenticated
      })
      .catch(() => {
        setUser(null); // Set user to null if no authenticated user found
      });
  }, []); // The effect runs only once when the component mounts

  return (
    <BrowserRouter>
      {user && <Banner user={user} setUser={setUser} />}{" "}
      {/* Conditionally render Banner if user is authenticated */}
      <Routes>
        {/* Define application routes */}
        <Route
          path="/create-client"
          element={user ? <CreateClient /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/client-list" /> : <Login setUser={setUser} />
          } // Redirect to client-list if logged in
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/create-client" : "/login"} />} // Redirect to appropriate route based on user authentication
        />
        <Route
          path="/client-list"
          element={user ? <ClientList /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-balance/:id"
          element={user ? <AddBalance /> : <Navigate to="/login" />}
        />
        <Route
          path="/deduct-balance/:id"
          element={user ? <DeductBalance /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App; // Export the App component for use in index.js
