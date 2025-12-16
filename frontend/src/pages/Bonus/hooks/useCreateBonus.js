import { toast } from '../../../components/Toast'
import { useCreateBonusMutation, useUpdateBonusMutation , useCreateDailyBonusMutation } from '../../../reactQuery/hooks/customMutationHook'
import { AdminRoutes } from '../../../routes'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { serialize } from 'object-to-formdata'
import { getBonusDetail } from '../../../utils/apiCalls'

const useCreateBonus = () => {
    const { t } = useTranslation(['bonus'])
    const navigate = useNavigate()
    const { bonusId } = useParams()
    const queryClient = useQueryClient()

    // const validCoins = (data) => {
    //     if(data?.bonusData?.gcAmount >= 0 || data?.bonusData?.scAmount >= 0) {
    //         return true;
    //     }
    //     return false
    // }

    const { data: _bonusByPageData } = useQuery({
        queryKey: ['bonusId', bonusId ],
        queryFn: () => getBonusDetail({bonusId}),
        select: (res) => res?.data?.bonus,
        refetchOnWindowFocus: false,
    })

    const { mutate: createBonusMutation, isLoading: createBonusLoading } = useCreateBonusMutation({onSuccess: () => {
        toast(t('bonusCreate'), 'success')
        navigate(AdminRoutes.BonusListing)
    }})

    const { mutate: createDailyBonusMutation, isLoading: createDailyBonusLoading } = useCreateDailyBonusMutation({onSuccess: () => {
        toast(t('bonusCreate'), 'success')
        navigate(AdminRoutes.BonusListing)
    }})

    const { mutate: updateBonusMutation, isLoading: updateBonusLoading } = useUpdateBonusMutation({onSuccess: () => {
        toast(t('updateBonus'), 'success')
        queryClient.invalidateQueries({ queryKey: ['bonusId', bonusId ] })
        navigate(AdminRoutes.BonusListing)
      }})


    const createBonus = (data) =>{ data.bonusData.bonusType == 'daily bonus' ? createDailyBonusMutation(serialize(data.bonusData)) : createBonusMutation(data.bonusData) }
    const updateBonus = (data) => { updateBonusMutation(serialize(data.bonusData)) }
    // const updateBonus = (data) => { validCoins(data) ? updateBonusMutation(serialize(data.bonusData)) : toast('Either SC or GC coins should be greater than 0','error')}

    return {
        t,
        loading: createBonusLoading || updateBonusLoading || createDailyBonusLoading,
        createBonusLoading,
        createBonus,
        updateBonus
    }
}

export default useCreateBonus