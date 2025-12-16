import React, { useState } from 'react'
import { Tabs, Tab, Row, Col } from '@themesberg/react-bootstrap'
import ChangePassword from './components/ChangePassword'
import EditProfile from './components/EditProfile'

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState('profile')

    return (
    <>
      <Row>
        <Col className='d-flex'>
          <h3>Profile</h3>
        </Col>
      </Row>
      <Tabs
        activeKey={selectedTab}
        onSelect={(tab) => setSelectedTab(tab)}
        className='nav-light m-auto w-100'
      >
        <Tab eventKey='profile' title="Edit Profile">
          <div style={{margin:"20px"}}><EditProfile /></div>
        </Tab>
        <Tab eventKey='change_password' title="Change Password">
          <ChangePassword />
        </Tab>
      </Tabs>
    </>
  )
}

export default ProfilePage