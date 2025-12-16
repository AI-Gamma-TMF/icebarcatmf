import React from 'react'
import { faImages } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Row, Tab, Tabs } from '@themesberg/react-bootstrap'
import Trigger from '../../components/OverlayTrigger'
import Preloader from '../../components/Preloader'
import { GalleryModal } from '../../components/ConfirmationModal'
import useEditEmailTemplate from './hooks/useEditEmailTemplate'
import EmailTemplate from '../../components/EmailTemplate'

const EditEmailTemplate = () => {
  const {
    emailTemplate,
    loading,
    updateTemplate,
    dynamicKeys,
    galleryModal,
    setGalleryModal,
    isHidden,
    setIsTestTemplateModalVisible,
    isTestTemplateModalVisible,
    testEmail,
    setTestEmail,
    selectedTab,
    t
  } = useEditEmailTemplate()

  if(loading) return <Preloader />
  else return (
    <>
      <Row className='mb-2'>
        <Col sm={8}>
          <h3>{`${t('editTemplate.title')} ${emailTemplate?.label}`}</h3>
        </Col>
        <Col className='d-flex justify-content-end align-items-center'>
          <Trigger message='Gallery' id='gallery' />
            <Button
              id='gallery'
              hidden={isHidden({ module: { key: 'ImageGallery', value: 'R' } })}
              onClick={() => setGalleryModal(true)}
              variant='secondary'
            >
              <FontAwesomeIcon icon={faImages} />
            </Button>
        </Col>
      </Row>
      <Tabs
        activeKey={selectedTab}
        className='nav-light'
      >
        <Tab eventKey='EN' title='EN' tabClassName={'tab-active'}>
          <div className='mt-5'>
            <EmailTemplate
              dynamicKeys={dynamicKeys}
              isHidden={isHidden}
              setGalleryModal={setGalleryModal}
              emailTemplate={emailTemplate}
              setIsTestTemplateModalVisible={setIsTestTemplateModalVisible}
              isTestTemplateModalVisible={isTestTemplateModalVisible}
              updateTemplate={updateTemplate}
              galleryModal={galleryModal}
              testEmail={testEmail}
              setTestEmail={setTestEmail}
              selectedTab={selectedTab}
            />
          </div>
        </Tab>
      </Tabs>
      {galleryModal &&
      <GalleryModal
        galleryModal={galleryModal}
        setGalleryModal={setGalleryModal}
      />}
    </>
  )
}

export default EditEmailTemplate