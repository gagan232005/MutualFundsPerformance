import React, { useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import EDASection from "../components/EDASection";

export default function Analytics() {
    const { fund, fundName, eda, loading, loadEDA } = useOutletContext();

    // Auto-load the moment a fund is selected and we don't already have
    // EDA data for it — used to require clicking a button on Dashboard.
    useEffect(() => {
        if (fund && !eda && !loading) {
            loadEDA();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fund]);

    return (
        <div>
            <div className="section-eyebrow analytics-eyebrow">
                FUND ANALYTICS
            </div>

            <h1 className="page-title">Statistical Analysis</h1>
            <p className="page-subtitle">
                {fund ? `Fund: ${fundName}` : "Select a fund on the Dashboard first."}
            </p>

            {!fund && (
                <div className="empty-prompt">
                    Select an AMC and fund on the Dashboard to view its EDA here.
                </div>
            )}

            {fund && loading && (
                <div className="empty-prompt eda-loading-prompt">
                    <span className="eda-loading-spinner" />
                    Loading EDA…
                </div>
            )}

            {fund && !loading && eda && (
                <>
                    <EDASection eda={eda} />
                    <div className="flow-continue">
                        <Link to="/prediction" className="btn primary">
                            Continue to Prediction →
                        </Link>
                    </div>
                </>
            )}

            {fund && !loading && !eda && (
                <div className="card" style={{ textAlign: "center" }}>
                    <button className="btn primary" onClick={loadEDA}>
                        Load EDA
                    </button>
                </div>
            )}
        </div>
    );
}