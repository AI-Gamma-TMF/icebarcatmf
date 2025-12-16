import {
  faArrowCircleDown,
  faArrowCircleUp,
  faCheckSquare,
  faEdit,
  faWindowClose, faFan,
  faPlus,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col, Table, Form, Button, ListGroup, Card } from '@themesberg/react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddGames from './components/AddGames';
import EditGames from './components/EditGames';
import { tableHeaders } from './constants';
import useCasinoGamesListing from './hooks/useCasinoGamesListing';
import { ConfirmationModal, HideConfirmationModal } from '../../components/ConfirmationModal';
import ImageViewer from '../../components/ImageViewer/ImageViewer';
import Trigger from '../../components/OverlayTrigger';
import PaginationComponent from '../../components/Pagination';
import { InlineLoader } from '../../components/Preloader';
import { AdminRoutes } from '../../routes';
import useCheckPermission from '../../utils/checkPermission';
import { getDateTime } from '../../utils/dateFormatter';
import { convertToTimeZone, getFormattedTimeZoneOffset, formatNumber } from '../../utils/helper';
import { getItem } from '../../utils/storageUtils';
import { timeZones } from '../Dashboard/constants';

const CasinoGames = () => {
  const {
    limit,
    page,
    loading,
    setLimit,
    setPage,
    totalPages,
    casinoGames,
    casinoCategoryId,
    // setCasinoCategoryId,
    subCategories,
    providerId,
    setProviderId,
    casinoProvidersData,
    show,
    setShow,
    handleShow,
    handleYes,
    active,
    handleShowModal,
    showModal,
    type,
    handleClose,
    gameData,
    categoryGameId,
    setHideModalShow,
    hideModalShow,
    handleHideYes,
    handleHideModal,
    statusFilter,
    setStatusFilter,
    setOrderBy,
    setSort,
    setOver,
    selected,
    sort,
    over,
    getProviderName,
    navigate,
    // handleUploadClose,
    // showUploadModal,
    // uploadGamesLoading,
    // uploadGames,
    // setShowUploadModal,
    search,
    setSearch,
    hideLoading,
    updateloading,
    operator,
    setOperator,
    filterBy,
    setFilterBy,
    filterValue,
    setFilterValue,
    customerFacingFilter,
    setCustomerFacingFilter,
    gameId,
    setGameId, setFreeSpinStatusShow, handleFreeSpinYes, freeSpinStatusShow, freeSpinstatus, updateFreeSpinloading, handleFreeSpin,
  } = useCasinoGamesListing();
  const [error, setError] = useState('')

  const { isHidden } = useCheckPermission();
  const { t } = useTranslation('casinoGames');
  const timeZone = getItem('timezone');
  const timezoneOffset =
    timeZone != null ? timeZones.find((x) => x.code === timeZone).value : getFormattedTimeZoneOffset();

  const handleReset = () => {
    setPage(1);
    setLimit(15);
    setSearch('');
    setProviderId('');
    setStatusFilter('');
    setFilterBy('');
    setOperator('');
    setFilterValue('');
    setOrderBy('masterCasinoGameId');
    setCustomerFacingFilter('');
    setGameId('')
  };

  return (
    <>
      <>
        <Row className='Casino Games'>
          <Col xs='12' sm='6'>
            <h3>{t('title')}</h3>
          </Col>
          <Col xs='12' sm='6' style={{ display: 'flex', justifyContent: 'end' }}>
            <ListGroup.Item>
              <Card.Text className='text-sm-right'>
                <Button
                  hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                  className='m-1'
                  variant='success'
                  size='sm'
                  onClick={() => navigate(AdminRoutes.ReorderGames)}
                >
                  {t('reorder')}
                </Button>
              </Card.Text>
            </ListGroup.Item>
            <ListGroup.Item>
              <Card.Text className='text-sm-right'>
                <Button
                  className='m-1'
                  variant='success'
                  size='sm'
                  onClick={() => {
                    handleShowModal('Add');
                  }}
                >
                  Add game
                </Button>
              </Card.Text>
            </ListGroup.Item>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col sm={6} lg={2}>
            <Form.Label column='sm'>{t('filter.search.title')}</Form.Label>

            <Form.Control
              type='search'
              value={search}
              placeholder={t('filter.search.place')}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value.replace(/[~`!$%@^&*#=)()><?]+/g, ''));
              }}
            />
          </Col>
          <Col sm={6} lg={2}>
            <Form.Label column='sm'>{t('filter.provider.title')}</Form.Label>

            <Form.Select
              onChange={(e) => {
                setPage(1);
                setProviderId(e.target.value);
              }}
              value={providerId}
            >
              <option value=''>{t('filter.provider.options.all')}</option>
              {casinoProvidersData &&
                casinoProvidersData?.rows?.map((c) => (
                  <option key={c?.masterCasinoProviderId} value={c?.masterCasinoProviderId}>
                    {c?.name}
                  </option>
                ))}
            </Form.Select>
          </Col>

          <Col sm={6} lg={2}>
            <Form.Label column='sm'>{t('filter.status.title')}</Form.Label>

            <Form.Select
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              value={statusFilter}
            >
              <option value=''>{t('filter.status.options.all')}</option>
              <option value='true'>{t('filter.status.options.active')}</option>
              <option value='false'>{t('filter.status.options.inActive')}</option>
            </Form.Select>
          </Col>

          <Col sm={6} lg={2}>
            <Form.Label column='sm'>{t('filter.filterBy.title')}</Form.Label>

            <Form.Select
              onChange={(e) => {
                setPage(1);
                setFilterBy(e.target.value);
              }}
              value={filterBy}
            >
              <option hidden>Select value</option>
              <option value='returnToPlayer'>{t('filter.filterBy.options.returnToPlayer')}</option>
              {/* <option value='systemRtp'>{t('filter.filterBy.options.systemRtp')}</option> */}
              {/* <option value='betSum'>{t('filter.filterBy.options.betSum')}</option> */}
              {/* <option value='winSum'>{t('filter.filterBy.options.winSum')}</option> */}
              {/* <option value='GGR'>{t('filter.filterBy.options.GGR')}</option> */}
            </Form.Select>
          </Col>

          <Col sm={6} lg={2}>
            <Form.Label column='sm'>{t('filter.operator.title')}</Form.Label>

            <Form.Select
              onChange={(e) => {
                setPage(1);
                setOperator(e.target.value);
              }}
              value={operator}
              disabled={!filterBy}
            >
              <option hidden>Select Operator</option>
              <option value='='>{t('filter.operator.options.equal')}</option>
              <option value='>'>{t('filter.operator.options.gt')}</option>
              <option value='>='>{t('filter.operator.options.gte')}</option>{' '}
              <option value='<'>{t('filter.operator.options.lt')}</option>{' '}
              <option value='<='>{t('filter.operator.options.lte')}</option>
            </Form.Select>
          </Col>

          <Col sm={6} lg={2}>
            <Form.Label>{t('filter.filterValue.title')}</Form.Label>
            <Form.Control
              type='number'
              onKeyDown={(evt) => ['e', 'E', '+'].includes(evt.key) && evt.preventDefault()}
              name='filterValue'
              value={filterValue}
              onChange={(e) => {
                setFilterValue(e?.target?.value);
              }}
              placeholder={t('filter.filterValue.place')}
              disabled={!operator}
            />
          </Col>
        </Row>
        <Row className='mt-3 d-flex align-items-end'>
          <Col sm={6} lg={2}>
            <Form.Label>{t('filter.gameActiveOnSite.title')}</Form.Label>
            <Form.Select
              onChange={(e) => {
                setPage(1);
                setCustomerFacingFilter(e?.target?.value);
              }}
              value={customerFacingFilter}
            >
              <option value=''>{t('filter.gameActiveOnSite.options.all')}</option>
              <option value='true'>{t('filter.gameActiveOnSite.options.active')}</option>
              <option value='false'>{t('filter.gameActiveOnSite.options.inActive')}</option>
            </Form.Select>
          </Col>
          <Col sm={6} lg={2}>
            <Form.Label column='sm'>Game Id</Form.Label>

            <Form.Control
              type='search'
              value={gameId}
              placeholder={"Game Id"}
              onChange={(event) => {
                const inputValue = event?.target?.value;
                if (/^\d*$/.test(inputValue)) {
                  if (inputValue.length <= 10) {
                    setPage(1)
                    setGameId(inputValue)
                    setError('')
                  } else {
                    setError('Game Id cannot exceed 10 digits')
                  }
                }
              }}
            />
            {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
          </Col>
          <Col className='ms-auto' sm='auto'>
            <Button variant='secondary' onClick={handleReset}>
              Reset
            </Button>
          </Col>
        </Row>


        <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
          <thead className='thead-dark'>
            <tr>
              {tableHeaders?.map((h, idx) => (
                <th
                  key={idx}
                  onClick={() => h.value !== '' && setOrderBy(h.value)}
                  style={{
                    cursor: (h.value !== '')
                      ? 'pointer' : 'default',
                  }}
                  className={selected(h) ? 'border-3 border border-blue' : ''}
                >
                  {t(h.labelKey)} {h.value === 'gameActiveOnSite' && '*'} &nbsp;
                  {selected(h) &&
                    (sort === 'asc' ? (
                      <FontAwesomeIcon
                        style={over ? { color: 'red' } : {}}
                        icon={faArrowCircleUp}
                        onClick={() => setSort('desc')}
                        onMouseOver={() => setOver(true)}
                        onMouseLeave={() => setOver(false)}
                      />
                    ) : (
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
            {casinoGames?.count > 0 &&
              casinoGames?.rows?.map(
                (
                  {
                    gameName,
                    isActive,
                    masterCasinoGameId: categoryGameId,
                    masterCasinoProviderId,
                    gameActiveOnSite,
                    // betSum,
                    // winSum,
                    returnToPlayer,
                    // systemRtp,
                    // GGR,
                    imageUrl,
                    createdAt, freeSpinAllowed, adminEnabledFreespin
                  },
                  index,
                ) => {

                  const longThumbnail = imageUrl;
                  return (
                    <tr key={categoryGameId}>
                      <td>{categoryGameId}</td>
                      <td>
                        {/* <Trigger message={gameName} id={categoryGameId} /> */}
                        <span
                          id={categoryGameId}
                          style={{
                            width: '100px',
                            cursor: 'pointer',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',

                            padding: 0,
                            margin: 0,
                          }}
                          className='d-inline-block  '
                        >
                          {gameName}
                        </span>
                      </td>

                      <td>{longThumbnail ? <ImageViewer thumbnailUrl={longThumbnail} /> : t('noImage')}</td>

                      <td>{getProviderName(masterCasinoProviderId)}</td>
                      <td>{gameActiveOnSite ? 'Yes' : 'No'}</td>
                      <td>{getDateTime(convertToTimeZone(createdAt, timezoneOffset))}</td>
                      {/* <td>{formatNumber(betSum, { isDecimal: true })}</td> */}
                      {/* <td>{formatNumber(winSum, { isDecimal: true })}</td> */}
                      {/* <td>{formatNumber(GGR, { isDecimal: true })}</td> */}
                      <td
                        className={`${returnToPlayer === 0 ? '' : returnToPlayer > 100 ? 'text-danger' : 'text-success'
                          }`}
                      >
                        {returnToPlayer ? `${formatNumber(returnToPlayer, { isDecimal: true })} %` : '-'}
                      </td>
                      {/* <td className={`${systemRtp === null ? '' : systemRtp > 100 ? 'text-danger' : 'text-success'}`}>
                          {systemRtp ? `${formatNumber(systemRtp, { isDecimal: true })} %` : '-'}
                        </td> */}
                      <td>
                        {isActive ? (
                          <span className='text-success'>{t('active')}</span>
                        ) : (
                          <span className='text-danger'>{t('inActive')}</span>
                        )}
                      </td>

                      {(!isHidden({ module: { key: 'CasinoManagement', value: 'U' } }) ||
                        !isHidden({ module: { key: 'CasinoManagement', value: 'T' } }) ||
                        !isHidden({ module: { key: 'CasinoManagement', value: 'C' } })) ? (
                        <td>
                          <Trigger message={t('trigger.edit')} id={categoryGameId + 'edit'} />
                          <Button
                            id={categoryGameId + 'edit'}
                            className='m-1'
                            size='sm'
                            variant='warning'
                            hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                            onClick={() => {
                              handleShowModal('Edit', casinoGames?.rows[index], categoryGameId);
                            }}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>

                          {!isActive ? (
                            <>
                              <Trigger message={t('trigger.activeStatus')} id={categoryGameId + 'active'} />
                              <Button
                                id={categoryGameId + 'active'}
                                className='m-1'
                                size='sm'
                                variant='success'
                                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                onClick={() => handleShow(categoryGameId, isActive, freeSpinAllowed)}
                              >
                                <FontAwesomeIcon icon={faCheckSquare} />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Trigger message={t('trigger.inActiveStatus')} id={categoryGameId + 'inactive'} />
                              <Button
                                id={categoryGameId + 'inactive'}
                                className='m-1'
                                size='sm'
                                variant='danger'
                                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                onClick={() => handleShow(categoryGameId, isActive, freeSpinAllowed)}
                              >
                                <FontAwesomeIcon icon={faWindowClose} />
                              </Button>
                            </>
                          )}

                          <Trigger message={t('trigger.hide')} id={categoryGameId + 'hide'} />
                          <Button
                            id={categoryGameId + 'hide'}
                            className='m-1'
                            size='sm'
                            variant='warning'
                            hidden={isHidden({ module: { key: 'CasinoManagement', value: 'D' } })}
                            onClick={() => handleHideModal(categoryGameId)}
                          >
                            <FontAwesomeIcon icon={faEyeSlash} />
                          </Button>

                          {freeSpinAllowed &&
                            (!adminEnabledFreespin ? (
                              <>
                                <Trigger
                                  message="Enable Free Spin"
                                  id={categoryGameId + "enable"}
                                />
                                <Button
                                  id={categoryGameId + "enable"}
                                  className="m-1"
                                  size="sm"
                                  variant="success"
                                  onClick={() =>
                                    handleFreeSpin(
                                      categoryGameId,
                                      adminEnabledFreespin
                                    )
                                  }
                                  hidden={isHidden({
                                    module: {
                                      key: "CasinoManagement",
                                      value: "T",
                                    },
                                  })}
                                >
                                  <FontAwesomeIcon icon={faFan} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Trigger
                                  message="Disable FreeSpin"
                                  id={categoryGameId + "disable"}
                                />
                                <Button
                                  id={categoryGameId + "disable"}
                                  className="m-1"
                                  size="sm"
                                  variant="danger"
                                  onClick={() =>
                                    handleFreeSpin(
                                      categoryGameId,
                                      adminEnabledFreespin
                                    )
                                  }
                                  hidden={isHidden({
                                    module: {
                                      key: "CasinoManagement",
                                      value: "T",
                                    },
                                  })}
                                >
                                  <FontAwesomeIcon icon={faFan} />
                                </Button>
                              </>
                            ))}

                          <Trigger
                            message="Create Discount Rate"
                            id={categoryGameId + "createDiscount"}
                          />
                          <Button
                            id={categoryGameId + "createDiscount"}
                            className="m-1"
                            size="sm"
                            variant="info"
                            onClick={() =>
                              navigate(`${AdminRoutes.EditGameDiscountRate.split(":").shift()}${categoryGameId}`)
                            }
                            hidden={
                              isHidden({
                                module: {
                                  key: "GamePages",
                                  value: "U",
                                },
                              }) &&
                              isHidden({
                                module: {
                                  key: "GamePages",
                                  value: "C",
                                },
                              })
                            }
                          >
                            <FontAwesomeIcon icon={faPlus} />

                          </Button>
                        </td>
                      ) : (
                        'NA'
                      )}
                    </tr>
                  );
                },
              )}

            {casinoGames?.count === 0 && (
              <tr>
                <td colSpan={8} className='text-danger text-center'>
                  {t('noDataFound')}
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {loading && <InlineLoader />}
        {casinoGames?.count !== 0 && (
          <PaginationComponent
            page={casinoGames?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}

        <Row className='ms-1 mt-1 fw-bold'>
          * Note: If the game is not customer-facing, it is either because the game itself, its provider, or its aggregator is turned off.
        </Row>
      </>

      {show && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
          loading={updateloading}
          note="Deactivating this Game will cancel all associated Free Spins ."
          freeSpinstatus={freeSpinstatus}
        />
      )}

      {hideModalShow && (
        <HideConfirmationModal
          hideModalShow={hideModalShow}
          setHideModalShow={setHideModalShow}
          handleHideYes={handleHideYes}
          loading={hideLoading}
          hideMsg="Warning: Hidding this game will make it permanently unavailable to all users. Do you still want to proceed?"
        />
      )}
      <ConfirmationModal
        setShow={setFreeSpinStatusShow}
        show={freeSpinStatusShow}
        handleYes={handleFreeSpinYes}
        active={freeSpinstatus}
        loading={updateFreeSpinloading}
        message="Update Free Spin Status"
      />

      {categoryGameId !== null && type !== 'Add' ? (
        <EditGames
          handleClose={handleClose}
          show={showModal}
          gameData={gameData}
          type={type}
          subCategories={subCategories}
          limit={limit}
          pageNo={page}
          casinoCategoryId={casinoCategoryId}
          statusFilter={statusFilter}
          providerId={providerId}
        />
      ) : (
        <AddGames
          handleClose={handleClose}
          show={showModal}
          gameData={gameData}
          type={type}
          subCategories={subCategories}
          limit={limit}
          pageNo={page}
          casinoCategoryId={casinoCategoryId}
          statusFilter={statusFilter}
          providerId={providerId}
        />
      )}
    </>
  );
};

export default CasinoGames;
