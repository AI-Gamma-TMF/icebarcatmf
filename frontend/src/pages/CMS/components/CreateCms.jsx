import React, {useState} from 'react'
import { Formik, Form, ErrorMessage } from 'formik'
import {
  Col,
  Row,
  Form as BForm,
  Tabs,
  Tab
} from '@themesberg/react-bootstrap'
import { createCmsSchema } from '../schema'
import useCreateCms from '../hooks/useCreateCms'
import EditCMSTemplate from '../../../components/EditCMSTemplate'
// import useCheckPermission from '../../../utils/checkPermission'
// import { useLocation } from 'react-router-dom'

const CreateCms = ({ cmsData, details }) => {
  const {
    navigate,
    createCms,
    editCms,
    cmsPageId,
    setTemplate,
    // showGalleryModal,
    // setShowGalleryModal,
    cmsKeys,
    selectedTab,
    t,loading
  } = useCreateCms(cmsData)
  // const { state } = useLocation();
  // const { isHidden } = useCheckPermission()
  const [title, setTitle] = useState(cmsData ? cmsData?.title : { EN: '' })
  const [content, setContent] = useState(cmsData ? cmsData?.content : { EN: '' })

  // const handleCopy = (values) => {
  //   navigator.clipboard.writeText(values.isHidden.toString())
  //     .then(() => {
  //       console.log('Copied to clipboard', details);
  //     })
  //     .catch(err => {
  //       console.error('Failed to copy: ', err);
  //     });
  // };

  return (
    <>
      <Row className="w-100 m-auto">
        <Col xs={9}>
          <h3>{cmsData ? `${!details ? t('editCmsTitle') : ''} ${t('viewCmsTitle')} ${cmsData?.title?.EN}` : t('createCmsTitle')}</h3>
        </Col>
      </Row>

      <Formik
        initialValues={{
          cmsType: cmsData ? cmsData?.cmsType : 1,
          targetUrl: cmsData?.targetUrl ? cmsData?.targetUrl : '',
          title: title?.EN || '',
          slug: cmsData ? cmsData?.slug : '',
          content: content?.EN || '',
          category: cmsData ? cmsData?.category : 1,
          isActive: cmsData ? (!!cmsData?.isActive) : true,
          language: selectedTab,
          isHidden: cmsData?.isHidden || false,
          link: cmsData?.link || '',
          showTermAndConditions : cmsData?.showTermAndConditions || false,
        }}
        validationSchema={createCmsSchema(t)}
        onSubmit={(formValues) => {
          !cmsData
            ? createCms({ cmsData: { ...formValues, category: formValues.cmsType == '3' ? 4 : +formValues.category, cmsType: +formValues.cmsType, title: title, content: content } })
            : editCms({ cmsData: { ...formValues, category: formValues.cmsType == '3' ? 4 : +formValues.category, cmsType: +formValues.cmsType, title: title, content: content, cmsPageId: parseInt(cmsPageId) } })
        }}
      >
        {({ values, errors, handleChange, handleSubmit, handleBlur, setFieldValue }) => (
          <Form>
            <Row className='mb-3 align-items-center'>
              <Col xs='12' sm='6' lg='3'>
                <BForm.Label>
                {t('inputField.type.label')} <span className='text-danger'>*</span>
                </BForm.Label>
                <BForm.Control
                    type='text'
                    name='cmsType'
                    value={t('inputField.type.options.internal')}
                    disabled="true"
                  />
              </Col>
              {values.cmsType != 3 && <Col xs={12} sm={6} lg={3}>
                <Col xs='12' sm='6' lg='3'>
                  <BForm.Label>
                    {values.cmsType != 2 ? t('inputField.slug.label') : t('inputField.targetUrl.label')} <span className='text-danger'>*</span>
                  </BForm.Label>
                </Col>
                {values.cmsType != 2 ? 
                <Col>
                  <BForm.Control
                    type='text'
                    name='slug'
                    placeholder='Enter Slug'
                    value={values.slug}
                    disabled={details}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    component='div'
                    name='slug'
                    className='text-danger'
                  />
                </Col> : 
                <Col xs='12' sm='6' lg='3'>
                  <BForm.Control
                    type='text'
                    name='targetUrl'
                    placeholder='Enter Target URL'
                    value={values.targetUrl}
                    disabled={details}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    component='div'
                    name='targetUrl'
                    className='text-danger'
                  />
                </Col>}
              </Col>}

              {details && <Col xs='12' sm='6' lg='3'>
                <BForm.Label>
                {t('inputField.cmsLink.label')} 
                </BForm.Label>
                <BForm.Control
                    type='text'
                    name='link'
                    value={values.link}
                    disabled="true"  
                  />
              </Col>}

              <Col>
                <Col>
                  <BForm.Label>
                    {t('inputField.showCmsPopupToUser.label')} <span className='text-danger'>*</span>
                  </BForm.Label>
                </Col>
                <Col>
                  <BForm.Check
                    type='switch'
                    name='showTermAndConditions'
                    disabled={details}
                    defaultChecked={values.showTermAndConditions}
                    value={values.showTermAndConditions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Col>
              </Col>

              <Col>
                <Col>
                  <BForm.Label>
                    {t('inputField.isHidden.label')} <span className='text-danger'>*</span>
                  </BForm.Label>
                </Col>
                <Col>
                  <BForm.Check
                    type='switch'
                    name='isHidden'
                    disabled={details}
                    defaultChecked={values.isHidden}
                    value={values.isHidden}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Col>
              </Col>
              <Col>
                <Col>
                  <BForm.Label>
                    {t('inputField.status.label')} <span className='text-danger'>*</span>
                  </BForm.Label>
                </Col>
                <Col>
                  <BForm.Check
                    type='switch'
                    name='isActive'
                    disabled={details}
                    defaultChecked={values.isActive}
                    value={values.isActive}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Col>

              </Col>

            </Row>
            {/* tabs will be increased in case of multilanguage */}
            <Tabs
              activeKey={selectedTab}
              className='nav-light mt-3'
            >
              <Tab
                eventKey='EN'
                title='EN'
                mountOnEnter
                tabClassName={'tab-active'}
              >
                <div className='mt-5'>
                  <EditCMSTemplate
                    values={cmsData}
                    cmsKeys={cmsKeys}
                    setFieldValue={setFieldValue}
                    selectedTab={selectedTab}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setTemp={setTemplate}
                    handleSubmit={handleSubmit}
                    navigate={navigate}
                    details={details}
                    initValues={values}
                    errors={errors}
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                    loading={loading}
                  />
                </div>
              </Tab>
            </Tabs>

          </Form>
        )}
      </Formik>
    </>
  )
}

export default CreateCms
