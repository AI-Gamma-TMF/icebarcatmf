import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllTournamentsListParams, getSelectedTournament } from '../../../utils/apiCalls'
import { useDebounce } from 'use-debounce'
import { useState } from 'react'
import { getItem } from '../../../utils/storageUtils'
import { useUserStore } from '../../../store/store'

const useTournamentDetails = ({isEdit, isView, tournamentId: duplicateTournamentId}) => {
  const { tournamentId } = useParams()
  const navigate = useNavigate()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500);
  const currentTimeZone = getItem("timezone");
  // const currentTimezoneOffset = timeZones?.find(x => x.code === currentTimeZone)?.value;
  // const timeZoneOffset = getFormattedTimeZoneOffset();
  // const [timeStamp, setTimeStamp] = useState(currentTimezoneOffset ? currentTimezoneOffset : timeZoneOffset);
  // const [timeZoneCode, setTimeZoneCode] = useState(timeZones.find(x => x.value === timeStamp)?.code);

  const timeZoneCode = useUserStore((state) => state.timeZoneCode)

  // useEffect(() => {
  //   setTimeZoneCode(timeZones.find(x => x.value === timeStamp)?.code);
  //   setItem("timezone", timeZones.find(x => x.value === timeStamp)?.code);
  // }, [timeStamp]);

  const { data: tournamentData, isLoading: loading, refetch: refetchTournament } = useQuery({
    queryKey: ['tournamentId', limit, page, tournamentId, currentTimeZone, debouncedSearch],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1], timezone: queryKey[4], search: queryKey[5] }
      return getAllTournamentsListParams(params, { tournamentId })
    },
    select: (res) => res?.data?.data,
    refetchOnWindowFocus: false,
    enabled: isEdit ? isEdit : isView
    })

    const { data: selectedTournamentData, isLoading: selectedTournamentLoading } = useQuery({
      queryKey: ['selectedTournament'],
      queryFn: ({ queryKey }) => {
        const params = { timezone: queryKey[3] }
        return getSelectedTournament(params, { tournamentId: duplicateTournamentId })
      },
      select: (res) => res?.data?.data,
      refetchOnWindowFocus: false,
      enabled: !isEdit && !isView && !!duplicateTournamentId,
    })
  

  const totalPages = Math.ceil(tournamentData?.tournamentLeaderBoard?.count / limit)

  const getCsvDownloadUrl = () =>
    `${process.env.REACT_APP_API_URL}/api/v1/tournament/${tournamentId}?csvDownload=true&timezone=${timeZoneCode}&limit=${limit}&pageNo=${page}&search=${search}`

  return {
    tournamentData,
    loading,
    navigate,
    refetchTournament,
    totalPages, limit, setLimit,
    page, setPage,
    getCsvDownloadUrl,
    selectedTournamentData,
    selectedTournamentLoading,
    search,
    setSearch
  }
}

export default useTournamentDetails
