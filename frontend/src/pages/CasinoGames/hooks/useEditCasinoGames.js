import { useUpdateCasinoGame } from '../../../reactQuery/hooks/customMutationHook'
import { toast } from '../../../components/Toast'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

const useEditCasinoGames = (handleClose) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation('casinoGames')

  const { mutate: updateCasinoGame, isLoading: updateLoading } = useUpdateCasinoGame({onSuccess: () => {
    toast(t('editGames.successMessageUpdate'), 'success')
    handleClose()
    queryClient.invalidateQueries({ queryKey: ['casinoGames'] })
    }})

  return {
    updateCasinoGame,
    updateLoading
  }


}

export default useEditCasinoGames
