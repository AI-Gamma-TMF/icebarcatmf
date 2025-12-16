import React from 'react'
import { useNavigate } from "react-router-dom";
import useReorderTournaments from '../hooks/useReorderTournaments'
import {
    Button,
    Row,
    Col,
    Spinner,
    Form
} from '@themesberg/react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import '../reorderTable.scss'
import { AdminRoutes } from '../../../routes'

const ReorderTournaments = () => {
    const {
        t,
        loading,
        state,
        onDragEnd,
        handleSave,
        status,
        setStatus,
        coinType,
        setCoinType
    } = useReorderTournaments()

    const navigate = useNavigate();

    return (
        <>
            <Row>
                <Col sm={8}>
                    <h3>Reorder Tournaments</h3>
                </Col>

                <Col>
                    <div className='text-right d-flex justify-content-end gap-2 mb-3'>
                        <Button
                            variant='success'
                            onClick={() => handleSave()}
                            disabled={loading}
                        >
                            Save
                            {loading && (
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            )}
                        </Button>
                        <Button
                            variant="warning"
                            onClick={() => navigate(AdminRoutes.Tournament)}
                        >
                            Cancel
                        </Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs='12' lg='auto'>
                    <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
                        <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                            {t('casinoSubCategory.filters.status')}
                        </Form.Label>

                        <Form.Select
                            onChange={(e) => {
                                setStatus(e.target.value)
                            }}
                            value={status}
                            style={{ minWidth: '230px' }}
                        >
                            <option value='all'>{t('casinoSubCategory.filters.all')}</option>
                            <option value='0'>{t('casinoSubCategory.filters.upComing')}</option>
                            <option value='1'>{t('casinoSubCategory.filters.onGoing')}</option>
                        </Form.Select>
                    </div>
                </Col>
                <Col xs='12' lg='auto'>
                    <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
                        <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                            {t('casinoSubCategory.filters.coinType')}
                        </Form.Label>

                        <Form.Select
                            onChange={(e) => {
                                setCoinType(e.target.value)
                            }}
                            value={coinType}
                            style={{ minWidth: '230px' }}
                        >
                            <option value='all'>{t('casinoSubCategory.filters.all')}</option>
                            <option value='SC'>{t('casinoSubCategory.filters.scCoin')}</option>
                            <option value='GC'>{t('casinoSubCategory.filters.gcCoin')}</option>
                        </Form.Select>
                    </div>
                </Col>
            </Row>

            <div className='tournament-reorder cus-reorder-package'>

                <div className='reorder-heading cus-reorder-heading'>
                    {[
                        'Id',
                        'Title',
                        'Joining Coin',
                        'Status'
                    ]?.map((h, idx) => (
                        <p key={idx} style={{ width: h === 'Title' ? '40%' : '18%' }}>{h}</p>
                    ))}
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='list'>
                        {provided => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>

                                {state?.count > 0 &&
                                    state?.rows?.map(
                                        ({
                                            tournamentId,
                                            title,
                                            entryCoin,
                                            status

                                        }, idx) => (
                                            <Draggable draggableId={`id-${idx}`} key={idx} index={idx}>
                                                {provided => (
                                                    <div
                                                        className='reorder-content cus-reorder-content'
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <p className='cus-reorder-id'>{tournamentId}</p>
                                                        <p className='cus-reorder-amt' style={{  width: "40%", whiteSpace: "nowrap", overflow: "hidden" }}>{title}</p>
                                                        <p className='cus-reorder-gccoin'>{entryCoin}</p>
                                                        <p>{status === "0" ? (
                                                            <span className="text-warning">Upcoming</span>
                                                        ) : status === "1" ? (
                                                            <span className="text-success">Ongoing</span>
                                                        ) : status === "2" ? (
                                                            <span className="text-muted">Completed</span>
                                                        ) : status === '3' ? (
                                                            <span className="text-danger">Cancelled</span>
                                                        ) : (
                                                            <span>----</span>
                                                        )}                                                        </p>
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

            {state?.count === 0
                ? <p className='text-danger text-center'>No data found</p>
                : null}
        </>
    )
}

export default ReorderTournaments