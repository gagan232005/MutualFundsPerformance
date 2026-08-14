import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function PredictionOutput({ data, eda }) {

  if (!data || !eda) return null;

  const actualHistory = eda.navValues || [];
  const actualDates = eda.dates || [];
  const predictionDates = data.predictionDates || [];
  const predictions = data.prediction || [];
  const upper = data.upperBound || [];
  const lower = data.lowerBound || [];

  if (!actualHistory.length || !predictions.length)
    return <p>No prediction data available</p>;

  const lastActual = actualHistory[actualHistory.length - 1];
  const lastDate = actualDates[actualDates.length - 1];

  // ========================
  // Merge Historical + Forecast
  // ========================
  const historicalData = actualHistory.map((val, i) => ({
    date: actualDates[i],
    actual: val,
    predicted: null,
    upper: null,
    lower: null
  }));

  const forecastData = predictionDates.map((date, i) => ({
    date,
    actual: null,
    predicted: predictions[i],
    upper: upper[i],
    lower: lower[i]
  }));

  const combinedData = [...historicalData, ...forecastData];

  // ========================
  // Model Comparison Data
  // ========================
  const modelData = (data.algorithms || []).map((algo) => ({
    name: algo.model,
    value: algo.predicted
  }));

  const pieColors = ["#00eaff", "#2ecc71", "#f39c12", "#e74c3c"];

  return (
    <div style={container}>

      <h2 style={title}>📈 Prediction Trend</h2>

      {/* ================= LINE GRAPH ================= */}
      <div style={chartCard}>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={combinedData}>
            <CartesianGrid stroke="#2c3e50" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />

            {/* Confidence Interval */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="rgba(150,150,150,0.25)"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="#ffffff"
            />

            {/* Historical Line */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#00eaff"
              strokeWidth={3}
              dot={false}
            />

            {/* Forecast Line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#000000"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= MODEL COMPARISON ================= */}
      <h2 style={sectionTitle}>📊 Model Prediction Comparison</h2>

      <div style={chartCard}>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={modelData}>
            <CartesianGrid stroke="#2c3e50" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#f39c12"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= PIE SUMMARY ================= */}
      <h2 style={sectionTitle}>🧠 Prediction Summary</h2>

      <div style={pieGrid}>

        {/* Actual vs Predicted */}
        <div style={chartCard}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Actual NAV", value: lastActual },
                  { name: "Predicted NAV", value: predictions[0] }
                ]}
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                <Cell fill="#00eaff" />
                <Cell fill="#2ecc71" />
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Model Pie */}
        <div style={chartCard}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={modelData}
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {modelData.map((entry, index) => (
                  <Cell key={index} fill={pieColors[index % 4]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

// ================= STYLES =================

const container = {
  marginTop: 40,
  padding: 30,
  borderRadius: 20,
  background: "rgba(15,23,42,0.85)"
};

const title = {
  color: "#00eaff",
  marginBottom: 20
};

const sectionTitle = {
  marginTop: 40,
  color: "#00eaff"
};

const chartCard = {
  padding: 20,
  borderRadius: 16,
  background: "rgba(0,0,0,0.3)",
  marginBottom: 30
};

const pieGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 25
};