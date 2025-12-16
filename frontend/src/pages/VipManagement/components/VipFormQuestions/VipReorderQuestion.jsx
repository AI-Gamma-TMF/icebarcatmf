// export default VipReorderQuestion
import React from 'react'
import {
  Button,
  Row,
  Col,
  Spinner
} from '@themesberg/react-bootstrap'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import './vip-reorder.scss'
import useReorderQuestion from '../../hooks/useReorderQuestions'
import { AdminRoutes } from '../../../../routes'

const VipReorderQuestion = () => {
  const {
    t,
    loading,
    state,
    onDragEnd,
    handleSave, navigate
  } = useReorderQuestion()

  return (
    <>
      <Row>
        <Col sm={8}>
          <h3>Reorder Questions</h3>
        </Col>

        <Col>
          <div className='text-right mb-3'>
          <Button className='me-2'
              variant='warning'
                onClick={() => navigate(AdminRoutes.VipDashboardQuestionForm)}
            >
              {t('cancel')}
            </Button>
            <Button
              variant='success'
              onClick={() => handleSave()}
              disabled={loading}
            >
              {t('save')}{' '}
              {loading && (
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
              )}
            </Button>
          </div>
        </Col>
      </Row>

      <div className='cus-reorder-package'>

        <div className='reorder-heading cus-reorder-heading d-flex'>
          <p className='cus-reorder-id'style={{ width: '16.67%',display:"flex",alignItems:"center",justifyContent:"center" }} >ID</p>
          <p className='cus-reorder-question' style={{ width: '50%',display:"flex",alignItems:"center",justifyContent:"center" }}>Question</p>
          <p className='cus-reorder-question-type' style={{ width: '16.67%',display:"flex",alignItems:"center",justifyContent:"center" }}>Question Type</p>
          <p className='cus-reorder-status'style={{ width: '16.67%',display:"flex",alignItems:"center",justifyContent:"center" }}>Status</p>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='list'>
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {state.count > 0 &&
                  state?.rows?.map((
                    {
                      questionnaireId,
                      question,
                      frontendQuestionType,
                      isActive
                    }, idx
                  ) => (
                    <Draggable draggableId={`id-${idx}`} key={idx} index={idx}>
                      {provided => (
                        <div
                          className='reorder-content cus-reorder-content d-flex'
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <p className='cus-reorder-id'style={{ width: '16.67%',display:"flex",alignItems:"center",justifyContent:"center" }} >{questionnaireId}</p>
                          <p className='cus-reorder-question'style={{ width: '50%',display:"flex",alignItems:"center",justifyContent:"center" }}>{question}</p>
                          <p className='cus-reorder-question-type' style={{ width: '16.67%',display:"flex",alignItems:"center",justifyContent:"center" }} >{frontendQuestionType ?? 'N/A'}</p>
                          <p className='cus-reorder-status'style={{ width: '16.67%',display:"flex",alignItems:"center",justifyContent:"center" }}>
                            {isActive
                              ? <span className='text-success'>{t('activeStatus')}</span>
                              : <span className='text-danger'>{t('inActiveStatus')}</span>}
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

      {state.count === 0 && (
        <p className='text-danger text-center'>{t('noDataFound')}</p>
      )}
    </>
  )
}

export default VipReorderQuestion
