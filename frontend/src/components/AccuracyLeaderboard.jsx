import React from "react";

// Keep the same accent color per model used elsewhere in the app
// (ChartSection / ModelComparison) so the leaderboard reads consistently.
const MODEL_COLORS = {
  LINEAR: "#ffc846",
  DRIFT: "#00eaff",
  RF: "#48ff5a",
};

const MEDAL_COLORS = ["#f5c542", "#d9dde5", "#d18a52"];

export default function AccuracyLeaderboard({ algorithms = [] }) {
  if (!algorithms || algorithms.length === 0) return null;

  const sorted = [...algorithms].sort((a, b) => a.rank - b.rank);

  return (
    <div className="accuracy-card">
      <h2 className="accuracy-title">Accuracy by Model</h2>

      {sorted.map((model, i) => (
        <div className="accuracy-row" key={model.model ?? i}>
          <div
            className="rank-circle"
            style={{ background: MEDAL_COLORS[i] || "#4b5563" }}
          >
            {model.rank}
          </div>

          <div className="accuracy-info">
            <div className="accuracy-top">
              <span className="model-name">{model.model}</span>
              <span className="accuracy-value">{model.accuracy}%</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.max(0, Math.min(100, model.accuracy))}%`,
                  background: MODEL_COLORS[model.model] || "#38bdf8",
                }}
              ></div>
            </div>

            <div className="rating-text">
              {model.rating}
              {i === 0 ? " · Best Model" : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
