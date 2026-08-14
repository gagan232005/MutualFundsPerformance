import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function NavTrend({ history = [], predicted = [] }) {
  let hist = [];

  if (Array.isArray(history) && typeof history[0] === "object") {
    hist = history;
  } else if (Array.isArray(history) && Array.isArray(history[0])) {
    hist = history.map(item => ({ date: item[0], nav: Number(item[1]) }));
  } else if (Array.isArray(history) && typeof history[0] === "number") {
    hist = history.map((v, i) => ({ date: `Point-${i+1}`, nav: Number(v) }));
  }

  const minLen = Math.min(hist.length, predicted.length);

  const chartData = hist.slice(0, minLen).map((h, i) => ({
    date: h.date,
    actual: h.nav,
    predicted: predicted[i],
  }));

  return (
    <div className="premium-card">
      <h2>📈 NAV Trend — Actual vs Predicted</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="date" stroke="#9bb6ff" />
          <YAxis stroke="#9bb6ff" />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: 10 }} />
          <Legend />

          <Line
            type="monotone"
            dataKey="actual"
            stroke="#4aa3ff"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={1200}
          />

          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#00eaff"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}