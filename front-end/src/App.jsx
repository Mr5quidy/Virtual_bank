import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Banner from "./components/Banner";
import CreateClient from "./components/CreateClient";
import Login from "./components/Login";
import axios from "axios";
import ClientList from "./components/ClientList";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/user/check-user", {
        withCredentials: true,
      })
      .then((resp) => {
        setUser(resp.data); // Set user if authenticated
      })
      .catch(() => {
        setUser(null); // No user found
      });
  }, []);

  return (
    <BrowserRouter>
      {user && <Banner user={user} setUser={setUser} />}{" "}
      {/* Pass setUser to Banner */}
      <Routes>
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
          element={<Navigate to={user ? "/create-client" : "/login"} />}
        />
        <Route
          path="/client-list"
          element={user ? <ClientList /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
