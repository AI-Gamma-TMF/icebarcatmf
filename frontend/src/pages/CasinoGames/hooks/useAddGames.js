import { useAddCasinoGameMutation } from '../../../reactQuery/hooks/customMutationHook'
import { toast } from '../../../components/Toast'
import { useQueryClient , useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getAllCasinoProviders } from '../../../utils/apiCalls'


const useAddCasinoGames = (handleClose) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation('casinoGames') 

  const { mutate: addCasinoGame, isLoading: updateLoading } = useAddCasinoGameMutation({onSuccess: () => {
    toast(t('addGames.successMessageUpdate'), 'success')
    handleClose()
    queryClient.invalidateQueries({ queryKey: ['casinoGames'] })
    }})

    const { data: allProviders } = useQuery({
      queryKey: ['providersList'],
      queryFn: () => {
        return getAllCasinoProviders()
      },
      refetchOnWindowFocus: false,
      select: (res) => res?.data?.casinoProvider
    })


  return {
    addCasinoGame,
    updateLoading,
    allProviders
  }


}

export default useAddCasinoGames
