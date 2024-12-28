import React, { useState } from 'react';

const Reports = () => {
  const [data, setData] = useState([
    { date: '2024-11-01', consumption: 5 },
    { date: '2024-11-02', consumption: 6 },
    { date: '2024-11-03', consumption: 4.5 },
    // More data can be added dynamically
  ]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reports</h1>
      <p>View your electricity consumption over time.</p>
      
      {/* Display data in a simple table for now */}
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Consumption (kWh)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.consumption}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
