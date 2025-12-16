import React from 'react'
import {
  Button,
  Row,
  Col
} from '@themesberg/react-bootstrap'
import { ConfirmationModal, DeleteConfirmationModal } from '../../components/ConfirmationModal'



import CreateCasinoCategory from './components/CreateCasinoCategory'
import useCasinoCategoriesListing from './hooks/useCasinoCategoriesListing'
import useCheckPermission from '../../utils/checkPermission'
import { AdminRoutes } from '../../routes'

const CasinoCategory = () => {
  const {
    t,
    limit,
    page,
    // loading,
    // casinoCategories,
    show,
    // setLimit,
    // setPage,
    setShow,
    // totalPages,
    // handleShow,
    handleYes,
    handleShowModal,
    showModal,
    type,
    handleClose,
    selectedCategory,
    // setSelectedCategory,
    active,
    navigate,
    // handleDeleteModal,
    // deleteLoading,
    // handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    // setOrderBy,
    // selected,
    // sort,
    // setSort,
    // over,
    // setOver,
    updateloading
  } = useCasinoCategoriesListing()
  const { isHidden } = useCheckPermission()
  // if(loading) return (<Preloader />)
  return (
    <>
      <>
        <Row className='mb-2'>
          <Col>
            <h3>{t('casinoCategory.title')}</h3>
          </Col>

          <Col>
            <div className='d-flex justify-content-end'>
              <Button
                variant='success'
                size='sm'
                style={{ marginRight: '10px' }}
                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'C' } })}
                onClick={() => handleShowModal('Create')}
              >
                {t('casinoCategory.createButton')}
              </Button>

              <Button
                variant='success'
                size='sm'
                hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                onClick={() => navigate(AdminRoutes.ReorderCasinoCategories)}
              >
                {t('casinoCategory.reorder')}
              </Button>
            </div>
          </Col>
        </Row>

        {/* <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
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
            {casinoCategories?.count > 0 &&
                casinoCategories?.rows?.map(
                  ({
                    name,
                    masterGameCategoryId,
                    isActive,
                    orderId
                  }) => {
                    return (
                      <tr key={masterGameCategoryId}>
                        <td>{masterGameCategoryId}</td>
                        <td>
                          <Trigger message={name?.EN} id={name?.EN} />
                            <span
                            id={name?.EN}
                              style={{
                                width: '100px',
                                cursor: 'pointer'
                              }}
                              className='d-inline-block text-truncate'
                            >
                              {name?.EN}
                            </span>
                        </td>

                        <td>{orderId}</td>

                        <td>
                          {isActive
                            ? (
                              <span className='text-success'>{t('casinoCategory.activeStatus')}</span>
                              )
                            : (
                              <span className='text-danger'>{t('casinoCategory.inActiveStatus')}</span>
                              )}
                        </td>
                        {(!isHidden({ module: { key: 'CasinoManagement', value: 'U' } }) || !isHidden({ module: { key: 'CasinoManagement', value: 'T' } }))
                          ? (
                            <td>
                              <>
                                <Trigger message='Edit' id={masterGameCategoryId + 'edit'} />
                                <Button
                                  id={masterGameCategoryId + 'edit'}
                                  className='m-1'
                                  size='sm'
                                  variant='warning'
                                  hidden={isHidden({ module: { key: 'CasinoManagement', value: 'U' } })}
                                  onClick={() => {
                                    setSelectedCategory({ categoryId: masterGameCategoryId, name, isActive })
                                    handleShowModal('Edit')
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>

                                {!isActive
                                  ? (<>
                                    <Trigger message='Set Status Active' id={masterGameCategoryId + 'active'} />
                                    <Button
                                      id={masterGameCategoryId + 'active'}
                                      className='m-1'
                                      size='sm'
                                      variant='success'
                                      hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                      onClick={() =>
                                        handleShow(masterGameCategoryId, isActive)}
                                    >
                                      <FontAwesomeIcon icon={faCheckSquare} />
                                    </Button>
                                  </>
                                  )
                                  : (<>
                                    <Trigger message='Set Status In-Active' id={masterGameCategoryId + 'inactive'} />
                                    <Button
                                      id={masterGameCategoryId + 'inactive'}
                                      className='m-1'
                                      size='sm'
                                      variant='danger'
                                      hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                                      onClick={() =>
                                        handleShow(masterGameCategoryId, isActive)}
                                    >
                                      <FontAwesomeIcon icon={faWindowClose} />
                                    </Button>
                                  </>
                                  )}

                                <Trigger message='Delete' id={masterGameCategoryId + 'delete'} />
                                <Button
                                  id={masterGameCategoryId + 'delete'}
                                  className='m-1'
                                  size='sm'
                                  variant='danger'
                                  hidden={isHidden({ module: { key: 'CasinoManagement', value: 'D' } })}
                                  onClick={() => handleDeleteModal(masterGameCategoryId)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </>
                            </td>
                          ) : "NA"}
                      </tr>
                    )
                  }
                )}

            {casinoCategories?.count === 0 &&
                  (
                    <tr>
                      <td
                        colSpan={5}
                        className='text-danger text-center'
                      >
                        {t('casinoCategory.noDataFound')}
                      </td>
                    </tr>
                  )}
          </tbody>
        </Table> */}
        {/* {loading && <InlineLoader />} */}
        {/* {casinoCategories?.count !== 0 &&
        (
          <PaginationComponent
            page={casinoCategories?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )} */}
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
            // handleDeleteYes={handleDeleteYes}
            // loading={deleteLoading}
          />)}

      {type === 'Edit'
        ? (
            selectedCategory && (
              <CreateCasinoCategory
                t={t}
                categoryName={selectedCategory.name}
                isActive={selectedCategory.isActive}
                categoryId={selectedCategory?.categoryId}
                handleClose={handleClose}
                limit={limit}
                pageNo={page}
                showModal={showModal}
                type={type}
              />
            )
          )
        : (
          <CreateCasinoCategory
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

export default CasinoCategory