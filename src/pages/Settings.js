import React, { useState } from 'react';

const Settings = () => {
  const [electricityRate, setElectricityRate] = useState(0.15); // Default rate in USD/kWh
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  const handleSaveSettings = () => {
    // You can later add functionality to persist these settings (e.g., using local storage or API)
    alert(`Settings saved! Rate: $${electricityRate}/kWh, Notifications: ${notificationEnabled ? 'Enabled' : 'Disabled'}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Settings</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Electricity Rate ($/kWh):
          <input
            type="number"
            value={electricityRate}
            onChange={(e) => setElectricityRate(parseFloat(e.target.value))}
            step="0.01"
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Enable Notifications:
          <input
            type="checkbox"
            checked={notificationEnabled}
            onChange={(e) => setNotificationEnabled(e.target.checked)}
          />
        </label>
      </div>

      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

export default Settings;
