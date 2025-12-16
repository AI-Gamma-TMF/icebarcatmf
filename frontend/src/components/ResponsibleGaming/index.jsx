import { Card } from '@themesberg/react-bootstrap'
import React from 'react'
import Limit from './Limit'
import './style.scss'
import useResponsibleGaming from './useResponsibleGaming'
import useCheckPermission from '../../utils/checkPermission'
import SelfExclusion from './SelfExclusion'
import { ResetConfirmationModal } from '../ConfirmationModal'
import { limitName, getDateAfterShweepDay } from './constants'
import LimitLabels from './LimitLabels'

const ResponsibleGaming = ({ userLimits, currencyCode, getUserDetails, refetchForPlayerData }) => {
  const {
    t,
    limitLabels,
    setLimit,
    setLimitModal,
    limitModal,
    limit,
    // updateLimit,
    exclusionModal,
    setExclusionModal,
    setDisableUser,
    resetModal,
    setResetModal,
    handleYes,
    data,
    // setData,
    updateResponsibleGambling,
    resetResponsibleGambling,
    // updateLoading,
    userId
  } = useResponsibleGaming({ userLimits, getUserDetails ,refetchForPlayerData})

  const { isHidden } = useCheckPermission()
//   const updateLimitForModal = (limit?.label === limitName.take_break || limit?.label === limitName.session_limit) ? setDisableUser : updateLimit
	const updateLimitForModal = (formValues) => {
    if (limit.label === limitName.daily_purchase_limit ||
      limit.label === limitName.weekly_purchase_limit ||
      limit.label === limitName.monthly_purchase_limit) {
      updateResponsibleGambling({
        responsibleGamblingType: '2',
        limitType: limit.limitType.toString(),
        userId: Number(userId),
        reason: formValues.formValues.reason,
        favorite: formValues.formValues.isFavorite,
        amount: formValues.formValues.limit
      })
    }
    if (limit.label === limitName.daily_bet_limit ||
      limit.label === limitName.weekly_bet_limit ||
      limit.label === limitName.monthly_bet_limit) {
      updateResponsibleGambling({
        responsibleGamblingType: '1',
        limitType: limit.limitType.toString(),
        userId: Number(userId),
        reason: formValues.formValues.reason,
        favorite: formValues.formValues.isFavorite,
        amount: formValues.formValues.limit
      })
    }
    if (limit.label === limitName.take_break) {
      updateResponsibleGambling({
        responsibleGamblingType: '4',
        userId: Number(userId),
        reason: formValues.formValues.reason,
        favorite: formValues.formValues.isFavorite,
        amount: Number(formValues.formValues.limit),
        timeBreakDuration: getDateAfterShweepDay(formValues.formValues.limit)?.formattedDate  
      })
    }
    if(limit.label === limitName.self_exclusion) {
      updateResponsibleGambling({
        responsibleGamblingType: '5',
        userId: Number(userId),
        reason: formValues.formValues.reason,
        favorite: formValues.formValues.isFavorite,
        selfExclusion: true
      })
    }
} 
const resetLimit = (formValues) => {
 
  if (limit.label === limitName.daily_purchase_limit ||
    limit.label === limitName.weekly_purchase_limit ||
    limit.label === limitName.monthly_purchase_limit) {
      resetResponsibleGambling({
      responsibleGamblingType: '2',
      limitType: limit.limitType.toString(),
      userId: Number(userId),
      amount: formValues.formValues.limit
    })
  }
  if (limit.label === limitName.daily_bet_limit ||
    limit.label === limitName.weekly_bet_limit ||
    limit.label === limitName.monthly_bet_limit) {
      resetResponsibleGambling({
      responsibleGamblingType: '1',
      limitType: limit.limitType.toString(),
      userId: Number(userId),
      amount: formValues.formValues.limit
    })
  }
  if (limit.label === limitName.take_break) {
    resetResponsibleGambling({
      responsibleGamblingType: '4',
      userId: Number(userId),
    })
  }
  if(limit.label === limitName.self_exclusion) {
    resetResponsibleGambling({
      responsibleGamblingType: '5',
      userId: Number(userId),
      selfExclusion:  false 
    })
  }

}
  return (
    <>
      <Card className='card-overview'>
        <h4 className='h4-overview'>Limits <hr className='h4-hr' /></h4>
        <div className='div-overview limit row w-100 m-auto'>
           {limitLabels?.map(({ label, value, minimum, limitType, selfExclusion,image },index) => {
            return <LimitLabels 
            key={index}
            label={label}
            value={value}
            minimum={minimum}
            limitType={limitType}
            limitLabels={limitLabels}
            selfExclusion={selfExclusion}
            setLimitModal={setLimitModal}
            setLimit={setLimit}
            t={t}
            isHidden={isHidden}
            image={image}
          />
           })}
        </div>
      </Card>
      {limitModal &&
        <Limit
          t={t}
          show={limitModal}
          setShow={setLimitModal}
          limit={limit}
          updateLimit={updateLimitForModal}
          currencyCode={currencyCode}
          resetLimit={resetLimit}
        />}

      {exclusionModal &&
        <SelfExclusion
          t={t}
          show={exclusionModal}
          setShow={setExclusionModal}
          limit={limit}
          updateLimit={setDisableUser}
        />}

      {resetModal &&
        <ResetConfirmationModal
          t={t}
          show={resetModal}
          setShow={setResetModal}
          handleYes={handleYes}
          data={data}
        />}
    </>
  )
}

export default ResponsibleGaming