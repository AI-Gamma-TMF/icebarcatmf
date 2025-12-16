import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getBonusDetail, getScratchCardDropdown } from '../../../utils/apiCalls';
import { useDebounce } from 'use-debounce'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from '../../../components/Toast';
import { errorHandler, useCreateDailyBonusStreakMutation, useDeleteBonus, useUpdateBonusStatusMutation, useUpdateDailyBonusStreakMutation } from '../../../reactQuery/hooks/customMutationHook';
import { useTranslation } from 'react-i18next'
import { serialize } from 'object-to-formdata'

const useDailyBonusStreak = () => {
  const { t } = useTranslation(['dailyBonusStreak'])
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [active, setActive] = useState('')
  const [bonusType, setBonusType] = useState('daily-bonus')
  const [orderBy, _setOrderBy] = useState('day')
  const [status, setStatus] = useState('')
  const [statusShow, setStatusShow] = useState(false)
  const [bonus, setBonus] = useState('')
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [bonusId, setBonusId] = useState('')

  const handleStatusShow = (bonus, status) => {
    setBonus(bonus)
    setStatus(!status)
    setStatusShow(true)
  }

  const handleDeleteModal = (id) => {
    setBonusId(id)
    setDeleteModalShow(true)
  }
  const { data: scratchCardDropdownList } = useQuery({
    queryKey: ['scratchCardDropdownList'],
    queryFn: () => {
      return getScratchCardDropdown()
    },
    select: (res) => res?.data?.scratchCards,
    refetchOnWindowFocus: false,
  })
  const { isLoading: loading, data: dailyBonusStreakData, refetch: refetchDailyBonusStreakData } = useQuery({
    queryKey: ['bonusList', limit, page, debouncedSearch, active, bonusType, orderBy],
    queryFn: ({ queryKey }) => {
      const params = { bonusType: queryKey[5], orderBy: queryKey[6] };
      if (queryKey[3]) params.search = queryKey[3]
      if (queryKey[4]) params.isActive = active
      return getBonusDetail(params)
    },
    select: (res) => res?.data?.bonus,
    refetchOnWindowFocus: false
  })
  const { mutate: updateBonusMutation } = useUpdateDailyBonusStreakMutation({
    onSuccess: () => {
      refetchDailyBonusStreakData()
      toast('Bonus updated successfully.', 'success')
      queryClient.invalidateQueries({ queryKey: ['bonusId', bonusId] })
      // navigate(AdminRoutes.BonusListing)
    },
    onError: (error) => {
      errorHandler(error);
    }
  })

 const updateBonus = (data) => { updateBonusMutation(serialize(data)) }
 
 const { mutate: updateStatus } = useUpdateBonusStatusMutation({
    onSuccess: () => {
      toast('Bonus status updated successfully.', 'success')
      queryClient.invalidateQueries({ queryKey: ['bonusList'] })
      setStatusShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })

  const { mutate: deleteBonus } = useDeleteBonus({
    onSuccess: () => {
      toast('Bonus deleted successfully.', 'success')
      queryClient.invalidateQueries({ queryKey: ['bonusList'] })
      setDeleteModalShow(false)
    }
  })

  const totalPages = Math.ceil(dailyBonusStreakData?.count / limit)

  const handleYes = () => {
    const data = {
      code: 'BONUS',
      bonusId: bonus.bonusId,
      status: status
    }
    updateStatus(data)
  }

  const handleDeleteYes = () => {
    deleteBonus({ bonusId })
  }

  const { mutate: createDailyBonusStreakMutation } =
    useCreateDailyBonusStreakMutation({
      onSuccess: () => {
        refetchDailyBonusStreakData()
        toast("Daily Bonus Streak Created Successfully", "success");
      },
      onError: (error) => {
        toast(error.response.data.errors[0].description, "error");
        errorHandler(error);
      },
    });
  const createDailyBonusStreak = (data) => {
    createDailyBonusStreakMutation(serialize(data))
  }
  return {
    t,
    navigate,
    limit,
    page,
    search,
    setPage,
    setLimit,
    setSearch,
    bonusType,
    setBonusType,
    bonus,
    handleStatusShow,
    statusShow,
    setStatusShow,
    status,
    dailyBonusStreakData,
    totalPages,
    loading,
    active,
    setActive,
    handleYes,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    updateBonus,
    createDailyBonusStreak,
    scratchCardDropdownList
  }
}

export default useDailyBonusStreak