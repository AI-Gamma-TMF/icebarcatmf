import React from 'react';
import { Button, Row, Col, Table, Form, Card } from '@themesberg/react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './GameReorder.scss';
import useGameReorder from './hooks/useGameReorder';
import Preloader from '../../components/Preloader';
import { AdminRoutes } from '../../routes';
// import PaginationComponent from '../../../components/Pagination'

const GameReorder = () => {
  const {
    t,
    loading,
    reOrderedGame,
    onDragEnd,
    handleSave,
    casinoGames,
    // handRemoveGame,
    handleAddGame,
    // casinoCategories,
    categoryFilter,
    // setCategoryFilter,
    // totalPages,
    setCasinoCategoryId,
    subCategories,
    casinoCategoryId,
    setReorderedGame,
    // setCasinoGames,
    selectedId,
    handleSelectAll,
    tempCasinoGames,
    addCasinoGame,
    selectedReorderGameId,
    // setSelectedReorderGameId,
    handleReorderSelectAll,
    handleReorderAddGame,
    removeReorderAddGame,
    navigate
  } = useGameReorder();

  const subCategoryChangeHandler = (e) => {
    setCasinoCategoryId(e.target.value);
    if (reOrderedGame.rows) {
      setReorderedGame({ rows: [], count: 0 });
    }
  };

  return (
    <>
      {loading && <Preloader />}
      <Row>
        <Col sm={8}>
          <h3>{t('casinoGames.reorder.title')}</h3>
        </Col>
        <Col>
          <div className='text-right mb-3'>
            <Button className='me-2' size='sm'
              variant='warning'
              onClick={() => navigate(AdminRoutes.CasinoGames)}
            >
              {t('casinoGames.reorder.cancel')}
            </Button>
            <Button variant='success' size='sm' onClick={() => handleSave()} disabled={reOrderedGame?.count === 0}>
              {t('casinoGames.reorder.updateButton')}
            </Button>
          </div>
        </Col>
      </Row>
      <div className='game-reordering-container'>
        <Row>
          <Col sm={8}>
            <Card className='p-2 game-reordering-subcontainer me-1'>
              <Row>
                <Col lg={10}>
                  <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
                    {/* <div className='d-flex justify-content-start align-items-start flex-column w-50 flex-wrap'>
                <Form.Label style={{ marginBottom: '0', marginRight: '15px' ,marginLeft: '15px'}}>
                {t('casinoGames.reorder.category')}
                </Form.Label>

                <Form.Select
                  value={categoryFilter}
                  style={{ marginBottom: '0', marginRight: '15px', maxWidth: '230px' }}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCasinoGames({ rows: [], count: 0 });
                  }}
                  // style={{ maxWidth: '230px' }}
                >
                  <option value=''>{t('casinoGames.reorder.selectCategory')}</option>
                  {casinoCategories && casinoCategories?.rows?.map((c) => (
                    <option key={c?.masterGameCategoryId} value={c?.masterGameCategoryId}>{c?.name.EN}</option>
                  ))}
                </Form.Select>
                </div> */}
                    {categoryFilter && (
                      <>
                        <div className='d-flex justify-content-start align-items-center w-50 flex-wrap'>
                          <Form.Label style={{ marginBottom: '0', marginRight: '15px', marginLeft: '15px' }}>
                            {t('casinoGames.reorder.subCategory')}
                          </Form.Label>
                          <Form.Select
                            style={{ marginBottom: '0', marginRight: '15px', maxWidth: '230px' }}
                            value={casinoCategoryId}
                            onChange={(e) => subCategoryChangeHandler(e)}
                          >
                            <option value=''>{t('casinoGames.reorder.all')}</option>

                            {subCategories &&
                              subCategories?.rows?.map((c) => (
                                <option key={c?.masterGameSubCategoryId} value={c?.masterGameSubCategoryId}>
                                  {c?.name?.EN}
                                </option>
                              ))}
                          </Form.Select>
                        </div>
                      </>
                    )}
                  </div>
                </Col>
                {selectedId?.length > 0 && (
                  <Col lg={2}>
                    <Button variant='primary' onClick={addCasinoGame} style={{ width: '100px', marginTop: '20px' }}>
                      Add
                    </Button>
                  </Col>
                )}
              </Row>

              <div style={{ overflow: 'auto' }}>
                {casinoCategoryId ? (
                  <>
                    <Table bordered striped hover size='sm' className='text-center mt-4'>
                      <thead className='thead-dark'>
                        <tr>
                          <th>
                            <input
                              name='selectAll'
                              type='checkbox'
                              className='m-1 form-check-input  game-button cursor-pointer'
                              checked={selectedId?.length > 0 && selectedId?.length == tempCasinoGames?.rows?.length}
                              onChange={(e) => handleSelectAll(e)}
                            />
                          </th>
                          <th>{t('casinoGames.reorder.headers.orderID')}</th>
                          <th>{t('casinoGames.reorder.headers.gameName')}</th>
                          <th>{t('casinoGames.reorder.headers.provider')}</th>
                          <th>{t('casinoGames.reorder.headers.rtp')}</th>
                          <th>{t('casinoGames.reorder.headers.gameActiveOnSite')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {casinoGames?.rows?.map((item, idx) => {
                          return (
                            <tr key={idx}>
                              <td>
                                {' '}
                                <input
                                  name='select'
                                  type='checkbox'
                                  className='m-1 form-check-input game-button cursor-pointer'
                                  checked={selectedId?.includes(item?.masterCasinoGameId)}
                                  onChange={(e) => handleAddGame(e, item)}
                                />
                              </td>
                              <td className='text-left'>{idx + 1}</td>
                              <td>{item.name}</td>
                              <td>{item.providerName}</td>
                              <td>{item.returnToPlayer || '-'}</td>
                              <td>{item.gameActiveOnSite ? 'Yes': 'No'}</td>
                            </tr>
                          );
                        })}

                        {casinoGames?.count === 0 && (
                          <tr>
                            <td className='text-danger' colSpan={10}>
                              {t('casinoGames.reorder.noData')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    {/* {casinoGames?.count !== 0 &&
                    <PaginationComponent
                      page={casinoGames?.count < page ? setPage(1) : page}
                      totalPages={totalPages}
                      setPage={setPage}
                      limit={limit}
                      setLimit={setLimit}
                    />} */}
                  </>
                ) : (
                  <p className='text-danger text-center mt-7'> {t('casinoGames.reorder.selectFirstMessage')} </p>
                )}
              </div>
            </Card>
          </Col>

          <Col>
            <Row>
              <Col style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              {selectedReorderGameId?.length > 0 && (
                <Button
                  variant='primary'
                  onClick={removeReorderAddGame}
                  style={{ width: '100px', marginTop: '20px', marginBottom: '20px', alignItems:'end' }}
                >
                  Remove
                </Button>
              )}
              </Col>
            </Row>

            <Card className='p-2 game-reordering-subcontainer'>
              {reOrderedGame?.count !== 0 ? (
                <div className='game-reorder'>
                  <div className='game-reorder-heading'>
                    {[t('casinoGames.reorder.headers.id'), t('casinoGames.reorder.headers.gameName')].map((h, idx) => (
                      <p className={`game-heading-${idx}`} key={h}>
                        {h}
                      </p>
                    ))}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        marginRight: '30px',
                        marginTop: '5px',
                      }}
                    >
                      {' '}
                      <input
                        className={`game-heading-${3} form-check-input cursor-pointer`}
                        name='select'
                        type='checkbox'
                        checked={
                          selectedReorderGameId?.length > 0 && selectedReorderGameId?.length == reOrderedGame?.rows?.length
                        }
                        onChange={(e) => handleReorderSelectAll(e)}
                      // onChange={(e) => handRemoveGame(item)}
                      ></input>
                    </div>
                  </div>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId='list'>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          {/* <QuoteList quotes={state.quotes} /> */}
                          {reOrderedGame?.rows?.map((item, idx) => (
                            <Draggable draggableId={`id-${idx}`} key={idx} index={idx}>
                              {(provided) => (
                                <div
                                  className='game-reorder-content'
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <p className='game-id'>{idx + 1}</p>
                                  <p className='game-name'>{item.name}</p>
                                  {/* <Button
                                  className='m-1 game-button'
                                  size='sm'
                                  variant='danger'
                                  onClick={() => handRemoveGame(item)}
                                >X
                                </Button> */}
                                  <input
                                    className='m-1 form-check-input game-button cursor-pointer'
                                    name='select'
                                    type='checkbox'
                                    checked={selectedReorderGameId?.includes(item?.masterCasinoGameId)}
                                    onChange={(e) => handleReorderAddGame(e, item)}
                                  />
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
              ) : (
                <p className='text-danger text-center mt-7'>{t('casinoGames.reorder.gameNotSelected')}</p>
              )}
            </Card>
          </Col>
        </Row>

      </div>
    </>
  );
};

export default GameReorder;
