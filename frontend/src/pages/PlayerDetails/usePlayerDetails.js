import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import moment from 'moment-timezone'
import { useParams } from 'react-router-dom'
import { getDateTime } from '../../utils/dateFormatter'
import { getPlayerById } from '../../utils/apiCalls'
import { useGetPlayerResponsibleQuery } from '../../reactQuery/hooks/customQueryHook'
import { useTranslation } from 'react-i18next'
import { commonDateTimeFormat, convertToTimeZone, getFormattedTimeZoneOffset } from '../../utils/helper'
import { getItem } from '../../utils/storageUtils'
import { timeZones } from '../Dashboard/constants'

const usePlayerDetails = () => {
  const { t } = useTranslation('players')
  // const [selectedTab, setSelectedTab] = useState('overview')
  // const [showManageMoneyModal, setShowManageMoneyModal] = useState(false)
  const [refetchActivity, setRefetchActivity] = useState(false)
  const timezone = getItem('timezone');
  const { userId } = useParams()
  const methods = ["Email", "Google", "Facebook", "Apple", "Phone"]
  const [limitLabels, setLimitLabels] = useState([
    { label: t('playerLimit.limitHeading.dailyWageLimit'), value: null, minimum: 0, limitType: 1, image: '', message:'' },
    { label: t('playerLimit.limitHeading.weeklyWageLimit'), value: null, minimum: null, limitType: 2, image: '', message:'' },
    { label: t('playerLimit.limitHeading.monthlyWageLimit'), value: null, minimum: null, limitType: 3, image: '', message:'' },
    { label: t('playerLimit.limitHeading.dailyTimeLimit'), value: null, minimum: 0, limitType: 1, image: '', message:'' },
    { label: t('playerLimit.limitHeading.weeklyTimeLimit'), value: null, minimum: null, limitType: 2, image: '', message:'' },
    { label: t('playerLimit.limitHeading.monthlyTimeLimit'), value: null, minimum: 0, limitType: 3, image: '', message:'' },
    { label: 'Take A Break', value: null, image: '', message:'', timeBreakDuration:null },
    { label: 'Self Exclusion', value: null, selfExclusion: false, image: '', message:'' }
  ])
  const timeZone = getItem("timezone");
  const timezoneOffset = timeZone != null ? timeZones.find(x => x.code === timeZone).value : getFormattedTimeZoneOffset()
  

  const successToggler = (data) => {
    console.log("this hit on reset", data)
    const tempLabel = [...limitLabels]
    if (data?.groupedData?.PURCHASE && data?.groupedData?.PURCHASE?.length > 0 &&
      data?.groupedData?.PURCHASE.find((item) => item.limitType === '1')) {
      tempLabel[0].value = data?.groupedData?.PURCHASE.find((item) => item.limitType === '1').amount
      tempLabel[0].image = '/rsg-image/daily-purchase-limit.svg'
      tempLabel[0].message = data?.groupedData?.PURCHASE.find((item) => item.limitType === '1').message
    }
    else {
      tempLabel[0].value = null
      tempLabel[0].image = ''
      tempLabel[0].message = ''
    }
    if (data?.groupedData?.PURCHASE && data?.groupedData?.PURCHASE?.length > 0 &&
      data?.groupedData?.PURCHASE.find((item) => item.limitType === '2')) {
      tempLabel[1].value = data?.groupedData?.PURCHASE.find((item) => item.limitType === '2').amount
      tempLabel[1].image = '/rsg-image/weekly-purchase-limit.svg'
      tempLabel[1].message = data?.groupedData?.PURCHASE.find((item) => item.limitType === '2').message
    }
    else {
      tempLabel[1].value = null
      tempLabel[1].image = ''
      tempLabel[1].message = ''
    }
    if (data?.groupedData?.PURCHASE && data?.groupedData?.PURCHASE?.length > 0 &&
      data?.groupedData?.PURCHASE.find((item) => item.limitType === '3')) {
      tempLabel[2].value = data?.groupedData?.PURCHASE.find((item) => item.limitType === '3').amount
      tempLabel[2].image = '/rsg-image/monthly-purchase-play.svg'
      tempLabel[2].message = data?.groupedData?.PURCHASE.find((item) => item.limitType === '3').message
    }
    else {
      tempLabel[2].value = null
      tempLabel[2].image = ''
      tempLabel[2].message = ''
    }
    if (data?.groupedData?.BET && data?.groupedData?.BET?.length > 0 &&
      data?.groupedData?.BET.find((item) => item.limitType === '1')) {
      tempLabel[3].value = data?.groupedData?.BET.find((item) => item.limitType === '1').amount
      tempLabel[3].image = '/rsg-image/daily-play-limit.svg'
      tempLabel[3].message = data?.groupedData?.BET.find((item) => item.limitType === '1').message
    }
    else {
      tempLabel[3].value = null
      tempLabel[3].image = ''
      tempLabel[3].message = ''
    }
    if (data?.groupedData?.BET && data?.groupedData?.BET?.length > 0 &&
      data?.groupedData?.BET.find((item) => item.limitType === '2')) {
      tempLabel[4].value = data?.groupedData?.BET.find((item) => item.limitType === '2').amount
      tempLabel[4].image = '/rsg-image/weekly-play-limit.svg'
      tempLabel[4].message = data?.groupedData?.BET.find((item) => item.limitType === '2').message
    }
    else {
      tempLabel[4].value = null
      tempLabel[4].image = ''
      tempLabel[4].message = ''
    }
    if (data?.groupedData?.BET && data?.groupedData?.BET?.length > 0 &&
      data?.groupedData?.BET.find((item) => item.limitType === '3')) {
      tempLabel[5].value = data?.groupedData?.BET.find((item) => item.limitType === '3').amount
      tempLabel[5].image = '/rsg-image/monthly-play-limit.svg'
      tempLabel[5].message = data?.groupedData?.BET.find((item) => item.limitType === '3').message
    }
    else {
      tempLabel[5].value = null
      tempLabel[5].image = ''
      tempLabel[5].message = ''
    }

    if (data?.groupedData?.TIME_BREAK) {
      tempLabel[6].value = data?.groupedData?.TIME_BREAK[0].amount;
      tempLabel[6].image = '/rsg-image/take-a-break.svg'
      tempLabel[6].message = data?.groupedData?.TIME_BREAK[0]?.message
      tempLabel[6].timeBreakDuration= data?.groupedData?.TIME_BREAK[0]?.timeBreakDuration

    } else {
      tempLabel[6].value = null
      tempLabel[6].image = ''
      tempLabel[6].message = ''
    }
    if (data?.groupedData?.SELF_EXCLUSION) {
      tempLabel[7].selfExclusion = data?.groupedData?.SELF_EXCLUSION[0].selfExclusion;
      tempLabel[7].value = data?.groupedData?.SELF_EXCLUSION[0].selfExclusion ? 'Excluded' : 'Not Set';
      tempLabel[7].image = '/rsg-image/self-exculsion.svg'
      tempLabel[7].message = data?.groupedData?.SELF_EXCLUSION[0].message;
    } else {
      tempLabel[7].value = null
      tempLabel[7].image = ''
      tempLabel[7].message = ''
    }
    setLimitLabels(tempLabel)
  }
  useEffect(()=>{
    if(limitLabels?.[6]?.value){
      const updatedLabels = [...limitLabels] // clone the array
      updatedLabels[6] = {
        ...updatedLabels[6],
        message: `User is on Time Break until ${getDateTime(
          convertToTimeZone(
            moment(limitLabels?.[6].timeBreakDuration).format(commonDateTimeFormat.dateWithTime),
            timezoneOffset
          )
        )}`
      }
  
      setLimitLabels(updatedLabels)
    }
  }, [timeZone])
  const errorToggler = () => { }
  const { refetch:refetchForPlayerData } = useGetPlayerResponsibleQuery({ params: { userId, active: 1, timezone : timezone ? timezone : 'GMT' }, successToggler, errorToggler })

  const { isLoading: loading, data: res, refetch: getUserDetails } = useQuery({
    queryKey: ['players', userId],
    queryFn: ({ queryKey }) => {
      const params = queryKey[1] ? { userId: queryKey[1] } : {}
      return getPlayerById(params)
    },
    refetchOnWindowFocus: false,
  })

  const userData = res?.data?.user
  const basicInfo = [

    { label: 'ID', value: userId },
    { label: 'Email', value: userData?.email },
    { label: 'First Name', value: userData?.firstName || 'NA' },
    { label: 'Last Name', value: userData?.lastName || 'NA' },
    { label: 'DOB', value: userData?.dateOfBirth ? moment(new Date(userData?.dateOfBirth)).format(commonDateTimeFormat.date) : 'NA' },
    { label: 'Country', value: 'United States Of America' },
    {
      label: 'KYC Level', value: userData?.kycStatus == 'K0' ? 'VL0' :
        (userData?.kycStatus == 'K1' ? 'VL1' :
          (userData?.kycStatus == 'K2') ? 'VL2' :
            (userData?.kycStatus == 'K3') ? 'VL3' : 'VL4'
        ) || 'NA'
    },
    { label: 'Registration Date', value: getDateTime(convertToTimeZone(moment(userData?.createdAt).format(commonDateTimeFormat.dateWithTime), timezoneOffset)) },
    { label: 'Affiliate Id', value: userData?.affiliateId },
    { label: 'Click Id', value: userData?.affiliateCode?.replaceAll('-', '') },
    { label: 'Phone Code', value: userData?.phoneCode !== null ? `+${userData?.phoneCode}` : 'NA' },
    { label: 'Phone', value: userData?.phone },
    { label: '2FA', value: userData?.is2FAEnable },
    { label: 'Tier', value: userData?.tierDetails?.currentTier?.name },
    { label: 'Last Login', value: userData?.lastLoginDate ? getDateTime(convertToTimeZone(moment(userData?.lastLoginDate).format(commonDateTimeFormat.dateWithTime), timezoneOffset)) : 'NA' },
    { label: 'Play Through', value: userData?.UserReport?.playThrough },
    { label: 'Logged In Method', value: methods[userData?.signInMethod] || "Unknown"}
  ]

  const alertInfo = [
    { label: 'Redemption', value: userData?.userPendingRedemptionTickets },
    { label: 'Expiry', value: userData?.userPendingExpiryTickets },
    { label: 'Fraud', value: userData?.userPendingFraudTickets },
    { label: 'Verification', value: userData?.userPendingVerificationTickets },

  ]

  const handelRefetchActivity = (data) => {
    setRefetchActivity(data)
  }

  return {
    userData,
    loading,
    basicInfo,
    alertInfo,
    getUserDetails,
    t,
    refetchActivity,
    handelRefetchActivity,
    refetchForPlayerData,limitLabels
  }
}

export default usePlayerDetails
