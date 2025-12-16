import React, { useState } from 'react'
import {
    Button,
    Table,
} from '@themesberg/react-bootstrap'
import Trigger from '../../../components/OverlayTrigger';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { payoutTournamentData } from '../constants';
import { usePayoutTournamentMutation } from '../../../reactQuery/hooks/customMutationHook';
import { toast } from '../../../components/Toast';


const TournamentPayout = ({ tournamentData, payoutTournamentList, refetch }) => {
    const [payoutStatusShow, setPayoutStatusShow] = useState(false);
    const [itemForPayout, setItemForPayout] = useState(null);

    const { mutate: payoutTournament } = usePayoutTournamentMutation({
        onSuccess: (res) => {
            if (res?.data) {
                setPayoutStatusShow(false);
                toast(res?.data?.message, 'success');
                setTimeout(() => {
                    refetch()
                }, 500)
            }
        },
        onError: (error) => {
            setPayoutStatusShow(false);
            toast(error?.response?.data?.message || 'Error during payout', 'error');
        }
    })

    const handlePayoutSubmit = async () => {
        if (!itemForPayout) return;

        const payload = {
            tournamentId: itemForPayout
        };

        payoutTournament(payload);
    };

    const handlePayoutClick = (data) => {
        setItemForPayout(data);
        setPayoutStatusShow(true);
    };

    // // Dynamically update the headers based on the tournamentData entryCoin
    // const leaderTableHeadersModified = payoutTournamentData.filter((header) => {
    //     if (header.labelKey === 'SC Bet' && tournamentData?.entryCoin !== 'SC') {
    //         return false;  // Exclude SC Bet column if entryCoin is not SC
    //     }
    //     if (header.labelKey === 'GC Bet' && tournamentData?.entryCoin !== 'GC') {
    //         return false;  // Exclude GC Bet column if entryCoin is not GC
    //     }
    //     return true;
    // }).map((header) => {
    //     if (header.labelKey === 'Score') {
    //         if (tournamentData?.entryCoin === 'SC') {
    //             return { ...header, labelKey: 'Score (win SC)' };  // Update header for SC
    //         }
    //         if (tournamentData?.entryCoin === 'GC') {
    //             return { ...header, labelKey: 'Score (win GC)' };  // Update header for GC
    //         }
    //     }
    //     if (header.labelKey === 'SC Bet' && tournamentData?.entryCoin === 'SC') {
    //         return { ...header, labelKey: 'SC Play' };  // Change header label for SC
    //     }
    //     if (header.labelKey === 'GC Bet' && tournamentData?.entryCoin === 'GC') {
    //         return { ...header, labelKey: 'GC Play' };  // Change header label for GC
    //     }
    //     return header;
    // });

    // Check if the payout button should be disabled based on the conditions
    const isPayoutDisabled = payoutTournamentList?.data?.updatedEligibleUsers?.length === 0 ||
        payoutTournamentList?.message === 'No one win the tournament' ||
        payoutTournamentList?.data?.isPayoutCompleted;

    return (
        <>
            <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
                <thead className='thead-dark'>
                    <tr>
                        {payoutTournamentData?.map((h, idx) => (
                            <th key={idx}>{h.labelKey} </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {payoutTournamentList?.data?.updatedEligibleUsers?.length > 0 ? (
                        payoutTournamentList?.data?.updatedEligibleUsers?.map((data, _index) => {

                            return (
                                <tr key={data?.tournamentId}>
                                    <td>{data?.rank}</td>
                                    <td>
                                        <Trigger message={data?.User.username} id={data?.User.username} />
                                        <span
                                            id={data?.User.username}
                                            style={{ width: '100px', cursor: 'pointer' }}
                                            className='d-inline-block text-truncate'
                                        >
                                            {data?.User.username}
                                        </span>
                                    </td>
                                    <td>{data?.User.email}</td>
                                    <td>{data?.score}</td>
                                    <td>{data?.playerBet}</td>
                                    <td>{data?.playerWin}</td>
                                    {/* <td>{tournamentData?.entryCoin === 'SC' ? data?.scBet : data?.gcBet}</td> */}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={payoutTournamentData?.length} className='text-danger text-center'>
                                No one win the tournament
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>



            <Trigger
                message="Payout"
                id={tournamentData?.tournamentId + "payout"}
            />
            <Button
                id={tournamentData?.tournamentId + "payout"}
                className="m-1"
                size="sm"
                variant="success"
                onClick={() => handlePayoutClick(tournamentData?.tournamentId)}
                disabled={isPayoutDisabled}
            >
                Payout
            </Button>

            <ConfirmationModal
                setShow={setPayoutStatusShow}
                show={payoutStatusShow}
                handleYes={handlePayoutSubmit}
                message={
                    <span>
                        Are you sure you want to payout all these players?
                    </span>
                }
            />
        </>
    );
};

export default TournamentPayout;
