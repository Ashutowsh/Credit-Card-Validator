import React, { useState, useRef } from "react";
import axios from "axios";

const CreditCardValidator = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const [showNumber, setShowNumber] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setCardNumber(e.target.value);
  };

  const handleClickShowNumber = () => {
    const cursorPosition = inputRef.current.selectionStart;
    setShowNumber((prevShowNumber) => !prevShowNumber);
    setTimeout(() => {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      inputRef.current.focus();
    }, 0);
  };

  const handleMouseDownNumber = (event) => event.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/validate", {
        number: cardNumber,
      });

      if (response.data.success === "true") {
        setMessage(response.data.message);
        setSuccess(true);
      } else {
        setMessage(response.data.message);
        setSuccess(false);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else if (error.request) {
        setMessage("No response from server. Please try again.");
      } else {
        setMessage("An error occurred. Please try again.");
      }
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Credit Card Validator
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-300"
            >
              Credit Card Number
            </label>
            <div className="mt-1 relative">
              <input
                id="cardNumber"
                name="cardNumber"
                type={showNumber ? "text" : "password"}
                autoComplete="cc-number"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-900 text-white"
                value={cardNumber}
                onChange={handleChange}
                ref={inputRef}
              />
              <button
                type="button"
                onClick={handleClickShowNumber}
                onMouseDown={handleMouseDownNumber}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              >
                {showNumber ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Validate
            </button>
          </div>
        </form>
        {message && (
          <div
            className={`mt-6 ${
              success ? "bg-green-500" : "bg-red-500"
            } text-white p-4 rounded-md`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditCardValidator;
