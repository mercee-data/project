import React, { useState } from "react";
import "./Dashboard.css"; // Ensure to create and link the CSS file for styles.

const Dashboard = () => {
  const [unitsPurchased, setUnitsPurchased] = useState("");
  const [appliances, setAppliances] = useState([]);
  const [remainingUnits, setRemainingUnits] = useState(0);

  const [applianceName, setApplianceName] = useState("");
  const [wattage, setWattage] = useState("");
  const [hours, setHours] = useState("");

  // Function to validate and add purchased units
  const handlePurchase = () => {
    if (unitsPurchased <= 0 || isNaN(unitsPurchased)) {
      alert("Please enter a valid number of units.");
      return;
    }
    setRemainingUnits((prev) => prev + parseFloat(unitsPurchased));
    setUnitsPurchased("");
  };

  // Function to validate and add an appliance
  const addAppliance = () => {
    if (!applianceName || wattage <= 0 || hours <= 0 || isNaN(wattage) || isNaN(hours)) {
      alert("Please enter valid appliance details.");
      return;
    }

    const newAppliance = {
      name: applianceName.trim(),
      wattage: parseFloat(wattage),
      hours: parseFloat(hours),
    };

    setAppliances((prev) => [...prev, newAppliance]);
    setApplianceName("");
    setWattage("");
    setHours("");
  };

  // Function to delete an appliance
  const deleteAppliance = (index) => {
    setAppliances((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate total daily consumption in kWh
  const dailyConsumption = appliances.reduce(
    (total, appliance) => total + (appliance.wattage * appliance.hours) / 1000,
    0
  );

  return (
    <div className="container">
      <h1>Volt Watch</h1>

      {/* Purchase Units Section */}
      <div className="section">
        <h2>Add Purchased Units</h2>
        <input
          type="number"
          placeholder="Enter units"
          value={unitsPurchased}
          onChange={(e) => setUnitsPurchased(e.target.value)}
        />
        <button onClick={handlePurchase}>Add Units</button>
      </div>

      {/* Add Appliance Section */}
      <div className="section">
        <h2>Add Appliance</h2>
        <input
          type="text"
          placeholder="Appliance Name"
          value={applianceName}
          onChange={(e) => setApplianceName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Wattage (W)"
          value={wattage}
          onChange={(e) => setWattage(e.target.value)}
        />
        <input
          type="number"
          placeholder="Hours Used/Day"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />
        <button onClick={addAppliance}>Add Appliance</button>
      </div>

      {/* Appliance Table */}
      <div className="section">
        <h2>Appliances</h2>
        <table>
          <thead>
            <tr>
              <th>Appliance</th>
              <th>Wattage (W)</th>
              <th>Hours Used/Day</th>
              <th>Daily Consumption (kWh)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appliances.map((appliance, index) => (
              <tr key={index}>
                <td>{appliance.name}</td>
                <td>{appliance.wattage}</td>
                <td>{appliance.hours}</td>
                <td>
                  {((appliance.wattage * appliance.hours) / 1000).toFixed(2)}
                </td>
                <td>
                  <button onClick={() => deleteAppliance(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Remaining Units Section */}
      <div className="section">
        <h2>Consumption Overview</h2>
        <p>
          <strong>Daily Consumption:</strong> {dailyConsumption.toFixed(2)} kWh
        </p>
        <p>
          <strong>Remaining Units:</strong> {remainingUnits.toFixed(2)} kWh
        </p>
        <p>
          <strong>Estimated Days Left:</strong>{" "}
          {remainingUnits > 0
            ? (remainingUnits / dailyConsumption).toFixed(1)
            : 0}{" "}
          days
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
