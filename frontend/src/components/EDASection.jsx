import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

/* Theme-matched tooltip (mirrors ChartSection's dark tooltip style) */
function EDATooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
      <div style={tooltipStyles.box}>
        <div style={tooltipStyles.label}>Point #{label}</div>
        <div style={tooltipStyles.row}>
          <span style={tooltipStyles.dot} />
          <span style={tooltipStyles.name}>NAV</span>
          <span style={tooltipStyles.value}>
          {typeof payload[0].value === "number"
              ? payload[0].value.toFixed(2)
              : payload[0].value}
        </span>
        </div>
      </div>
  );
}

function riskBadgeClass(riskLevel) {
  const key = (riskLevel || "").toString().toLowerCase();

  if (key.includes("very")) return "risk-badge risk-very-high";
  if (key.includes("high")) return "risk-badge risk-high";
  if (key.includes("medium") || key.includes("moderate"))
    return "risk-badge risk-medium";
  if (key.includes("low")) return "risk-badge risk-low";

  return "risk-badge risk-medium";
}

function CollapsibleSection({ open, onToggle, title, subtitle, children }) {
  return (
      <div className="eda-collapsible">
        <button
            type="button"
            className="eda-toggle-row"
            onClick={onToggle}
            aria-expanded={open}
        >
          <div>
            <div className="eda-toggle-title">{title}</div>
            {subtitle && <div className="eda-toggle-subtitle">{subtitle}</div>}
          </div>

          <svg
              className={`eda-toggle-chevron ${open ? "is-open" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
          >
            <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && <div className="eda-collapse-panel">{children}</div>}
      </div>
  );
}

export default function EDASection({ eda }) {
  const [showDataset, setShowDataset] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  const history = eda?.navValues || [];
  const dates = eda?.dates || [];

  const mean = eda?.meanNav || 0;
  const stddev = eda?.stdDeviation || 0;
  const volatility = eda?.volatility || 0;
  const riskLevel = eda?.riskLevel || "N/A";

  const chartData = useMemo(
      () => history.map((v, i) => ({ index: i + 1, nav: v })),
      [history]
  );

  const sumSquared = useMemo(
      () => history.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0),
      [history, mean]
  );

  const rangeMin = history.length ? Math.min(...history) : 0;
  const rangeMax = history.length ? Math.max(...history) : 0;

  if (!eda || !history.length) return null;

  return (
      <div className="card eda-card">

        {/* HEADER */}
        <div className="section-head eda-header">
          <div>
            <div className="section-eyebrow">EXPLORATORY DATA ANALYSIS</div>
            <h2 className="section-title eda-title">NAV Performance Overview</h2>
          </div>

          <span className={riskBadgeClass(riskLevel)}>{riskLevel} Risk</span>
        </div>

        {/* SUMMARY STAT CARDS */}
        <div className="eda-grid">
          <div className="stat-card">
            <div className="stat-key">Mean NAV</div>
            <div className="stat-value">{mean.toFixed(2)}</div>
          </div>

          <div className="stat-card">
            <div className="stat-key">Std. Deviation</div>
            <div className="stat-value">{stddev.toFixed(2)}</div>
          </div>

          <div className="stat-card">
            <div className="stat-key">Volatility</div>
            <div className="stat-value">{volatility.toFixed(2)}%</div>
          </div>

          <div className="stat-card">
            <div className="stat-key">NAV Range</div>
            <div className="stat-value eda-range-value">
              {rangeMin.toFixed(2)}
              <span className="eda-range-sep">–</span>
              {rangeMax.toFixed(2)}
            </div>
          </div>
        </div>

        {/* AREA CHART */}
        <div className="eda-chart-card">
          <div className="eda-chart-heading">
            <span>NAV Trend</span>
            <span className="eda-chart-count">{history.length} data points</span>
          </div>

          <div className="eda-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="edaNavFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-2)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--accent-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="index" stroke="var(--muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip content={<EDATooltip />} />

                <Area
                    type="monotone"
                    dataKey="nav"
                    stroke="var(--accent-2)"
                    strokeWidth={2}
                    fill="url(#edaNavFill)"
                />

                <ReferenceLine
                    y={mean}
                    stroke="var(--warning)"
                    strokeDasharray="4 4"
                    label={{
                      value: "Mean",
                      position: "insideTopRight",
                      fill: "var(--warning)",
                      fontSize: 11,
                    }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DATASET PREVIEW */}
        <CollapsibleSection
            open={showDataset}
            onToggle={() => setShowDataset((v) => !v)}
            title="Fund Dataset Preview"
            subtitle={`${history.length} NAV records`}
        >
          <div className="eda-table-scroll">
            <table className="alg-table">
              <thead>
              <tr>
                <th>Date</th>
                <th>NAV</th>
              </tr>
              </thead>
              <tbody>
              {history.map((value, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                    <td>{dates[i] || "-"}</td>
                    <td>{typeof value === "number" ? value.toFixed(2) : value}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* CALCULATION BREAKDOWN */}
        <CollapsibleSection
            open={showCalc}
            onToggle={() => setShowCalc((v) => !v)}
            title="How Mean & Std. Deviation Are Calculated"
            subtitle="Step-by-step statistical breakdown"
        >
          <div className="eda-calc-formula">
            <div>
              <strong>Mean</strong> = {mean.toFixed(4)}
            </div>
            <div className="eda-calc-formula-sub">
              Std. Deviation = √( Σ (NAV − Mean)² / n )
            </div>
          </div>

          <div className="eda-table-scroll">
            <table className="alg-table">
              <thead>
              <tr>
                <th>NAV</th>
                <th>NAV − Mean</th>
                <th>(NAV − Mean)²</th>
              </tr>
              </thead>
              <tbody>
              {history.map((value, i) => {
                const diff = value - mean;
                const sq = diff * diff;

                return (
                    <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                      <td>{value.toFixed(2)}</td>
                      <td className={diff < 0 ? "eda-negative" : "eda-positive"}>
                        {diff.toFixed(4)}
                      </td>
                      <td>{sq.toFixed(4)}</td>
                    </tr>
                );
              })}
              </tbody>
            </table>
          </div>

          <div className="eda-calc-summary">
            <div>
              Σ (NAV − Mean)² = <strong>{sumSquared.toFixed(4)}</strong>
            </div>
            <div>
              Std. Deviation = √({sumSquared.toFixed(4)} / {history.length}) ={" "}
              <strong>{stddev.toFixed(4)}</strong>
            </div>
            <div>
              Volatility = <strong>{volatility.toFixed(2)}%</strong>
            </div>
          </div>
        </CollapsibleSection>

      </div>
  );
}

/* Local themed tooltip styles — matches ChartSection.jsx's idiom */
const tooltipStyles = {
  box: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "10px 14px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.45)",
  },
  label: {
    color: "var(--muted)",
    fontSize: 11.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "var(--text)",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
    background: "var(--accent-2)",
  },
  name: {
    fontWeight: 600,
    color: "var(--muted)",
  },
  value: {
    fontWeight: 700,
    marginLeft: "auto",
  },
};