import React, { useState } from 'react'
import {
    Row,
    Accordion,
    Table,
    Spinner
} from '@themesberg/react-bootstrap'
import { TournamentDashboardHeader } from '../../constants';
import { timeZones } from '../../../Dashboard/constants';
import { getItem } from '../../../../utils/storageUtils';
import { convertToTimeZone, getFormattedTimeZoneOffset } from '../../../../utils/helper';
import { getDateTime } from '../../../../utils/dateFormatter';


const TournamentAccordion = ({ activeToggleHeader, list, tournamentData, tournamentBootedLoading }) => {

    const [activeAccordionKey, setActiveAccordionKey] = useState('');
    const timeZone = getItem("timezone");
    const timezoneOffset = timeZone != null ? timeZones.find(x => x.code === timeZone).value : getFormattedTimeZoneOffset();

    const TournamentDashboardHeaderModified = TournamentDashboardHeader
        .filter((header) => {
            if (
                ["scWinAmount", "gcWinAmount", "Winner"].includes(header?.labelKey) &&
                activeToggleHeader === "Booted Player"
            ) {
                return false;
            }
            return true;
        })
        .map((header) => {
            if (header.labelKey === "scWinAmount") {
                return { ...header, labelKey: "Rewarded SC" };
            }
            if (header.labelKey === "gcWinAmount") {
                return { ...header, labelKey: "Rewarded GC" };
            }
            return header;
        });

    return (
        <Accordion activeKey={activeAccordionKey}>
            <Accordion.Item eventKey={activeToggleHeader}>
                <Accordion.Header onClick={() => setActiveAccordionKey(activeAccordionKey ? '' : activeToggleHeader)}>
                    <Row className="mt-4" style={{ cursor: 'pointer' }}>
                        <h5 className="accordian-heading">
                            <span>{activeToggleHeader}</span>
                        </h5>
                    </Row>
                </Accordion.Header>
                <Accordion.Body>
                    {tournamentBootedLoading ? (  // Conditional rendering for loading state
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
                            <thead className='thead-dark'>
                                <tr>
                                    {TournamentDashboardHeaderModified.map((h, idx) => (
                                        <th key={idx}>{h.labelKey} </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>

                                {list?.length > 0 &&
                                    list?.map((data) => {
                                        return (
                                            <tr key={data?.userId}>
                                                <td>{data?.userId}</td>
                                                <td>{data?.User.username}</td>
                                                <td>{data?.User.email}</td>
                                                <td>{getDateTime(convertToTimeZone(data?.createdAt, timezoneOffset))}</td>
                                                <td>{data?.score}</td>
                                                <td>{data?.playerBet}</td>
                                                <td>{data?.playerWin}</td>
                                                {/* <td>
                                                    {tournamentData?.entryCoin === 'SC' ? data?.scBet :
                                                        tournamentData?.entryCoin === 'GC' ? data?.gcBet : '-'}
                                                </td> */}

                                                <td>{(tournamentData?.status === '2' || tournamentData?.status === '3') ? data?.scWinAmount : "-"}</td>
                                                <td>{(tournamentData?.status === '2' || tournamentData?.status === '3') ? data?.gcWinAmount : "-"}</td>

                                                <td>{data?.ggr ? data?.ggr : '-'}</td>
                                                <td>{data?.isWinner ? "Yes" : "No"}</td>
                                            </tr>
                                        );
                                    })}
                                {list?.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className='text-danger text-center'>
                                            No Data Available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default TournamentAccordion