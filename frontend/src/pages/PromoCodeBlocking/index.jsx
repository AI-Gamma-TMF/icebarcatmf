import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Button, Table } from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCheckSquare, faWindowClose, faArrowCircleUp, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'
import usePlayerListing from './usePlayerListing'
import PaginationComponent from '../../components/Pagination'
import { AdminRoutes } from '../../routes'
import { tableHeaders } from './constants'
import { InlineLoader } from '../../components/Preloader'
import Trigger from '../../components/OverlayTrigger'
import useCheckPermission from '../../utils/checkPermission'
import PlayerSearch from './PlayerSearch'
import { PromocodeBlockModal } from './Components/PromocodeBlockModal'
import { toast } from '../../components/Toast'
import ImportCsvModal from './Components/ImportCsvModal'

const PromoCodeBlocking = () => {
  const { t, navigate, selected, loading, sort, setStatusShow, statusShow, handleYes, status,
    setSort, over, setOver, playersData, totalPages, page, setPage, limit, setLimit, setOrderBy, handleStatusShow,
    globalSearch,
    setGlobalSearch,
    orderBy,
    getCsvDownloadUrl,
    playerId,
    playerDetail, updateloading,
    multiSelectPlayers,
    setMultiSelectPlayers,
    selectAll, setSelectAll,
    importedFile,
    setImportedFile,
    uploadCSVLoading,
    importModalShow,
    setImportModalShow,
    handleCSVSumbit,
    importAction,
    setImportAction,
    promocodeStatus,
    setPromocodeStatus
  } = usePlayerListing();

  const { isHidden } = useCheckPermission()
  const [modalText, setModalText] = useState('player')

  const handlePlayerTableSorting = (param) => {
    if (param.value === orderBy) {
      setSort(sort === "asc" ? "desc" : "asc");
    }
    else if (param.value === "promocode") {
      return;
    }
    else if (param.value === "actions") {
      return;
    }
    else {
      setOrderBy(param.value)
      setSort('asc');
    }
  }

  const handleMultiSelect = (player) => {
    setMultiSelectPlayers((prevIds) => {
      const isAlreadySelected = prevIds.includes(player.userId);
      const updatedIds = isAlreadySelected
        ? prevIds.filter((i) => i !== player.userId) // Remove if already present
        : [...prevIds, player.userId]; // Add if not present

      // Update the "Select All" state based on the updated list
      if (updatedIds.length === playersData.rows.length) {
        setSelectAll(true);
      } else {
        setSelectAll(false);
      }

      return updatedIds;
    });
  };

  const handleMultipleBlock = () => {
    if (multiSelectPlayers.length > 0) {
      handleStatusShow(
        null,
        false,
      )
    } else {
      toast('No players selected', 'error')
    }
  }

  const handleMultipleUnblock = () => {
    if (multiSelectPlayers.length > 0) {
      handleStatusShow(
        null,
        true,
      )
    } else {
      toast('No players selected', 'error')
    }
  }

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all players
      setMultiSelectPlayers(playersData.rows.map(player => player.userId));
    } else {
      // Deselect all players
      setMultiSelectPlayers([]);
    }
  };

  useEffect(() => {
    if (multiSelectPlayers.length > 1) {
      setModalText('players')
    } else {
      setModalText('player')
    }
  }, [multiSelectPlayers])

  useEffect(() => {
    setSelectAll(false)
    setMultiSelectPlayers([])
  }, [page])

  return (
    <>
      <Card className='p-2 mb-2'>
        <Row>
          <Col>
            <h3>{t('Promocode Restricted Players')}</h3>
          </Col>
        </Row>
        <PlayerSearch
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          getCsvDownloadUrl={getCsvDownloadUrl}
          playersData={playersData}
          setSelectAll={setSelectAll}
          setMultiSelectPlayers={setMultiSelectPlayers}
          setPage={setPage}
          setImportedFile={setImportedFile}
          setImportModalShow={setImportModalShow}
          promocodeStatus={promocodeStatus}
          setPromocodeStatus={setPromocodeStatus}
        />
        <Row className='mt-3 pagination justify-content-center align-items-center'>
          <Col className='col-lg-1 col-sm-4 col-12 p-0'>
            <Button
              variant='success'
              onClick={() => handleMultipleUnblock()}
              style={{ width: '90%' }}
              hidden={isHidden({ module: { key: 'BlockUsers', value: 'C' } })}
            >
              Unblock
            </Button>
          </Col>
          <Col className='col-lg-1 col-sm-4 col-12 p-0'>
            <Button
              variant='danger'
              onClick={() => handleMultipleBlock()}
              style={{ width: '90%' }}
              hidden={isHidden({ module: { key: 'BlockUsers', value: 'C' } })}
            >
              Block
            </Button>
          </Col>
        </Row>
        <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
          <thead className='thead-dark'>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              {tableHeaders.map((h, idx) => (
                <th
                  key={idx}
                  onClick={() => h.value !== '' && handlePlayerTableSorting(h)}
                  style={{
                    cursor: (h.value !== 'actions' && 'pointer')
                  }}
                  className={
                    selected(h)
                      ? 'border-3 border border-blue'
                      : ''
                  }
                >
                  {t(h.labelKey)}{' '}
                  {selected(h) &&
                    (sort === 'asc'
                      ? (
                        <FontAwesomeIcon
                          style={over ? { color: 'red' } : {}}
                          icon={faArrowCircleUp}
                          onClick={() => setSort('desc')}
                          onMouseOver={() => setOver(true)}
                          onMouseLeave={() => setOver(false)}
                        />
                      )
                      : (
                        <FontAwesomeIcon
                          style={over ? { color: 'red' } : {}}
                          icon={faArrowCircleDown}
                          onClick={() => setSort('asc')}
                          onMouseOver={() => setOver(true)}
                          onMouseLeave={() => setOver(false)}
                        />
                      ))}
                </th>
              ))}
            </tr>
          </thead>

          {loading ? (
            <tr>
              <td colSpan={10} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : (
            <tbody>
              {playersData && playersData.rows.length > 0 ? (
                playersData?.rows.map((player) => {
                  return (
                    <tr key={player.userId}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        const contextMenu = document.getElementById(`contextMenu-${player.userId}`);
                        contextMenu.style.top = `${e.clientY}px`;
                        contextMenu.style.left = `${e.clientX}px`;
                        contextMenu.style.display = 'block';
                      }}>
                      <td>
                        <input
                          type="checkbox"
                          id={`${player.userId}-multiple`}
                          name="multi-select"
                          checked={multiSelectPlayers.includes(player.userId)}
                          onChange={() => {
                            handleMultiSelect(player)
                          }}
                        ></input>
                      </td>
                      <td>{player.userId}</td>
                      <td>{player.email}</td>
                      <td>{player.username || 'NA'}</td>
                      <td>
                        {(player.firstName && player.lastName) ? `${player.firstName} ${player.lastName}` : 'NA'}
                      </td>
                      <td>
                        {player.isAvailPromocodeBlocked === true ? <span className='text-danger'>Blocked</span> : <span className='text-success'>Unblocked</span>}
                      </td>
                      <td>
                        <Trigger message='View' id={player.userId + 'view'} />
                        <Button
                          id={player.userId + 'view'}
                          className='m-1'
                          size='sm'
                          variant='info'
                          onClick={() => {
                            navigate(
                              `${AdminRoutes.PlayerDetails.split(':').shift()}${player.userId}`
                            )
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        <div
                          id={`contextMenu-${player.userId}`}
                          style={{
                            position: 'fixed',
                            display: 'none',
                            backgroundColor: 'white',
                            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                            borderRadius: '5px',
                            padding: '5px',
                            zIndex: '9999',
                          }}
                        >
                          <div
                            onClick={() => {
                              window.open(
                                `${AdminRoutes.PlayerDetails.split(':').shift()}${player.userId}`,
                                '_blank'
                              );
                              document.getElementById(`contextMenu-${player.userId}`).style.display = 'none';
                            }}
                            style={{
                              cursor: 'pointer',
                              padding: '5px',
                            }}
                          >
                            Open in new tab
                          </div>
                        </div>
                        {/* Code to set Player Promocode Block   */}
                        {player.isAvailPromocodeBlocked === true
                          ? (
                            <>
                              <Trigger message='Set Promocode Unblock' id={player.userId + 'active'} />
                              <Button
                                id={player.userId + 'active'}
                                className='m-1'
                                size='sm'
                                variant='success'
                                onClick={() =>
                                  handleStatusShow(
                                    player.userId,
                                    player.isAvailPromocodeBlocked,
                                    player?.statusDetails,
                                    player
                                  )}
                                hidden={isHidden({ module: { key: 'Users', value: 'T' } })}
                              >
                                <FontAwesomeIcon icon={faCheckSquare} />
                              </Button>
                            </>) : (
                            <>
                              <Trigger message='Set Promocode Block' id={player.userId + 'inactive'} />
                              <Button
                                id={player.userId + 'inactive'}
                                className='m-1'
                                size='sm'
                                variant='danger'
                                onClick={() =>
                                  handleStatusShow(
                                    player.userId,
                                    player.isAvailPromocodeBlocked,
                                    player?.statusDetails,
                                    player
                                  )}
                                hidden={isHidden({ module: { key: 'Users', value: 'T' } })}
                              >
                                <FontAwesomeIcon icon={faWindowClose} />
                              </Button>
                            </>
                          )}
                      </td>
                    </tr>
                  )
                }
                )
              ) : (
                <tr>
                  <td colSpan={6} className='text-danger text-center'>
                    {t('No Data Found')}
                  </td>
                </tr>
              )
              }
            </tbody>
          )}
        </Table>
        {playersData?.rows?.length !== 0 && (
          <PaginationComponent
            page={playersData?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </Card>
      {statusShow && <PromocodeBlockModal
        setShow={setStatusShow}
        show={statusShow}
        handleYes={handleYes}
        active={status}
        playerId={playerId}
        playerDetail={playerDetail}
        loading={updateloading}
        modalText={modalText}
        setPage={setPage}
      />}
      {importModalShow && <ImportCsvModal
        setShow={setImportModalShow}
        show={importModalShow}
        handleYes={handleCSVSumbit}
        loading={uploadCSVLoading}
        importedFile={importedFile}
        importAction={importAction}
        setImportAction={setImportAction}
      />}
    </>
  )
}

export default PromoCodeBlocking