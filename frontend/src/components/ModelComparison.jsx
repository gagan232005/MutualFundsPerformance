import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

export default function ModelComparison({
                                            modelData = [],
                                        }) {

    const chartData = useMemo(() => {

        if (!Array.isArray(modelData)) {
            return [];
        }

        return modelData.map(
            (item, index) => {

                const drift =
                    Number(
                        item?.drift ??
                        item?.DRIFT ??
                        item?.Drift ??
                        0
                    );

                const linear =
                    Number(
                        item?.linear ??
                        item?.LINEAR ??
                        item?.Linear ??
                        0
                    );

                const rf =
                    Number(
                        item?.rf ??
                        item?.RF ??
                        item?.randomForest ??
                        item?.random_forest ??
                        0
                    );

                const values = [
                    drift,
                    linear,
                    rf,
                ].filter(
                    (value) =>
                        Number.isFinite(value)
                );

                return {
                    month: `M${index + 1}`,

                    drift,
                    linear,
                    rf,

                    min:
                        values.length
                            ? Math.min(...values)
                            : 0,

                    max:
                        values.length
                            ? Math.max(...values)
                            : 0,
                };
            }
        );

    }, [modelData]);

    if (!chartData.length) {
        return (
            <div className="chart-empty">
                No model comparison data available.
            </div>
        );
    }

    return (
        <section className="comparison-card">

            <div className="comparison-header">

                <div>

          <span className="eyebrow">
            FORECAST ANALYSIS
          </span>

                    <h2>
                        Forecast Model Spread
                    </h2>

                    <p>
                        Compare how the forecasting models
                        estimate future NAV over the selected
                        horizon.
                    </p>

                </div>

                <div className="chart-stat">

          <span>
            FORECAST HORIZON
          </span>

                    <strong>
                        {chartData.length} Months
                    </strong>

                </div>

            </div>

            <div className="chart-legend-note">

                <span className="range-indicator"></span>

                <span>
          Shaded region represents the range
          between model estimates.
        </span>

            </div>

            <div className="professional-chart">

                <ResponsiveContainer
                    width="100%"
                    height={430}
                >

                    <ComposedChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 25,
                            left: 5,
                            bottom: 10,
                        }}
                    >

                        <defs>

                            <linearGradient
                                id="forecastRange"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="var(--chart-accent)"
                                    stopOpacity={0.28}
                                />

                                <stop
                                    offset="100%"
                                    stopColor="var(--chart-accent)"
                                    stopOpacity={0.03}
                                />
                            </linearGradient>

                        </defs>

                        <CartesianGrid
                            stroke="var(--chart-grid)"
                            strokeDasharray="3 6"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="month"
                            tick={{
                                fill: "var(--chart-text)",
                                fontSize: 12,
                            }}
                            axisLine={{
                                stroke:
                                    "var(--chart-axis)",
                            }}
                            tickLine={false}
                        />

                        <YAxis
                            tick={{
                                fill: "var(--chart-text)",
                                fontSize: 12,
                            }}
                            axisLine={false}
                            tickLine={false}
                            width={55}
                            domain={[
                                "dataMin - 0.5",
                                "dataMax + 0.5",
                            ]}
                        />

                        <Tooltip
                            contentStyle={{
                                background:
                                    "var(--tooltip-bg)",
                                border:
                                    "1px solid var(--border)",
                                borderRadius: "12px",
                                boxShadow:
                                    "var(--shadow-md)",
                            }}
                            labelStyle={{
                                color:
                                    "var(--text-primary)",
                                fontWeight: 600,
                            }}
                            itemStyle={{
                                color:
                                    "var(--text-primary)",
                            }}
                            formatter={(value) =>
                                Number(value).toFixed(2)
                            }
                        />

                        <Area
                            type="monotone"
                            dataKey="max"
                            stroke="none"
                            fill="url(#forecastRange)"
                            fillOpacity={1}
                            tooltipType="none"
                        />

                        <Area
                            type="monotone"
                            dataKey="min"
                            stroke="none"
                            fill="var(--surface)"
                            fillOpacity={1}
                            tooltipType="none"
                        />

                        <Line
                            type="monotone"
                            dataKey="drift"
                            name="Drift"
                            stroke="#38bdf8"
                            strokeWidth={2.5}
                            dot={{
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="linear"
                            name="Linear Regression"
                            stroke="#f59e0b"
                            strokeWidth={2.5}
                            dot={{
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="rf"
                            name="Random Forest"
                            stroke="#34d399"
                            strokeWidth={2.5}
                            dot={{
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        />

                        <Legend
                            verticalAlign="bottom"
                            height={35}
                            iconType="line"
                            wrapperStyle={{
                                color:
                                    "var(--text-secondary)",
                                fontSize: "12px",
                            }}
                        />

                    </ComposedChart>

                </ResponsiveContainer>

            </div>

        </section>
    );
}