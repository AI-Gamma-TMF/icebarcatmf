import { Button, Table, Row, Col, Form } from '@themesberg/react-bootstrap';
import PaginationComponent from '../../../components/Pagination';
import Trigger from '../../../components/OverlayTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { InlineLoader } from '../../../components/Preloader';
import { formatNumber } from '../../../utils/helper';

const GamesList = ({
  t,
  page,
  limit,
  search,
  setLimit,
  setPage,
  setSearch,
  totalPages,
  masterGames,
  addGame,
  disablePagination = false,
  hasActions = false,
  hasAddGamesAction = false,
  hasRemoveGamesAction = false,
  getProviderName,
  removeGames,
  loading,
  statusFilter,
  setStatusFilter,
  providerId,
  setProviderId,
  allProviders
}) => {
  return (
    <div className='mt-1'>
      <Row className='mb-2'>
        <Col xs='auto' className='d-flex justify-content-start '>
          {/* <div className='d-flex justify-content-start '> */}
            <Form.Label style={{ marginRight: '15px' }}>
              {t('casinoGames.addGames.search')}
            </Form.Label>

            <Form.Control
              type='search'
              value={search}
              placeholder={t('casinoGames.addGames.searchPlaceholder')}
              // size='sm'
              // style={{ maxWidth: '200px' }}
              onChange={(event) => setSearch(event.target.value.replace(/[~`!$%@^&*#=)()><?]+/g, ''))}
            />
          {/* </div> */}
        </Col>
        <Col xs='auto' className='d-flex justify-content-start '>
          <Form.Label style={{ marginRight: '15px' }}>{t('casinoGames.addGames.provider')}</Form.Label>
          <Form.Select
          style={{width:'150px'}}
            onChange={(e) => {
              setPage(1);
              setProviderId(e.target.value);
            }}
            value={providerId}
          >
            <option value=''>{t('casinoGames.addGames.all')}</option>
            {allProviders &&
              allProviders?.rows?.map((c) => (
                <option key={c?.masterCasinoProviderId} value={c?.masterCasinoProviderId}>
                  {c?.name}
                </option>
              ))}
          </Form.Select>
        </Col>

        <Col xs='auto' className='d-flex justify-content-start '>
          <Form.Label style={{ marginRight: '15px' }}>{t('casinoGames.addGames.status')}</Form.Label>
          <Form.Select
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            value={statusFilter}
          >
            <option value=''>{t('casinoGames.addGames.filter.status.options.all')}</option>
            <option value='true'>{t('casinoGames.addGames.filter.status.options.active')}</option>
            <option value='false'>{t('casinoGames.addGames.filter.status.options.inActive')}</option>
          </Form.Select>
        </Col>
      </Row>

      <Table bordered striped responsive hover size='sm' className={'text-center'}>
        <thead className='thead-dark'>
          <tr>
            {[
              // t('casinoGames.addGames.headers.id'),
              t('casinoGames.addGames.headers.gameName'),
              t('casinoGames.addGames.headers.casinoProvider'),
              t('casinoGames.addGames.headers.gameActiveOnSite'),
              // t('casinoGames.addGames.headers.betSum'),
              // t('casinoGames.addGames.headers.winSum'),
              // t('casinoGames.addGames.headers.GGR'),
              t('casinoGames.addGames.headers.rtp'),
              // t('casinoGames.addGames.headers.systemRtp'),
              t('casinoGames.addGames.headers.status'),
              // t('casinoGames.addGames.headers.actions'),
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
            {hasActions && <th>{t('casinoGames.addGames.headers.actions')}</th>}
          </tr>
        </thead>

        <tbody>
          {masterGames?.count > 0 &&
            masterGames?.rows?.map(
              ({
                masterCasinoGameId,
                gameName,
                masterCasinoProviderId,
                isActive,
                returnToPlayer,
                // systemRtp,
                // betSum,
                // winSum,
                // GGR,
                gameActiveOnSite,
              }) => {
                return (
                  <tr key={masterCasinoGameId}>
                    <td>
                      <Trigger message={gameName} id={masterCasinoGameId + 'name'} />
                      <span
                        id={masterCasinoGameId + 'name'}
                        style={{
                          width: '300px',
                          cursor: 'pointer',
                        }}
                        className='d-inline-block text-truncate'
                      >
                        {gameName}
                      </span>
                    </td>

                    <td>{getProviderName(masterCasinoProviderId)}</td>

                    <td>{gameActiveOnSite ? 'Yes' : 'No'}</td>
                    {/* <td>{formatNumber(betSum, { isDecimal: true })}</td>
                    <td>{formatNumber(winSum, { isDecimal: true })}</td> */}
                    {/* <td>{formatNumber(GGR, { isDecimal: true })}</td> */}
                    <td
                      className={`${returnToPlayer === 0 ? '' : returnToPlayer > 100 ? 'text-danger' : 'text-success'}`}
                    >
                      {returnToPlayer ? `${formatNumber(returnToPlayer, { isDecimal: true })} %` : '-'}
                    </td>
                    {/* <td className={`${systemRtp === null ? '' : systemRtp > 100 ? 'text-danger' : 'text-success'}`}>
                      {+systemRtp ? `${formatNumber(systemRtp, { isDecimal: true })} %` : '-'}
                    </td> */}
                    <td>
                      {isActive ? (
                        <span className='text-success'>Active</span>
                      ) : (
                        <span className='text-danger'>In Active</span>
                      )}
                    </td>
                    {hasAddGamesAction && (
                      <td>
                        <>
                          <Trigger message='Add this Game' id={masterCasinoGameId + 'addGame'} />
                          <Button
                            id={masterCasinoGameId + 'addGame'}
                            className='m-1'
                            size='sm'
                            variant='success'
                            onClick={() => addGame({ masterCasinoGameId, name: gameName })}
                          >
                            <FontAwesomeIcon icon={faPlusSquare} />
                          </Button>
                        </>
                      </td>
                    )}

                    {hasRemoveGamesAction && (
                      <td>
                        <>
                          <Trigger message='Remove this Game' id={masterCasinoGameId + 'remove'} />
                          <Button
                            id={masterCasinoGameId + 'remove'}
                            className='m-1'
                            size='sm'
                            variant='danger'
                            onClick={() => removeGames(masterCasinoGameId)}
                          >
                            <FontAwesomeIcon icon={faMinusSquare} />
                          </Button>
                        </>
                      </td>
                    )}
                  </tr>
                );
              },
            )}
          {masterGames?.count === 0 && (
            <tr>
              <td colSpan={hasActions ? 4 : 3} className='text-danger text-center'>
                {t('casinoGames.addGames.noData')}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {loading && <InlineLoader />}

      {!disablePagination && masterGames?.count !== 0 && (
        <PaginationComponent
          page={masterGames?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}

      <Row className='ms-1 mt-2 fw-bold'>
        * Note: If the game is not customer-facing, it is either because the game itself, its provider, or its aggregator is turned off.
      </Row> 
    </div>
  );
};

export default GamesList;
