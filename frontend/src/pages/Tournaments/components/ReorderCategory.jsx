import React from 'react'
import {
  Button,
  Row,
  Col
} from '@themesberg/react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import useReorderCategories from '../hooks/useReorderCategories'
import Preloader from '../../../components/Preloader'
import '../reorderTable.scss'

const ReorderCategory = () => {
  const {
    t,
    loading,
    state, onDragEnd, handleSave
  } = useReorderCategories()

  if (loading) return (<Preloader />)
  return (
    <>
      <Row>
        <Col xs={6} lg={9}>
          <h3>{t('casinoCategory.reorderCategory.label')}</h3>
        </Col>

        <Col xs={6} lg={3}>
          <div className='text-right mb-3'>
            <Button
              variant='success'
              onClick={() => handleSave()}
            >
              {t('casinoCategory.reorderCategory.save')}
            </Button>
          </div>
        </Col>
      </Row>

      <div className='cus-reorder-table'>

        <div className='reorder-heading cus-reorder-heading'>
          {[
            t('casinoCategory.reorderCategory.id'),
            t('casinoCategory.reorderCategory.name'),
            t('casinoCategory.reorderCategory.status')
          ].map((h) => (
            <p key={h}>{h}</p>
          ))}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='list'>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {/* <QuoteList quotes={state.quotes} /> */}
                {state.count > 0 &&
                  state?.rows?.map(
                    ({

                      name,
                      masterGameCategoryId,
                      isActive

                    }, idx) => (
                      <Draggable draggableId={`id-${idx}`} key={idx} index={idx}>
                        {provided => (
                          <div
                            className='reorder-content d-flex cus-reorder-content'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <p className='cus-reorder-id'>{masterGameCategoryId}</p>
                            <p className='cus-reorder-name'>
                              {name?.EN}
                            </p>

                            <p className='cus-reorder-status'>
                              {isActive
                                ? (
                                  <span className='text-success'>{t('casinoCategory.activeStatus')}</span>
                                )
                                : (
                                  <span className='text-danger'>{t('casinoCategory.inActiveStatus')}</span>
                                )}
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

      </div>

      {state.count === 0
        ? <p className='text-danger text-center'>{t('casinoCategory.noDataFound')}</p>
        : null}
    </>
  )
}

export default ReorderCategory