import React from 'react'
import { Tabs, Tab, Row, Col } from '@themesberg/react-bootstrap'
import Overview from './components/Overview'
import Permissions from './components/Permissions'
import useAdminDetails from './hooks/useAdminDetails'
import Preloader from '../../components/Preloader'
import Hierarchy from '../../components/Hierarchy'

const AdminDetails = () => {
  const {
    setSelectedTab,
    selectedTab,
    adminDetails,
    loading
    // navigate
  } = useAdminDetails()

  return (
    <>
      {loading && <Preloader />}
      <>
        <Row>
          <Col className='d-flex'>
            <h3>{adminDetails?.AdminRole?.name}:&nbsp; </h3>

            <h3>
              <div
                style={{
                  whitespace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                {adminDetails &&
                  `${adminDetails?.firstName} ${adminDetails?.lastName}`}
              </div>
            </h3>
          </Col>

        </Row>

        <Tabs
          activeKey={selectedTab}
          onSelect={(tab) => setSelectedTab(tab)}
          className='nav-light'
        >
          <Tab eventKey='overview' title='Overview'>
            <div className='mt-5'>
              <Row className='mt-3 '>
                <Overview adminDetails={adminDetails} />
              </Row>
            </div>
          </Tab>

          <Tab eventKey='permissions' title='Permissions'>
            <div className='mt-5'>
              <Row className='mt-3 d-flex text-left'>
                <Permissions adminDetails={adminDetails} />
              </Row>
            </div>
          </Tab>
          {adminDetails?.roleId !== 3 &&
            <Tab eventKey='usersTree' title='Tree'>
              <div className='mt-5'>
                <Row className='mt-3 d-flex flex-row-reverse text-right'>
                  {adminDetails && adminDetails?.adminUserId && (
                    <Hierarchy
                      adminDetails={{
                        name: `${adminDetails?.firstName} ${adminDetails?.lastName}`,
                        id: adminDetails?.adminUserId,
                        children: [],
                        isInitial: true,
                        data: { roleId: adminDetails?.roleId }
                      }}
                    />
                  )}
                </Row>
              </div>
            </Tab>}
        </Tabs>
      </>
    </>
  )
}

export default AdminDetails
