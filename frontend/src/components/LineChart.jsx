import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function LineChart({ dates, history }) {
    return (
        <div className="chart-wrapper">
            <h3>NAV Trend</h3>
            <Line
                data={{
                    labels: dates,
                    datasets: [
                        {
                            label: "NAV",
                            data: history,
                            borderColor: "#00eaff",
                            borderWidth: 3,
                            pointBackgroundColor: "#00eaff",
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false
                }}
            />
        </div>
    );
}
