
import React from "react"
import { Button } from "@themesberg/react-bootstrap";

const JackpotGraphInfoPopup = ({ jackpotGraphData, setShowInfoBox }) => {

    return (
        <div style={{
            position: 'absolute',
            top: '220px',
            right: '30px',
            width: '300px',
            zIndex: 1050,
            backgroundColor: '#fff',
            border: '1px solid #dee2e6',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            padding: '16px',
        }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 style={{ margin: 0 }}>Graph Info</h6>
                <Button variant="light" size="sm" onClick={() => setShowInfoBox(false)}>×</Button>
            </div>

            <ul>
                {jackpotGraphData.datasets.filter((data)=>data?.borderColor).map(ds => (

                    <li key={ds.label}><span style={{ color: ds.borderColor }}>{ds.label}</span></li>
                ))}
            </ul>
        </div>
    )
}

export default JackpotGraphInfoPopup