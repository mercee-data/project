import React from "react";

const History = () => {
  // Mock data for the table
  const mockData = [
    { date: "2024-11-01", unitsPurchased: 20, dailyConsumption: 5, remainingUnits: 15 },
    { date: "2024-11-02", unitsPurchased: 10, dailyConsumption: 6, remainingUnits: 19 },
    // Add more rows as needed
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>History</h1>
      <p>View your past electricity usage and purchases.</p>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Units Purchased</th>
            <th>Daily Consumption (kWh)</th>
            <th>Remaining Units</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.unitsPurchased}</td>
              <td>{entry.dailyConsumption}</td>
              <td>{entry.remainingUnits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
