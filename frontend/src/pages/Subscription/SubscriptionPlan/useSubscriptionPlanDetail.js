import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getSubscriptionDetail } from '../../../utils/apiCalls';

const useSubscriptionPlanDetail = () => {
    const { subscriptionId } = useParams()
    const queryClient = useQueryClient();
    const navigate = useNavigate()

    const { data: subscriptionData, isLoading: loading, refetch: refetchSubscription } = useQuery({
        queryKey: ['subscriptionId', subscriptionId],
        queryFn: ({ queryKey }) => {
            const params = {
                subscriptionId
            }
            return getSubscriptionDetail(params)
        },
        select: (res) => res?.data?.data,
        refetchOnWindowFocus: false
    })

    return {
        subscriptionData,
        loading,
        navigate,
        refetchSubscription
    }
}

export default useSubscriptionPlanDetail
