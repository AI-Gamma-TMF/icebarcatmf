import React from 'react'
import {
  Table,
  Button
} from '@themesberg/react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlusSquare,
  faMinusSquare
} from '@fortawesome/free-solid-svg-icons'

import PaginationComponent from '../../../../components/Pagination'
import Trigger from '../../../../components/OverlayTrigger'
import { useTranslation } from 'react-i18next'

const GamesList = ({
  page,
  limit,
  setLimit,
  setPage,
  totalPages,
  games,
  addGame,
  removeGame,
  disablePagination = false,
  hasActions = false,
  hasAddGamesAction = false,
  hasRemoveGamesAction = false
}) => {
  const { t } = useTranslation(['countries'])

  return (
    <>
      <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
        <thead className='thead-dark'>
          <tr>
            {[
              t('restrictedProvider.headers.id'),
              t('restrictedProvider.headers.name'),
              t('restrictedProvider.headers.status'),
              t('restrictedProvider.headers.operatorStatus')
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
            {hasActions && <th>{t('restrictedProvider.headers.actions')}</th>}
          </tr>
        </thead>

        <tbody>
          {games?.count > 0 &&
                    games?.rows?.map(
                      ({
                        masterCasinoGameId,
                        name,
                        isActive,
                        operatorStatus
                      }) => {
                        return (
                          <tr key={masterCasinoGameId}>

                            <td>{masterCasinoGameId}</td>

                            <td>
                              <Trigger message={name} id={masterCasinoGameId} />
                                <span
                                id={masterCasinoGameId}
                                  style={{
                                    width: '200px',
                                    cursor: 'pointer'
                                  }}
                                  className='d-inline-block text-truncate'
                                >
                                  {name}
                                </span>
                            </td>

                            <td>
                              {isActive
                                ? (
                                  <span className='text-success'>{t('restrictedProvider.active')}</span>
                                  )
                                : (
                                  <span className='text-danger'>{t('restrictedProvider.inactive')}</span>
                                  )}
                            </td>

                            <td>
                              {operatorStatus
                                ? (
                                  <span className='text-success'>{t('restrictedProvider.active')}</span>
                                  )
                                : (
                                  <span className='text-danger'>{t('restrictedProvider.inactive')}</span>
                                  )}
                            </td>

                            {hasAddGamesAction && (
                              <td>
                                <>
                                  <Trigger message={t('restrictedGame.addGame')} id={masterCasinoGameId+'add'} />
                                    <Button
                                    id={masterCasinoGameId+'add'}
                                      className='m-1'
                                      size='sm'
                                      variant='success'
                                      onClick={() => addGame({
                                        masterCasinoGameId,
                                        name,
                                        isActive,
                                        operatorStatus
                                      })}
                                    >
                                      <FontAwesomeIcon icon={faPlusSquare} />
                                    </Button>
                                </>
                              </td>
                            )}

                            {hasRemoveGamesAction && (
                              <td>
                                <>
                                  <Trigger message={t('restrictedGame.removeGame')} id={masterCasinoGameId+'remove'} />
                                    <Button
                                    id={masterCasinoGameId+'remove'}
                                      className='m-1'
                                      size='sm'
                                      variant='danger'
                                      onClick={() => removeGame(masterCasinoGameId)}
                                    >
                                      <FontAwesomeIcon icon={faMinusSquare} />
                                    </Button>
                                </>
                              </td>
                            )}
                          </tr>
                        )
                      }
                    )}

          {games?.count === 0 &&
                      (
                        <tr>
                          <td
                            colSpan={hasActions ? 5 : 4}
                            className='text-danger text-center'
                          >
                            {t('restrictedProvider.noData')}
                          </td>
                        </tr>
                      )}
        </tbody>
      </Table>

      {!disablePagination && games?.count !== 0 &&
            (
              <PaginationComponent
                page={games?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            )}
    </>
  )
}

export default GamesList
