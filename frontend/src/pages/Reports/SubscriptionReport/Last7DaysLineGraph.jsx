import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Spinner } from "@themesberg/react-bootstrap";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Last7DaysLineGraph = ({ labels, monthlyData, yearlyData, metaInfo, loading }) => {

    const data = {
        labels,
        datasets: [
            {
                label: "Monthly",
                data: monthlyData,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4
            },
            {
                label: "Yearly",
                data: yearlyData,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAscpectRatio: false,
        animation: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const index = context.dataIndex;
                        const datasetLabel = context.dataset.label;
                        const info = metaInfo[index][datasetLabel.toLowerCase()] || [];

                        const countText = `${datasetLabel}: ${context.formattedValue}`;
                        const subsText = info.map(sub => `${sub.name} (ID: ${sub.subscriptionId})`).join(", ");

                        return subsText ? [countText, `Subs: ${subsText}`] : countText;
                    }
                }
            },
            legend: {
                position: "top"
            },
            title: {
                display: true,
                text: "Last 7 Days Subscriptions"
            }
        },
        scales: {
            x: {
                title: { display: true, text: "Date" },
            },
            y: {
                title: { display: true, text: "Count" },
                beginAtZero: true
            }
        }
    };

    return <>
        <div style={{ minHeight: "250px" }}>
            <h2>Last 7 Days Subscription</h2>
            {loading ? (
                <div className="loader" style={{ textAlign: "center", padding: "50px" }}>
                    <span>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    </span>
                </div>
            ) : (
                <>
                    <Line data={data} options={options} />
                </>
            )}
        </div>
    </>
};

export default Last7DaysLineGraph;
