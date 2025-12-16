import React from 'react'
import { Tabs, Tab, Row, Col } from '@themesberg/react-bootstrap'

import useRestrictedGames from './useRestrictedGames'
import Preloader from '../../components/Preloader'
import GamesList from './components/GamesList'
import AddRestrictedGames from './components/AddRestrictedGames'
import RemoveRestrictedGames from './components/RemoveRestrictedGames'
import useCheckPermission from '../../utils/checkPermission'
import { Link } from 'react-router-dom'
import { AdminRoutes } from '../../routes'

const RestrictedGames = () => {
  const {
    t,
    loading,
    updateRestrictedItemLoading,
    deleteRestrictedGameLoading,
    restrictedItemsLimit,
    setRestrictedItemsLimit,
    restrictedItemsPage,
    setRestrictedItemsPage,
    unRestrictedItemsLimit,
    setUnRestrictedItemsLimit,
    setUnRestrictedItemsPage,
    unRestrictedItemsPage,
    restrictedItemsTotalPages,
    unRestrictedItemsTotalPages,
    restrictedItems,
    selectedTab,
    setSelectedTab,
    unRestrictedItems,
    addGame,
    selectedGames,
    removeGame,
    addRestrictedGames,
    addDeleteGame,
    removeDeleteGame,
    removeRestrictedGame,
    removedGames
  } = useRestrictedGames()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {loading
        ? (
          <Preloader />
          )
        : (
          <div >
            <Row className="mb-2">
              <Col className='d-flex'>
                <h3 style={{ fontSize: '1rem' }}><Link style={{textDecoration: 'underline'}} to={AdminRoutes.Countries}>{t('title')}</Link> {' >> '}{t('viewTitle')}</h3>
              </Col>
            </Row>
            <Row>
              <Col sm={8}>
                <h3>{t('viewTitle')}</h3>
              </Col>
            </Row>
            <Tabs
              activeKey={selectedTab}
              onSelect={(tab) => setSelectedTab(tab)}
              className='nav-light'
            >
              <Tab eventKey='restricted-games' title={t('restrictedGame.restrictedGames')}>
                <div className='mt-5'>
                  <Row className='mt-3 d-flex'>
                    <GamesList
                      limit={restrictedItemsLimit}
                      setLimit={setRestrictedItemsLimit}
                      page={restrictedItemsPage}
                      setPage={setRestrictedItemsPage}
                      games={restrictedItems?.games}
                      totalPages={restrictedItemsTotalPages}
                    />
                  </Row>
                </div>
              </Tab>

              <Tab eventKey='add-games' title={t('restrictedGame.addGames')}>
                <div className='mt-5'>
                  <Row className='mt-3 d-flex'>
                    <AddRestrictedGames
                      limit={unRestrictedItemsLimit}
                      setLimit={setUnRestrictedItemsLimit}
                      page={unRestrictedItemsPage}
                      setPage={setUnRestrictedItemsPage}
                      unRestrictedItems={unRestrictedItems?.games}
                      totalPages={unRestrictedItemsTotalPages}
                      addGame={addGame}
                      selectedGames={selectedGames}
                      removeGame={removeGame}
                      addRestrictedGames={addRestrictedGames}
                      loading={updateRestrictedItemLoading}
                    />
                  </Row>
                </div>
              </Tab>

              {!isHidden({ module: { key: 'RestrictedCountry', value: 'U' } }) &&
                <Tab eventKey='remove-games' title={t('restrictedGame.removeGames')}>
                  <div className='mt-5'>
                    <Row className='mt-3 d-flex'>
                      <RemoveRestrictedGames
                        loading={deleteRestrictedGameLoading}
                        limit={restrictedItemsLimit}
                        setLimit={setRestrictedItemsLimit}
                        page={restrictedItemsPage}
                        setPage={setRestrictedItemsPage}
                        restrictedItems={restrictedItems?.games}
                        totalPages={restrictedItemsTotalPages}
                        addDeleteGame={addDeleteGame}
                        removedGames={removedGames}
                        removeDeleteGame={removeDeleteGame}
                        removeRestrictedGame={removeRestrictedGame}
                      />
                    </Row>
                  </div>
                </Tab>}
            </Tabs>
          </div>
          )}
    </>
  )
}

export default RestrictedGames
