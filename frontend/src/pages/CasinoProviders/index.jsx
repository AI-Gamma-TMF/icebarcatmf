import {
  Button,
  Row,
  Col,
  Table,
  Form

} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import PaginationComponent from '../../components/Pagination'
import CreateCasinoProviders from './components/CreateCasinoProvider'
import { ConfirmationModal,  HideConfirmationModal } from '../../components/ConfirmationModal'
import {
  faCheckSquare,
  faWindowClose,
  faEdit,
  faArrowCircleUp,
  faArrowCircleDown,
  faRedoAlt,faFan,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import useProviderListing from './useProviderListing'
import Trigger from '../../components/OverlayTrigger'
import { InlineLoader } from '../../components/Preloader'
import useCheckPermission from '../../utils/checkPermission'
import { AdminRoutes } from '../../routes'
import { tableHeaders } from './constants'
import ImageViewer from '../../components/ImageViewer/ImageViewer'

const CasinoProviders = () => {
  const {
    limit,
    setLimit,
    page,
    setPage,
    search,
    setSearch,
    aggregatorsList,
    setAggregatorsFilter,
    aggregatorsFilter,
    statusFilter,
    setStatusFilter,
    show,
    statusShow,
    setStatusShow,
    data,
    type,
    casinoProvidersData,
    totalPages,
    handleClose,
    handleShow,
    handleStatusShow,
    handleYes,
    loading,
    createUpdateLoading,
    status,
    t,
    createProvider,
    updateProvider,
    navigate,
    setOrderBy,
    selected,
    sort,
    setSort,
    over,
    setOver,
    handleHideModal,
    hideModalShow,
    setHideModalShow,
    handleHideYes,
    hideLoading, 
    updateloading,
    resetFilters,setFreeSpinStatusShow,handleFreeSpinYes,freeSpinStatusShow,freeSpinstatus,updateFreeSpinloading,handleFreeSpin,
  } = useProviderListing()
  const { isHidden } = useCheckPermission()
  return (
    <>
      <>
        <Row>
          <Col sm={7}>
            <h3>{t('casinoProvider.title')}</h3>
          </Col>

          <Col>
            <div className='d-flex justify-content-end'>
              <Button
                variant='success'
                size='sm'
                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                onClick={() => navigate(AdminRoutes.ReorderCasinoProviders)}
              >
                {t('casinoProvider.reorder')}
              </Button>
            </div>
          </Col>

          {/* <Col sm={5}>
            <div className='text-right mb-2'>
              <Button
                variant='success'
                className='f-right'
                size='sm'
                onClick={() => handleShow('Create', null)}
                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'C' } })}
              >
                {t('casinoProvider.createButton')}
              </Button>
            </div>
          </Col> */}
        </Row>
        <Row className='mb-3 w-100 m-auto'>
          <Col xs='12' lg='auto'>
            <div className='d-flex justify-content-start align-items-center w-100 mb-2 flex-wrap'>
              <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                {'Aggregators'}
              </Form.Label>

              <Form.Select
                value={aggregatorsFilter}
                onChange={(e) => {
                  setPage(1)
                  setAggregatorsFilter(e.target.value)
                }}
                style={{ minWidth: '230px' }}
              >
                <option value=''>{t('casinoSubCategory.filters.all')}</option>

                {aggregatorsList && aggregatorsList?.rows?.map((c) => (
                  <option key={c?.masterGameAggregatorId} value={c?.masterGameAggregatorId}>{c?.name?.toUpperCase()}</option>
                ))}
              </Form.Select>
            </div>
          </Col>

          <Col xs='12' lg='auto'>
            <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
              <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                {t('casinoSubCategory.filters.status')}
              </Form.Label>

              <Form.Select
                onChange={(e) => {
                  setPage(1)
                  setStatusFilter(e.target.value)
                }}
                value={statusFilter}
                style={{ minWidth: '230px' }}
              >
                <option value='all'>{t('casinoSubCategory.filters.all')}</option>
                <option value='true'>{t('casinoSubCategory.filters.active')}</option>
                <option value='false'>{t('casinoSubCategory.filters.inactive')}</option>
              </Form.Select>
            </div>
          </Col>

          <Col xs='12' lg='auto' className='mt-2 mt-lg-0'>
            <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
              <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                {t('casinoSubCategory.filters.search')}
              </Form.Label>

              <Form.Control
                type='search'
                value={search}
                placeholder={t('casinoSubCategory.filters.searchWithNName&Id')}
                onChange={(event) => {
                  setPage(1)
                  setSearch(
                    event.target.value.replace(/[~`!$%@^&*#=)()><?]+/g, '')
                  )
                }}
                style={{ minWidth: '230px' }}
              />
            </div>
          </Col>

          <Col xs={3} style={{ marginTop: "30px" }}>
            <Trigger message="Reset Filters" id={"redo"} />
            <Button id={"redo"} variant="success" onClick={resetFilters}>
              <FontAwesomeIcon icon={faRedoAlt} />
            </Button>
          </Col>
        </Row>
        <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
          <thead className='thead-dark'>
            <tr>
              {tableHeaders.map((h, idx) => (
                <th
                  key={idx}
                  onClick={() => h.value !== '' && setOrderBy(h.value)}
                  style={{
                  cursor: (h.value !== '')
                   ? 'pointer' : 'default',
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

          <tbody>
            {casinoProvidersData &&
              casinoProvidersData?.rows?.map(
                (
                  {
                    masterCasinoProviderId,
                    name,
                    isActive,
                    thumbnailUrl,
                    MasterGameAggregator,freeSpinAllowed,adminEnabledFreespin
                  },
                  index
                ) => {
                  return (
                    <tr key={masterCasinoProviderId}>
                      <td>{masterCasinoProviderId}</td>
                      <td>
                        <Trigger message={name} id={masterCasinoProviderId + 'name'} />
                        <span
                          id={masterCasinoProviderId + 'name'}
                          style={{
                            width: '100px',
                            cursor: 'pointer'
                          }}
                          className='d-inline-block text-truncate'
                        >
                          {name}
                        </span>
                      </td>

                      <td>
                        {thumbnailUrl ? (
                          <ImageViewer
                            thumbnailUrl={thumbnailUrl}
                          />
                        ) : (
                          t('noImage')
                        )}
                      </td>

                      <td>
                        <Trigger message={name} id={masterCasinoProviderId + 'aggregator'} />
                        <span
                          id={masterCasinoProviderId + 'aggregator'}
                          style={{
                            width: '100px',
                            cursor: 'pointer'
                          }}
                          className='d-inline-block text-truncate'
                        >
                          {MasterGameAggregator?.name?.toUpperCase()}
                        </span>
                      </td>

                      <td>
                        {isActive
                          ? (
                            <span className='text-success'>{t('casinoProvider.activeStatus')}</span>
                          )
                          : (
                            <span className='text-danger'>{t('casinoProvider.inActiveStatus')}</span>
                          )}
                      </td>
                      <td>
                        {(!isHidden({ module: { key: 'CasinoManagement', value: 'U' } }) || !isHidden({ module: { key: 'CasinoManagement', value: 'T' } }))
                          ? (
                            <>
                              <Trigger message='Edit' id={masterCasinoProviderId + 'edit'} />

                              <Button
                                id={masterCasinoProviderId + 'edit'}
                                className='m-1'
                                size='sm'
                                variant='warning'
                                onClick={() =>
                                  handleShow(
                                    'Edit',
                                    casinoProvidersData?.rows[index]
                                  )}
                                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>

                              {!isActive
                                ? (
                                  <>
                                    <Trigger message='Set Status Active' id={masterCasinoProviderId + 'active'} />
                                    <Button
                                      id={masterCasinoProviderId + 'active'}
                                      className='m-1'
                                      size='sm'
                                      variant='success'
                                      onClick={() =>
                                        handleStatusShow(
                                          masterCasinoProviderId,
                                          isActive,freeSpinAllowed
                                        )}
                                      hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                    >
                                      <FontAwesomeIcon icon={faCheckSquare} />
                                    </Button>
                                  </>
                                )
                                : (
                                  <>
                                    <Trigger message='Set Status In-Active' id={masterCasinoProviderId + 'inactive'} />
                                    <Button
                                      id={masterCasinoProviderId + 'inactive'}
                                      className='m-1'
                                      size='sm'
                                      variant='danger'
                                      onClick={() =>
                                        handleStatusShow(
                                          masterCasinoProviderId,
                                          isActive,freeSpinAllowed
                                        )}
                                      hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                    >
                                      <FontAwesomeIcon icon={faWindowClose} />
                                    </Button>
                                  </>
                                )}

                              {/* <Trigger message='View Blocked Countries' id={masterCasinoProviderId + 'coun'} />
                              <Button
                                id={masterCasinoProviderId + 'coun'}
                                className='m-1'
                                size='sm'
                                variant='secondary'
                                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                                onClick={() => navigate(`${AdminRoutes.RestrictedProviderCountries.split(':').shift()}${masterCasinoProviderId}`)}
                              >
                                <FontAwesomeIcon icon={faBan} />
                              </Button> */}
                              <Trigger message={'Hide'} id={masterCasinoProviderId + 'hide'} />
                              <Button
                                id={masterCasinoProviderId + 'hide'}
                                className='m-1'
                                size='sm'
                                variant='warning'
                                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'D' } })}
                                onClick={() => handleHideModal(masterCasinoProviderId)}
                              >
                                <FontAwesomeIcon icon={faEyeSlash} />
                              </Button>
                                {freeSpinAllowed &&
                          (!adminEnabledFreespin ? (
                            <>
                              <Trigger
                                message="Enable Free Spin"
                                id={masterCasinoProviderId + "enable"}
                              />
                              <Button
                                id={masterCasinoProviderId + "enable"}
                                className="m-1"
                                size="sm"
                                variant="success"
                                onClick={() =>
                                  handleFreeSpin(
                                    masterCasinoProviderId,
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
                                id={masterCasinoProviderId + "disable"}
                              />
                              <Button
                                id={masterCasinoProviderId + "disable"}
                                className="m-1"
                                size="sm"
                                variant="danger"
                                onClick={() =>
                                  handleFreeSpin(
                                    masterCasinoProviderId,
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
                            </>)
                          : 'NA'}
                      </td>
                    </tr>
                  )
                }
              )}

            {
              casinoProvidersData?.count === 0 &&
              (
                <tr>
                  <td
                    colSpan={5}
                    className='text-danger text-center'
                  >
                    {t('casinoProvider.noDataFound')}
                  </td>
                </tr>
              )
            }
          </tbody>
        </Table>
        {loading && <InlineLoader />}
        {casinoProvidersData?.count !== 0 &&
          (
            <PaginationComponent
              page={casinoProvidersData?.count < page ? setPage(1) : page}
              totalPages={totalPages}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />
          )}

        <ConfirmationModal
          setShow={setStatusShow}
          show={statusShow}
          handleYes={handleYes}
          active={status}
          loading={updateloading}
            note="Deactivating this Provider will cancel all associated Free Spins ."
            freeSpinstatus={freeSpinstatus}
        />
        {hideModalShow &&
          (
            <HideConfirmationModal
              hideModalShow={hideModalShow}
              setHideModalShow={setHideModalShow}
              handleHideYes={handleHideYes}
              loading={hideLoading}
              hideMsg="Warning: Hiding this provider will make all of its games invisible to all users. Do you still want to proceed?"
            />)}
      </>
       <ConfirmationModal
              setShow={setFreeSpinStatusShow}
              show={freeSpinStatusShow}
              handleYes={handleFreeSpinYes}
              active={freeSpinstatus}
              loading={updateFreeSpinloading}
              message="Update Free Spin Status"
            />
      <CreateCasinoProviders
        t={t}
        handleClose={handleClose}
        data={data}
        type={type}
        show={show}
        loading={createUpdateLoading}
        createProvider={createProvider}
        updateProvider={updateProvider}
      />
    </>
  )
}

export default CasinoProviders;