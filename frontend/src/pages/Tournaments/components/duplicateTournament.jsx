import React from 'react'
import useTournamentDetails from '../hooks/useTournamentDetails'
import CreateTournament from './CreateTournament'
import Preloader from '../../../components/Preloader'
import { useLocation } from 'react-router-dom'

const DuplicateTournament = () => {


    const location = useLocation()

    const duplicateTournamentId = location?.state?.duplicateTournamentId
    const isDuplicate = !!duplicateTournamentId;
    const { selectedTournamentData, selectedTournamentLoading } = useTournamentDetails({ isEdit: false, isView: false, tournamentId: duplicateTournamentId })

    if (selectedTournamentLoading) return <Preloader />
    return <CreateTournament selectedTournamentData={selectedTournamentData} type={"CREATE_DUPLICATE"} isDuplicate={isDuplicate} />
}

export default DuplicateTournament
