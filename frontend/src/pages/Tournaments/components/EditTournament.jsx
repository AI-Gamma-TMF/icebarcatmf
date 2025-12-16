import React from 'react'
import useTournamentDetails from '../hooks/useTournamentDetails'
import CreateTournament from './CreateTournament'
import Preloader from '../../../components/Preloader'

const EditTournament = () => {

  const { tournamentData,
    loading, refetchTournament } = useTournamentDetails({ isEdit: true, isView: false, tournamentId: '' })

  if (loading) return <Preloader />
  return <CreateTournament data={tournamentData} type={"EDIT"} refetchTournament={refetchTournament} loading={loading} />
}

export default EditTournament
