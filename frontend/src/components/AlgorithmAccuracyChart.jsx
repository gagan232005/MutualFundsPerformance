import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AlgorithmAccuracyChart({ data }) {
  if (!data) return null;

  return (
    <div className="card">
      <h3>Algorithm Accuracy Comparison</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="model" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="accuracy" fill="#00f5d4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}