import React, { useState } from "react";
import { Table, Col, Row, Card, Accordion } from "@themesberg/react-bootstrap";
import useBonusReport from "./useBonusReport";
import { InlineLoader } from "../../../components/Preloader";
import BonusGraph from "./BonusGraph";
import { formatAmountWithCommas } from "../../../utils/helper";

const BonusReport = () => {
    const {
        bonusReportData,
        loading,
        bonusRefetch,
    } = useBonusReport();

    const [accordionOpen, setAccordionOpen] = useState(false);

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
            <Row className="mb-3">
                <Col sm={12}><h3>Bonus Report</h3></Col>
            </Row>

            <Row className='mt-0'>
                <Col md={12} sm={12} className='my-3'>
                    <Card className=' tournament-card p-2'>
                        <BonusGraph />
                    </Card>
                </Col>
            </Row>

            <Accordion className="mt-4" activeKey={accordionOpen ? "0" : null}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header onClick={handleAccordionToggle}>
                        Bonus Report Table
                    </Accordion.Header>
                    <Accordion.Body>
                        <p className="text-danger ms-3 mt-1 mb-0" style={{ fontSize: "0.9rem" }}>
                            Note: This table displays only SC Bonus data.
                        </p>
                        <Table bordered striped responsive hover size="sm" className="text-center">
                            <thead className="thead-dark">
                                <tr>
                                    {bonusReportData && Object.keys(bonusReportData)?.length > 0 && (
                                        <th>Bonus Type</th>
                                    )}
                                    {bonusReportData &&
                                        Object.keys(bonusReportData?.[Object.keys(bonusReportData)[0]] || {})?.map((reportKey, idx) => (
                                            <th key={idx}>{reportKey.replace(/_/g, ' ')}</th>
                                        ))}
                                </tr>
                            </thead>                                                                                                                
                            <tbody>                                       
                                {loading ? (
                                    <tr>
                                        <td colSpan={10} className="text-center">
                                            <InlineLoader />
                                        </td>
                                    </tr>
                                ) : bonusReportData && Object.keys(bonusReportData).length > 0 ? (
                                    Object.keys(bonusReportData)?.map((bonusTypeKey, idx) => (
                                        <tr key={idx}>
                                            <td className="text-capitalize">
                                                {bonusTypeKey.replace(/([a-z])([A-Z])/g, '$1 $2')}
                                            </td>
                                            {Object.keys(bonusReportData[bonusTypeKey])?.map((reportKey, rIdx) => (
                                                <td key={rIdx}>
                                                    {formatAmountWithCommas(bonusReportData[bonusTypeKey][reportKey]?.scBonus ?? "-")}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="text-danger text-center">
                                            No data Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>
    );
};

export default BonusReport;
