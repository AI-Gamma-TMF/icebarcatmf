
import React from "react"
import { Button } from "@themesberg/react-bootstrap";

const ScratchCardInfoPopup = ({ bonusGraphData, selectedMetric, setShowInfoBox }) => {

    const topBonusType = [...bonusGraphData.datasets]
        .map(ds => ({
            label: ds.label,
            total: ds.data.reduce((sum, val) => sum + val, 0),
        }))
        .sort((a, b) => b.total - a.total)[0];

    const totalMetricValue = bonusGraphData.datasets.reduce(
        (acc, ds) => acc + ds.data.reduce((sum, val) => sum + val, 0),
        0
    );

    const averagePerInterval = (totalMetricValue / bonusGraphData.labels.length).toFixed(2);

    return (
        <div style={{
            position: 'absolute',
            top: '220px',
            right: '30px',
            width: '350px',
            height: '500px',
            zIndex: 1050,
            backgroundColor: '#fff',
            border: '1px solid #dee2e6',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            padding: '16px',
            overflowX: 'scroll'
        }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 style={{ margin: 0 }}>Graph Info</h6>
                <Button variant="light" size="sm" onClick={() => setShowInfoBox(false)}>×</Button>
            </div>

            <p><strong>Total Intervals:</strong> {bonusGraphData.labels.length}</p>
            {/* <p><strong>Time Range:</strong> {bonusGraphData.labels[0]} to {bonusGraphData.labels[bonusGraphData.labels.length - 1]}</p> */}
            <p><strong>Total {selectedMetric.label}:</strong> {totalMetricValue.toFixed(2)}</p>
            <p><strong>Average per Interval:</strong> {averagePerInterval}</p>
            {topBonusType && (
                <p><strong>Top Bonus Type:</strong> {topBonusType.label} ({topBonusType.total.toFixed(2)})</p>
            )}

        </div>
    )
}

export default ScratchCardInfoPopup