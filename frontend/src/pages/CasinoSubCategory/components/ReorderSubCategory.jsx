import React from 'react'
import {
  Button,
  Row,
  Col,
  Spinner
} from '@themesberg/react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import useReorderSubCategories from '../hooks/useReorderSubCategories'
import Preloader from '../../../components/Preloader'
import { AdminRoutes } from '../../../routes'

const ReorderSubCategory = () => {
  const {
    t,
    loading,
    state, onDragEnd, handleSave, 
    // casinoCategories, 
    // categoryFilter, 
    // setCategoryFilter,
     saveLoading, navigate
  } = useReorderSubCategories()

  if(loading) return (<Preloader />)
  return (
    <>
      <Row>
        <Col xs={12} sm={6}>
          <h3>{t('casinoSubCategory.reorderCategory.title')}</h3>
        </Col>

        {/* <Col xs={12} sm={6}>
          <div className='d-flex justify-content-between justify-content-sm-end align-items-center w-100 flex-wrap'>
            <Form.Label style={{ marginBottom: '0', marginRight: '15px' }}>
            {t('casinoSubCategory.reorderCategory.category')}
            </Form.Label>

            <Form.Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ maxWidth: '230px' }}
            >
              <option value=''>{t('casinoSubCategory.reorderCategory.selectCategory')}</option>
              {casinoCategories && casinoCategories?.rows?.map((c) => (
                <option key={c?.masterGameCategoryId} value={c?.masterGameCategoryId}>{c?.name?.EN}</option>
              ))}
            </Form.Select>
          </div>
        </Col> */}

      </Row>

      {/* {categoryFilter
        ? ( */}
          <>
            <div>
              <div className='text-right mt-2'>
              <Button className='me-2' 
                variant='warning'
                  onClick={() => navigate(AdminRoutes.CasinoSubCategories)}
              >
                {t('casinoSubCategory.reorderCategory.cancel')}
              </Button>
                <Button
                  variant='success'
                  className='f-right'
                  style={{ marginRight: '10px' }}
                  onClick={() => handleSave()}
                  disabled = { saveLoading}
                >
                  {t('casinoSubCategory.reorderCategory.save')}
                  {saveLoading && (
                    <Spinner
                      style={{marginLeft: '4px'}}
                      as='span'
                      animation='border'
                      size='sm'
                      role='status'
                      aria-hidden='true'
                    />
                  )}
                </Button>
              </div>

              <div className='reorder-heading cus-reorder-heading'>
                {[
                  t('casinoSubCategory.reorderCategory.id'),
                  t('casinoSubCategory.reorderCategory.name'),
                  t('casinoSubCategory.reorderCategory.status'),
                  // t('casinoSubCategory.reorderCategory.categoryName')
                ].map((h) => (
                  <p key={h}>{h}</p>
                ))}
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='list'>
                  {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {state.count > 0 &&
              state?.rows?.map(
                ({
                  name: nameObj,
                  // MasterGameCategory: { name: categoryName },
                  isActive,
                  masterGameSubCategoryId
                }, idx) => {
                  const name = (nameObj)
                  return(
                  <Draggable draggableId={`id-${idx}`} key={idx} index={idx}>
                    {provided => (
                      <div
                        className='reorder-content d-flex cus-reorder-content'
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <p>{masterGameSubCategoryId}</p>
                        <p>
                          {name?.EN}
                        </p>

                        <p>
                          {isActive
                            ? (
                              <span className='text-success'>{t('casinoSubCategory.filters.active')}</span>
                              )
                            : (
                              <span className='text-danger'>{t('casinoSubCategory.filters.inactive')}</span>
                              )}
                        </p>
                        {/* <p>
                          {categoryName?.EN}
                        </p> */}

                      </div>
                    )}
                  </Draggable>
                )})}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

            </div>
            {state.count === 0 &&
              <div className='text-danger text-center'>{t('casinoSubCategory.noDataFound')}</div>}
          </>
          {/* )
        : <p className='text-center mt-7'>{t('casinoSubCategory.categoryFirst')} </p>} */}
    </>
  )
}

export default ReorderSubCategory