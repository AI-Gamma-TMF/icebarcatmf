import React from 'react'
import Preloader from '../../../components/Preloader'
import useBonusDetail from '../hooks/useBonusDetail'
import CreateReferralBonus from './CreateReferralBonus'

const ReferralBonusDetail = () => {
  const { bonusByPageData, loading } = useBonusDetail()
  if(loading) return <Preloader />
  return <CreateReferralBonus bonusData={bonusByPageData?.rows[0]} details />
}

export default ReferralBonusDetail
