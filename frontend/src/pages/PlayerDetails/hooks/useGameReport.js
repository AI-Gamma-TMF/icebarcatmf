// import { useEffect, useState } from 'react'

// import { formatDateYMD, getDateDaysAgo } from '../../../utils/dateFormatter'
// import { getLoginToken } from '../../../utils/storageUtils'
// import { useParams } from 'react-router'
// import { useQuery } from '@tanstack/react-query'
// import { getPlayerById } from '../../../utils/apiCalls'

// const useGameReport = () => {
//   const { userId } = useParams()
//   const [selectedTab, setSelectedTab] = useState('game')
//   const [dateOptions, setDateOptions] = useState('today')
//   const [limit, setLimit] = useState(10)
//   const [pageNo, setPageNo] = useState(1)

  
//   const [state, setState] = useState([
//     {
//       startDate: getDateDaysAgo(0),
//       endDate: new Date(),
//       key: 'selection'
//     }
//   ])
//   const paramsData = {
//     startDate: formatDateYMD(state.map(a => a.startDate)),
//     endDate: formatDateYMD(state.map(a => a.endDate)),
//     dateOptions,
//     selectedTab,
//     userId,
//     limit
//   }
//   const { isLoading: loading, data: gameReportPlayer, refetch: fetchDetails } = useQuery({
//     queryKey: ['gameReport', ...Object.values(paramsData)],
//     queryFn: () => {
//       // const params = queryKey[1] ? {userId: queryKey[1]} : {}
//       return getPlayerById(paramsData)
//     },
//     refetchOnWindowFocus: false,
//   })
//   const totalPages = Math.ceil(gameReportPlayer?.count / limit)

//   useEffect(() => {
//     if (dateOptions !== 'custom') fetchDetails()
//   }, [dateOptions])

//   const getCsvDownloadUrl = () =>
//     `${process.env.REACT_APP_API_URL}/api/admin/get-game-report?userId=${userId}&limit=${limit}&dateOptions=${dateOptions}&customStartDate=${formatDateYMD(state.map(a => a.startDate))}&customEndDate=${formatDateYMD(state.map(a => a.endDate))}&tab=${selectedTab}&csvDownload=true&token=${getLoginToken()}`

//   return {

//     fetchDetails,
//     loading,
//     setState,
//     state,
//     selectedTab,
//     setSelectedTab,
//     gameReportPlayer,
//     limit,
//     setLimit,
//     dateOptions,
//     setDateOptions,
//     getCsvDownloadUrl,
//     totalPages,
//     pageNo,
//     setPageNo
//   }
// }

// export default useGameReport

// not in use 