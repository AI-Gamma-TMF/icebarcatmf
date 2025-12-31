import React, { useState } from "react";
import { Table, Col, Row, Card, Accordion } from "@themesberg/react-bootstrap";
import useBonusReport from "./useBonusReport";
import { InlineLoader } from "../../../components/Preloader";
import BonusGraph from "./BonusGraph";
import { formatAmountWithCommas } from "../../../utils/helper";
import "./bonusReportStyle.scss";

const BonusReport = () => {
    const {
        bonusReportData,
        loading,
        bonusRefetch,
    } = useBonusReport();

    const [accordionOpen, setAccordionOpen] = useState(false);

    const bonusTypes = bonusReportData ? Object.keys(bonusReportData) : [];
    const firstTypeKey = bonusTypes?.[0];
    const reportColumns = firstTypeKey
        ? Object.keys(bonusReportData?.[firstTypeKey] || {})
        : [];
    const colCount = (bonusTypes.length > 0 ? 1 : 0) + reportColumns.length;

    const handleAccordionToggle = () => {
        setAccordionOpen((prev) => {
            const nextState = !prev;
            if (nextState) {
                bonusRefetch();
            }
            return nextState;
        });
    };

    return (
        <>
            <div className="bonus-report-page dashboard-typography">
                <Row className="d-flex align-items-center mb-2">
                    <Col sm={12}>
                        <h3 className="bonus-report-page__title">Bonus Report</h3>
                        <div className="bonus-report-page__subtitle">
                            View bonus trends and SC bonus breakdown for the selected time window.
                        </div>
                    </Col>
                </Row>

                <Row className="mt-0">
                    <Col md={12} sm={12} className="mb-2">
                        <Card className="p-2 bonus-report-page__card">
                            <BonusGraph />
                        </Card>
                    </Col>
                </Row>

                <Accordion
                    className="bonus-report-accordion mt-2"
                    activeKey={accordionOpen ? "0" : null}
                >
                    <Accordion.Item eventKey="0">
                        <Accordion.Header onClick={handleAccordionToggle}>
                            Bonus Report Table
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="bonus-report-note">
                                Note: This table displays only SC Bonus data.
                            </div>

                            <div className="table-responsive bonus-report-table-wrap">
                                <Table
                                    hover
                                    size="sm"
                                    className="dashboard-data-table bonus-report-table text-center"
                                >
                                    <thead>
                                        <tr>
                                            {bonusTypes.length > 0 ? <th>Bonus Type</th> : null}
                                            {reportColumns.map((reportKey, idx) => (
                                                <th key={idx}>
                                                    {reportKey.replace(/_/g, " ")}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {loading && bonusTypes.length === 0 ? (
                                            <tr>
                                                <td colSpan={Math.max(colCount, 1)} className="text-center">
                                                    <InlineLoader />
                                                </td>
                                            </tr>
                                        ) : bonusTypes.length > 0 ? (
                                            <>
                                                {bonusTypes.map((bonusTypeKey) => (
                                                    <tr key={bonusTypeKey}>
                                                        <td className="text-capitalize">
                                                            {bonusTypeKey.replace(/([a-z])([A-Z])/g, "$1 $2")}
                                                        </td>
                                                        {reportColumns.map((reportKey) => (
                                                            <td key={reportKey}>
                                                                {formatAmountWithCommas(
                                                                    bonusReportData?.[bonusTypeKey]?.[reportKey]?.scBonus ?? "-"
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}

                                                {loading ? (
                                                    <tr>
                                                        <td colSpan={Math.max(colCount, 1)} className="text-center">
                                                            <InlineLoader />
                                                        </td>
                                                    </tr>
                                                ) : null}
                                            </>
                                        ) : (
                                            <tr>
                                                <td colSpan={Math.max(colCount, 1)} className="text-center">
                                                    <span className="bonus-report-empty">No data Found</span>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        </>
    );
};

export default BonusReport;
