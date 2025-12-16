import React from 'react'
import Preloader from '../../../components/Preloader'
import CreateGamePageCard from './CreateGamePageCard'
import useEditGameCard from '../hooks/useEditGameCard'

const EditGamePageCard = () => {
  const { gameCardDetail, gameCardEditLoading } = useEditGameCard();
  if(gameCardEditLoading) return <Preloader />
  return <CreateGamePageCard gameCardDetails={gameCardDetail} loading={false}/>
}

export default EditGamePageCard
