import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getBlockedUser } from '../../../utils/apiCalls'
import { toast } from '../../../components/Toast'
import { errorHandler, useDeleteDomainBlockMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useDebounce } from 'use-debounce'

const useDomainBlocking = () => {
  const queryClient = useQueryClient()
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [domianId, setDomainId] = useState()
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)

  const { data: blockedDomainList, isLoading: loading } = useQuery({ 
    queryKey: ['blockedDomainList', limit, page, orderBy, 
    sort, debouncedSearch],
    queryFn: ({ queryKey }) => {
      const params = {pageNo: queryKey[2], limit: queryKey[1]};
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if (queryKey[5]) params.search = queryKey[5]
      return getBlockedUser(params)
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    retry:false
  })

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Action'

  const totalPages = Math.ceil(blockedDomainList?.blockedDomains?.count / limit)


  const handleDelete = (id)=>{
    setDomainId(id)
    setDeleteModalShow(true)
  }

  const { mutate: deleteBlockedDomain,isLoading:deleteLoading } = useDeleteDomainBlockMutation({
    onSuccess: ({ data }) => {
        if (data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['blockedDomainList'] })
        const updatedList = queryClient.getQueryData(['blockedDomainList', limit, page, orderBy, 
    sort, debouncedSearch]);
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.blockedDomains?.rows) && updatedList?.data?.blockedDomains?.rows.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
        setDeleteModalShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })
  const handleDeleteYes = () => {
    deleteBlockedDomain({
      domainId: domianId,
    })
  }

  return {
    blockedDomainList, selected, loading, page, totalPages, setPage, limit, setLimit, handleDelete, handleDeleteYes, deleteModalShow, setDeleteModalShow, setSearch, search, setOrderBy, sort, over, setOver, setSort, deleteLoading 
  }
}

export default useDomainBlocking
