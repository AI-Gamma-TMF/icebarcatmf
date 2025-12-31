import React, { useEffect, useState } from 'react';
import { Row, Col } from "@themesberg/react-bootstrap";
import { formatPriceWithCommas } from '../../../utils/helper';
import { InlineLoader } from '../../../components/Preloader';

const StaffSCCreditSummary = ({ StaffSCCreditSummaryData }) => {
    const [loading, setLoading] = useState(true);

    const [prevSummaryData, setPrevSummaryData] = useState(null);

    useEffect(() => {
        if (StaffSCCreditSummaryData && Object.keys(StaffSCCreditSummaryData).length > 0) {
            setLoading(false);
            setPrevSummaryData(StaffSCCreditSummaryData); // Store previous data
        }
    }, [StaffSCCreditSummaryData]);

    const summaryItems = [
        { title: "Total SC Coins Credited", value: prevSummaryData?.totalScAdded, img: "/sc-credited.svg", accentClass: "sc-stack" },
        { title: "Total SC Coins Deducted", value: prevSummaryData?.totalScRemoved, img: "/sc-deducted.svg", accentClass: "ggrsc-balance" },
        { title: "Total GC Coins Credited", value: prevSummaryData?.totalGcAdded, img: "/gc-credited.svg", accentClass: "sc-win" },
        { title: "Total GC Coins Deducted", value: prevSummaryData?.totalGcRemoved, img: "/gc-deducted.svg", accentClass: "usc-balance" },
    ];

    const adminDetails = [
        {
            title: "Admin with Highest SC Credited",
            data: prevSummaryData?.highestSc,
            img: "/highest-sc-credited-admin.svg",
        },
        {
            title: "Admin with Highest GC Credited",
            data: prevSummaryData?.highestGc,
            img: "/highest-gc-credited-admin.svg",
        },
        {
            title: "Most Recent Admin Action",
            data: prevSummaryData?.mostRecent,
            img: "/most-recent-admin.svg",
        }
    ];

    return (
        <div className="admin-coins-summary">
            <div className="admin-coins-summary__kpis dashboard-boxes-container">
                {summaryItems.map((item, index) => (
                    <div key={index} className={`dashboard-box ${item.accentClass}`}>
                        <div className="ticker-label">
                            <img src={item.img} alt={item.title} />
                            <label>{item.title}</label>
                        </div>
                        <div className="value-wrap">
                            {loading && !StaffSCCreditSummaryData ? (
                                <InlineLoader />
                            ) : (
                                <div className="live-report-data">
                                    {formatPriceWithCommas(item?.value ?? "N/A")}
                                </div>
                            )}
                            <div className="new-icon">
                                <img src={item.img} alt={item.title} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Row className="g-3">
                {adminDetails.map((admin, index) => (
                    <Col key={index} md={4}>
                        <div className="admin-coins-highlight">
                            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: 12 }}>
                                <div style={{ minWidth: 0 }}>
                                    <h4 className="admin-coins-highlight__title">{admin.title}</h4>
                                    {loading ? (
                                        <InlineLoader />
                                    ) : (
                                        <>
                                            <p className="admin-coins-highlight__kv">
                                                <strong>Name:</strong>{" "}
                                                {admin.data?.first_name || "N/A"}{" "}
                                                {admin.data?.last_name || ""}
                                            </p>
                                            <p className="admin-coins-highlight__kv">
                                                <strong>Email:</strong> {admin.data?.email || "N/A"}
                                            </p>
                                            <p className="admin-coins-highlight__kv">
                                                <strong>Amount:</strong>{" "}
                                                {formatPriceWithCommas(admin.data?.amount || 0)}
                                            </p>
                                            {admin.title === "Most Recent Admin Action" && (
                                                <p className="admin-coins-highlight__kv">
                                                    <strong>Reason:</strong> {admin.data?.reason || "N/A"}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                                <img
                                    className="admin-coins-highlight__img"
                                    src={admin.img}
                                    alt={admin.title}
                                />
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default StaffSCCreditSummary;