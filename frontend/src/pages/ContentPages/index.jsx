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
import { faEdit, faEye, faTrash, faArrowCircleUp, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'
import useCmsListing from './hooks/useContentPagesListing'
import Trigger from '../../components/OverlayTrigger'
import { InlineLoader } from '../../components/Preloader'
import PaginationComponent from '../../components/Pagination'
import { AdminRoutes } from '../../routes'
import { DeleteConfirmationModal } from '../../components/ConfirmationModal'
import useCheckPermission from '../../utils/checkPermission'
import { tableHeaders } from './constants'
import CreateContentPage from './components/CreateContentPage'

const ContentPagesListing = () => {
  const {
    page,
    limit,
    setPage,
    setLimit,
    setSearch,
    search,
    navigate,
    pageContentData,
    totalPages,
    loading,
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
    handleDeleteYes,
    type,
    showModal,
    selectedPage,
    setSelectedPage,
    handleClose,
    handleShowModal
  } = useCmsListing()
  const { isHidden } = useCheckPermission()

  return (
    <>
      <Row className='d-flex justify-content-between'>
        <Col xs='6' md='8' lg='9'>
          <h3>{t('title')}</h3>
        </Col>

        <Col xs='6' md='4' lg='3' className='text-end'>
          <Button
            variant='success'
            className='f-right'
            size='sm'
            onClick={() => handleShowModal('Create')}
          // hidden={isHidden({ module: { key: 'CMS', value: 'C' } })}
          >
            {t('createButton')}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs='12' md='6' lg='3'> 
          <div className=''>

            <Form.Label>
              {t('filter.search')}
            </Form.Label>

            <Form.Control
              type='search'
              value={search}
              placeholder='Search by page name'
              onChange={(event) => {
                setPage(1)
                setSearch(
                  event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, '')
                )
              }
              }
            />
          </div>
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
                  cursor: 'pointer'
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
          {Boolean(pageContentData) &&
            pageContentData?.rows?.map(
              (page) => {
                const { pageId, pageName } = page;
                return (
                  <tr key={pageId}>
                    <td>{pageId}</td>

                    <td>
                      <Trigger message={pageName} id={pageName} />
                      <span
                        id={pageName}
                        style={{
                          width: '150px',
                          cursor: 'pointer'
                        }}
                        // onClick={() =>
                        //   navigate(
                        //     `${AdminRoutes.CmsDetails.split(':').shift()}${pageId}`
                        //   )}
                        className='text-link d-inline-block text-truncate'
                      >
                        {pageName}
                      </span>
                    </td>

                    <td>
                      <Trigger message='Edit' id={`${pageId}_Edit`} />
                      <Button
                        id={`${pageId}_Edit`}
                        className='m-1'
                        size='sm'
                        variant='warning'
                        onClick={() => {
                          setSelectedPage(page)
                          handleShowModal('Edit')
                        }}
                        hidden={isHidden({ module: { key: 'CMS', value: 'U' } })}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Trigger message='View Details' id={`${pageId}_View`} />
                      <Button
                        id={`${pageId}_View`}
                        className='m-1'
                        size='sm'
                        variant='info'
                        onClick={() =>
                          navigate(
                            `${AdminRoutes.ContentPageDetails.split(':').shift()}${pageId}`
                          )}
                      // hidden={isHidden({ module: { key: 'CMS', value: 'R' } })}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </Button>
                      <Trigger message={'Delete'} id={pageId + 'delete'} />

                      <Button
                        id={pageId + 'delete'}
                        className='m-1'
                        size='sm'
                        variant='danger'
                        // hidden={isHidden({ module: { key: 'CMS', value: 'D' } })}
                        onClick={() => {
                          setSelectedPage(page)
                          handleDeleteModal()
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>

                    </td>
                  </tr>
                )
              }
            )}
          {pageContentData?.count === 0 && (
            <tr>
              <td colSpan={6} className='text-danger text-center'>
                {t('noDataFound')}
              </td>
            </tr>
          )}
        </tbody>
      </Table>}
      {loading && <InlineLoader />}
      {pageContentData?.count !== 0 && (
        <PaginationComponent
          page={pageContentData?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}

      {deleteModalShow &&
        (
          <DeleteConfirmationModal
            deleteModalShow={deleteModalShow}
            setDeleteModalShow={setDeleteModalShow}
            handleDeleteYes={handleDeleteYes}
          />
        )
      }
      {type === 'Edit'
        ? (
          selectedPage && (
            <CreateContentPage
              t={t}
              pageName={selectedPage.pageName}
              pageId={selectedPage?.pageId}
              handleClose={handleClose}
              limit={limit}
              pageNo={page}
              showModal={showModal}
              type={type}
            />
          )
        )
        : (
          <CreateContentPage
            t={t}
            handleClose={handleClose}
            limit={limit}
            pageNo={page}
            showModal={showModal}
            type={type}
          />
        )}
    </>
  )
}

export default ContentPagesListing;