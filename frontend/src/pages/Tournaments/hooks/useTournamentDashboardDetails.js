import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getTournamentDashboard, getTournamentDashboardGameIds, getTournamentDashboardTotalPlayer, getTournamentDashboardWinnerBootedSummary } from '../../../utils/apiCalls'
import { getItem } from '../../../utils/storageUtils'


const useTournamentDashboardDetails = ({ type }) => {
    const { tournamentId } = useParams()

    const timeZone = getItem("timezone");
    //   const timezoneOffset = timeZone != null ? timeZones.find(x => x.code === timeZone).value : getFormattedTimeZoneOffset()

    //   const [timeZoneCode, setTimeZoneCode] = useState(timeZones.find(x => x.value === timezoneOffset)?.code);
    const [selectedGame, setSelectedGame] = useState()
    const [selectedPlayer, setSelectedPlayer] = useState()

    //   useEffect(() => {
    //     setTimeZoneCode(timeZones.find((x) => x.value === timezoneOffset)?.code);
    //   }, [timezoneOffset]);


    const { data: tournamentSummaryData } = useQuery({
        queryKey: [`tournamentDashboard-${tournamentId}`],
        queryFn: () => {
            return getTournamentDashboard({ tournamentId })
        },
        select: (res) => res?.data?.data,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false,
        enabled: type !== "CREATE" && type !== "EDIT" && type !== "CREATE_DUPLICATE"
    })

    const { data: tournamentGameIds } = useQuery({
        queryKey: [`tournamentGameIds-${tournamentId}`],
        queryFn: () => {
            return getTournamentDashboardGameIds({ tournamentId })
        },
        select: (res) => res?.data?.data,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false,
        enabled: type !== "CREATE" && type !== "EDIT" && type !== "CREATE_DUPLICATE"
    })

    const { data: tournamentTotalPlayers } = useQuery({
        queryKey: [`tournamentTotalPlayer-${tournamentId}`, timeZone],
        queryFn: ({ queryKey }) => {
            const params = {};
            if (queryKey[1]) params.timezone = queryKey[1];
            return getTournamentDashboardTotalPlayer(params, { tournamentId })
        },
        select: (res) => res?.data?.data,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false,
        enabled: type !== "CREATE" && type !== "EDIT" && type !== "CREATE_DUPLICATE"
    })

    const { data: tournamentWinnerBootedSummary, loading: tournamentBootedLoading } = useQuery({
        queryKey: [`tournamentWinner-${tournamentId}`],
        queryFn: () => {
            return getTournamentDashboardWinnerBootedSummary({ tournamentId })
        },
        select: (res) => res?.data?.data,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false,
        enabled: type !== "CREATE" && type !== "EDIT" && type !== "CREATE_DUPLICATE"
    })

    return {
        tournamentSummaryData,
        tournamentGameIds,
        tournamentTotalPlayers,
        tournamentWinnerBootedSummary,
        tournamentBootedLoading,
        selectedGame,
        selectedPlayer,
        setSelectedGame,
        setSelectedPlayer,
    }
}

export default useTournamentDashboardDetails
