import React from "react";

export default function SIPReturns({ sip, fund }) {
    if (!sip)
        return (
            <div
                style={{
                    background: "rgba(255,255,255,0.02)",
                    padding: 20,
                    borderRadius: 16,
                    marginTop: 20,
                    border: "1px solid rgba(255,255,255,0.05)",
                    color: "#9fe8ff",
                }}
            >
                Loading SIP data...
            </div>
        );

    return (
        <div
            style={{
                background: "rgba(255,255,255,0.02)",
                padding: 25,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.05)",
                marginTop: 25,
            }}
        >
            <h2
                style={{
                    color: "#00eaff",
                    marginBottom: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                💰 SIP Calculator
            </h2>

            <table style={{ width: "100%", color: "white", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th
                        style={{
                            padding: 12,
                            textAlign: "left",
                            color: "#9fe8ff",
                            fontSize: 16,
                        }}
                    >
                        Duration
                    </th>
                    <th
                        style={{
                            padding: 12,
                            textAlign: "right",
                            color: "#9fe8ff",
                            fontSize: 16,
                        }}
                    >
                        Return
                    </th>
                </tr>
                </thead>

                <tbody>
                <tr>
                    <td style={td}>1 Year</td>
                    <td style={tdRight}>{sip["1Y"]}</td>
                </tr>
                <tr>
                    <td style={td}>3 Years</td>
                    <td style={tdRight}>{sip["3Y"]}</td>
                </tr>
                <tr>
                    <td style={td}>5 Years</td>
                    <td style={tdRight}>{sip["5Y"]}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

const td = {
    padding: 12,
    fontSize: 15,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const tdRight = {
    padding: 12,
    textAlign: "right",
    fontSize: 15,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    color: "#00eaff",
};
