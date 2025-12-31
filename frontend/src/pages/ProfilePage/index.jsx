import React from 'react'
import { Tabs, Tab, Row, Col, Card } from '@themesberg/react-bootstrap'
import useProfilePage from './useProfilePage'
import { profileConstants } from './constants'
import Overview from './components/Overview'
import Permission from './components/Permission'
import SiteConfiguration from './components/SiteConfiguration'
import Hierarchy from '../../components/Hierarchy'
import QRBlock from './components/QRBlock'
import './profile.scss'

const ProfilePage = () => {
  const {
    details,
    selectedTab,
    setSelectedTab,
    editable,
    setEditable,
    updateData,
    loading,
    siteConfigLoading,
    type,
    setType,
    adminDetails,
    setUserDetails,
    siteConfigEditable,
    setSiteConfigEditable,
    updateSiteConfig,
    preview,
    handleImagePreview,
    t,
    qrcodeUrlInfo,
    toggleForQRModal,
    openQRModalToggle,
    isGetOtpLoading,
    disable2FA
  } = useProfilePage()

  const constant = profileConstants
  return (
    <div className='profile-page dashboard-typography'>
      <Card className='p-2 mb-2 profile-page__card'>
        <Row className='d-flex align-items-center mb-2'>
          <Col className='d-flex align-items-center'>
            <h3 className='profile-page__title'>{t('title')}</h3>
          </Col>
        </Row>

        <Tabs
          activeKey={selectedTab}
          onSelect={(tab) => setSelectedTab(tab)}
          className='profile-tabs'
        >
          <Tab eventKey='overview' title={t('overview')}>
            <div className='profile-tab-panel'>
              {selectedTab === 'overview' && (
                <Overview
                  details={details}
                  adminDetails={adminDetails}
                  setEditable={setEditable}
                  editable={editable}
                  updateData={updateData}
                  constant={constant}
                  type={type}
                  setType={setType}
                  loading={loading}
                  disable2FA={disable2FA}
                  openQRModalToggle={openQRModalToggle}
                  isGetOtpLoading={isGetOtpLoading}
                />
              )}
              <QRBlock
                qrcodeUrlInfo={qrcodeUrlInfo}
                toggleForQRModal={toggleForQRModal}
                from2FAQr={true}
                setUserDetails={setUserDetails}
                adminDetails={adminDetails}
              />
            </div>
          </Tab>

          {adminDetails?.roleId === 1 && (
            <Tab eventKey='siteConfiguration' title={t('siteConf')}>
              <div className='profile-tab-panel'>
                {selectedTab === 'siteConfiguration' && (
                  <SiteConfiguration
                    details={details}
                    setEditable={setSiteConfigEditable}
                    editable={siteConfigEditable}
                    updateData={updateSiteConfig}
                    loading={siteConfigLoading}
                    preview={preview}
                    handleImagePreview={handleImagePreview}
                  />
                )}
              </div>
            </Tab>
          )}

          <Tab eventKey='permissions' title={t('permissionsTitle')}>
            <div className='profile-tab-panel'>
              {selectedTab === 'permissions' && <Permission details={details} t={t} />}
            </div>
          </Tab>
          {adminDetails?.roleId !== 3 &&
            adminDetails?.userPermission?.permission?.Admins != undefined && (
              <Tab eventKey='usersTree' title={t('tree')}>
                <div className='profile-tab-panel profile-tab-panel--tree'>
                  <Row className='mt-3 d-flex flex-row-reverse text-right'>
                    {details && details?.adminUserId && selectedTab === 'usersTree' && (
                      <Hierarchy
                        adminDetails={{
                          name: `${details?.firstName} ${details?.lastName}`,
                          id: details?.adminUserId,
                          children: [],
                          isInitial: true,
                          data: { roleId: details?.roleId }
                        }}
                      />
                    )}
                  </Row>
                </div>
              </Tab>
            )}
        </Tabs>
      </Card>
    </div>
  )
}

export default ProfilePage