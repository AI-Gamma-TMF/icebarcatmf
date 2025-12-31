/* eslint-disable react/display-name */
import React from 'react'
import {
  Button,
  Form,
  Row,
  Col,
  Table,
  Card
} from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faEdit, faEye, faWindowClose, faTrash, faArrowCircleUp, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'
import useCmsListing from './hooks/useCmsListing'
import Trigger from '../../components/OverlayTrigger'
import { InlineLoader } from '../../components/Preloader'
import PaginationComponent from '../../components/Pagination'
import { AdminRoutes } from '../../routes'
import { ConfirmationModal, DeleteConfirmationModal } from '../../components/ConfirmationModal'
import useCheckPermission from '../../utils/checkPermission'
import { tableHeaders } from './constants'
import './cmsListing.scss'

const CMSListing = () => {
  const {
    page,
    deleteLoading,
    limit,
    setPage,
    setLimit,
    setSearch,
    search,
    navigate,
    cmsData,
    totalPages,
    loading,
    handleStatusShow,
    statusShow,
    setStatusShow,
    handleYes,
    status,
    active,
    setActive,
    t,
    over,
    setOver,
    selected,
    setOrderBy,
    sort,
    setSort,
    handleDeleteModal,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes, updateloading
  } = useCmsListing()
  const { isHidden } = useCheckPermission()

  return (
    <div className='dashboard-typography cms-page'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <h3 className='cms-page__title'>{t('title')}</h3>
          <p className='cms-page__subtitle'>Manage CMS pages, slugs, and status</p>
        </div>
        <div className='d-flex justify-content-end'>
          <Button
            variant='primary'
            className='cms-page__create-btn'
            size='sm'
            onClick={() =>
              navigate(AdminRoutes.CmsCreate, {
                state: { cmsData: cmsData?.rows }
              })
            }
            hidden={isHidden({ module: { key: 'CMS', value: 'C' } })}
          >
            {t('createButton')}
          </Button>
        </div>
      </div>

      <Card className='dashboard-filters mb-4'>
        <Card.Body>
          <Row className='g-3'>
            <Col xs='12' md='6' lg='4'>
              <Form.Label>{t('filter.search')}</Form.Label>
              <Form.Control
                type='search'
                value={search}
                placeholder='Search title, slug'
                onChange={(event) => {
                  setPage(1)
                  setSearch(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ''))
                }}
              />
            </Col>
            <Col xs='12' md='6' lg='3'>
              <Form.Label>{t('filter.status.title')}</Form.Label>
              <Form.Select
                value={active}
                onChange={(event) => {
                  setPage(1)
                  setActive(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ''))
                }}
              >
                <option key='' value='all'>{t('filter.status.options.all')}</option>
                <option key='true' value>{t('filter.status.options.active')}</option>
                <option key='false' value={false}>{t('filter.status.options.inActive')}</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className='dashboard-data-table'>
        <div className='cms-table-wrap'>
          <Table bordered hover responsive size='sm' className='mb-0 text-center'>
            <thead>
              <tr>
                {tableHeaders.map((h, idx) => (
                  <th
                    key={idx}
                    onClick={() => h.value !== '' && setOrderBy(h.value)}
                    style={{ cursor: h.value !== '' ? 'pointer' : 'default' }}
                    className={selected(h) ? 'sortable active' : 'sortable'}
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
              {loading ? (
                <tr>
                  <td colSpan={tableHeaders.length} className='text-center py-4'>
                    <InlineLoader />
                  </td>
                </tr>
              ) : Boolean(cmsData) && cmsData?.count > 0 ? (
                cmsData?.rows?.map((cms) => {
                  const { cmsPageId, title, slug, isActive } = cms;
                  return (
                    <tr key={cmsPageId}>
                      <td>{cmsPageId}</td>
                      <td>
                        <Trigger message={title?.EN} id={cmsPageId} />
                        <span
                          id={cmsPageId}
                          onClick={() =>
                            navigate(`${AdminRoutes.CmsDetails.split(':').shift()}${cmsPageId}`)
                          }
                          className='cms-title-link'
                          title={title?.EN}
                        >
                          {title?.EN}
                        </span>
                      </td>
                      <td>{slug || '-'}</td>
                      <td>
                        <span className={isActive ? 'cms-pill cms-pill--active' : 'cms-pill cms-pill--inactive'}>
                          {isActive ? t('activeStatus') : t('inActiveStatus')}
                        </span>
                      </td>
                      <td>
                        <div className='cms-actions'>
                          <Trigger message='Edit' id={`${cmsPageId}_Edit`} />
                          <Button
                            id={`${cmsPageId}_Edit`}
                            className='cms-icon-btn'
                            size='sm'
                            variant='warning'
                            onClick={() =>
                              navigate(`${AdminRoutes.CmsEdit.split(':').shift()}${cmsPageId}`)
                            }
                            hidden={isHidden({ module: { key: 'CMS', value: 'U' } })}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>

                          <Trigger message='View Details' id={`${cmsPageId}_View`} />
                          <Button
                            id={`${cmsPageId}_View`}
                            className='cms-icon-btn'
                            size='sm'
                            variant='info'
                            onClick={() =>
                              navigate(`${AdminRoutes.CmsDetails.split(':').shift()}${cmsPageId}`)
                            }
                            hidden={isHidden({ module: { key: 'CMS', value: 'R' } })}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>

                          {!isActive ? (
                            <>
                              <Trigger message='Set Active' id={`${cmsPageId}_Active`} />
                              <Button
                                id={`${cmsPageId}_Active`}
                                className='cms-icon-btn'
                                size='sm'
                                variant='success'
                                onClick={() => handleStatusShow(cms, isActive)}
                                hidden={isHidden({ module: { key: 'CMS', value: 'T' } })}
                              >
                                <FontAwesomeIcon icon={faCheckSquare} />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Trigger message='Set In-Active' id={`${cmsPageId}_in-Active`} />
                              <Button
                                id={`${cmsPageId}_in-Active`}
                                className='cms-icon-btn'
                                size='sm'
                                variant='danger'
                                onClick={() => handleStatusShow(cms, isActive)}
                                hidden={isHidden({ module: { key: 'CMS', value: 'T' } })}
                              >
                                <FontAwesomeIcon icon={faWindowClose} />
                              </Button>
                            </>
                          )}

                          <Trigger message={'Delete'} id={cmsPageId + 'delete'} />
                          <Button
                            id={cmsPageId + 'delete'}
                            className='cms-icon-btn'
                            size='sm'
                            variant='danger'
                            hidden={isHidden({ module: { key: 'CMS', value: 'D' } })}
                            onClick={() => handleDeleteModal(cmsPageId)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className='text-center py-4 cms-empty'>
                    {t('noDataFound')}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      {cmsData?.count !== 0 && (
        <PaginationComponent
          page={cmsData?.count < page ? setPage(1) : page}
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
      />
      {deleteModalShow &&
        (
          <DeleteConfirmationModal
            deleteModalShow={deleteModalShow}
            setDeleteModalShow={setDeleteModalShow}
            handleDeleteYes={handleDeleteYes}
            loading={deleteLoading}
          />)}
    </div>
  )
}

export default CMSListing;