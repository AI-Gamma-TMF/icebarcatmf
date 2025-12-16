
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Spinner } from "@themesberg/react-bootstrap";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const PriceDistributionChart = ({ labels = [], gcData = [], scData = [] }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (gcData.length >= 0 && scData.length >= 0) {
            setLoading(false);
        }
    }, [gcData, scData]);

    const data = {
        labels: labels, // X-axis labels
        datasets: [
            {
                label: "GC", // Label for the first bar
                data: gcData, // Y-axis data points
                backgroundColor: "rgba(38, 43, 64)", // Bar color
                borderColor: "rgba(38, 43, 64)", // Border color
                borderWidth: 1, // Border width
            },
            {
                label: "SC", // Label for the second bar
                data: scData, // Y-axis data points
                backgroundColor: "rgba(204, 204, 204, 1)", // Bar color
                borderColor: "rgba(204, 204, 204, 1)", // Border color
                borderWidth: 1, // Border width
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAscpectRatio: false,
        plugins: {
            legend: {
                position: "top", // Position of the legend
            },
            title: {
                display: true,
                text: "Prize Distribution", // Chart title
                font: {
                    weight: 'bold', // Make the X-axis label bold
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Rank", // Label for X-axis
                    font: {
                        weight: 'bold', // Make the X-axis label bold
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Prize Amount", // Label for Y-axis
                    font: {
                        weight: 'bold', // Make the X-axis label bold
                    },
                },
            },
        },
    };

    return (
        <div style={{ minHeight: "250px" }}>
            <h2>Prize Distribution</h2>
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
                    <Bar data={data} options={options} />
                </>
            )}
        </div>
    );
};

export default PriceDistributionChart;