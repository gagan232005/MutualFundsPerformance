import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const SUMMARY_COLORS = ["#4aa3ff", "#00eaff"];
const MODEL_COLORS = ["#00eaff", "#ffc846", "#48ff5a"];

function ChartTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  return (
    <div style={tooltipStyles.box}>
      <div style={tooltipStyles.row}>
        <span style={{ ...tooltipStyles.dot, background: p.color }} />
        <span style={tooltipStyles.name}>{p.name}</span>
        <span style={tooltipStyles.value}>
          {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
        </span>
      </div>
    </div>
  );
}

function CustomLegend({ items }) {
  return (
    <div style={legendStyles.wrap}>
      {items.map((item) => (
        <div key={item.name} style={legendStyles.item}>
          <span style={{ ...legendStyles.dot, background: item.color }} />
          <span style={legendStyles.label}>{item.name}</span>
          <span style={legendStyles.value}>{item.value.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}

export default function PieCharts({ actual = [], predicted = [], modelData = [] }) {
  if (actual.length === 0 && predicted.length === 0 && modelData.length === 0) {
    return (
      <div style={styles.grid}>
        <div className="premium-card" style={{ ...styles.card, ...styles.emptyState }}>
          <div style={styles.emptyTitle}>No prediction data yet</div>
          <div style={styles.emptySubtitle}>Run a prediction to see the NAV summary and model distribution here.</div>
        </div>
      </div>
    );
  }

  const actualLast = actual[actual.length - 1] || 0;
  const predictedLast = predicted[predicted.length - 1] || 0;

  const summaryData = [
    { name: "Actual NAV", value: actualLast },
    { name: "Predicted NAV", value: predictedLast },
  ];

  const growthPct = actualLast ? ((predictedLast - actualLast) / actualLast) * 100 : 0;
  const growthPositive = growthPct >= 0;

  const lastModelRow = modelData.length > 0 ? modelData[modelData.length - 1] : null;
  const comparisonData = lastModelRow
    ? [
        { name: "DRIFT", value: lastModelRow.DRIFT || 0 },
        { name: "LINEAR", value: lastModelRow.LINEAR || 0 },
        { name: "RF", value: lastModelRow.RF || 0 },
      ]
    : [
        { name: "DRIFT", value: 0 },
        { name: "LINEAR", value: 0 },
        { name: "RF", value: 0 },
      ];

  const topModel = [...comparisonData].sort((a, b) => b.value - a.value)[0];

  return (
    <div style={styles.grid}>
      <div className="premium-card" style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Prediction Summary</h2>
          <span style={styles.subtitle}>Latest actual NAV vs. latest predicted NAV</span>
        </div>

        <div style={styles.donutWrap}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={summaryData}
                dataKey="value"
                innerRadius={78}
                outerRadius={112}
                paddingAngle={2}
                stroke="none"
              >
                {summaryData.map((entry, index) => (
                  <Cell key={index} fill={SUMMARY_COLORS[index % SUMMARY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div style={styles.centerLabel}>
            <div
              style={{
                ...styles.centerValue,
                color: growthPositive ? "var(--success)" : "#ff6b6b",
              }}
            >
              {growthPositive ? "▲" : "▼"} {Math.abs(growthPct).toFixed(1)}%
            </div>
            <div style={styles.centerCaption}>Projected change</div>
          </div>
        </div>

        <CustomLegend
          items={[
            { name: "Actual NAV", value: actualLast, color: SUMMARY_COLORS[0] },
            { name: "Predicted NAV", value: predictedLast, color: SUMMARY_COLORS[1] },
          ]}
        />
      </div>

      <div className="premium-card" style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Model Distribution</h2>
          <span style={styles.subtitle}>Share of final forecasted NAV by model</span>
        </div>

        <div style={styles.donutWrap}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={comparisonData}
                dataKey="value"
                innerRadius={78}
                outerRadius={112}
                paddingAngle={2}
                stroke="none"
              >
                {comparisonData.map((entry, index) => (
                  <Cell key={index} fill={MODEL_COLORS[index % MODEL_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div style={styles.centerLabel}>
            <div style={{ ...styles.centerValue, fontSize: 18, color: "var(--text)" }}>
              {topModel?.name}
            </div>
            <div style={styles.centerCaption}>Highest forecast</div>
          </div>
        </div>

        <CustomLegend
          items={comparisonData.map((d, i) => ({
            ...d,
            color: MODEL_COLORS[i % MODEL_COLORS.length],
          }))}
        />
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 20,
    marginTop: 20,
  },
  card: {
    padding: "22px 22px 20px",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 26px",
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
  headerRow: {
    marginBottom: 4,
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
  donutWrap: {
    position: "relative",
  },
  centerLabel: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    pointerEvents: "none",
  },
  centerValue: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: 0.2,
  },
  centerCaption: {
    marginTop: 3,
    fontSize: 11,
    color: "var(--muted)",
    opacity: 0.75,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
};

const legendStyles = {
  wrap: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px 20px",
    marginTop: 14,
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 12.5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  label: {
    color: "var(--text)",
    fontWeight: 600,
  },
  value: {
    color: "var(--muted)",
    fontWeight: 700,
  },
};

const tooltipStyles = {
  box: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "8px 12px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.45)",
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
