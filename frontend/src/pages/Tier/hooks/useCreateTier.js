import { toast } from '../../../components/Toast'
import { useTranslation } from 'react-i18next'
import { errorHandler, useCreateTierMutation, useCreateTournamentsCronMutation, useUpdateTierMutation, useUpdateTournamentCronMutation } from '../../../reactQuery/hooks/customMutationHook'
import { serialize } from 'object-to-formdata';
import { AdminRoutes } from '../../../routes';
import { useNavigate } from 'react-router-dom'


const useCreateTier = () => {
  const { t } = useTranslation(['tier'])
  const navigate = useNavigate()


 // const { mutate:updateTournamentCron} = useUpdateTournamentCronMutation()
  const { mutate:createTournamentCron} = useCreateTournamentsCronMutation()


  const { mutate: updateTierList, isLoading: updateLoading } = useUpdateTierMutation({onSuccess: (res) => {
    toast(t('tournaments.categoryUpdateToast'), 'success')
    //updateTournamentCron({tierId:res?.data?.data?.tierId})
    navigate(AdminRoutes.Tier)

  }, onError: (error) => {
    errorHandler(error)
  }})

  const updateTournament = (data) => {
    updateTierList(serialize(data))
  }

  const { mutate: createTier, isLoading: createLoading } = useCreateTierMutation({onSuccess: (res) => {
    toast(t('tournaments.categoryCreateToast'), 'success')
    createTournamentCron({tierId:res?.data?.data?.tierId})
    navigate(AdminRoutes.Tier)

  }, onError: (error) => {
    errorHandler(error)
  }})

  const createTournamentList = (data) => {
    createTier(serialize(data))
  }

  return {
    loading: updateLoading || createLoading,
    updateTournament,
    createTournamentList,
    t
  }
}

export default useCreateTier
