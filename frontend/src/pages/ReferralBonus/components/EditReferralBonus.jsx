import React from 'react'
import Preloader from '../../../components/Preloader'
import useBonusDetails from '../hooks/useBonusDetail'
import CreateReferralBonus from './CreateReferralBonus'

const EditReferralBonus = () => {
  const { bonusByPageData, loading } = useBonusDetails()
  
  if(loading) return <Preloader />
  return <CreateReferralBonus bonusData={bonusByPageData?.rows[0]} />
}

export default EditReferralBonus
