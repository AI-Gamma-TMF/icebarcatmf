import React from 'react'
import Preloader from '../../../components/Preloader'
import CreateTier from './CreateTier'
import useTierDetails from '../hooks/useTierDetails'

const ViewTier = () => {
  const {  tournamentData,loading} = useTierDetails()
  if(loading) return <Preloader />
  return <CreateTier data={tournamentData}  details/>
}

export default ViewTier
