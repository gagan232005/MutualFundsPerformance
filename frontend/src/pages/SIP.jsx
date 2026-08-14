import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import SIPCalculator from "../components/SIPCalculator";

export default function SIP() {
  const { fund, fundName, eda, predictionData, handleDownloadPDF } = useOutletContext();

  const selectedFund = eda
    ? { name: fundName, history: eda.navValues || [], dates: eda.dates || [] }
    : null;

  return (
    <div>
      <h1 className="page-title">SIP Calculator</h1>
      <p className="page-subtitle">
        {fund ? `Fund: ${fundName}` : "Select a fund on the Dashboard first."}
      </p>

      {!fund && (
        <div className="empty-prompt">
          Select an AMC and fund on the Dashboard to project SIP returns.
        </div>
      )}

      {fund && !eda && (
        <div className="empty-prompt">
          Load this fund's EDA on the Analytics page first — the SIP
          projection uses its historical NAV to estimate returns.
        </div>
      )}

      {fund && eda && (
        <div id="reportContent">
          <SIPCalculator selectedFund={selectedFund} />

          <div className="premium-card" style={{ marginTop: 24 }}>
            <h2>📄 Download Report</h2>
            <p className="download-card-desc">
              {predictionData
                ? "Export the fund's full analysis, forecast, and SIP projection as a PDF report."
                : "Run a prediction to include the forecast in your PDF report."}
            </p>
            <button
              className="btn primary"
              onClick={handleDownloadPDF}
              style={{ marginTop: 16, padding: "12px 20px", fontSize: 16, borderRadius: 8 }}
            >
              Download Full Professional PDF
            </button>
          </div>
        </div>
      )}

      {fund && eda && (
        <div className="flow-continue flow-continue-subtle">
          <Link to="/understanding-models" className="btn-text-link">
            📚 Not sure how these models work? →
          </Link>
        </div>
      )}
    </div>
  );
}
