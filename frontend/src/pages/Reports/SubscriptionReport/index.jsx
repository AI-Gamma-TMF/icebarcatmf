import React, { useEffect, useState } from "react";
import { Table, Col, Row, Card, Accordion } from "@themesberg/react-bootstrap";
import SubscriptionSummaryCard from "./SubscriptionSummaryCard";
import useSubscriptionDetail from "./useSubscriptionDetail";
import RevenueByPlanGraph from "./RevenueByPlanGraph";
import Last7DaysLineGraph from "./Last7DaysLineGraph";


const formateRevenuePerPlanData = (responseData = [], subscriptionKVM = {}) => {
    const labels = [];
    const monthlyData = [];
    const yearlyData = [];
    const subscriptionIds = [];

    responseData?.forEach(({ planType, revenue, subscriptionId }) => {
        const subName = subscriptionKVM[subscriptionId] || `ID ${subscriptionId}`;

        if (!labels.includes(subName)) {
            labels.push(subName);
            monthlyData.push(planType === "monthly" ? revenue : 0);
            yearlyData.push(planType === "yearly" ? revenue : 0);
            subscriptionIds.push(subscriptionId);
        } else {
            const idx = labels.indexOf(subName);
            if (planType === "monthly") monthlyData[idx] = revenue;
            if (planType === "yearly") yearlyData[idx] = revenue;
        }
    });

    return { labels, monthlyData, yearlyData, subscriptionIds };
};

const formatLast7DaysLineData = (responseData = [], subscriptionKVM = {}) => {
    const dateMap = {};

    responseData?.forEach(({ subscriptionId, planType, count, joinDate }) => {
        if (!dateMap[joinDate]) {
            dateMap[joinDate] = { monthly: [], yearly: [] };
        }
        dateMap[joinDate][planType]?.push({
            subscriptionId,
            name: subscriptionKVM[subscriptionId] || `Subscription ID - ${subscriptionId}`,
            count: Number(count)
        });
    });

    const labels = Object.keys(dateMap).sort();

    const monthlyData = labels.map(date =>
        dateMap[date].monthly.reduce((sum, item) => sum + item.count, 0)
    );
    const yearlyData = labels.map(date =>
        dateMap[date].yearly.reduce((sum, item) => sum + item.count, 0)
    );

    const metaInfo = labels.map(date => ({
        monthly: dateMap[date].monthly,
        yearly: dateMap[date].yearly
    }));

    return { labels, monthlyData, yearlyData, metaInfo };
};


const SubscriptionReport = () => {
    const [revenuePerPlan, setRevenuePerPlan] = useState({
        labels: [],
        revenue: [],
    });

    const [last7DaysLine, setLast7DaysLine] = useState({
        labels: [],
        monthlyData: [],
        yearlyData: [],
        metaInfo: []
    });

    const { SubscriptionReportData, isLoading, refetch } = useSubscriptionDetail()

    useEffect(() => {
        refetch()
    }, [])

    useEffect(() => {
        const data = SubscriptionReportData?.data;
        if (data) {
            const formatted = formateRevenuePerPlanData(
                data?.revenuePerPlan,
                data?.subscriptionKVM
            );
            setRevenuePerPlan(formatted);

            const last7Line = formatLast7DaysLineData(
                data?.last7DaysSubscriptions,
                data?.subscriptionKVM
            );
            setLast7DaysLine(last7Line);
        }
    }, [
        SubscriptionReportData?.data
    ]);


    return (
        <>
            <Row>
                <Col sm={12}><h3>Subscription Report</h3></Col>
            </Row>

            <Row>
                <SubscriptionSummaryCard
                    subscriptionSummaryData={SubscriptionReportData?.data} />
            </Row>

            <Row>
                <Col lg={6} md={6} sm={6} className='mt-3'>
                    <Card className='p-2'>
                        <Last7DaysLineGraph
                            labels={last7DaysLine.labels}
                            monthlyData={last7DaysLine.monthlyData}
                            yearlyData={last7DaysLine.yearlyData}
                            metaInfo={last7DaysLine.metaInfo}
                            loading={isLoading}
                        />
                    </Card>
                </Col>
                <Col lg={6} md={6} sm={6} className='mt-3'>
                    <Card className='p-2'>
                        <RevenueByPlanGraph
                            labels={revenuePerPlan.labels}
                            monthlyData={revenuePerPlan.monthlyData}
                            yearlyData={revenuePerPlan.yearlyData}
                            subscriptionIds={revenuePerPlan.subscriptionIds}
                            loading={isLoading}
                        />
                    </Card>
                </Col>
            </Row>

        </>
    );
};

export default SubscriptionReport;
