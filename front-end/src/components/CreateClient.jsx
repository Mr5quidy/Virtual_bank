import React, { useState } from "react"; // Importing React and useState hook
import axios from "axios"; // Importing Axios for HTTP requests
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS for styling
import { BASE_URL } from "../utils/config.js"; // Importing base URL for API requests

/**
 * CreateClient Component
 * This component provides a form for creating a new client.
 * It captures client details, uploads an ID photo, and generates a unique Lithuanian IBAN.
 *
 * Usage:
 * <CreateClient />
 */

const CreateClient = () => {
  // State variables to hold form input values and messages
  const [firstName, setFirstName] = useState(""); // State for the first name
  const [secondName, setSecondName] = useState(""); // State for the second name
  const [iban, setIban] = useState(""); // State for the IBAN, generated automatically
  const [idNumber, setIdNumber] = useState(""); // State for the ID number
  const [idPhoto, setIdPhoto] = useState(null); // State for the uploaded ID photo
  const [message, setMessage] = useState(""); // State for messages to display to the user

  /**
   * handleFileChange function
   * This function handles file input changes and updates the idPhoto state.
   * @param {Event} e - The event object from the file input.
   */
  const handleFileChange = (e) => {
    setIdPhoto(e.target.files[0]); // Set the selected file as the ID photo
  };

  /**
   * handleSubmit function
   * This asynchronous function handles form submission.
   * It constructs FormData and sends a POST request to create a new client.
   * @param {Event} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(); // Create a new FormData object
    formData.append("firstName", firstName); // Append first name
    formData.append("secondName", secondName); // Append second name
    formData.append("iban", iban); // Append IBAN
    formData.append("idNumber", idNumber); // Append ID number
    formData.append("idPhoto", idPhoto); // Append ID photo

    try {
      const response = await axios.post(
        BASE_URL + "/api/client/create-client/", // API endpoint for creating a client
        formData,
        {
          withCredentials: true, // Include cookies for session management
        }
      );

      if (response.status === 201) {
        // Check if the creation was successful
        setMessage("Client created successfully!"); // Set success message
        // Reset form fields after successful submission
        setFirstName("");
        setSecondName("");
        setIban(generateLithuanianIBAN()); // Generate a new IBAN
        setIdNumber("");
        setIdPhoto(null);
      } else {
        setMessage(`Error: ${response.data.message}`); // Handle server-side error
      }
    } catch (error) {
      setMessage(
        `Unable to reach server: ${
          error.response ? error.response.data.message : error.message
        }`
      ); // Display error message if request fails
    }
  };

  /**
   * generateLithuanianIBAN function
   * This function generates a random Lithuanian IBAN.
   * @returns {string} - A randomly generated Lithuanian IBAN.
   */
  const generateLithuanianIBAN = () => {
    const countryCode = "LT"; // Lithuanian country code

    // Generate a random 4-digit bank code
    const bankCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits

    // Generate a random 16-digit account number
    const accountNumber = Math.floor(
      1000000000000000 + Math.random() * 9000000000000000
    ).toString(); // 16 digits

    // Combine to form the IBAN without check digits
    const initialIBAN = `${countryCode}00${bankCode}${accountNumber}`;

    // Calculate check digits
    const checkDigits = calculateCheckDigits(initialIBAN); // Calculate check digits

    // Return the full IBAN
    return `${countryCode}${checkDigits}${bankCode}${accountNumber}`;
  };

  /**
   * calculateCheckDigits function
   * This function calculates the check digits for a given IBAN.
   * @param {string} iban - The initial IBAN without check digits.
   * @returns {string} - The calculated check digits.
   */
  const calculateCheckDigits = (iban) => {
    // Rearrange the IBAN for calculation
    const rearrangedIBAN = iban.slice(4) + iban.slice(0, 4);

    const numericIBAN = rearrangedIBAN
      .split("") // Split the IBAN into characters
      .map((char) =>
        isNaN(char) ? (char.charCodeAt(0) - 55).toString() : char
      ) // Convert letters to numbers
      .join(""); // Join the characters back into a string

    // Use BigInt for modulus operation
    const mod97 = BigInt(numericIBAN) % BigInt(97);

    // Calculate check digits
    const checkDigits = (98n - mod97) % 100n; // Calculate check digits
    return checkDigits.toString().padStart(2, "0"); // Ensure 2 digits
  };

  // Generate the IBAN when the component mounts
  React.useEffect(() => {
    setIban(generateLithuanianIBAN()); // Generate IBAN
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group mb-3">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} // Update first name state on change
            required
            minLength="3" // Minimum length requirement
            maxLength="20" // Maximum length requirement
            placeholder="Enter first name"
          />
        </div>

        <div className="form-group mb-3">
          <label>Second Name</label>
          <input
            type="text"
            className="form-control"
            value={secondName}
            onChange={(e) => setSecondName(e.target.value)} // Update second name state on change
            required
            minLength="3" // Minimum length requirement
            maxLength="20" // Maximum length requirement
            placeholder="Enter second name"
          />
        </div>

        <div className="form-group mb-3">
          <label>IBAN</label>
          <input
            type="text"
            className="form-control"
            value={iban} // Display the generated IBAN
            readOnly // Make it read-only since it's auto-generated
          />
        </div>

        <div className="form-group mb-3">
          <label>ID Number</label>
          <input
            type="text"
            className="form-control"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)} // Update ID number state on change
            required
            minLength="11" // Minimum length requirement
            maxLength="11" // Maximum length requirement
            placeholder="Enter ID Number"
          />
        </div>

        <div className="form-group mb-4">
          <label>ID Photo</label>
          <input
            type="file"
            className="form-control-file"
            accept="image/*" // Accept only image files
            onChange={handleFileChange} // Handle file changes
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

export default CreateClient; // Export the CreateClient component for use in other parts of the application
