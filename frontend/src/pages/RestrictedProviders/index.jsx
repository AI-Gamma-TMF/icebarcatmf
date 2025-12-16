import React from 'react'
import { Tabs, Tab, Row, Col } from '@themesberg/react-bootstrap'

import useRestrictedProviders from './useRestrictedProviders'
import Preloader from '../../components/Preloader'
import ProvidersList from './components/ProvidersList'
import AddRestrictedProviders from './components/AddRestrictedProviders'
import RemoveRestrictedProviders from './components/RemoveRestrictedProviders'
import useCheckPermission from '../../utils/checkPermission'
import { Link } from 'react-router-dom'
import { AdminRoutes } from '../../routes'

const RestrictedProviders = () => {
  const {
    t,
    loading,
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
    addProvider,
    selectedProviders,
    removeProvider,
    addRestrictedProvider,
    removeRestrictedProvider,
    addDeleteProvider,
    removeDeleteProvider,
    removedProviders
  } = useRestrictedProviders()
  const { isHidden } = useCheckPermission()

  return (
    <>
      {loading
        ? (
          <Preloader />
          )
        : (
          <div>
            <Row className="mb-2">
              <Col className='d-flex'>
                <h3 style={{ fontSize: '1rem' }}><Link style={{textDecoration: 'underline'}} to={AdminRoutes.Countries}>{t('title')}</Link> {' >> '}{t('viewProviderTitle')}</h3>
              </Col>
            </Row>
            <Row>
              <Col sm={8}>
                <h3>{t('viewProviderTitle')}</h3>
              </Col>
            </Row>
            <Tabs
              activeKey={selectedTab}
              onSelect={(tab) => setSelectedTab(tab)}
              className='nav-light'
            >
              <Tab eventKey='restricted-providers' title={t('restrictedProvider.restrictedProviders')}>
                <div className='mt-5'>
                  <Row className='mt-3 d-flex'>
                    <ProvidersList
                      limit={restrictedItemsLimit}
                      setLimit={setRestrictedItemsLimit}
                      page={restrictedItemsPage}
                      setPage={setRestrictedItemsPage}
                      provider={restrictedItems?.providers}
                      totalPages={restrictedItemsTotalPages}
                    />
                  </Row>
                </div>
              </Tab>

              <Tab eventKey='add-providers' title={t('restrictedProvider.addProviders')}>
                <div className='mt-5'>
                  <Row className='mt-3 d-flex'>
                    <AddRestrictedProviders
                      t={t}
                      limit={unRestrictedItemsLimit}
                      setLimit={setUnRestrictedItemsLimit}
                      page={unRestrictedItemsPage}
                      setPage={setUnRestrictedItemsPage}
                      unRestrictedItems={unRestrictedItems?.providers}
                      totalPages={unRestrictedItemsTotalPages}
                      addProvider={addProvider}
                      selectedProviders={selectedProviders}
                      removeProvider={removeProvider}
                      addRestrictedProvider={addRestrictedProvider}
                    />
                  </Row>
                </div>
              </Tab>

              {!isHidden({ module: { key: 'RestrictedCountry', value: 'U' } }) &&
                <Tab
                  eventKey='remove-providers'
                  title={t('restrictedProvider.removeProviders')}
                >
                  <div className='mt-5'>
                    <Row className='mt-3 d-flex'>
                      <RemoveRestrictedProviders
                        t={t}
                        limit={restrictedItemsLimit}
                        setLimit={setRestrictedItemsLimit}
                        page={restrictedItemsPage}
                        setPage={setRestrictedItemsPage}
                        restrictedItems={restrictedItems?.providers}
                        totalPages={restrictedItemsTotalPages}
                        addDeleteProvider={addDeleteProvider}
                        removedProviders={removedProviders}
                        removeDeleteProvider={removeDeleteProvider}
                        removeRestrictedProvider={removeRestrictedProvider}
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

export default RestrictedProviders
