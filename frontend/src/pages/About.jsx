import React from "react";

const CAPABILITIES = [
    {
        number: "01",
        title: "Live NAV Analysis",
        description:
            "Retrieve current and historical NAV information for selected mutual fund schemes and examine their performance over time.",
    },
    {
        number: "02",
        title: "Performance Analytics",
        description:
            "Evaluate EDA,NAV trends, volatility and historical behaviour through interactive analytical views.",
    },
    {
        number: "03",
        title: "NAV Forecasting",
        description:
            "Generate future NAV estimates using multiple forecasting approaches and compare their expected behaviour.",
    },
    {
        number: "04",
        title: "Model Evaluation",
        description:
            "Compare different forecasting models to understand how their predictions differ for the selected fund.",
    },
    {
        number: "05",
        title: "Investment Projection",
        description:
            "Use the SIP calculator to estimate potential investment growth based on contribution, duration and expected returns.",
    },
    {
        number: "06",
        title: "AI-Assisted Insights",
        description:
            "Get simplified explanations of analytical results and model outputs through the integrated AI assistant.",
    },
];

const TECHNOLOGIES = [
    {
        name: "React",
        description: "Interactive frontend application",
    },
    {
        name: "Java",
        description: "Backend application logic",
    },
    {
        name: "Spring Boot",
        description: "REST API and backend services",
    },
    {
        name: "Weka",
        description: "Machine learning algorithms",
    },
    {
        name: "Recharts",
        description: "Interactive data visualization",
    },
    {
        name: "Axios",
        description: "Frontend API communication",
    },
    {
        name: "AMFI / mfapi.in",
        description: "Mutual fund NAV data source",
    },
    {
        name: "jsPDF",
        description: "Professional report generation",
    },
];

const PROCESS = [
    {
        number: "01",
        title: "Select",
        description: "Choose an AMC and mutual fund scheme.",
    },
    {
        number: "02",
        title: "Analyse",
        description: "Explore NAV history and performance metrics.",
    },
    {
        number: "03",
        title: "Forecast",
        description: "Generate predictions using multiple models.",
    },
    {
        number: "04",
        title: "Compare",
        description: "Evaluate the forecasts side by side.",
    },
];

export default function About() {
    return (
        <div className="about-page">

            {/* HERO */}
            <section className="about-hero">

                <div className="about-hero-meta">
                    <span>PROJECT OVERVIEW</span>
                    <span>01</span>
                </div>

                <h1 className="about-title">
                    Mutual Funds{" "}
                    <span>Performance Prediction</span>
                </h1>

                <p className="about-lead">
                    A data-driven platform for analysing mutual fund performance,
                    forecasting NAV behaviour, comparing machine-learning models,
                    and exploring investment scenarios.
                </p>

            </section>


            {/* PROJECT OVERVIEW */}
            <section className="about-section about-overview">

                <div className="about-section-index">
                    02
                </div>

                <div className="about-section-content">

                    <div className="about-kicker">
                        PLATFORM OVERVIEW
                    </div>

                    <h2>
                        From live fund data to
                        <span> actionable insights.</span>
                    </h2>

                    <p>
                        Mutual Funds Performance Prediction brings fund data,
                        historical analysis, forecasting models and investment
                        calculations together in a single platform.
                    </p>

                    <p>
                        Users can select a mutual fund scheme, analyse its
                        historical NAV behaviour, generate future forecasts,
                        compare prediction models and explore potential SIP
                        outcomes.
                    </p>

                </div>

            </section>


            {/* CAPABILITIES */}
            <section className="about-section capabilities-section">

                <div className="about-section-heading">

                    <div>
                        <div className="about-kicker">
                            PLATFORM CAPABILITIES
                        </div>

                        <h2>
                            Everything needed to
                            <span> understand fund performance.</span>
                        </h2>
                    </div>

                    <div className="about-section-index">
                        03
                    </div>

                </div>


                <div className="capabilities-grid">

                    {CAPABILITIES.map((item) => (
                        <article
                            className="capability-card"
                            key={item.number}
                        >

                            <div className="capability-number">
                                {item.number}
                            </div>

                            <div className="capability-content">

                                <h3>
                                    {item.title}
                                </h3>

                                <p>
                                    {item.description}
                                </p>

                            </div>

                        </article>
                    ))}

                </div>

            </section>


            {/* HOW IT WORKS */}
            <section className="about-section process-section">

                <div className="about-section-heading">

                    <div>
                        <div className="about-kicker">
                            ANALYSIS PROCESS
                        </div>

                        <h2>
                            A simple path from
                            <span> data to prediction.</span>
                        </h2>
                    </div>

                    <div className="about-section-index">
                        04
                    </div>

                </div>


                <div className="process-track">

                    {PROCESS.map((item, index) => (
                        <React.Fragment key={item.number}>

                            <div className="process-item">

                                <div className="process-number">
                                    {item.number}
                                </div>

                                <div className="process-text">

                                    <h3>
                                        {item.title}
                                    </h3>

                                    <p>
                                        {item.description}
                                    </p>

                                </div>

                            </div>

                            {index < PROCESS.length - 1 && (
                                <div className="process-line" />
                            )}

                        </React.Fragment>
                    ))}

                </div>

            </section>


            {/* TECHNOLOGY */}
            <section className="about-section technology-section">

                <div className="about-section-heading">

                    <div>
                        <div className="about-kicker">
                            TECHNOLOGY
                        </div>

                        <h2>
                            Built with a modern
                            <span> full-stack architecture.</span>
                        </h2>
                    </div>

                    <div className="about-section-index">
                        05
                    </div>

                </div>


                <div className="technology-grid">

                    {TECHNOLOGIES.map((technology) => (
                        <div
                            className="technology-card"
                            key={technology.name}
                        >

                            <h3>
                                {technology.name}
                            </h3>

                            <p>
                                {technology.description}
                            </p>

                        </div>
                    ))}

                </div>

            </section>


            {/* FINAL STATEMENT */}
            <section className="about-final">

                <div className="about-final-number">
                    06
                </div>

                <div>

                    <div className="about-kicker">
                        PROJECT OBJECTIVE
                    </div>

                    <h2>
                        Making mutual fund analysis
                        <span> easier to understand.</span>
                    </h2>

                    <p>
                        The platform is designed to combine quantitative
                        analysis with understandable visual insights, helping
                        users explore fund behaviour without relying on a
                        single prediction.
                    </p>

                </div>

            </section>

        </div>
    );
}