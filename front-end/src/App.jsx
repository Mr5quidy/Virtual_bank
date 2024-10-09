import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Banner from "./components/banner";
import CreateClient from "./components/createClient";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Banner />
      <Routes>
        <Route path="/create-client" element={<CreateClient />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
