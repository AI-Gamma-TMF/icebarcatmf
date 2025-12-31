import {
  Button,
  Row,
  Col,
  Table,
  Form,
  Card

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
import './providers.scss'

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
    isFetching,
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
    <div className="providers-page dashboard-typography">
      <Row className="d-flex align-items-center mb-2">
        <Col sm={7}>
          <h3 className="providers-page__title">{t('casinoProvider.title')}</h3>
        </Col>

        <Col className="d-flex justify-content-end gap-2">
          <Button
            variant="success"
            size="sm"
            className="providers-page__action-btn"
            hidden={isHidden({ module: { key: 'CasinoManagement', value: 'C' } })}
            onClick={() => handleShow('Create', null)}
          >
            {t('casinoProvider.createButton')}
          </Button>

          <Button
            variant="success"
            size="sm"
            className="providers-page__action-btn"
            hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
            onClick={() => navigate(AdminRoutes.ReorderCasinoProviders)}
          >
            {t('casinoProvider.reorder')}
          </Button>
        </Col>
      </Row>

      <Card className="p-2 mb-2 providers-page__card">
        <Row className="dashboard-filters providers-filters g-3 align-items-end">
          <Col xs={12} md={4}>
            <Form.Label className="form-label">Aggregators</Form.Label>
            <Form.Select
              value={aggregatorsFilter}
              onChange={(e) => {
                setPage(1)
                setAggregatorsFilter(e.target.value)
              }}
            >
              <option value=''>{t('casinoSubCategory.filters.all')}</option>
              {aggregatorsList?.rows?.map((c) => (
                <option key={c?.masterGameAggregatorId} value={c?.masterGameAggregatorId}>
                  {c?.name?.toUpperCase()}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col xs={12} md={3}>
            <Form.Label className="form-label">{t('casinoSubCategory.filters.status')}</Form.Label>
            <Form.Select
              onChange={(e) => {
                setPage(1)
                setStatusFilter(e.target.value)
              }}
              value={statusFilter}
            >
              <option value='all'>{t('casinoSubCategory.filters.all')}</option>
              <option value='true'>{t('casinoSubCategory.filters.active')}</option>
              <option value='false'>{t('casinoSubCategory.filters.inactive')}</option>
            </Form.Select>
          </Col>

          <Col xs={12} md={4}>
            <Form.Label className="form-label">{t('casinoSubCategory.filters.search')}</Form.Label>
            <Form.Control
              type='search'
              value={search}
              placeholder={t('casinoSubCategory.filters.searchWithNName&Id')}
              onChange={(event) => {
                setPage(1)
                setSearch(event.target.value.replace(/[~`!$%@^&*#=)()><?]+/g, ''))
              }}
            />
          </Col>

          <Col xs={12} md="auto" className="ms-auto d-flex justify-content-end">
            <Trigger message="Reset Filters" id={"redo"} />
            <Button
              id={"redo"}
              variant="success"
              className="providers-page__reset-btn"
              onClick={resetFilters}
            >
              <FontAwesomeIcon icon={faRedoAlt} />
            </Button>
          </Col>
        </Row>

        <div className="dashboard-section-divider" />

        <div className="table-responsive providers-table-wrap">
          <Table hover size="sm" className="dashboard-data-table providers-table text-center">
            <thead>
              <tr>
                {tableHeaders.map((h, idx) => (
                  <th
                    key={idx}
                    onClick={() => h.value !== '' && setOrderBy(h.value)}
                    style={{ cursor: h.value !== '' ? 'pointer' : 'default' }}
                    className={selected(h) ? 'border-3 border border-blue' : ''}
                  >
                    {t(h.labelKey)}{' '}
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
              {loading && !casinoProvidersData?.rows?.length ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center">
                    <InlineLoader />
                  </td>
                </tr>
              ) : (
                <>
                  {casinoProvidersData?.rows?.map(
                    (
                      {
                        masterCasinoProviderId,
                        name,
                        isActive,
                        thumbnailUrl,
                        MasterGameAggregator,
                        freeSpinAllowed,
                        adminEnabledFreespin
                      },
                      index
                    ) => (
                      <tr key={masterCasinoProviderId}>
                        <td>{masterCasinoProviderId}</td>
                        <td>
                          <Trigger message={name} id={masterCasinoProviderId + 'name'} />
                          <span
                            id={masterCasinoProviderId + 'name'}
                            className='d-inline-block text-truncate providers-table__name'
                            style={{ cursor: 'pointer' }}
                          >
                            {name}
                          </span>
                        </td>

                        <td>
                          {thumbnailUrl ? <ImageViewer thumbnailUrl={thumbnailUrl} /> : t('noImage')}
                        </td>

                        <td>
                          <Trigger message={name} id={masterCasinoProviderId + 'aggregator'} />
                          <span
                            id={masterCasinoProviderId + 'aggregator'}
                            className='d-inline-block text-truncate providers-table__aggregator'
                            style={{ cursor: 'pointer' }}
                          >
                            {MasterGameAggregator?.name?.toUpperCase()}
                          </span>
                        </td>

                        <td>
                          {isActive ? (
                            <span className='text-success'>{t('casinoProvider.activeStatus')}</span>
                          ) : (
                            <span className='text-danger'>{t('casinoProvider.inActiveStatus')}</span>
                          )}
                        </td>
                        <td className="providers-table__actions">
                          {!isHidden({ module: { key: 'CasinoManagement', value: 'U' } }) ||
                          !isHidden({ module: { key: 'CasinoManagement', value: 'T' } }) ? (
                            <>
                              <Trigger message='Edit' id={masterCasinoProviderId + 'edit'} />
                              <Button
                                id={masterCasinoProviderId + 'edit'}
                                className='m-1'
                                size='sm'
                                variant='warning'
                                onClick={() => handleShow('Edit', casinoProvidersData?.rows[index])}
                                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>

                              {!isActive ? (
                                <>
                                  <Trigger message='Set Status Active' id={masterCasinoProviderId + 'active'} />
                                  <Button
                                    id={masterCasinoProviderId + 'active'}
                                    className='m-1'
                                    size='sm'
                                    variant='success'
                                    onClick={() => handleStatusShow(masterCasinoProviderId, isActive, freeSpinAllowed)}
                                    hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                  >
                                    <FontAwesomeIcon icon={faCheckSquare} />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Trigger message='Set Status In-Active' id={masterCasinoProviderId + 'inactive'} />
                                  <Button
                                    id={masterCasinoProviderId + 'inactive'}
                                    className='m-1'
                                    size='sm'
                                    variant='danger'
                                    onClick={() => handleStatusShow(masterCasinoProviderId, isActive, freeSpinAllowed)}
                                    hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                  >
                                    <FontAwesomeIcon icon={faWindowClose} />
                                  </Button>
                                </>
                              )}

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
                                    <Trigger message="Enable Free Spin" id={masterCasinoProviderId + "enable"} />
                                    <Button
                                      id={masterCasinoProviderId + "enable"}
                                      className="m-1"
                                      size="sm"
                                      variant="success"
                                      onClick={() => handleFreeSpin(masterCasinoProviderId, adminEnabledFreespin)}
                                      hidden={isHidden({ module: { key: "CasinoManagement", value: "T" } })}
                                    >
                                      <FontAwesomeIcon icon={faFan} />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Trigger message="Disable FreeSpin" id={masterCasinoProviderId + "disable"} />
                                    <Button
                                      id={masterCasinoProviderId + "disable"}
                                      className="m-1"
                                      size="sm"
                                      variant="danger"
                                      onClick={() => handleFreeSpin(masterCasinoProviderId, adminEnabledFreespin)}
                                      hidden={isHidden({ module: { key: "CasinoManagement", value: "T" } })}
                                    >
                                      <FontAwesomeIcon icon={faFan} />
                                    </Button>
                                  </>
                                ))}
                            </>
                          ) : (
                            'NA'
                          )}
                        </td>
                      </tr>
                    )
                  )}

                  {casinoProvidersData?.count === 0 && (
                    <tr>
                      <td colSpan={tableHeaders.length} className="text-danger text-center">
                        {t('casinoProvider.noDataFound')}
                      </td>
                    </tr>
                  )}

                  {isFetching && (
                    <tr>
                      <td colSpan={tableHeaders.length} className="text-center">
                        <InlineLoader />
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {casinoProvidersData?.count !== 0 && !loading && (
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
    </div>
  )
}

export default CasinoProviders;