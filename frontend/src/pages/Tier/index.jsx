import React, { useEffect, useState } from 'react'
import {
  Button,
  Row,
  Col,
  Table,
  Form
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PaginationComponent from '../../components/Pagination'
import { ConfirmationModal, DeleteConfirmationModal } from '../../components/ConfirmationModal'
import {
  faCheckSquare,
  faEdit,
  faEye,
  faArrowCircleUp,
  faArrowCircleDown,
  faWindowClose,
  faRedoAlt
} from '@fortawesome/free-solid-svg-icons'
import Trigger from '../../components/OverlayTrigger'
import { InlineLoader } from '../../components/Preloader'
import useCheckPermission from '../../utils/checkPermission'
import { AdminRoutes } from '../../routes'
import { tableHeaders } from './constants'
import useTierListing from './hooks/useTierListing'
import { formatPriceWithCommas } from '../../utils/helper'
const limitTierList = 6;
const Tiers = () => {
  const {
    t,
    limit,
    page,
    loading,
    tierList,
    show,
    setLimit,
    setPage,
    setShow,
    totalPages,
    handleShow,
    handleYes,
    active,
    navigate,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    setOrderBy,
    selected,
    sort,
    setSort,
    over,
    setOver,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    updateloading,
    tierSearch,
    setTierSearch,
    resetFilters
  } = useTierListing({ isUTC: true })

  const [allTiers, setAllTiers] = useState([]);

  useEffect(() => {
    if (tierList?.tiers?.rows?.length > 0 && allTiers?.length === 0) {
      setAllTiers(tierList?.tiers?.rows); // only set once on initial load
    }
  }, [tierList?.tiers]);

  const { isHidden } = useCheckPermission()
  return (
    <>
      <>
        <Row className='mb-2'>
          <Col>
            <h3>{t('tournaments.title')}</h3>
          </Col>

          <Col>
            <div className='d-flex justify-content-end'>
              {tierList && !(tierList?.totalActiveTiers >= limitTierList) && <Button
                variant='success'
                size='sm'
                style={{ marginRight: '10px' }}
                hidden={isHidden({ module: { key: 'Tiers', value: 'C' } })}
                onClick={() => navigate(AdminRoutes.tierCreate)}
              >
                {t('tournaments.createButton')}
              </Button>}
            </div>
          </Col>
        </Row>

        <Row className='mb-3 w-100 m-auto'>
          <Col xs='12' lg='auto' className='mt-2 mt-lg-0'>
            <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
              <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                Search by Name or Tier Id
              </Form.Label>

              <Form.Control
                type='search'
                value={search}
                placeholder={'Search...'}
                onChange={(event) => {
                  setPage(1)
                  setSearch(
                    event?.target?.value.replace(/[~`!$%@^&*#=)()><?]+/g, '')
                  )
                }}
                style={{ minWidth: '230px' }}
              />
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
                  setStatusFilter(e?.target?.value)
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

          <Col className='col-lg-2 col-sm-6 col-12'>
            <Form.Group className='mb-3' controlId='formGroupTier'>
              <Form.Label className="mb-1">Tier</Form.Label>
              <Form.Select
                as="select"
                placeholder="Tier"
                name='tierSearch'
                value={tierSearch}
                onChange={(event) => {
                  setPage(1)
                  setTierSearch(event?.target?.value)
                }}
              >
                <option value='all'>All</option>
                {allTiers?.map((tier) => (
                  <option key={tier?.tierId} value={tier?.level}>
                    {tier?.name}
                  </option>
                ))}

              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            <Trigger message='Reset Filters' id={'redo'} />
            <Button
              id={'redo'}
              variant='success'
              onClick={resetFilters}
              className='mt-4'
            >
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
                    cursor: (h.value !== '' && 'pointer')
                  }}
                  className={
                    selected(h)
                      ? 'border-3 border border-blue'
                      : ''
                  }
                >
                  {t(h.labelKey)}{' '}
                  {selected(h) &&
                    (sort === 'ASC'
                      ? (
                        <FontAwesomeIcon
                          style={over ? { color: 'red' } : {}}
                          icon={faArrowCircleUp}
                          onClick={() => setSort('DESC')}
                          onMouseOver={() => setOver(true)}
                          onMouseLeave={() => setOver(false)}
                        />
                      )
                      : (
                        <FontAwesomeIcon
                          style={over ? { color: 'red' } : {}}
                          icon={faArrowCircleDown}
                          onClick={() => setSort('ASC')}
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
              {tierList && tierList?.tiers?.count > 0 ? (
                tierList?.tiers?.rows?.map(
                  ({
                    tierId,
                    name,
                    requiredXp,
                    bonusGc,
                    bonusSc,
                    weeklyBonusPercentage,
                    isWeekelyBonusActive,
                    monthlyBonusPercentage,
                    isMonthlyBonusActive,
                    level,
                    isActive,
                    icon
                  }) => {
                    return (
                      <tr key={tierId}>
                        <td>{tierId}</td>

                        <td>
                          <Trigger message={name} id={name} />
                          <span
                            id={name}
                            style={{
                              width: '100px',
                              cursor: 'pointer'
                            }}
                            className='d-inline-block text-truncate'
                          >
                            {name}
                          </span>
                        </td>
                        {/* <td>{getDateTime(createdAt)}</td> */}

                        <td>{formatPriceWithCommas(requiredXp)}</td>


                        <td>{formatPriceWithCommas(bonusGc)}</td>
                        <td>{formatPriceWithCommas(bonusSc)}</td>
                        <td>{weeklyBonusPercentage}</td>
                        <td>
                          {isWeekelyBonusActive
                            ? (
                              <span className='text-success'>{t('tournaments.activeStatus')}</span>
                            )
                            : (
                              <span className='text-danger'>{t('tournaments.inActiveStatus')}</span>
                            )}
                        </td>

                        <td>{monthlyBonusPercentage}</td>
                        <td>
                          {isMonthlyBonusActive
                            ? (
                              <span className='text-success'>{t('tournaments.activeStatus')}</span>
                            )
                            : (
                              <span className='text-danger'>{t('tournaments.inActiveStatus')}</span>
                            )}
                        </td>
                        <td>{level}</td>




                        <td>
                          {isActive
                            ? (
                              <span className='text-success'>{t('tournaments.activeStatus')}</span>
                            )
                            : (
                              <span className='text-danger'>{t('tournaments.inActiveStatus')}</span>
                            )}
                        </td>

                        <td>

                          <img src={icon} alt="..." width={50} height={50} className='img-thumbnail'
                            onClick={() => icon && window.open(icon)}>

                          </img>
                        </td>



                        <td>
                          <>
                            <Trigger message={'View'} id={tierId + 'view'} />
                            <Button
                              id={tierId + 'view'}
                              className='m-1'
                              size='sm'
                              variant='info'
                              onClick={() =>
                                navigate(
                                  `${AdminRoutes.tierDetails.split(':').shift()}${tierId}`
                                )}
                              hidden={isHidden({ module: { key: 'Tiers', value: 'R' } })}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>

                            <Trigger message='Edit' id={tierId + 'edit'} />
                            <Button
                              id={tierId + 'edit'}
                              className='m-1'
                              size='sm'
                              variant='warning'
                              hidden={isHidden({ module: { key: 'Tiers', value: 'U' } })}
                              onClick={() => {
                                navigate(
                                  `${AdminRoutes.tierEdit.split(':').shift()}${tierId}`
                                )
                              }}
                            // disabled={isEditable}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>

                            {!isActive
                              ? (<>
                                <Trigger message='Set Status Active' id={tierId + 'active'} />
                                <Button
                                  id={tierId + 'active'}
                                  className='m-1'
                                  size='sm'
                                  variant='success'
                                  hidden={isHidden({ module: { key: 'Tiers', value: 'T' } })}
                                  onClick={() =>
                                    handleShow(tierId, isActive)}
                                // disabled={isEditable}
                                >
                                  <FontAwesomeIcon icon={faCheckSquare} />
                                </Button>
                              </>
                              )
                              : (<>
                                <Trigger message='Set Status In-Active' id={tierId + 'inactive'} />
                                <Button
                                  id={tierId + 'inactive'}
                                  className='m-1'
                                  size='sm'
                                  variant='danger'
                                  hidden={isHidden({ module: { key: 'Tiers', value: 'T' } })}
                                  onClick={() =>
                                    handleShow(tierId, isActive)}
                                // disabled={isEditable}
                                >
                                  <FontAwesomeIcon icon={faWindowClose} />
                                </Button>
                              </>
                              )}

                            {/* <Trigger message='Delete' id={tierId + 'delete'} />
                          <Button
                            id={tierId + 'delete'}
                            className='m-1'
                            size='sm'
                            variant='danger'
                            hidden={isHidden({ module: { key: 'Tiers', value: 'D' } })}
                            onClick={() => handleDeleteModal(tierId)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button> */}
                          </>
                        </td>
                      </tr>
                    )
                  }
                )
              ) : <tr>
                <td colSpan={7} className='text-danger text-center'>
                  {t('tournaments.noDataFound')}
                </td>
              </tr>
              }
            </tbody>
          )}

        </Table>
        {tierList?.tiers?.count !== 0 &&
          (
            <PaginationComponent
              page={tierList?.tiers?.count < page ? setPage(1) : page}
              totalPages={totalPages}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />
          )}
      </>
      {show && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
          loading={updateloading}
        />
      )}

      {deleteModalShow &&
        (
          <DeleteConfirmationModal
            deleteModalShow={deleteModalShow}
            setDeleteModalShow={setDeleteModalShow}
            handleDeleteYes={handleDeleteYes}
          />)}

    </>
  )
}

export default Tiers