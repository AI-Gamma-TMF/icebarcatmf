import React from "react";
import { Card, Row, Col } from "@themesberg/react-bootstrap";

// Format number with commas
const formatPriceWithCommas = (value) => {
    const num = Number(value);
    if (isNaN(num)) return "0";
    return num.toLocaleString();
};

// Card container style
const cardStyle = {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.08)",
    minHeight: "90px",
    border: "1px solid limegray"
};

// Text wrapper
const textContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
};

// Title text
const titleStyle = {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "4px"
};

// Value text
const valueStyle = {
    fontSize: "18px",
    fontWeight: "600"
};

// Icon style
const iconStyle = {
    width: "36px",
    height: "36px",
    objectFit: "contain",
};

const SubscriptionSummaryCards = ({ subscriptionSummaryData = {} }) => {
    const cards = [
        {
            title: "Total Active Subscriptions",
            value: subscriptionSummaryData?.totalActiveSubscription,
            icon: require("../../../assets/img/active-players.png"),
            bgClass: "blue-bg",
        },
        {
            title: "Total Users Subscribed",
            value: subscriptionSummaryData?.totalUsersSubscribed,
            icon: require("../../../assets/img/total-user.png"),
            bgClass: "green-bg",
        },
        {
            title: "Total Cancelled Subscriptions",
            value: subscriptionSummaryData?.totalCancelledSubscription,
            icon: require("../../../assets/img/spin-total-cancelled.png"),
            bgClass: "orange-bg",
        },
        {
            title: "Total Upgraded Subscriptions",
            value: subscriptionSummaryData?.totalUpgradedSubscription,
            icon: require("../../../assets/img/total-win.png"),
            bgClass: "pink-bg",
        },
        {
            title: "Cancelled Last 30 Days",
            value: subscriptionSummaryData?.totalSubscriptionCancelledLast30Days,
            icon: require("../../../assets/img/spin-total-cancelled.png"),
            bgClass: "purple-bg",
        },
        {
            title: "Renewed Last 30 Days",
            value: subscriptionSummaryData?.totalSubscriptionRenewedLast30Days,
            icon: require("../../../assets/img/tournament-ggr.png"),
            bgClass: "red-bg",
        },
        {
            title: "Monthly Recurring Subscription",
            value: subscriptionSummaryData?.monthlyRecurringSubscription,
            icon: require("../../../assets/img/total-wallet-sc.png"),
            bgClass: "cyan-bg",
        },
        {
            title: "Expected Monthly Recurring Subscription",
            value: subscriptionSummaryData?.expectedMonthlyRecurringSubscription,
            icon: require("../../../assets/img/gc-credited.svg").default,
            bgClass: "teal-bg",
        },
        {
            title: "Growth Rate MRR",
            value: subscriptionSummaryData?.growthRateMRR,
            icon: require("../../../assets/img/min-revenue.svg").default,
            valueColor:
                subscriptionSummaryData?.growthRateMRR > 0
                    ? "green"
                    : subscriptionSummaryData?.growthRateMRR < 0
                        ? "red"
                        : "black",
            bgClass: "lime-bg",
        },
        {
            title: "Average Revenue Per User",
            value: subscriptionSummaryData?.averageRevenuePerUser,
            icon: require("../../../assets/img/total-ggr-sc.svg").default,
            bgClass: "gold-bg",
        },
        {
            title: "Monthly Churn Rate",
            value: subscriptionSummaryData?.monthlyChurnRate,
            icon: require("../../../assets/img/total-seed-amount.svg").default,
            bgClass: "violet-bg",
        },
    ];

    return (
        <>
            <style>
                {`
    .blue-bg { background-color: #dbeafe; }   /* Light blue */
    .green-bg { background-color: #dcfce7; }  /* Light green */
    .orange-bg { background-color: #ffedd5; } /* Light orange */
    .pink-bg { background-color: #fce7f3; }   /* Light pink */
    .purple-bg { background-color: #ede9fe; } /* Light purple */
    .red-bg { background-color: #fee2e2; }    /* Light red */
    .cyan-bg { background-color: #cffafe; }   /* Light cyan */
    .teal-bg { background-color: #ccfbf1; }   /* Light teal */
    .lime-bg { background-color: #ecfccb; }   /* Light lime */
    .gold-bg { background-color: #fef9c3; }   /* Light gold */
    .violet-bg { background-color: #e9d5ff; } /* Light violet */
     `}
            </style>

            <Row className="mt-4">
                {cards.map((card, index) => (
                    <Col md={3} sm={6} className="mb-3" key={index}>
                        <Card style={cardStyle} className={card.bgClass}>
                            <div style={textContainerStyle}>
                                <span style={titleStyle}>{card.title}</span>
                                <span
                                    style={{
                                        ...valueStyle,
                                        color: card.valueColor || valueStyle.color,
                                    }}
                                >
                                    {formatPriceWithCommas(card.value)}
                                </span>
                            </div>
                            <img src={card.icon} alt={card.title} style={iconStyle} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default SubscriptionSummaryCards;
