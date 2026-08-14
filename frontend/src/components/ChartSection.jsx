import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* Dark, theme-matched tooltip (replaces Recharts' default white box) */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={tooltipStyles.box}>
      <div style={tooltipStyles.label}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={tooltipStyles.row}>
          <span style={{ ...tooltipStyles.dot, background: p.color || p.fill }} />
          <span style={tooltipStyles.name}>{p.name}</span>
          <span style={tooltipStyles.value}>
            {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Compact sparkline tooltip for the KPI card (no legend, single value) */
function SparkTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={tooltipStyles.sparkBox}>
      {typeof payload[0].value === "number" ? payload[0].value.toFixed(2) : payload[0].value}
    </div>
  );
}

/* First-to-last % change for a numeric series */
function pctChange(values) {
  const nums = values.filter((v) => typeof v === "number" && !Number.isNaN(v));
  if (nums.length < 2 || nums[0] === 0) return 0;
  return ((nums[nums.length - 1] - nums[0]) / Math.abs(nums[0])) * 100;
}

function KPIHeadline({ label, value, change, chart }) {
  const positive = change >= 0;
  return (
    <div style={kpi.col}>
      <div style={kpi.label}>{label}</div>
      <div style={kpi.value}>{value}</div>
      <div
        style={{
          ...kpi.badge,
          color: positive ? "#4ade80" : "#f87171",
          background: positive ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)",
        }}
      >
        {positive ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
      </div>
      <div style={kpi.chartWrap}>{chart}</div>
    </div>
  );
}

export default function ChartSection({ actual = [], predicted = [], dates = [], modelData = [] }) {
  if (dates.length === 0 && modelData.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyTitle}>No prediction data yet</div>
        <div style={styles.emptySubtitle}>Select a fund and run a prediction to see actual vs. predicted NAV and model comparisons here.</div>
      </div>
    );
  }

  const chartData = dates.map((d, i) => ({
    date: d,
    actual: actual[i] || 0,
    predicted: predicted[i] || 0,
  }));

  const safeModelData = modelData;

  /* Auto-scale the Y axis to the data instead of always starting at 0 —
     NAV values often sit in a narrow band (e.g. 200-230), and a 0-based
     axis flattens all the real movement into a thin strip near the top. */
  const makeDomain = (values) => {
    const nums = values.filter((v) => typeof v === "number" && !Number.isNaN(v));
    if (!nums.length) return [0, "auto"];
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const pad = Math.max((max - min) * 0.15, 1);
    return [Math.floor(min - pad), Math.ceil(max + pad)];
  };

  const modelDomain = makeDomain(safeModelData.flatMap((d) => [d.DRIFT, d.LINEAR, d.RF]));

  const actualValues = chartData.map((d) => d.actual);
  const predictedValues = chartData.map((d) => d.predicted);
  const actualLast = actualValues[actualValues.length - 1] || 0;
  const predictedLast = predictedValues[predictedValues.length - 1] || 0;
  const actualChange = pctChange(actualValues);
  const predictedChange = pctChange(predictedValues);

  return (
    <div style={styles.grid}>
      {/* ---- KPI-style Actual vs Predicted comparison card ---- */}
      <div style={styles.kpiCard}>
        <h2 style={styles.kpiTitle}>Actual vs. Predicted Comparison</h2>

        <div style={kpi.row}>
          <KPIHeadline
            label="Actual NAV"
            value={actualLast.toFixed(2)}
            change={actualChange}
            chart={
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
                  <Tooltip content={<SparkTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#7fb3ff"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            }
          />

          <KPIHeadline
            label="Predicted NAV"
            value={predictedLast.toFixed(2)}
            change={predictedChange}
            chart={
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={36} />
                  <Tooltip content={<SparkTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="predicted" radius={[3, 3, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill="#7fb3ff" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            }
          />
        </div>
      </div>

      {/* ---- Model comparison card (unchanged layout, refined style) ---- */}
      <div className="premium-card" style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Model Prediction Comparison</h2>
          <span style={styles.subtitle}>Forecasted NAV by model across the horizon</span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safeModelData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
            <YAxis domain={modelDomain} stroke="var(--muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
            <Legend wrapperStyle={styles.legend} iconType="circle" iconSize={9} />
            <Line type="monotone" dataKey="DRIFT" stroke="#00eaff" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="LINEAR" stroke="#ffc846" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="RF" stroke="#48ff5a" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  emptyState: {
    background: "#05070a",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: "48px 26px",
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#f5f7fa",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: "var(--muted)",
    maxWidth: 420,
    margin: "0 auto",
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 20,
  },
  kpiCard: {
    background: "#05070a",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: "24px 26px 20px",
  },
  kpiTitle: {
    margin: "0 0 22px",
    fontSize: 19,
    fontWeight: 700,
    color: "#f5f7fa",
    letterSpacing: 0.2,
  },
  card: {
    padding: "22px 22px 18px",
  },
  headerRow: {
    marginBottom: 6,
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: "var(--accent-2)",
    letterSpacing: 0.2,
  },
  subtitle: {
    display: "block",
    marginTop: 4,
    fontSize: 12.5,
    color: "var(--muted)",
    opacity: 0.8,
    fontWeight: 500,
  },
  legend: {
    fontSize: 12.5,
    color: "var(--text)",
    paddingTop: 8,
  },
};

const kpi = {
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 28,
  },
  col: {
    minWidth: 0,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#9ca3af",
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: 800,
    color: "#f5f7fa",
    letterSpacing: 0.2,
    lineHeight: 1.1,
  },
  badge: {
    display: "inline-block",
    marginTop: 10,
    marginBottom: 14,
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  },
  chartWrap: {
    marginLeft: -4,
  },
};

const tooltipStyles = {
  box: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "10px 14px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.45)",
  },
  sparkBox: {
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
    color: "#f5f7fa",
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
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  name: {
    fontWeight: 600,
  },
  value: {
    marginLeft: "auto",
    fontWeight: 700,
    color: "#fff",
  },
};
