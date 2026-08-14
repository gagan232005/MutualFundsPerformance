import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function BarComparison({ data }) {
    const algos = data.algorithms;

    const chartData = Object.keys(algos).map((name) => ({
        algo: name.toUpperCase(),
        nav: algos[name].predicted.slice(-1)[0],
    }));

    const COLORS = ["#00d4ff", "#ffca3a", "#8ac926", "#ff595e", "#1982c4"];

    return (
        <div style={{ width: "85%", margin: "40px auto" }}>
            <h2
                style={{
                    color: "#4cc9f0",
                    marginBottom: 20,
                    fontSize: 24,
                    textAlign: "center",
                }}
            >
                Algorithm Performance Comparison
            </h2>

            <div
                style={{
                    height: "350px",
                    background: "#0e1523",
                    borderRadius: 16,
                    padding: 20,
                    border: "1px solid #123",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
                }}
            >
                <ResponsiveContainer>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1a2636" />

                        <XAxis
                            dataKey="algo"
                            tick={{ fill: "#a8c8ff", fontSize: 12 }}
                        />
                        <YAxis
                            tick={{ fill: "#a8c8ff", fontSize: 12 }}
                        />

                        <Tooltip
                            contentStyle={{
                                background: "#0d1b2a",
                                borderRadius: 10,
                                border: "1px solid #123",
                                color: "#fff",
                            }}
                            itemStyle={{ color: "#4cc9f0", fontWeight: 600 }}
                        />

                        <Legend wrapperStyle={{ color: "#9cc4ff" }} />

                        <Bar dataKey="nav" radius={[6, 6, 0, 0]}>
                            {chartData.map((_, i) => (
                                <cell
                                    key={i}
                                    fill={COLORS[i % COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
