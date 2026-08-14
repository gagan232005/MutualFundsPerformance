import React from "react";

const MODELS = [
  {
    number: "01",
    icon: "📈",
    name: "Drift Method",
    desc: "Uses the overall trend between the first and last historical NAV values and extends that trend to predict future values. A simple statistical forecasting method used as a baseline model.",
    useCases: ["Quick baseline forecast", "Funds with a steady, consistent trend"],
    advantages: ["No training required", "Fast and fully interpretable", "Reference point for evaluating the ML models"],
  },
  {
    number: "02",
    icon: "📊",
    name: "Linear Regression",
    desc: "A supervised machine learning algorithm that learns a linear relationship between historical NAV values and time, then predicts future NAV using the fitted linear model.",
    useCases: ["Funds with a linear growth pattern", "Fast, explainable predictions"],
    advantages: ["Fast to train and predict", "Highly interpretable", "Well suited to linear trends"],
  },
  {
    number: "03",
    icon: "🌲",
    name: "Random Forest",
    desc: "An ensemble machine learning algorithm that combines multiple decision trees. It captures nonlinear relationships in NAV movement, and tends to outperform on choppier, less predictable funds — though on smoothly trending funds, Drift or Linear Regression can score higher since Random Forest can't extrapolate past the range of values it was trained on.",
    useCases: ["Volatile or nonlinear NAV movement", "Funds without a clean, consistent trend"],
    advantages: ["Captures nonlinear patterns", "Robust to noise/outliers", "Often strongest on choppier, regime-shifting funds"],
  },
];

const GLOSSARY = [
  {
    name: "AMC",
    description: "Asset Management Company — the firm that pools investor money and manages it as mutual funds, e.g. HDFC, SBI, ICICI Prudential.",
  },
  {
    name: "NAV",
    description: "Net Asset Value — the per-unit price of a fund, published daily and used throughout this app for analysis and forecasting.",
  },
  {
    name: "Baseline model",
    description: "A simple reference forecast (Drift) that other models are measured against to judge whether added complexity is worth it.",
  },
  {
    name: "Ensemble model",
    description: "A model built from many smaller models — Random Forest combines multiple decision trees to form a single, sturdier prediction.",
  },
];

const CHOOSING = [
  {
    number: "01",
    title: "Start with Drift",
    description: "Treat it as the baseline. If another model can't beat it, it isn't adding value for that fund.",
  },
  {
    number: "02",
    title: "Check the trend shape",
    description: "A clean, steady climb favours Linear Regression. Choppy, regime-shifting movement favours Random Forest.",
  },
  {
    number: "03",
    title: "Compare, don't assume",
    description: "Use the Model Comparison view to see accuracy side by side rather than picking a model on reputation alone.",
  },
];

export default function UnderstandingModels() {
  return (
      <div className="about-page">

        {/* HERO */}
        <section className="about-hero">

          <div className="about-hero-meta">
            <span>MODEL GUIDE</span>
            <span>01</span>
          </div>

          <h1 className="about-title">
            How the Forecasting{" "}
            <span>Models Work</span>
          </h1>

          <p className="about-lead">
            Three approaches to predicting NAV — from a simple statistical
            baseline to ensemble machine learning — explained so you can read
            the forecasts with context, not just trust a number.
          </p>

        </section>


        {/* AMC / NAV PRIMER */}
        <section className="about-section about-overview">

          <div className="about-section-index">
            02
          </div>

          <div className="about-section-content">

            <div className="about-kicker">
              BEFORE YOU FORECAST
            </div>

            <h2>
              A quick primer on
              <span> AMCs and NAV.</span>
            </h2>

            <p>
              An AMC (Asset Management Company) is the firm that pools money
              from investors and manages it in the form of mutual funds — for
              example HDFC, SBI, or ICICI Prudential. Each AMC runs several
              funds, and each fund tracks its own Net Asset Value (NAV), the
              per-unit price used throughout this app.
            </p>

            <p>
              Selecting an AMC on the Dashboard narrows the fund list down to
              that AMC's own funds, so the forecasting models below always
              train on a single fund's NAV history at a time.
            </p>

          </div>

        </section>


        {/* MODELS */}
        <section className="about-section capabilities-section">

          <div className="about-section-heading">

            <div>
              <div className="about-kicker">
                FORECASTING MODELS
              </div>

              <h2>
                Three ways to
                <span> predict future NAV.</span>
              </h2>
            </div>

            <div className="about-section-index">
              03
            </div>

          </div>


          <div className="model-showcase-grid">

            {MODELS.map((m) => (
                <article className="model-showcase-card" key={m.number}>

                  <div className="model-showcase-top">
                    <span className="model-showcase-number">{m.number}</span>
                    <span className="model-showcase-icon">{m.icon}</span>
                  </div>

                  <h3>{m.name}</h3>
                  <p className="model-showcase-desc">{m.desc}</p>

                  <div className="model-showcase-subheading">Best Use Cases</div>
                  <ul className="model-showcase-list">
                    {m.useCases.map((u) => (
                        <li key={u}>{u}</li>
                    ))}
                  </ul>

                  <div className="model-showcase-subheading">Advantages</div>
                  <ul className="model-showcase-list">
                    {m.advantages.map((a) => (
                        <li key={a}>{a}</li>
                    ))}
                  </ul>

                </article>
            ))}

          </div>

        </section>


        {/* CHOOSING A MODEL */}
        <section className="about-section process-section">

          <div className="about-section-heading">

            <div>
              <div className="about-kicker">
                READING THE FORECASTS
              </div>

              <h2>
                How to choose
                <span> between them.</span>
              </h2>
            </div>

            <div className="about-section-index">
              04
            </div>

          </div>


          <div className="process-track">

            {CHOOSING.map((item, index) => (
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

                  {index < CHOOSING.length - 1 && (
                      <div className="process-line" />
                  )}

                </React.Fragment>
            ))}

          </div>

        </section>


        {/* GLOSSARY */}
        <section className="about-section technology-section">

          <div className="about-section-heading">

            <div>
              <div className="about-kicker">
                QUICK GLOSSARY
              </div>

              <h2>
                Terms used
                <span> throughout this app.</span>
              </h2>
            </div>

            <div className="about-section-index">
              05
            </div>

          </div>


          <div className="technology-grid">

            {GLOSSARY.map((term) => (
                <div className="technology-card" key={term.name}>
                  <h3>{term.name}</h3>
                  <p>{term.description}</p>
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
              NO SINGLE SOURCE OF TRUTH
            </div>

            <h2>
              Use models as guidance,
              <span> not certainty.</span>
            </h2>

            <p>
              No forecasting model can predict the market with certainty.
              These models are here to help you understand different ways a
              fund's NAV might move — compare them on the Model Comparison
              page rather than relying on any single prediction.
            </p>

          </div>

        </section>

      </div>
  );
}