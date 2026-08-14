import React from "react";

const DatasetTable = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div>
      <h2>Dataset Preview</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>NAV</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.date}</td>
              <td>{row.nav}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DatasetTable;
