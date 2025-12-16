import { useQueryClient } from '@tanstack/react-query'
import { errorHandler, useCreateSubscriptionMutation, useCreateTournamentsMutation, useUpdateSubscriptionMutation, useUpdateTournamentMutation } from '../../../reactQuery/hooks/customMutationHook'
import { AdminRoutes } from '../../../routes';
import { useNavigate } from 'react-router-dom'
import { toast } from '../../../components/Toast';

const useCreateSubscriptionPlan = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()


    const { mutate: createSubscriptionList, isLoading: createLoading } = useCreateSubscriptionMutation({
        onSuccess: (res) => {
            toast('Plan Created successfully!', 'success')
            queryClient.invalidateQueries({ queryKey: ['subscription'] })
            navigate(AdminRoutes.SubscriptionPlan)
        }, onError: (error) => {
            errorHandler(error)
        }
    })

    const createSubscriptionMutation = (data) => {
        createSubscriptionList(data)
    }

    const { mutate: updateSubscriptionList, isLoading: updateLoading } = useUpdateSubscriptionMutation({
        onSuccess: (res) => {
            toast('Plan Updated succsessfully', 'success')
            queryClient.invalidateQueries({ queryKey: ['subscription'] })
            navigate(AdminRoutes.SubscriptionPlan)

            // handleClose()
        }, onError: (error) => {
            // handleClose()
            errorHandler(error)
        }
    })

    const updateSubscriptionMutation = (data) => {
        updateSubscriptionList(data)
    }

    return {
        loading: createLoading,
        createSubscriptionMutation,
        updateSubscriptionMutation,
        updateLoading
    }
}

export default useCreateSubscriptionPlan
