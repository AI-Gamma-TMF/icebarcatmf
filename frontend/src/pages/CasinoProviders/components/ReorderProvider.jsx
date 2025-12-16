import React from 'react';
import {
    Button,
    Row,
    Col
} from '@themesberg/react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Preloader from '../../../components/Preloader';
import useReorderProviders from '../hooks/useReorderProviders';
import { AdminRoutes } from '../../../routes';

const ReorderProvider = () => {
    const {
        t,
        loading,
        state,
        onDragEnd,
        handleSave, navigate
    } = useReorderProviders();

    if (loading) return (<Preloader />)

    return (
        <>
            <Row>
                <Col xs={6} lg={9}>
                    <h3>{t('casinoProvider.reorderProvider.label')}</h3>
                </Col>
                <Col xs={6} lg={3}>
                    <div className='text-right mb-3'>
                    <Button className='me-2'
                              variant='warning'
                               onClick={() => navigate(AdminRoutes.CasinoProviders)}
                            >
                              {t('casinoProvider.reorderProvider.cancel')}
                            </Button>
                        <Button
                            variant='success'
                            onClick={handleSave}
                        >
                            {t('casinoProvider.reorderProvider.save')}
                        </Button>
                    </div>
                </Col>
            </Row>

            <div className='cus-reorder-table'>
                <div className='reorder-heading cus-reorder-heading'>
                    {[
                        t('casinoProvider.reorderProvider.id'),
                        t('casinoProvider.reorderProvider.name'),
                        t('casinoProvider.reorderProvider.status')
                    ].map((h) => (
                        <p key={h}>{h}</p>
                    ))}
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='list'>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {state?.count > 0 && state?.rows?.map(
                                    (data, idx) => {
                                        return (
                                            <Draggable draggableId={`id-${idx}`} key={idx} index={idx}>
                                                {provided => (
                                                    <div
                                                        className='reorder-content d-flex cus-reorder-content'
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <p className='cus-reorder-id'>{data.masterCasinoProviderId}</p>
                                                        <p className='cus-reorder-name'>{data.name}</p>
                                                        <p className='cus-reorder-status'>
                                                            {data.isActive
                                                                ? <span className='text-success'>{t('casinoProvider.activeStatus')}</span>
                                                                : <span className='text-danger'>{t('casinoProvider.inActiveStatus')}</span>}
                                                        </p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )
                                    }
                                )}

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {state?.count === 0
                ? <p className='text-danger text-center'>{t('casinoProvider.noDataFound')}</p>
                : null}
        </>
    );
}

export default ReorderProvider;
