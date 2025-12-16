import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getTournamentStatisticsData } from '../../../utils/apiCalls'
import { appendCurrentTime, convertTimeZone, convertToUtc } from '../../../utils/helper'
import { getItem } from '../../../utils/storageUtils'
import moment from 'moment'
import { useUserStore } from '../../../store/store'

const useTournamentStatisticsChart = ({ type, isUTC }) => {
    const { tournamentId } = useParams()
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [selectedGame, setSelectedGame] = useState()
    const [selectedPlayer, setSelectedPlayer] = useState()

    const currentTimeZone = getItem("timezone");
    // const currentTimezoneOffset = timeZones?.find(x => x.code === currentTimeZone)?.value;
    // const timeZoneOffset = getFormattedTimeZoneOffset();
    // const [timeStamp, setTimeStamp] = useState(currentTimezoneOffset || timeZoneOffset);

    // const [timeZoneCode, setTimeZoneCode] = useState(timeZones.find(x => x.value === timeStamp)?.code);
    const timeZoneCode = useUserStore((state) => state.timeZoneCode)
    const [isDateReady, setIsDateReady] = useState(false);

    // Update timeZoneCode and store it in localStorage
    // useEffect(() => {
    //     const updatedTimeZoneCode = timeZones.find(x => x.value === timeStamp)?.code;
    //     setTimeZoneCode(updatedTimeZoneCode);
    //     setItem("timezone", updatedTimeZoneCode);
    // }, [timeStamp]);

    // Update start and end dates when time zone changes
    useEffect(() => {
        const updatedStartDate = convertTimeZone(startDate, timeZoneCode);
        const updatedEndDate = convertTimeZone(new Date(), timeZoneCode);

        setStartDate(updatedStartDate);
        setEndDate(updatedEndDate);

        // Set flag once the dates are properly updated
        if (updatedStartDate && updatedEndDate) {
            setIsDateReady(true);
        }
    }, [timeZoneCode]);

    const { data: tournamentStatisticsData, isLoading: isLoadingTournamentStatistics } = useQuery({
        queryKey: [`tournament-stats-${tournamentId}`, startDate, endDate, selectedGame, selectedPlayer, currentTimeZone],
        queryFn: () => {
            let formattedStartDate = startDate;
            let formattedEndDate = endDate;

            // If isUTC is true, convert to UTC
            if (isUTC) {
                formattedStartDate = convertToUtc(appendCurrentTime(startDate));
                formattedEndDate = convertToUtc(appendCurrentTime(endDate));
            }

            const params = {};

            if (formattedStartDate) params.startDate = formattedStartDate;
            if (formattedEndDate) params.endDate = formattedEndDate;
            if (selectedGame) params.gameId = selectedGame?.value;
            if (selectedPlayer) params.userId = selectedPlayer?.value;
            if (currentTimeZone) params.timezone = currentTimeZone;

            return getTournamentStatisticsData(params, { tournamentId });
        },
        select: (res) => res?.data?.data,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false,
        enabled: isDateReady && !!startDate && !!endDate && type !== "CREATE" && type !== "EDIT"
    });

    return {
        tournamentStatisticsData,
        startDate,
        setStartDate: (date) => setStartDate(moment(date).format('YYYY-MM-DD')),
        endDate,
        setEndDate: (date) => setEndDate(moment(date).format('YYYY-MM-DD')),
        selectedGame,
        setSelectedGame,
        selectedPlayer,
        setSelectedPlayer,
        isLoadingTournamentStatistics
    }
}

export default useTournamentStatisticsChart
