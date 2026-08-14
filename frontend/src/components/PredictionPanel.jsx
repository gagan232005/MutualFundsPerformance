import React, { useState } from "react";

export default function PredictionPanel({ onPredict }) {
    const [horizon, setHorizon] = useState(30);

    return (
        <div
            style={{
                width: "85%",
                margin: "40px auto",
                padding: "25px",
                background: "rgba(14, 21, 35, 0.5)",
                backdropFilter: "blur(10px)",
                borderRadius: "15px",
                border: "2px solid rgba(0, 212, 255, 0.4)",
                boxShadow: "0 0 25px rgba(0, 212, 255, 0.2)",
            }}
        >
            <h2
                style={{
                    color: "#4cc9f0",
                    marginBottom: 20,
                    fontSize: 24,
                    fontWeight: 700,
                }}
            >
                Predict Future NAV
            </h2>

            <div style={{ display: "flex", gap: "15px" }}>
                <input
                    type="number"
                    value={horizon}
                    onChange={(e) => setHorizon(e.target.value)}
                    placeholder="Enter Days"
                    style={{
                        flex: 1,
                        padding: "14px",
                        background: "#09131d",
                        color: "white",
                        border: "1px solid #123",
                        borderRadius: 10,
                        fontSize: 17,
                    }}
                />

                <button
                    onClick={() => onPredict(horizon)}
                    style={{
                        padding: "14px 28px",
                        background: "linear-gradient(90deg,#00d4ff,#4cc9f0)",
                        borderRadius: 10,
                        border: "none",
                        fontSize: 17,
                        fontWeight: 700,
                        cursor: "pointer",
                        color: "#022833",
                        boxShadow: "0 5px 20px rgba(0, 212, 255, 0.4)",
                    }}
                >
                    Predict
                </button>
            </div>
        </div>
    );
}
