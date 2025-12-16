import React from 'react'
import Preloader from '../../../components/Preloader'
import CreateGamePage from './CreateGamePage'
import useGamePageDetails from '../hooks/useGamePageDetails'

const EditGamePage = () => {
  const { gamePageDetail, loading } = useGamePageDetails();
  if(loading) return <Preloader />
  return <CreateGamePage gamePageData={gamePageDetail} loading={false}/>
}

export default EditGamePage
