import React from 'react'
import Preloader from '../../../components/Preloader'
import CreateGamePage from './CreateGamePage'
import useGamePageDetails from '../hooks/useGamePageDetails';

const GamePageDetail = () => {
  const { gamePageDetail, loading } = useGamePageDetails();
  if(loading) return <Preloader />
  return <CreateGamePage gamePageData={gamePageDetail} details />
}

export default GamePageDetail
