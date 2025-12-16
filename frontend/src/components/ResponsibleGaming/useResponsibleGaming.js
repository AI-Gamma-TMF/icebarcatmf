import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { useDisableUntilMutation, useResetLimitMutation, useSetDailyLimitsMutation, useSetDepositLimitsMutation, useSetLossLimitsMutation, useSetSessionTimeMutation, useUpdateResponsibleMutuation } from '../../reactQuery/hooks/customMutationHook'
import { useGetPlayerResponsibleQuery } from '../../reactQuery/hooks/customQueryHook'
import { limitName } from './constants'
import { useTranslation } from 'react-i18next'
import { getItem } from '../../utils/storageUtils'

const useResponsibleGaming = ({ userLimits, getUserDetails ,refetchForPlayerData}) => {
  const { t } = useTranslation(['players'])
  const { userId } = useParams()
  const [limit, setLimit] = useState({})
  const [data, setData] = useState('')
  const [limitModal, setLimitModal] = useState(false)
  const [enabled, _setEnabled] = useState(true)
  const [resetModal, setResetModal] = useState(false)
  const [exclusionModal, setExclusionModal] = useState(false)
  const {mutateAsync: setDailyLimit } = useSetDailyLimitsMutation()
  const {mutateAsync: setDepositLimit } = useSetDepositLimitsMutation()
  const {mutateAsync: setLossLimit } = useSetLossLimitsMutation()
  const {mutateAsync: setSessionTime } = useSetSessionTimeMutation()
  const {mutateAsync: setDisableUntil } = useDisableUntilMutation()
  const timezone = getItem('timezone');
const [limitLabels, setLimitLabels] = useState([
  { label: t('playerLimit.limitHeading.dailyWageLimit'), value: null, minimum: 0, limitType: 1, image: '/rsg-image/daily-purchase-limit.svg' },
  { label: t('playerLimit.limitHeading.weeklyWageLimit'), value: null, minimum: null, limitType: 2, image: '/rsg-image/weekly-purchase-limit.svg' },
  { label: t('playerLimit.limitHeading.monthlyWageLimit'), value: null, minimum: null, limitType: 3, image: '/rsg-image/monthly-purchase-play.svg' },
  { label: t('playerLimit.limitHeading.dailyTimeLimit'), value: null, minimum: 0, limitType: 1, image: '/rsg-image/daily-play-limit.svg' },
  { label: t('playerLimit.limitHeading.weeklyTimeLimit'), value: null, minimum: null, limitType: 2, image: '/rsg-image/weekly-play-limit.svg' },
  { label: t('playerLimit.limitHeading.monthlyTimeLimit'), value: null, minimum: userLimits?.weeklyDepositLimit, limitType: 3, image: '/rsg-image/monthly-play-limit.svg' },
  { label: 'Take A Break', value: null, image: '/rsg-image/take-a-break.svg' },
  { label: 'Self Exclusion', value: null, selfExclusion: false, image: '/rsg-image/self-exculsion.svg' }
])

const successToggler = (data) => {
    const tempLabel = [...limitLabels]
    if(data?.groupedData?.PURCHASE && data?.groupedData?.PURCHASE?.length > 0 && 
      data?.groupedData?.PURCHASE.find((item) => item.limitType === '1')){
      tempLabel[0].value = data?.groupedData?.PURCHASE.find((item) => item.limitType === '1').amount
    }
    else{
      tempLabel[0].value = null
    }
    if(data?.groupedData?.PURCHASE && data?.groupedData?.PURCHASE?.length > 0 && 
      data?.groupedData?.PURCHASE.find((item) => item.limitType === '2')){
      tempLabel[1].value = data?.groupedData?.PURCHASE.find((item) => item.limitType === '2').amount
    }
    else{
      tempLabel[1].value = null
    }
    if(data?.groupedData?.PURCHASE && data?.groupedData?.PURCHASE?.length > 0 && 
      data?.groupedData?.PURCHASE.find((item) => item.limitType === '3')){
      tempLabel[2].value = data?.groupedData?.PURCHASE.find((item) => item.limitType === '3').amount
    }
    else{
      tempLabel[2].value = null
    }
    if(data?.groupedData?.BET && data?.groupedData?.BET?.length > 0 && 
      data?.groupedData?.BET.find((item) => item.limitType === '1')){
      tempLabel[3].value = data?.groupedData?.BET.find((item) => item.limitType === '1').amount
    }
    else{
      tempLabel[3].value = null
    }
    if(data?.groupedData?.BET && data?.groupedData?.BET?.length > 0 && 
      data?.groupedData?.BET.find((item) => item.limitType === '2')){
      tempLabel[4].value = data?.groupedData?.BET.find((item) => item.limitType === '2').amount
    }
    else{
      tempLabel[4].value = null
    }
    if(data?.groupedData?.BET && data?.groupedData?.BET?.length > 0 && 
      data?.groupedData?.BET.find((item) => item.limitType === '3')){
      tempLabel[5].value = data?.groupedData?.BET.find((item) => item.limitType === '3').amount
    }
    else{
      tempLabel[5].value = null
    }

    if (data?.groupedData?.TIME_BREAK) {
      tempLabel[6].value = data?.groupedData?.TIME_BREAK[0].amount;
    }else{
      tempLabel[6].value = null
    }
    if (data?.groupedData?.SELF_EXCLUSION) {
      tempLabel[7].selfExclusion = data?.groupedData?.SELF_EXCLUSION[0].selfExclusion;
      tempLabel[7].value = data?.groupedData?.SELF_EXCLUSION[0].selfExclusion ? 'Excluded' : 'Not Set';
    }else{
      tempLabel[7].value = null
    }
    setLimitLabels(tempLabel)
  }
  const errorToggler = () => {}
  const {
    data: _responsibleData,
    refetch: refetchGetGambling
  } = useGetPlayerResponsibleQuery({
    params: {
      userId,
      active: 1,
      timezone : timezone ? timezone : 'GMT'
    },
    successToggler,
    errorToggler,
    enabled
  })


  const getData = ({ limit, reset, label }) => {
    const timePeriod = label?.split(' ')?.[0]?.toLowerCase()
    const type = label?.split(' ')?.[1]?.toLowerCase()
    let data = {}
    
    switch (type) {
      case t('playerLimit.wager'):
        data = {
              userId: +userId,
              dailyLimit: limit,
              timePeriod,
              reset,
              type
            }
        break;
      case t('playerLimit.deposit'):
        data = {
              userId: +userId,
              depositLimit: limit,
              timePeriod,
              reset,
              type
            }
        break;
      default:
        data = {
              userId: +userId,
              lossLimit: limit,
              timePeriod,
              reset,
              type
            }
    }
    return data
  }

  const resetLimit = (label) => {
    const data = getData({ limit: 1, reset: true, label })
    handleLimitCall(data)
  }

  const updateLimit = ({ formValues, label }) => {
    const data = getData({ limit: formValues?.limit, reset: false, label })
    handleLimitCall(data)
  }

  const handleLimitCall = async (body) => {
    try {  
      body?.type === t('playerLimit.wager')
        ? await setDailyLimit({ body })
        : (
          body?.type === t('playerLimit.deposit')
              ? await setDepositLimit({ body })
              : await setLossLimit({ body })
          )
      // yield put(updateLimitsComplete())
  
      data?.reset
        ? toast(t('playerLimit.limitResetToast'), 'success')
        : toast(t('playerLimit.limitUpdatedToast'), 'success')
        
      getUserDetails()
      // yield put(getUserStart({ userId: data.userId }))
    } catch (e) {
      toast(e.message, 'error')
  
      // yield put(updateLimitsComplete(e.response.data.message))
    }
  }

  const setDisableUser = ({ formValues, reset, type }) => {
    let data = {}
    switch (type) {
      case limitName.self_exclusion_key:
        data = {
          type,
          userId: +userId,
          reset,
          days: formValues?.permanent === 'true' ? -1 : formValues?.days * 30
        }
        break;
      case limitName.take_break:
        data = {
          type: limitName.take_break_key,
          userId: +userId,
          reset: false,
          days: formValues?.limit
        }
        break;
      default:
        data = {
          userId: +userId,
          timeLimit: formValues?.limit,
          timePeriod: 'daily',
          reset: false
        }
    }
    
    handleDisableUser({ data })
  }

  const resetDisableUser = (type) => {
    let data = {}

    switch (type) {
      case limitName.self_exclusion:
        data = {
          userId: +userId,
          type: limitName.self_exclusion_key,
          days: 0,
          reset: true
        }
        break;
      case limitName.take_break:
        data = {
          userId: +userId,
          type: limitName.take_break_key,
          days: 0,
          reset: true
        }
        break;
      default:
        data = {
          timeLimit: 0,
          timePeriod: 'daily',
          userId: +userId,
          reset: true
        }
    }
    
    handleDisableUser({data})
  }

  const handleDisableUser = async (data) => {
    const {data: body} = data
    try {  
      body?.type
        ? await setDisableUntil({ body })
        : await setSessionTime({ body })
  
  
      toast(`Account ${body?.reset ? 'Enabled' : 'Disabled'} Successfully`, 'success')
      getUserDetails()
      // yield put(getUserStart({ userId: data.userId }))
    } catch (e) {  
      toast(e?.message, 'error')
    }
  }

  const handleYes = (label) => {
    (label != limitName.take_break && label != limitName.self_exclusion && label != limitName.session_limit)
      ? resetLimit(label)
      : resetDisableUser(label)
  }

  const { mutate: updateResponsibleGambling, isLoading: updateLoading } = useUpdateResponsibleMutuation({
    onSuccess: (data) => {
      refetchGetGambling()
      refetchForPlayerData()
      if (data.data.message) {
        toast(data.data.message, 'success')
      } else {
        toast(data.data.message, 'error')
      }
    },
    onError: (error) => {
      if (error?.response?.data?.errors.length > 0) {
        const { errors } = error.response.data;
        errors.map((error) => {
          if (error?.errorCode === 500) {
            toast('Something Went Wrong', 'error')
          }
          if (error?.description) {
            toast(error?.description, 'error')
          }
        })
      }
    }
  })
  const { mutate: resetResponsibleGambling } = useResetLimitMutation({
    onSuccess: (data) => {
      refetchGetGambling()
      refetchForPlayerData()
      if (data.data.message) {
        toast(data.data.message, 'success')
      } else {
        toast(data.data.message, 'error')
      }
    },
    onError: (error) => {
      if (error?.response?.data?.errors.length > 0) {
        const { errors } = error.response.data;
        errors.map((error) => {
          if (error?.errorCode === 500) {
            toast('Something Went Wrong', 'error')
          }
          if (error?.description) {
            toast(error?.description, 'error')
          }
        })
      }
    }
  })
  return {
    t,
    limitLabels,
    setLimit,
    resetLimit,
    setLimitModal,
    limitModal,
    limit,
    updateLimit,
    resetDisableUser,
    exclusionModal,
    setExclusionModal,
    setDisableUser,
    resetModal,
    setResetModal,
    handleYes,
    data,
    setData,
    updateResponsibleGambling,
    resetResponsibleGambling,
    updateLoading,
    userId,
  }
}

export default useResponsibleGaming
