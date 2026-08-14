import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import AMCSelector from "../components/AMCSelector";

const QUICK_LINKS = [
    {
        to: "/analytics",
        number: "01",
        label: "Analytics",
        desc: "NAV trends, risk metrics and volatility analysis.",
        icon: (
            <svg viewBox="0 0 24 24">
                <path d="M4 19V5" />
                <path d="M4 19h16" />
                <path d="M7 15l3-4 3 2 5-7" />
            </svg>
        ),
    },

    {
        to: "/prediction",
        number: "02",
        label: "Prediction",
        desc: "Forecast future NAV using trained models.",
        icon: (
            <svg viewBox="0 0 24 24">
                <path d="M4 18l6-6 4 3 6-8" />
                <path d="M16 7h4v4" />
            </svg>
        ),
    },

    {
        to: "/model-comparison",
        number: "03",
        label: "Model Comparison",
        desc: "Evaluate and compare forecasting approaches.",
        icon: (
            <svg viewBox="0 0 24 24">
                <path d="M7 4h10" />
                <path d="M7 8h10" />
                <path d="M7 12h4" />
                <path d="M7 16h10" />
                <path d="M5 3h14v18H5z" />
            </svg>
        ),
    },

    {
        to: "/sip-calculator",
        number: "04",
        label: "SIP Calculator",
        desc: "Estimate investment growth and projected returns.",
        icon: (
            <svg viewBox="0 0 24 24">
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M8 7h8" />
                <path d="M8 11h2" />
                <path d="M14 11h2" />
                <path d="M8 15h2" />
                <path d="M14 15h2" />
            </svg>
        ),
    },

    {
        to: "/understanding-models",
        number: "05",
        label: "Prediction Models",
        desc: "Understand the algorithms behind the forecasts.",
        icon: (
            <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 3.5" />
                <path d="M12 16h.01" />
            </svg>
        ),
    },
];

export default function Dashboard() {
    const {
        amcList,
        selectedAMC,
        setSelectedAMC,
        fundList,
        fund,
        setFund,
        fundName,
    } = useOutletContext();

    return (
        <main className="dashboard-page">

            {/* HERO */}

            <section className="dashboard-hero">

                <div className="hero-copy">

                    <div className="dashboard-eyebrow">
                        MUTUAL FUND INTELLIGENCE
                    </div>

                    <h1>
                        Fund Performance
                        <span> Dashboard</span>
                    </h1>

                    <p>
                        Real-time NAV analytics, forecasting and
                        machine-learning model evaluation for
                        Indian mutual funds.
                    </p>
                </div>

                <div className="live-status">
                    <span className="live-dot"></span>

                    <div>
                        <strong>LIVE DATA</strong>
                        <small>Market data connected</small>
                    </div>
                </div>

            </section>


            {/* FUND SELECTION */}

            <section className="fund-selection-card">

                <div className="card-heading">

                    <div>

                        <div className="section-eyebrow">
                            START ANALYSIS
                        </div>

                        <h2>
                            Select a Fund
                        </h2>

                        <p>
                            Choose an asset management company and
                            mutual fund scheme to begin.
                        </p>

                    </div>

                    <div className="selection-step">
                        01
                    </div>

                </div>


                <div className="selection-grid">

                    <div className="selection-field">

                        <label>
                            Asset Management Company
                        </label>

                        <AMCSelector
                            selectedAMC={selectedAMC}
                            onSelect={setSelectedAMC}
                            amcList={amcList}
                        />

                    </div>


                    {selectedAMC && (
                        <div className="selection-field">

                            <label>
                                Mutual Fund Scheme
                            </label>

                            {fundList.length === 0 ? (

                                <div className="loading-field">
                                    <span className="loading-spinner"></span>
                                    Loading available schemes...
                                </div>

                            ) : (

                                <select
                                    className="select"
                                    value={fund}
                                    onChange={(e) =>
                                        setFund(e.target.value)
                                    }
                                >

                                    <option value="">
                                        Choose a fund scheme
                                    </option>

                                    {fundList.map((f) => (
                                        <option
                                            key={f.code}
                                            value={f.code}
                                        >
                                            {f.name}
                                        </option>
                                    ))}

                                </select>

                            )}

                        </div>
                    )}

                </div>


                {/* SELECTED FUND */}

                {fund && (

                    <div className="selected-fund-panel">

                        <div className="selected-fund-left">

                            <div className="selected-fund-label">
                                SELECTED FUND
                            </div>

                            <h3>
                                {fundName}
                            </h3>

                            <div className="fund-meta">

                                <span>
                                    {selectedAMC}
                                </span>

                                <span className="meta-divider">
                                    •
                                </span>

                                <span className="live-text">
                                    <span className="mini-live-dot"></span>
                                    Live NAV
                                </span>

                            </div>

                        </div>


                        <Link
                            to="/analytics"
                            className="primary-action"
                        >
                            <span>
                                View Fund Analytics
                            </span>

                            <span className="action-arrow">
                                →
                            </span>
                        </Link>

                    </div>

                )}

            </section>


            {/* TOOLS */}

            <section className="analysis-section">

                <div className="section-header">

                    <div>

                        <div className="section-eyebrow">
                            ANALYSIS
                        </div>

                        <h2>
                            Fund Intelligence Tools
                        </h2>

                        <p>
                            Explore performance, forecasts and
                            investment calculations.
                        </p>

                    </div>

                </div>


                <div className="quicknav-grid">

                    {QUICK_LINKS.map((link) => (

                        <Link
                            key={link.to}
                            to={link.to}
                            className="professional-tool-card"
                        >

                            <div className="tool-card-top">

                                <div className="tool-icon">
                                    {link.icon}
                                </div>

                                <span className="tool-number">
                                    {link.number}
                                </span>

                            </div>

                            <h3>
                                {link.label}
                            </h3>

                            <p>
                                {link.desc}
                            </p>

                            <div className="tool-footer">

                                <span>
                                    Open module
                                </span>

                                <span>
                                    →
                                </span>

                            </div>

                        </Link>

                    ))}

                </div>

            </section>

        </main>
    );
}