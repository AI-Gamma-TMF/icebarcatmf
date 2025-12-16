import { useQueryClient } from '@tanstack/react-query'
import { toast } from '../../../components/Toast'
import { useTranslation } from 'react-i18next'
import { errorHandler, useCreateTournamentsMutation, useUpdateTournamentMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useState } from 'react';
import { initialWinnerPercentage } from '../constants';
import { AdminRoutes } from '../../../routes';
import { useNavigate } from 'react-router-dom'

// const createOption = (label) => ({
//   label: label,
//   // value: label.toLowerCase().replace(/\W/g, ''),
//   value: label,
//   newOptions: true
// })


const useCreateTournaments = () => {
  const { t } = useTranslation(['tournaments'])
  const [gameIdValue, setGameIdValue] = useState(null)
  const [numberOfWinnersValue, setNumberOfWinners]= useState('')
  const [Winners, setWinners]= useState({})

  const [gameIdsOptions, setGamesIdsOptions] = useState([])
  const [isSelectLoading, setIsSetLoading] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()


  // const successToggler = (data) => {
  //   if (data?.length) {
  //     const tempData = []
  //     data?.map((item) => {
  //       tempData.push({
  //         label: `${item.name} (RTP:${item?.returnToPlayer?item?.returnToPlayer:''})`,
  //         value: item.masterCasinoGameId
  //       })
  //     })

  //     setGamesIdsOptions(tempData)
  //   }
  // }
  // const handleCreateOption = (inputValue) => {
  //   setIsSetLoading(true)
  //   setTimeout(() => {
  //     const newOption = createOption(inputValue)
  //     setIsSetLoading(false)
  //     const newList = [...typeOptions, newOption]
  //     setGamesIdsOptions(newList)
  //     setGameIdValue(newOption)
  //   }, 1000)
  // }

  const handleNumberOfWinners=(e)=>{
    if(e.target.value>0&&e.target.value<=5){
      const data= {...initialWinnerPercentage[e.target.value]}
      setWinners(data)
    }
    setNumberOfWinners(e.target.value)
  }
  // const { refetch: fetchData, isLoading } = useGetGamesIdsQuery({params:{},
  //   enabled,
  //   successToggler
  // })

  // useEffect(() => {
  //   // setEnabled(true)
  //   fetchData()
  // }, [])



  const { mutate: updateTournamentListMutate, isLoading: updateLoading } = useUpdateTournamentMutation({onSuccess: () => {
    toast(t('tournaments.categoryUpdateToast'), 'success')
    queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    navigate(AdminRoutes.Tournament)

    // handleClose()
  }, onError: (error) => {
    // handleClose()
    errorHandler(error)
  }})

  const updateTournament = (data) => {
    updateTournamentListMutate(data)
  }

  const { mutate: createTournament, isLoading: createLoading } = useCreateTournamentsMutation({onSuccess: () => {
    toast(t('tournaments.categoryCreateToast'), 'success')
    queryClient.invalidateQueries({ queryKey: ['tournaments'] })
    navigate(AdminRoutes.Tournament)

    // handleClose()
  }, onError: (error) => {
    // handleClose()
    errorHandler(error)
  }})

  const createTournamentList = (data) => {
    createTournament(data)
  }

  return {
    loading: updateLoading || createLoading,
    updateTournament,
    createTournamentList,
    setGamesIdsOptions,
    gameIdsOptions,
    setGameIdValue,
    gameIdValue,
    isSelectLoading,
    setIsSetLoading,
    handleNumberOfWinners,
    numberOfWinnersValue,
    setWinners,
    Winners,
    t,
      }
}

export default useCreateTournaments
