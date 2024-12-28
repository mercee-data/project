import React, { useState } from "react";
import "./EnergyTips.css";

function EnergyTips() {
  const tips = [
    "Turn off appliances when not in use.",
    "Use energy-efficient LED bulbs.",
    "Run washing machines and dishwashers with full loads.",
    "Adjust your air conditioner to 24°C or higher.",
    "Switch off chargers when devices are fully charged.",
    "Limit the use of electric water heaters.",
  ];

  // State for user input and savings result
  const [dailyUsage, setDailyUsage] = useState("");
  const [savings, setSavings] = useState(null);

  // Assume an average appliance consumes 100 watts (0.1 kWh per hour)
  const averageConsumptionPerHour = 0.1; // in kWh
  const electricityRate = 70; // cost per kWh in Naira (example)

  const handleCalculateSavings = () => {
    if (dailyUsage <= 0 || isNaN(dailyUsage)) {
      alert("Please enter a valid daily usage in hours.");
      return;
    }

    const dailyConsumption = dailyUsage * averageConsumptionPerHour;
    const dailyCost = dailyConsumption * electricityRate;

    // Calculate monthly savings (assuming reduced usage by half)
    const reducedDailyUsage = dailyUsage / 2;
    const reducedDailyConsumption = reducedDailyUsage * averageConsumptionPerHour;
    const reducedDailyCost = reducedDailyConsumption * electricityRate;

    const monthlySavings = (dailyCost - reducedDailyCost) * 30; // 30 days in a month

    setSavings(monthlySavings.toFixed(2)); // Format to 2 decimal places
  };

  return (
    <div className="energy-tips-container">
      <h2>Energy-Saving Tips</h2>
      <p>Maximize your electricity units by following these simple tips:</p>

      <ul>
        {tips.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>

      <div className="calculator">
        <h3>Usage Savings Calculator</h3>
        <p>See how much you can save by changing your habits:</p>
        <input
          type="number"
          placeholder="Enter daily appliance usage (in hours)"
          value={dailyUsage}
          onChange={(e) => setDailyUsage(e.target.value)}
        />
        <button onClick={handleCalculateSavings}>Calculate Savings</button>

        {savings !== null && (
          <div className="savings-result">
            <p>
              By reducing your daily usage by half, you could save approximately{" "}
              <strong>₦{savings}</strong> per month on electricity!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnergyTips;
