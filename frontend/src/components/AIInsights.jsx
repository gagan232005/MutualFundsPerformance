import React from "react";

export default function AIInsights({ data }) {
    if (!data) return null;

    const lastNav = data.predicted[data.predicted.length - 1];
    const firstNav = data.history[0].nav;
    const growth = (((lastNav - firstNav) / firstNav) * 100).toFixed(2);

    // Identify best model
    const algorithms = data.algorithms || {};
    const bestModel = Object.keys(algorithms).reduce((best, curr) =>
        algorithms[curr].mape < algorithms[best].mape ? curr : best
    );

    return (
        <div className="ai-box">
            <h2 className="ai-title">🤖 AI Insights Summary</h2>

            <p className="ai-text">
                The fund shows a <b>{growth > 0 ? "positive" : "negative"}</b> trend with a
                projected NAV of <b>{lastNav}</b>. Overall growth from the earliest NAV is
                <b> {growth}%</b>.
            </p>

            <p className="ai-text">
                The <b>{bestModel.toUpperCase()}</b> model achieved the lowest MAPE, indicating it
                captures the fund's pattern most accurately.
            </p>

            <p className="ai-text">
                NAV movement suggests moderate volatility. Long-term SIP contributions may offer
                stable returns if current patterns continue.
            </p>

            <p className="ai-bottom">
                ⚠ AI-generated insight — not financial advice.
            </p>
        </div>
    );
}
