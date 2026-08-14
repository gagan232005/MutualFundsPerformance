import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import ChartSection from "../components/ChartSection";
import PieCharts from "../components/PieCharts";
import AlgorithmTable from "../components/AlgorithmTable";
import AccuracyLeaderboard from "../components/AccuracyLeaderboard";

export default function Prediction() {
  const {
    fund,
    fundName,
    eda,
    predictionData,
    loading,
    handlePredict,
    nextNAV,
    dates,
    predicted,
    actual,
    modelData,
  } = useOutletContext();

  const algorithms = eda?.algorithms || [];
  const bestAlgo = [...algorithms].sort((a, b) => a.rank - b.rank)[0];

  const lastActual = actual.length ? actual[actual.length - 1] : null;
  const trendUp = lastActual != null && nextNAV != null ? nextNAV >= lastActual : null;
  const predictionDate = dates.length ? dates[dates.length - 1] : "—";

  return (
    <div>
      <h1 className="page-title">Prediction & Model Accuracy</h1>
      <p className="page-subtitle">
        {fund ? `Fund: ${fundName}` : "Select a fund on the Dashboard first."}
      </p>

      {!eda && (
        <div className="empty-prompt">
          Load a fund's EDA on the Analytics page before running a prediction.
        </div>
      )}

      {eda && algorithms.length > 0 && (
        <>
          <AlgorithmTable algorithms={algorithms} />
          <div style={{ marginTop: 16 }}>
            <AccuracyLeaderboard algorithms={algorithms} />
          </div>
        </>
      )}

      {eda && !predictionData && (
        <div className="card" style={{ textAlign: "center", marginTop: 24 }}>
          <h3 style={{ marginTop: 0 }}>NAV Forecast</h3>
          <button className="btn primary" onClick={handlePredict} style={{ marginTop: 10 }}>
            Predict Performance
          </button>
          {loading && <p style={{ marginTop: 10 }}>Loading...</p>}
        </div>
      )}

      {predictionData && (
        <div style={{ marginTop: 30 }}>
          <h3 className="section-heading" style={{ marginTop: 0 }}>
            NAV Forecast
          </h3>

          <div className="summary-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="summary-card">
              <div className="stat-key">Predicted NAV</div>
              <div className="stat-value">{nextNAV ? nextNAV.toFixed(2) : "—"}</div>
            </div>
            <div className="summary-card">
              <div className="stat-key">Prediction Date</div>
              <div className="stat-value">{predictionDate}</div>
            </div>
            <div className="summary-card">
              <div className="stat-key">Model Used</div>
              <div className="stat-value" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {bestAlgo?.model || "—"}
                {trendUp !== null && (
                  <span className={trendUp ? "risk-badge risk-low" : "risk-badge risk-high"}>
                    {trendUp ? "▲ Up" : "▼ Down"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <ChartSection actual={actual} predicted={predicted} dates={dates} modelData={modelData} />
          </div>

          <PieCharts actual={actual} predicted={predicted} modelData={modelData} />
        </div>
      )}

      {eda && algorithms.length > 0 && (
        <div className="flow-continue">
          <Link to="/model-comparison" className="btn primary">
            Continue to Model Comparison →
          </Link>
        </div>
      )}
    </div>
  );
}
