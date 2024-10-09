import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { BASE_URL } from "../utils/config.js";

const CreateClient = () => {
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [iban, setIban] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idPhoto, setIdPhoto] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setIdPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("secondName", secondName);
    formData.append("iban", iban);
    formData.append("idNumber", idNumber);
    formData.append("idPhoto", idPhoto);

    try {
      const response = await axios.post(
        BASE_URL + "/api/client/create-client/",
        formData,
        {
          withCredentials: true, // Include cookies for session
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // },
        }
      );

      if (response.status === 201) {
        setMessage("Client created successfully!");
        // Reset form after successful submission
        setFirstName("");
        setSecondName("");
        setIban("");
        setIdNumber("");
        setIdPhoto(null);
      } else {
        setMessage(`Error: ${response.data.message}`);
      }
    } catch (error) {
      setMessage(
        `Unable to reach server: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group mb-3">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            minLength="3"
            maxLength="20"
            placeholder="Enter first name"
          />
        </div>

        <div className="form-group mb-3">
          <label>Second Name</label>
          <input
            type="text"
            className="form-control"
            value={secondName}
            onChange={(e) => setSecondName(e.target.value)}
            required
            minLength="3"
            maxLength="20"
            placeholder="Enter second name"
          />
        </div>

        <div className="form-group mb-3">
          <label>IBAN</label>
          <input
            type="text"
            className="form-control"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            required
            minLength="20"
            maxLength="34"
            placeholder="Enter IBAN"
          />
        </div>

        <div className="form-group mb-3">
          <label>ID Number</label>
          <input
            type="text"
            className="form-control"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            required
            minLength="11"
            maxLength="11"
            placeholder="Enter ID Number"
          />
        </div>

        <div className="form-group mb-4">
          <label>ID Photo</label>
          <input
            type="file"
            className="form-control-file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Submit
        </button>
      </form>

      {message && <div className="alert alert-info mt-4">{message}</div>}
    </div>
  );
};

export default CreateClient;
