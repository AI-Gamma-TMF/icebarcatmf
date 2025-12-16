import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { getAllPlayers } from '../../utils/apiCalls'
import { useTranslation } from 'react-i18next'
import { errorHandler, useUploadCsvPromocodeBlockedMutation , useUpdateStatusMutation } from '../../reactQuery/hooks/customMutationHook'
import { toast } from '../../components/Toast'
import { initialSet } from './constants'

const usePlayerListing = () => {
  const { t } = useTranslation(['players'])
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500);
  const [kycOptions, setKycOptions] = useState('')
  const [orderBy, setOrderBy] = useState('userId')
  const [sort, setSort] = useState('desc')
  const [over, setOver] = useState(false)
  const [playerId, setPlayerId] = useState()
  const [playerStatusDetail, setPlayerStatusDetail] = useState()
  const [playerDetail, setPlayerDetail] = useState()
  const [status, setStatus] = useState()
  const [statusShow, setStatusShow] = useState(false)
  const [isActive, setIsActive] = useState('all')

  const [globalSearch, setGlobalSearch] = useState(initialSet)
  const { isLoading: loading, data: playersData } = useQuery({
    queryKey: ['playersList', limit, page, debouncedSearch, kycOptions, orderBy, sort, globalSearch, isActive],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.search = queryKey[3]
      if (queryKey[4]) params.kycStatus = kycOptions
      if (queryKey[5]) params.orderBy = orderBy
      if (queryKey[6]) params.sort = sort
      // if (queryKey[7]) params.unifiedSearch = globalSearch.unifiedSearch
      if(globalSearch.idSearch) params.idSearch = globalSearch.idSearch
      if (globalSearch.emailSearch) params.emailSearch = globalSearch.emailSearch
      if (globalSearch.firstNameSearch) params.firstNameSearch = globalSearch.firstNameSearch
      if (globalSearch.lastNameSearch) params.lastNameSearch = globalSearch.lastNameSearch
      if (globalSearch.userNameSearch) params.userNameSearch = globalSearch.userNameSearch
      if (globalSearch.phoneSearch) params.phoneSearch = globalSearch.phoneSearch
      if (globalSearch. totalPurchaseAmount) params. totalPurchaseAmount = globalSearch. totalPurchaseAmount
      if (globalSearch.totalRedemptionAmount) params.totalRedemptionAmount = globalSearch.totalRedemptionAmount
      if (globalSearch.tierSearch) params.tierSearch = globalSearch.tierSearch
      if (globalSearch.affiliateIdSearch) params.affiliateIdSearch = globalSearch.affiliateIdSearch
      if (globalSearch.regIpSearch) params.regIpSearch = globalSearch.regIpSearch
      if (globalSearch.lastIpSearch) params.lastIpSearch = globalSearch.lastIpSearch
      if (globalSearch.isActiveSearch) params.isActive = globalSearch.isActiveSearch
      if (9[6]) params.sort = sort
      return getAllPlayers(params)
    },
    select: (res) => res?.data?.users,
    refetchOnWindowFocus: false,
    retry: false
  })

  const totalPages = Math.ceil(playersData?.count / limit)

  const getCsvDownloadUrl = () =>
    `${process.env.REACT_APP_API_URL}/api/v1/user?csvDownload=true&limit=${limit}&pageNo=${page}&unifiedSearch=${globalSearch?.unifiedSearch || ''}`

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Action'

  const { mutate: updateStatus,isLoading:updateloading } = useUpdateStatusMutation({
    onSuccess: ({ data }) => {
      toast(data.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['playersList'] })
      setStatusShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })
  const [selectedUser, setSelectedUser] = useState([])
  
  const addUser = (user) => {
    const userExists = ([...selectedUser]
      .findIndex(g => g.userId === user.userId))
      
      if (userExists === -1) {
        setSelectedUser([...selectedUser, user])
    } else {
      toast("User already added ", 'error')
    }
  }
  const removeUser = (user) => {
    const updatedUser = [...selectedUser].filter(g => g.userId !== user.userId)
    setSelectedUser(updatedUser)
  }
  const handleStatusShow = (id, status, detail, player) => {
    setPlayerId(id)
    setStatus(status)
    setStatusShow(true)
    setPlayerStatusDetail(detail)
      setPlayerDetail(player)
  }

  const handleYes = (data) => {
    updateStatus({
      code: 'USER',
      userId: playerId,
      status,
      reason: data?.reason,
      favorite: data?.isFav
    })
  }
  //import csv
  //state for importing csv
  const [importedFile, setImportedFile] = useState(null);
  const [importModalShow, setImportModalShow] = useState(false);
  const [importAction, setImportAction] = useState(false);
   const { mutate: uploadCSV, isLoading: uploadCSVLoading } =
      useUploadCsvPromocodeBlockedMutation({
        onSuccess: ({ data }) => {
          toast(data.message, "success");
          queryClient.invalidateQueries({
            queryKey: ["promocodeBlockedPlayersList"],
          });
          setImportModalShow(false);
        },
        onError: (error) => {
          errorHandler(error);
          setImportModalShow(false);
        },
      });
  
    const handleCSVSumbit = () => {
      const formData = new FormData();
      formData.append("file", importedFile);
      formData.append('blockUsers', importAction);
      uploadCSV(formData);
    };

  return {
    t,selectedUser,addUser,removeUser, importedFile,
    setImportedFile,
    uploadCSVLoading,
    importModalShow,
    setImportModalShow,
    importAction,
    setImportAction,
    handleCSVSumbit,
    orderBy,
    selected,
    limit,
    setLimit,
    page,
    setPage,
    search,
    setSearch,
    playersData,
    totalPages,
    navigate,
    loading,
    kycOptions,
    setKycOptions,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver,
    handleStatusShow, playerStatusDetail,
    setStatusShow, statusShow, handleYes, status,
    globalSearch,
    setGlobalSearch,
    getCsvDownloadUrl,
    playerId,
    playerDetail,updateloading,
    isActive,
    setIsActive
  }
}

export default usePlayerListing
