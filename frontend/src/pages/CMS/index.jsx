/* eslint-disable react/display-name */
import React from 'react'
import {
  Button,
  Form,
  Row,
  Col,
  Table
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
    <>
      <Row>
        <Col className='col-10'>
          <h3>{t('title')}</h3>
        </Col>
        <Col className='col-2 text-end'>
          <Button
            variant='success'
            className='f-right'
            size='sm'
            onClick={() => navigate(AdminRoutes.CmsCreate, {
              state: {
                cmsData: cmsData?.rows
              }
            })}
            hidden={isHidden({ module: { key: 'CMS', value: 'C' } })}
          >
            {t('createButton')}
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs='12' md='6' lg='3'>

          <Form.Label>
            {t('filter.search')}
          </Form.Label>

          <Form.Control
            type='search'
            value={search}
            placeholder='Search title, slug'
            onChange={(event) => {
              setPage(1)
              setSearch(
                event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, '')
              )
            }
            }
          />
        </Col>
        <Col xs='12' md='6' lg='3'>
          <Form.Label>
            {t('filter.status.title')}
          </Form.Label>

          <Form.Select
            value={active}
            onChange={(event) => {
              setPage(1)
              setActive(
                event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, '')
              )
            }
            }
          >
            <option key='' value='all'>{t('filter.status.options.all')}</option>
            <option key='true' value>{t('filter.status.options.active')}</option>
            <option key='false' value={false}>{t('filter.status.options.inActive')}</option>
          </Form.Select>
        </Col>
      </Row>

      {<Table bordered striped responsive hover size='sm' className='text-center mt-4'>
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
            {Boolean(cmsData) && cmsData?.count > 0 ? (
              cmsData?.rows?.map(
                (cms) => {
                  const { cmsPageId, title, slug, isActive } = cms;
                  return (
                    <tr key={cmsPageId}>
                      <td>{cmsPageId}</td>

                      <td>
                        <Trigger message={title?.EN} id={cmsPageId} />
                        <span
                          id={cmsPageId}
                          style={{
                            width: '150px',
                            cursor: 'pointer'
                          }}
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.CmsDetails.split(':').shift()}${cmsPageId}`
                            )}
                          className='text-link d-inline-block text-truncate'
                        >
                          {title?.EN}
                        </span>
                      </td>

                      <td>{slug || '-'}</td>

                      <td>
                        {isActive
                          ? (
                            <span className='text-success'>{t('activeStatus')}</span>
                          )
                          : (
                            <span className='text-danger'>{t('inActiveStatus')}</span>
                          )}
                      </td>

                      <td>
                        <Trigger message='Edit' id={`${cmsPageId}_Edit`} />
                        <Button
                          id={`${cmsPageId}_Edit`}
                          className='m-1'
                          size='sm'
                          variant='warning'
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.CmsEdit.split(':').shift()}${cmsPageId}`
                            )}
                          hidden={isHidden({ module: { key: 'CMS', value: 'U' } })}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Trigger message='View Details' id={`${cmsPageId}_View`} />
                        <Button
                          id={`${cmsPageId}_View`}
                          className='m-1'
                          size='sm'
                          variant='info'
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.CmsDetails.split(':').shift()}${cmsPageId}`
                            )}
                          hidden={isHidden({ module: { key: 'CMS', value: 'R' } })}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>

                        {!isActive
                          ? (
                            <>
                              <Trigger message='Set Active' id={`${cmsPageId}_Active`} />
                              <Button
                                id={`${cmsPageId}_Active`}
                                className='m-1'
                                size='sm'
                                variant='success'
                                onClick={() =>
                                  handleStatusShow(cms, isActive)}
                                hidden={isHidden({ module: { key: 'CMS', value: 'T' } })}
                              >
                                <FontAwesomeIcon icon={faCheckSquare} />
                              </Button>
                            </>
                          )
                          : (
                            <>
                              <Trigger message='Set In-Active' id={`${cmsPageId}_in-Active`} />
                              <Button
                                id={`${cmsPageId}_in-Active`}
                                className='m-1'
                                size='sm'
                                variant='danger'
                                onClick={() =>
                                  handleStatusShow(cms, isActive)}
                                hidden={isHidden({ module: { key: 'CMS', value: 'T' } })}
                              >
                                <FontAwesomeIcon icon={faWindowClose} />
                              </Button>
                            </>
                          )}

                        <Trigger message={'Delete'} id={cmsPageId + 'delete'} />
                        <Button
                          id={cmsPageId + 'delete'}
                          className='m-1'
                          size='sm'
                          variant='danger'
                          hidden={isHidden({ module: { key: 'CMS', value: 'D' } })}
                          onClick={() => handleDeleteModal(cmsPageId)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  )
                }
              )
            ) : (
              <tr>
                <td colSpan={6} className='text-danger text-center'>
                  {t('noDataFound')}
                </td>
              </tr>
            )
            }
          </tbody>
        )}

      </Table>}
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
    </>
  )
}

export default CMSListing;