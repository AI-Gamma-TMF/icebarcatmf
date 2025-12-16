import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { getAllPlayers } from '../../utils/apiCalls'
import { useTranslation } from 'react-i18next'
import { toast } from '../../components/Toast'
import {
  useUploadCsvPromocodeBlockedMutation,
  useUpdateStatusMutation,
  errorHandler,
} from '../../reactQuery/hooks/customMutationHook'
import { initialSet } from './constant'
import { getItem } from '../../utils/storageUtils'

const useListing = () => {
  const { t } = useTranslation(['players'])
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const timezone = getItem('timezone');
  // Pagination & Sorting
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('userId')
  const [sort, setSort] = useState('desc')

  // Search
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [kycOptions, setKycOptions] = useState('')
  const [globalSearch, setGlobalSearch] = useState(initialSet)
  const [btnClick, setBtnClick] = useState(false)
 

  // Status Update
  const [playerId, setPlayerId] = useState()
  const [playerStatusDetail, setPlayerStatusDetail] = useState()
  const [playerDetail, setPlayerDetail] = useState()
  const [status, setStatus] = useState()
  const [statusShow, setStatusShow] = useState(false)

  // Misc
  const [over, setOver] = useState(false)
  const [selectedUser, setSelectedUser] = useState([])

  // CSV Import
  const [importedFile, setImportedFile] = useState(null)
  const [importModalShow, setImportModalShow] = useState(false)
  const [importAction, setImportAction] = useState(false)

  useEffect(() => {
    if (page != 1) {
      setBtnClick(true)
    }
  }, [page])

  useEffect(() => {
    setBtnClick(true)
  }, [limit])

  // Helpers
  const buildQueryParams = () => {
    const params = {
      pageNo: page,
      limit,
      orderBy,
      sort,
      timezone: timezone ? timezone : 'GMT'
    }

    if (debouncedSearch) params.search = debouncedSearch
    if (kycOptions) params.kycStatus = kycOptions

    Object.entries(globalSearch).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const paramKey = key
        params[paramKey] = value
      }
    })

    return params
  }

  const { isLoading: loading, data: playersData } = useQuery({
    queryKey: ['playersList', limit, page, debouncedSearch, kycOptions, orderBy, sort, globalSearch, timezone],
    queryFn: () => getAllPlayers(buildQueryParams()),
    select: (res) => res?.data?.users,
    refetchOnWindowFocus: false,
    retry: false,
  })

  const totalPages = Math.ceil(playersData?.count / limit)

  const getCsvDownloadUrl = () => {
    const { emailSearch, firstNameSearch, lastNameSearch, userNameSearch, isActive, idSearch = '', filterBy, operator, value, statusSearch } = globalSearch
    return `${process.env.REACT_APP_API_URL}/api/v1/user?csvDownload=true&limit=${limit}&pageNo=${page}&emailSearch=${emailSearch}&firstNameSearch=${firstNameSearch}&lastNameSearch=${lastNameSearch}&userNameSearch=${userNameSearch}&idSearch=${idSearch}&filterBy=${filterBy}&operator=${operator}&value=${value}&statusSearch=${statusSearch}&timezone=${timezone ? timezone : 'GMT'}&orderBy=${orderBy}&sort=${sort}`
  }

  const selected = (h) => orderBy === h.value && h.labelKey !== 'Action'

  const { mutate: updateStatus, isLoading: updateloading } = useUpdateStatusMutation({
    onSuccess: ({ data }) => {
      toast(data.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['playersList'] })
      const updatedList = queryClient.getQueryData([
        'playersList', limit, page, debouncedSearch, kycOptions, orderBy, sort, globalSearch, timezone
      ]);

      // If current page is now empty and not the first page, go back one
      if (Array.isArray(updatedList?.data?.users?.rows) && updatedList?.data?.users?.rows.length === 1 && page > 1) {

        setPage((prev) => prev - 1);
      }
      setStatusShow(false)
    },
    onError: errorHandler,
  })

  const addUser = (user) => {
    const exists = selectedUser.some((u) => u.userId === user.userId)
    if (!exists) setSelectedUser((prev) => [...prev, user])
    else toast('User already added', 'error')
  }

  const removeUser = (user) => {
    setSelectedUser((prev) => prev.filter((u) => u.userId !== user.userId))
  }

  const handleStatusShow = (id, status, detail, player) => {
    setPlayerId(id)
    setStatus(status)
    setPlayerStatusDetail(detail)
    setPlayerDetail(player)
    setStatusShow(true)
  }

  const handleYes = ({ reason, isFav }) => {
    updateStatus({
      code: 'USER',
      userId: playerId,
      status,
      reason,
      favorite: isFav,
    })
  }

  const { mutate: uploadCSV, isLoading: uploadCSVLoading } = useUploadCsvPromocodeBlockedMutation({
    onSuccess: ({ data }) => {
      toast(data.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['promocodeBlockedPlayersList'] })
      setImportModalShow(false)
    },
    onError: (error) => {
      errorHandler(error)
      setImportModalShow(false)
    },
  })

  const handleCSVSumbit = () => {
    const formData = new FormData()
    formData.append('file', importedFile)
    formData.append('blockUsers', importAction)
    uploadCSV(formData)
  }

  return {
    // Translations & Navigation
    t,
    navigate,

    // Pagination & Sorting
    limit,
    setLimit,
    page,
    setPage,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    selected,

    // Player Data
    playersData,
    totalPages,
    loading,
    setBtnClick,
    btnClick,

    // Search
    search,
    setSearch,
    kycOptions,
    setKycOptions,
    globalSearch,
    setGlobalSearch,

    // Status Update
    handleStatusShow,
    playerStatusDetail,
    playerDetail,
    playerId,
    status,
    statusShow,
    setStatusShow,
    handleYes,
    updateloading,

    // CSV Import
    importedFile,
    setImportedFile,
    uploadCSVLoading,
    importModalShow,
    setImportModalShow,
    importAction,
    setImportAction,
    handleCSVSumbit,

    // Misc
    getCsvDownloadUrl,
    over,
    setOver,
    selectedUser,
    addUser,
    removeUser,
  }
}

export default useListing
