import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllTournamentsList } from '../../../utils/apiCalls'
import { toast } from '../../../components/Toast'
import { errorHandler, useCancelTournament, useDeleteTournament, useUpdateStatusTournamentMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'
import { timeZones } from '../../Dashboard/constants.js'
import { getItem } from '../../../utils/storageUtils'
import { getFormattedTimeZoneOffset } from '../../../utils/helper'

const   useTournamentListing = ({ _isUTC }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation(['tournaments'])
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  // const [orderBy, setOrderBy] = useState('tournamentId')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [categoryId, _setCategoryId] = useState()
  const [active, _setActive] = useState()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [tournamentId, setTournamentId] = useState('')
  const [status, setStatus] = useState('1')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [joiningAmount, setJoiningAmount] = useState('')
  const cancelTournament = useCancelTournament({});
  const [statusShow, setStatusShow] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);


  const [state, setState] = useState([
    {
      key: 'selection'
    }
  ])
  const timeZone = getItem("timezone");
  const timezoneOffset = timeZone != null ? timeZones.find(x => x.code === timeZone).value : getFormattedTimeZoneOffset()

  // In your useQuery
  const { data: tournamentList, isLoading: loading, refetch: tournamentRefetch } = useQuery({
    queryKey: ['tournamentList', limit, page, debouncedSearch, sort,
      status, selectedCurrency, joiningAmount],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1]};
      if (queryKey[3]) params.unifiedSearch = queryKey[3];
      // if (queryKey[4]) params.orderBy = queryKey[4];
      // if (queryKey[5]) params.sort = queryKey[5];
      if (queryKey[5]) params.status = queryKey[5];
      if (queryKey[7]) params.entryAmount = queryKey[7];

      return getAllTournamentsList(params);
    },
    select: (res) => res?.data?.data,
    refetchOnWindowFocus: false
  });

  const selected = (h) =>
    // orderBy === h.value &&
    h.labelKey !== 'Actions'

  const totalPages = Math.ceil(tournamentList?.count / limit)

  const { mutate: updateStatus, isLoading: updateloading } = useUpdateStatusTournamentMutation({
    onSuccess: ({ data }) => {
      // if (data.success) {
      if (data.message) toast(data.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['tournamentList'] })
      // }
      setShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })

  const handleYes = () => {
    updateStatus({
      tournamentId: categoryId,
      isActive: active
    })
  }

  const handleClose = () => setShowModal(false)

  const handleShowModal = (type) => {
    setType(type)
    setShowModal(true)
  }

  const { mutate: deleteCategory } = useDeleteTournament({
    onSuccess: ({ data }) => {
      if (data?.success) {

        if (data?.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['tournamentList'] })
      }
      setDeleteModalShow(false)
    }
  })

  const handleDeleteYes = () => {
    deleteCategory({ tournamentId })
  }

  const handleDeleteModal = (id) => {
    setTournamentId(id)
    setDeleteModalShow(true)
  }

  
  const handleOnSubmit = async () => {
    const payload = {
      tournamentId: itemToUpdate,
    };

    cancelTournament.mutate(payload, {
      onSuccess: (res) => {
        if (res) {
          toast(res?.data?.message, 'success');
          tournamentRefetch();
          const updatedList = queryClient.getQueryData(['tournamentList', limit, page, debouncedSearch, sort,
      status, selectedCurrency, joiningAmount]);
          // If current page is now empty and not the first page, go back one
          if (Array.isArray(updatedList?.data?.data?.rows) && updatedList?.data?.data?.rows.length === 1 && page > 1) {
            setPage((prev) => prev - 1);
          }
          
        }
        setStatusShow(false);
      },
      onError: () => {
        setStatusShow(false);
      }
    });
  };

  return {
    t,
    limit,
    page,
    loading,
    tournamentList,
    show,
    setLimit,
    setPage,
    setShow,
    totalPages, updateloading,
    handleYes,
    handleShowModal,
    showModal,
    type,
    tournamentRefetch,
    handleClose,
    selectedCategory,
    setSelectedCategory,
    active,
    navigate,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    // setOrderBy,
    selected,
    sort,
    setSort,
    over,
    setOver,
    status,
    setStatus,
    search,
    setSearch,
    selectedCurrency,
    setSelectedCurrency,
    state,
    setState, 
    timezoneOffset,
    joiningAmount,
    setJoiningAmount,
    statusShow, setStatusShow,
    itemToUpdate, setItemToUpdate,
    cancelTournament,handleOnSubmit
  }
}

export default useTournamentListing
