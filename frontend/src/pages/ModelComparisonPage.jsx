import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import ModelComparisonChart from "../components/ModelComparison";

export default function ModelComparisonPage() {
    const {
        fund,
        fundName,
        predictionData,
        modelData,
    } = useOutletContext();

    return (
        <div className="module-page">

            {/* PAGE HEADER */}

            <div className="module-header">

                <div>
                    <div className="module-kicker">
                        MODULE 04
                    </div>

                    <h1 className="module-title">
                        Model Comparison
                    </h1>

                    <p className="module-description">
                        Compare forecast behaviour across the
                        models used by the prediction engine.
                    </p>
                </div>

                {fund && (
                    <div className="module-context">
                        <span>ACTIVE FUND</span>
                        <strong>{fundName}</strong>
                    </div>
                )}

            </div>

            {/* CONTENT */}

            {predictionData ? (
                <>

                    <ModelComparisonChart
                        modelData={modelData}
                    />

                    <div className="model-insight-panel">

                        <div className="insight-marker">
                            04
                        </div>

                        <div className="insight-content">

              <span className="eyebrow">
                NEXT STEP
              </span>

                            <h3>
                                Evaluate the investment scenario
                            </h3>

                            <p>
                                Use the SIP calculator to estimate
                                potential investment growth using
                                the selected fund.
                            </p>

                        </div>

                        <Link
                            to="/sip-calculator"
                            className="professional-button"
                        >
                            Open SIP Calculator
                            <span>→</span>
                        </Link>

                    </div>

                </>
            ) : (

                <div className="empty-state">

                    <div className="empty-number">
                        04
                    </div>

                    <span className="eyebrow">
            MODEL COMPARISON
          </span>

                    <h3>
                        No prediction available yet
                    </h3>

                    <p>
                        Run a prediction for the selected
                        fund before comparing the forecasting
                        models.
                    </p>

                    <Link
                        to="/prediction"
                        className="professional-button"
                    >
                        Run Prediction
                        <span>→</span>
                    </Link>

                </div>

            )}

        </div>
    );
}