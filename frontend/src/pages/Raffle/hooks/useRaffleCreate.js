import { toast } from '../../../components/Toast'
import { errorHandler, useCreateRaffleMutation, useCreateTournamentsCronMutation, useUpdateTournamentCronMutation, useUpdateTournamentMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useEffect, useState } from 'react';
import { useGetGamesIdsQuery } from '../../../reactQuery/hooks/customQueryHook';

import { AdminRoutes } from '../../../routes';
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

// const createOption = (label) => ({
//   label: label,
//   // value: label.toLowerCase().replace(/\W/g, ''),
//   value: label,
//   newOptions: true 
// })


const useCreateRaffle = () => {
  const [enabled, _setEnabled] = useState(false)
  const [gameIdValue, setGameIdValue] = useState(null)
  const [numberOfWinnersValue, _setNumberOfWinners]= useState('')
  const [Winners, setWinners]= useState({})

  const [gameIdsOptions, setGamesIdsOptions] = useState([])
  const [isSelectLoading, _setIsSetLoading] = useState(false)
  // const queryClient = useQueryClient()
  const { t } = useTranslation('casino');
  const navigate = useNavigate()


  const successToggler = (data) => {
    if (data.length) {
      const tempData = []
      data?.map((item) => {
        tempData.push({
          label: `${item.name} (RTP:${item?.returnToPlayer?item?.returnToPlayer:''})`,
          value: item.masterCasinoGameId
        })
      })

      setGamesIdsOptions(tempData)
    }
  }


  const { refetch: fetchData } = useGetGamesIdsQuery({params:{},
    enabled,
    successToggler
  })

  useEffect(() => {
    fetchData()
  }, [])

  const { mutate:updateTournamentCron} = useUpdateTournamentCronMutation()
  const { mutate:_createTournamentCron} = useCreateTournamentsCronMutation()


  const { mutate: updateTournamentList, isLoading: updateLoading } = useUpdateTournamentMutation({onSuccess: (res) => {
    toast(t('tournaments.categoryUpdateToast'), 'success')
    updateTournamentCron({tournamentId:res?.data?.data?.tournamentId})
    navigate(AdminRoutes.Tournament)

    // handleClose()
  }, onError: (error) => {
    // handleClose()
    errorHandler(error)
  }})

  const updateTournament = (data) => {
    updateTournamentList(data)
  }

  const { mutate: createRaffle, isLoading: createLoading } = useCreateRaffleMutation({onSuccess: () => {
    toast( 'Raffle Created Successfully', 'success')
    navigate(AdminRoutes.Raffle)
  }, onError: (error) => {
    errorHandler(error)
  }})

  const createRaffleList = (data) => {
    createRaffle(data)
  }

  return {
    loading: updateLoading || createLoading,
    updateTournament,
    createRaffleList,
    setGamesIdsOptions,
    gameIdsOptions,
    setGameIdValue,
    gameIdValue,
    isSelectLoading,
    numberOfWinnersValue,
    setWinners,
    Winners,
  }
}

export default useCreateRaffle