import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from "@themesberg/react-bootstrap";
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
        { title: "Total SC Coins Credited", value: prevSummaryData?.totalScAdded, img: "/sc-credited.svg", bgColor: "#D4EDDA" },
        { title: "Total SC Coins Deducted", value: prevSummaryData?.totalScRemoved, img: "/sc-deducted.svg", bgColor: "#F8D7DA" },
        { title: "Total GC Coins Credited", value: prevSummaryData?.totalGcAdded, img: "/gc-credited.svg", bgColor: "#D1ECF1" },
        { title: "Total GC Coins Deducted", value: prevSummaryData?.totalGcRemoved, img: "/gc-deducted.svg", bgColor: "#FFF3CD" },
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
        <div className="tournament-detail-wrap">
            <Row className="w-100">
                {summaryItems.map((item, index) => (
                    <Col key={index} md={3} className="mb-3">
                        <Card className="tournament-card p-3" style={{ backgroundColor: item.bgColor, borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                            <div>
                                <h3 style={{ fontWeight: 'bold', color: '#333' }}>{item.title}</h3>
                                {loading && !StaffSCCreditSummaryData ? (
                                    <InlineLoader />
                                ) : (
                                    <h3 style={{ color: '#007bff' }}>{formatPriceWithCommas(item?.value ?? "N/A")}</h3>
                                )}
                            </div>
                            <div>
                                <img src={item.img} alt={item.title} style={{ width: "70px" }} />
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="w-100">
                {adminDetails.map((admin, index) => (
                    <Col key={index} md={4} className="mb-3">
                        <Card className="tournament-card p-4 d-flex align-items-center" style={{ borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#f8f9fa' }}>
                            <div>
                                <h3 style={{ fontSize: "24px", fontWeight: 'bold', color: '#333' }}>{admin.title}</h3>
                                {loading ? <InlineLoader /> : (
                                    <>
                                        <p className="admin-info" style={{ fontSize: "16px" }}>
                                            <strong style={{ color: "#28a745" }}>Name:</strong> <span style={{ color: "#333", fontWeight: 'bold', fontSize: "14px" }}>{admin.data?.first_name || "N/A"} {admin.data?.last_name || ""}</span>
                                        </p>
                                        <p className="admin-info" style={{ fontSize: "16px" }}>
                                            <strong style={{ color: "#007bff" }}>Email:</strong> <span style={{ color: "#555", fontSize: "14px" }}>{admin.data?.email || "N/A"}</span>
                                        </p>
                                        <p className="admin-info" style={{ fontSize: "16px" }}>
                                            <strong style={{ color: "#ffc107" }}>Amount:</strong> <span style={{ color: "#333", fontWeight: 'bold', fontSize: "14px" }}>{formatPriceWithCommas(admin.data?.amount || 0)}</span>
                                        </p>
                                        {admin.title === "Most Recent Admin Action" && (
                                            <p className="admin-info" style={{ fontSize: "16px" }}>
                                                <strong style={{ color: "#dc3545" }}>Reason:</strong> <span style={{ color: "#333", fontSize: "14px" }}>{admin.data?.reason || "N/A"}</span>
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                            <div>
                                <img src={admin.img} alt={admin.title} style={{ width: "90px" }} />
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default StaffSCCreditSummary;