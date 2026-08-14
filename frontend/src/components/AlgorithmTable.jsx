import React from "react";

export default function AlgorithmTable({ algorithms }) {

  if (!algorithms || algorithms.length === 0) return null;

  const sorted = [...algorithms].sort((a, b) => a.rank - b.rank);

  return (

    <div className="card" style={styles.wrap}>

      <h3 style={styles.heading}>Algorithm Comparison Table</h3>

      <div style={styles.tableScroll}>

        <table style={styles.table}>

          <thead>

            <tr>

              <th style={{ ...styles.th, width: 70 }}>Rank</th>

              <th style={styles.th}>Model</th>

              <th style={styles.th}>Predicted NAV</th>

              <th style={styles.th}>Accuracy (%)</th>

              <th style={styles.th}>Rating</th>

              <th style={styles.th}>Performance</th>

            </tr>

          </thead>

          <tbody>

            {sorted.map((algo, i) => {

              const isBest = algo.rank === 1;

              return (

                <tr

                  key={algo.model ?? i}

                  className="algo-row"

                  style={{

                    background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",

                  }}

                >

                  <td style={styles.td}>{algo.rank}</td>

                  <td style={{ ...styles.td, fontWeight: 700 }}>{algo.model}</td>

                  <td style={styles.td}>{algo.predicted}</td>

                  <td style={styles.td}>{algo.accuracy}%</td>

                  <td style={styles.td}>{algo.rating ?? "—"}</td>

                  <td style={styles.td}>

                    {isBest ? (

                      <span style={styles.bestBadge}>Best Model</span>

                    ) : (

                      "Good"

                    )}

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

      <style>{`

        .algo-row { transition: background 0.15s ease; }

        .algo-row:hover { background: rgba(0, 212, 255, 0.06) !important; }

        @media (max-width: 640px) {

          .card table { min-width: 560px; }

        }

      `}</style>

    </div>

  );

}

const styles = {

  wrap: {

    padding: "22px 24px 26px",

  },

  heading: {

    margin: "0 0 18px",

    color: "var(--accent-2)",

    fontSize: 19,

    fontWeight: 700,

    letterSpacing: 0.2,

  },

  tableScroll: {

    overflowX: "auto",

    borderRadius: 12,

    border: "1px solid var(--border)",

  },

  table: {

    width: "100%",

    borderCollapse: "separate",

    borderSpacing: 0,

  },

  th: {

    textAlign: "left",

    padding: "12px 16px",

    fontSize: 12,

    fontWeight: 700,

    textTransform: "uppercase",

    letterSpacing: 0.5,

    color: "var(--muted)",

    background: "var(--bg-2)",

    borderBottom: "1px solid var(--border)",

    position: "sticky",

    top: 0,

  },

  td: {

    padding: "12px 16px",

    fontSize: 14,

    color: "var(--text)",

    borderBottom: "1px solid rgba(255,255,255,0.05)",

    whiteSpace: "nowrap",

  },

  bestBadge: {

    fontSize: 12,

    fontWeight: 700,

    color: "#022412",

    background: "linear-gradient(135deg,#5ffbc0, var(--success))",

    padding: "3px 10px",

    borderRadius: 999,

  },

};
