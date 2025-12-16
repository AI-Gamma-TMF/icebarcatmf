import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce';
import { getSubscriptionPlan } from "../../../utils/apiCalls";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { errorHandler, useSubscriptionStatusMutation } from "../../../reactQuery/hooks/customMutationHook";
import { toast } from "../../../components/Toast";

const useSubscriptionPlan = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [active, setActive] = useState(false)
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState('')
    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebounce(search, 500)
    const [subscriptionId, setSubscriptionId] = useState('');
    const [limit, setLimit] = useState(15)
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('DESC')
    const [orderBy, setOrderBy] = useState('subscriptionId')

    const { data: subscriptionPlanData, isLoading } = useQuery({
        queryKey: ['subscriptionPlanData', limit, page, sort, orderBy, debouncedSearch],
        queryFn: ({ queryKey }) => {
            const params = {}
            if (queryKey[1]) params.limit = queryKey[1]
            if (queryKey[2]) params.pageNo = queryKey[2]
            if (queryKey[3]) params.sort = queryKey[3]
            if (queryKey[4]) params.orderBy = queryKey[4]
            if (queryKey[5]) params.unifiedSearch = queryKey[5]
            return getSubscriptionPlan(params)
        },
        select: (res) => res?.data?.data,
        retry: false,
        refetchOnWindowFocus: false
    })

    const { mutate: updateStatus, isLoading: updateloading } = useSubscriptionStatusMutation({
        onSuccess: ({ data }) => {
            if (data.success) {
                if (data.message) toast(data.message, 'success')
                queryClient.invalidateQueries({ queryKey: ['subscriptionPlanData'] })
            }
            setShow(false)
        }, onError: (error) => {
            setShow(false)
            errorHandler(error)
        }
    })

    const handleYes = () => {
        const data = {
            subscriptionId: subscriptionId,
            isActive: status
        }
        updateStatus(data)
    }

    const handleShow = (id, currentStatus) => {
        setSubscriptionId(id);
        setStatus(!currentStatus)
        setShow(true)
    }

    const selected = (h) =>
        orderBy === h.value &&
        h.labelKey !== 'Action'

    return {
        subscriptionPlanData,
        isLoading,
        show,
        setShow,
        navigate,
        handleShow,
        status,
        setStatus,
        handleYes,
        selected,
        orderBy,
        setOrderBy,
        sort,
        setSort,
        search,
        setSearch
    }
}

export default useSubscriptionPlan;