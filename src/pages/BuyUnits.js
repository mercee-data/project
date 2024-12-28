import React, { useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./BuyUnits.css";

// Make sure to use your own Stripe public key
const stripePromise = loadStripe("your-publishable-key-from-stripe");

function BuyUnits() {
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cardElement = elements.getElement(CardElement);

    if (!stripe || !elements || !cardElement) {
      return;
    }

    setIsLoading(true); // Set loading state to true when the process starts

    try {
      // Step 1: Create a payment method with Stripe
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setResponseMessage(error.message);
        setIsLoading(false); // Set loading state to false on error
        return;
      }

      // Step 2: Send the payment method to the backend
      const purchaseData = { units: amount, paymentMethodId: paymentMethod.id, meterNumber };

      // Call your backend to create a Payment Intent and confirm it
      const response = await fetch("http://localhost:5000/api/buy-units", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data.success || "Units purchased successfully!");
      } else {
        setResponseMessage(data.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred while processing your request.");
    } finally {
      setIsLoading(false); // Set loading state to false after completion
    }
  };

  return (
    <div className="buy-units-container">
      <h2>Buy Electricity Units</h2>
      <p>Enter your details below to purchase electricity units.</p>

      <form className="buy-units-form" onSubmit={handleSubmit}>
        <label>
          Meter Number:
          <input
            type="text"
            placeholder="Enter meter number"
            value={meterNumber}
            onChange={(e) => setMeterNumber(e.target.value)}
            required
          />
        </label>

        <label>
          Amount (₦):
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>

        {/* Add Stripe's Card Element for handling card details */}
        <CardElement />

        <button type="submit" disabled={!stripe || isLoading}>
          {isLoading ? "Processing..." : "Buy Units"}
        </button>
      </form>

      {isLoading && (
        <div className="loading-spinner">
          {/* You can replace this with an actual spinner component */}
          <div className="spinner"></div>
        </div>
      )}

      {responseMessage && (
        <div className="response-message">
          <p>{responseMessage}</p>
        </div>
      )}
    </div>
  );
}

function StripeContainer() {
  return (
    <Elements stripe={stripePromise}>
      <BuyUnits />
    </Elements>
  );
}

export default StripeContainer;
