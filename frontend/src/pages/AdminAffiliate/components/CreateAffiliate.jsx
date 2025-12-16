import React from 'react'
import { Row, Col } from '@themesberg/react-bootstrap'
import { Formik } from 'formik'
import { createAffiliateSchema } from '../schemas'
import Affiliate from './Affiliate'
import useCreateAffiliate from '../hooks/useCreateAffiliate'

const CreateAffiliate = () => {

 const{ handleCreateAffiliate,isFormSubmitting }=useCreateAffiliate();

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Create Affiliate</h3>
        </Col>
      </Row>

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
        )}
      </Formik>
    </div>
  )
}

export default CreateAffiliate
