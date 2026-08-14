import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function PieChart2({ algorithms, history }) {
    if (!algorithms || !history || history.length === 0) return null;

    // Latest actual NAV
    const lastActual =
        Number(history[history.length - 1].nav || history[history.length - 1]);

    // Latest predicted NAVs
   const lastDrift = algorithms.drift.predicted.slice(-1)[0];
    const lastLinear = algorithms.linear.predicted.slice(-1)[0];
    const lastRF = algorithms.rf.predicted.slice(-1)[0];

    // Chart Data
    const data = [
        { name: "Actual NAV", value: lastActual },
       { name: "DRIFT Prediction", value: lastDrift },
        { name: "Linear Prediction", value: lastLinear },
        { name: "Random Forest Prediction", value: lastRF }
    ];

    // Premium Colors
    const COLORS = ["#1E90FF", "#00C49F", "#FFBB28", "#FF6347"];

    return (
        <div
            style={{
                background: "rgba(255,255,255,0.02)",
                padding: 25,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.06)",
                marginTop: 25
            }}
        >
            <h2 style={{ color: "#00eaff", marginBottom: 15 }}>
                📊 Prediction Comparison (Upgraded)
            </h2>

            <div style={{ width: "100%", height: 330 }}>
                <ResponsiveContainer>
                    <PieChart>

                        {/* DONUT ARC */}
                        <Pie
                            data={data}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}  // Donut hole
                            outerRadius={110}
                            paddingAngle={4}
                            labelLine={true}
                            label={({ name, value }) =>
                                `${name}: ${value.toFixed(2)}`
                            }
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index]} stroke="none" />
                            ))}
                        </Pie>

                        <Tooltip
                            formatter={(v) => v.toFixed(2)}
                            contentStyle={{
                                background: "#0b1a24",
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "white"
                            }}
                        />

                        <Legend
                            iconType="circle"
                            verticalAlign="bottom"
                            height={90}
                            formatter={(value) => (
                                <span style={{ color: "#9fe8ff", fontSize: 14 }}>{value}</span>
                            )}
                        />

                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* CENTER TEXT */}
            <div
                style={{
                    textAlign: "center",
                    marginTop: -160,
                    color: "#9fe8ff",
                    fontSize: 18,
                    fontWeight: 600,
                    pointerEvents: "none"
                }}
            >
                Prediction Breakdown
            </div>
        </div>
    );
}
