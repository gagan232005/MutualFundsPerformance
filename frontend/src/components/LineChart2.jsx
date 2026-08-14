import React from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    CartesianGrid, Legend, ResponsiveContainer
} from "recharts";

export default function LineChart2({ algorithms, predictionDates }) {
    if (!algorithms) return null;

   const models = ["drift", "linear", "rf"];
const length = algorithms["drift"].predicted.length;

const data = Array.from({ length }).map((_, i) => ({
    date: predictionDates?.[i] || `P${i + 1}`,
    DRIFT: algorithms["drift"].predicted[i],
    LINEAR: algorithms["linear"].predicted[i],
    RF: algorithms["rf"].predicted[i]
}));

    return (
        <div className="card section-card">
            <div className="section-head">
                <div className="section-title">Model Prediction Comparison</div>
            </div>

            <ResponsiveContainer width="100%" height={360}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2e3a" />

                    <XAxis dataKey="date" tick={{ fill: "#9bdfff" }} />
                    <YAxis tick={{ fill: "#9bdfff" }} />

                    <Tooltip
                        contentStyle={{
                            background: "#0b1220",
                            border: "1px solid #123",
                            borderRadius: 8
                        }}
                    />
                    <Legend wrapperStyle={{ color: "#9bdfff" }} />

                <Line type="monotone" dataKey="DRIFT" stroke="#4cc9f0" strokeWidth={3} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="LINEAR" stroke="#ffd166" strokeWidth={3} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="RF" stroke="#00ff99" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
