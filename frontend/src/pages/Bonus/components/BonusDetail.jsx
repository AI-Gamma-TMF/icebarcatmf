import React from 'react'
import Preloader from '../../../components/Preloader'
import useBonusDetails from '../hooks/useBonusDetail'
import CreateBonus from './CreateBonus'

const BonusDetail = () => {
  const { bonusByPageData, loading } = useBonusDetails()
  if(loading) return <Preloader />
  return <CreateBonus bonusData={bonusByPageData?.rows[0]} details />
}

export default BonusDetail
