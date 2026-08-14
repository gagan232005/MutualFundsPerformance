// src/components/Rating.jsx
import React from "react";

export default function Rating({ value = 0, outOf = 5 }) {
    const stars = Array.from({ length: outOf }, (_, i) => i < value);
    return (
        <div style={{ display: "flex", gap: 6 }}>
            {stars.map((on, i) => (
                <span key={i} style={{ color: on ? "#ffbb00" : "#444", fontSize: 18 }}>★</span>
            ))}
        </div>
    );
}
