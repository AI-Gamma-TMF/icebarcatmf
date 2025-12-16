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

const ProvidersList = ({
  page,
  limit,
  setLimit,
  setPage,
  totalPages,
  provider,
  addProvider,
  removeProvider,
  disablePagination = false,
  hasActions = false,
  hasAddGamesAction = false,
  hasRemoveGamesAction = false
}) => {
  
  const { t } = useTranslation(['countries'])
  return (
    <>
      <Table bordered striped responsive hover size='sm' className='text-center mt-1'>
        <thead className='thead-dark'>
          <tr>
            {[
              t('restrictedProvider.headers.id'),
              t('restrictedProvider.headers.name'),
              t('restrictedProvider.headers.status')
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
            {hasActions && <th>{t('restrictedProvider.headers.actions')}</th>}
          </tr>
        </thead>

        <tbody>
          {provider?.count > 0 &&
                    provider?.rows?.map(
                      ({
                        masterCasinoProviderId,
                        name,
                        isActive
                      }) => {
                        return (
                          <tr key={masterCasinoProviderId}>

                            <td>{masterCasinoProviderId}</td>

                            <td>
                              <Trigger message={name} id={masterCasinoProviderId} />
                                <span
                                id={masterCasinoProviderId}
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

                            {hasAddGamesAction && (
                              <td>
                                <>
                                  <Trigger message={t('restrictedProvider.addProvider')} id={masterCasinoProviderId+'add'} />
                                    <Button
                                    id={masterCasinoProviderId+'add'}
                                      className='m-1'
                                      size='sm'
                                      variant='success'
                                      onClick={() => addProvider({
                                        masterCasinoProviderId,
                                        name,
                                        isActive
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
                                  <Trigger message={t('restrictedProvider.removeProvider')} id={masterCasinoProviderId+'remove'} />
                                    <Button
                                    id={masterCasinoProviderId+'remove'}
                                      className='m-1'
                                      size='sm'
                                      variant='danger'
                                      onClick={() => removeProvider(masterCasinoProviderId)}
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

          {provider?.count === 0 &&
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

      {!disablePagination && provider?.count !== 0 &&
            (
              <PaginationComponent
                page={provider?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            )}
    </>
  )
}

export default ProvidersList
