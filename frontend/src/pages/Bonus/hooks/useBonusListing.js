import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getBonusDetail } from '../../../utils/apiCalls';
import { useDebounce } from 'use-debounce'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from '../../../components/Toast';
import { errorHandler, useDeleteBonus, useUpdateBonusStatusMutation } from '../../../reactQuery/hooks/customMutationHook';
import { useTranslation } from 'react-i18next'

const useBonusListing = () => {
    const { t } = useTranslation(['bonus'])
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [limit, setLimit] = useState(15)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebounce(search, 500)
    const [active, setActive] = useState('')
    const [bonusTypeFil, setBonusTypeFil] = useState('')
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

    const { isLoading: loading, data: bonusData } = useQuery({
        queryKey: ['bonusList', limit, page, debouncedSearch, active, bonusTypeFil],
        queryFn: ({ queryKey }) => {
          const params = {pageNo: queryKey[2], limit: queryKey[1]};
          if (queryKey[3]) params.search = queryKey[3]
          if (queryKey[4]) params.isActive = active
          if (queryKey[5]) params.bonusType = bonusTypeFil
          return getBonusDetail(params)
        },
        select: (res) => res?.data?.bonus,
        refetchOnWindowFocus: false
    })
    

    const { mutate: updateStatus,isLoading:updateloading } = useUpdateBonusStatusMutation({onSuccess: () => {
          toast(t('updateStatus'), 'success')
          queryClient.invalidateQueries({ queryKey: ['bonusList'] })
        
          const updatedList = queryClient.getQueryData([ 'bonusList', limit, page, debouncedSearch, active, bonusTypeFil]);
       
          // If current page is now empty and not the first page, go back one
          if (Array.isArray(updatedList?.data?.bonus?.rows) && updatedList?.data?.bonus?.rows.length === 1 && page > 1) {
    
            setPage((prev) => prev - 1);
          }
          setStatusShow(false)
      }, onError: (error) => {
        errorHandler(error)
    }})

    const { mutate: deleteBonus } = useDeleteBonus({onSuccess: () => {
        toast(t('deleteBonus'), 'success')
        queryClient.invalidateQueries({ queryKey: ['bonusList'] })
        setDeleteModalShow(false)
    }})

    const totalPages = Math.ceil(bonusData?.count / limit)

    const handleYes = () => {
        const data = {
            code:'BONUS',
            bonusId: bonus.bonusId,
            status: status
        }
        updateStatus(data)
    }

    const handleDeleteYes = () => {
        deleteBonus({bonusId})
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
        bonusTypeFil, 
        setBonusTypeFil,
        bonus,
        handleStatusShow,
        statusShow,
        setStatusShow,
        status,
        bonusData,
        totalPages,
        loading,
        active,
        setActive,
        handleYes,
        handleDeleteModal,
        handleDeleteYes,
        deleteModalShow,
        setDeleteModalShow,
        updateloading
    }
}

export default useBonusListing