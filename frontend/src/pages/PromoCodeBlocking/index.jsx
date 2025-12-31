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
import './promocodeBlocking.scss'

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
      <div className='dashboard-typography promocode-blocking-page'>
        <div className='d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3'>
          <div>
            <h3 className='promocode-blocking-page__title'>{t('Promocode Restricted Players')}</h3>
            <p className='promocode-blocking-page__subtitle'>
              Block or unblock players from applying promo codes
            </p>
          </div>

          <div className='promocode-blocking-page__actions'>
            <Button
              variant='outline-success'
              className='promocode-blocking-page__action-btn'
              onClick={() => handleMultipleUnblock()}
              hidden={isHidden({ module: { key: 'BlockUsers', value: 'C' } })}
            >
              Unblock
            </Button>
            <Button
              variant='outline-danger'
              className='promocode-blocking-page__action-btn'
              onClick={() => handleMultipleBlock()}
              hidden={isHidden({ module: { key: 'BlockUsers', value: 'C' } })}
            >
              Block
            </Button>
          </div>
        </div>

        <Card className='dashboard-filters promocode-blocking-filters mb-4'>
          <Card.Body>
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
          </Card.Body>
        </Card>

        <div className='dashboard-data-table'>
          <div className='promocode-blocking-table-wrap'>
            <Table bordered hover responsive size='sm' className='mb-0 text-center'>
              <thead>
                <tr>
                  <th className='text-center'>
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                  </th>
                  {tableHeaders.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => h.value !== '' && handlePlayerTableSorting(h)}
                      style={{
                        cursor: h.value !== 'actions' ? 'pointer' : 'default'
                      }}
                      className={selected(h) ? 'sortable active' : 'sortable'}
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

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={tableHeaders.length + 1} className="text-center py-4">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : playersData && playersData.rows.length > 0 ? (
                  playersData?.rows.map((player) => {
                    return (
                      <tr
                        key={player.userId}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          const contextMenu = document.getElementById(`contextMenu-${player.userId}`);
                          contextMenu.style.top = `${e.clientY}px`;
                          contextMenu.style.left = `${e.clientX}px`;
                          contextMenu.style.display = 'block';
                        }}
                      >
                        <td>
                          <input
                            type="checkbox"
                            id={`${player.userId}-multiple`}
                            name="multi-select"
                            checked={multiSelectPlayers.includes(player.userId)}
                            onChange={() => {
                              handleMultiSelect(player)
                            }}
                          />
                        </td>
                        <td>{player.userId}</td>
                        <td>{player.email}</td>
                        <td>{player.username || 'NA'}</td>
                        <td>
                          {(player.firstName && player.lastName) ? `${player.firstName} ${player.lastName}` : 'NA'}
                        </td>
                        <td>
                          <span
                            className={
                              player.isAvailPromocodeBlocked === true
                                ? 'promocode-blocking-pill promocode-blocking-pill--blocked'
                                : 'promocode-blocking-pill promocode-blocking-pill--unblocked'
                            }
                          >
                            {player.isAvailPromocodeBlocked === true ? 'Blocked' : 'Unblocked'}
                          </span>
                        </td>
                        <td>
                          <div className='promocode-blocking-actions'>
                            <Trigger message='View' id={player.userId + 'view'} />
                            <Button
                              id={player.userId + 'view'}
                              className='promocode-blocking-icon-btn'
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
                              className='promocode-blocking-context-menu'
                            >
                              <button
                                type="button"
                                className='promocode-blocking-context-item'
                                onClick={() => {
                                  window.open(
                                    `${AdminRoutes.PlayerDetails.split(':').shift()}${player.userId}`,
                                    '_blank'
                                  );
                                  document.getElementById(`contextMenu-${player.userId}`).style.display = 'none';
                                }}
                              >
                                Open in new tab
                              </button>
                            </div>

                            {player.isAvailPromocodeBlocked === true ? (
                              <>
                                <Trigger message='Set Promocode Unblock' id={player.userId + 'active'} />
                                <Button
                                  id={player.userId + 'active'}
                                  className='promocode-blocking-icon-btn'
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
                              </>
                            ) : (
                              <>
                                <Trigger message='Set Promocode Block' id={player.userId + 'inactive'} />
                                <Button
                                  id={player.userId + 'inactive'}
                                  className='promocode-blocking-icon-btn'
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
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length + 1} className='text-center py-4 promocode-blocking-empty'>
                      {t('No Data Found')}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {playersData?.rows?.length !== 0 && (
          <PaginationComponent
            page={playersData?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </div>
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