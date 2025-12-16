import React from "react";
import { Button, Row, Col } from "@themesberg/react-bootstrap";
import useReorderFtpBonus from "../hooks/useReorderFtpBonus";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../reorderPackages.scss";

const ReorderFtpBonusPage = () => {
  const { loading, state, onDragEnd, handleSave } =
    useReorderFtpBonus();
  
  return (
   
    <>
         <Row>
            <Col sm={8}>
                <h3>Reorder First Purchase Bonus </h3>
            </Col>

            <Col>
                <div className='text-right mb-3'>
                    <Button
                        variant='success'
                        onClick={() => handleSave()}
                        disabled={state.count===0||loading}
                    >
                       Save
                    </Button>
                </div>
            </Col>
        </Row>

        <div className='cus-reorder-package'>

            <div className='reorder-heading cus-reorder-heading'>
                {[
                   "ID",
                   
                    "GC BONUS",
                    "SC BONUS",
                    "STATUS"
                
                ].map((h) => (
                    <p key={h} style={{ width: '18%' }}>{h}</p>
                ))}
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='list'>
                    {provided => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>

                            {state.count > 0 &&
                                state?.rows?.map(
                                    ({
                                      packageFirstPurchaseId, isActive, firstPurchaseScBonus, firstPurchaseGcBonus
                                    }, idx) => (
                                        <Draggable draggableId={`id-${idx}`} key={idx} index={idx}>
                                            {provided => (
                                                <div
                                                    className='reorder-content cus-reorder-content'
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <p className='cus-reorder-id'>{packageFirstPurchaseId}</p>
                                                   
                                                    <p className='cus-reorder-gccoin'>{firstPurchaseGcBonus}</p>
                                                    <p className='cus-reorder-sccoin'>{firstPurchaseScBonus}</p>
                                                    <p className='cus-reorder-status'>
                                                        {isActive
                                                            ? (
                                                                <span className='text-success'>Active</span>
                                                            )
                                                            : (
                                                                <span className='text-danger'>In Active</span>
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
            ? <p className='text-danger text-center'> No Data Found or Package is not First Purchase Package Type </p>
            : null}
    </>
  );
};

export default ReorderFtpBonusPage;
