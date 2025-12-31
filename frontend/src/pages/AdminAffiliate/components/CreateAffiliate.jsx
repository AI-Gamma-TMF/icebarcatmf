import React from 'react'
import { Row, Col, Card } from '@themesberg/react-bootstrap'
import { Formik } from 'formik'
import { createAffiliateSchema } from '../schemas'
import Affiliate from './Affiliate'
import useCreateAffiliate from '../hooks/useCreateAffiliate'
import './createAffiliate.scss'

const CreateAffiliate = () => {

 const{ handleCreateAffiliate,isFormSubmitting }=useCreateAffiliate();

  return (
    <div className='dashboard-typography create-affiliate-page'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div>
          <h3 className='create-affiliate-page__title'>Create Affiliate</h3>
          <p className='create-affiliate-page__subtitle'>
            Capture affiliate details and submit for approval
          </p>
        </div>
      </div>

      <Formik
        initialValues={{
          firstName: '', // Initial value for first name
          lastName: '', // Initial value for last name
          email: '', // Initial value for email
          phone: '',
          phoneCode: '+1', // Initial value for phone
          state: null, // Initial value for state
          preferredContact: '', // Initial value for traffic source description
          trafficSource: '', // Initial value for attracting people details
          plan: '',
          isTermsAccepted: true
        }}
        validationSchema={createAffiliateSchema()}
        onSubmit={(formValues) => handleCreateAffiliate(formValues)}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
          errors
        }) => (
          <Card className='dashboard-filters create-affiliate-page__card'>
            <Card.Body>
              <Affiliate
                values={values}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                loading={false}
                errors={errors}
                isFormSubmitting={isFormSubmitting}
              />
            </Card.Body>
          </Card>
        )}
      </Formik>
    </div>
  )
}

export default CreateAffiliate
