import { useQuery } from '@tanstack/react-query'
import {  useParams } from 'react-router-dom'
import { getPayoutTournamentsData } from '../../../utils/apiCalls'
import { useEffect } from 'react'

const usePayoutTournamentDetails = ({type, tournamentData}) => {
    const { tournamentId } = useParams()

    const tournamentStatus = tournamentData ? tournamentData?.status : null;

    const shouldFetchPayoutData =
    (tournamentStatus === "2" || tournamentStatus === "3") &&
    type !== 'CREATE' &&
    type !== 'EDIT' && 
    type !== "CREATE_DUPLICATE";

     const { data: payoutTournamentList, refetch } = useQuery({
        queryKey: ['tournamentId', tournamentStatus],
        queryFn: () => {
                        return getPayoutTournamentsData({ tournamentId })
        },
        select: (res) => res?.data,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 0,
        enabled: shouldFetchPayoutData,
       })

    useEffect(() => {
        if (shouldFetchPayoutData) {
            refetch();
        }
    }, [shouldFetchPayoutData, refetch]);
    return {
        payoutTournamentList,
        refetch
    }
}

export default usePayoutTournamentDetails
