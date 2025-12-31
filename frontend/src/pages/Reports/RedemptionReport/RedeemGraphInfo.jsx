
import React from "react"
import { Button } from "@themesberg/react-bootstrap";
import "./redeemRateReport.scss";

const RedeemGraphInfoPopup = ({ redeemGraphData, setShowInfoBox }) => {

    return (
        <div className="redeem-graph-info">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="redeem-graph-info__title">Graph Info</h6>
                <Button
                    variant="secondary"
                    size="sm"
                    className="redeem-graph-info__close"
                    onClick={() => setShowInfoBox(false)}
                >
                    ×
                </Button>
            </div>

            <ul className="redeem-graph-info__list">
                {redeemGraphData?.datasets
                    ?.filter((data) => data?.borderColor)
                    ?.map((ds) => (
                        <li key={ds.label}>
                            <span style={{ color: ds.borderColor }}>{ds.label}</span>
                        </li>
                    ))}
            </ul>
        </div>
    )
}

export default RedeemGraphInfoPopup