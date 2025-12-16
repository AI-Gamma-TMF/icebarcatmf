import React from 'react'
import useTournamentDetails from '../hooks/useTournamentDetails'
import CreateTournament from './CreateTournament'
import Preloader from '../../../components/Preloader'

const EditTournament = () => {
  const { tournamentData,
    loading, refetchTournament, page, setPage, totalPages, limit, setLimit, getCsvDownloadUrl,
    importedFile,
    setImportedFile,
    uploadCSVLoading,
    importModalShow,
    setImportModalShow,
    handleCSVSumbit,
    search,
    setSearch } = useTournamentDetails({ isEdit: false, isView: true, tournamentId: '' })

  return <>
    {loading && <Preloader />}
    <CreateTournament data={tournamentData} details refetchTournament={refetchTournament} page={page} setPage={setPage}
      totalPages={totalPages} limit={limit} setLimit={setLimit} getCsvDownloadUrl={getCsvDownloadUrl}
      importedFile={importedFile}
      setImportedFile={setImportedFile}
      uploadCSVLoading={uploadCSVLoading}
      importModalShow={importModalShow}
      setImportModalShow={setImportModalShow}
      handleCSVSumbit={handleCSVSumbit}
      search={search}
      setSearch={setSearch}
    />
  </>
}

export default EditTournament
