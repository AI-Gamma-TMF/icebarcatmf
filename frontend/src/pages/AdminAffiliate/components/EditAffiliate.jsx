import React from 'react'
import { Card, Row, Col } from '@themesberg/react-bootstrap'
import { Formik } from 'formik'
import { updateStaffSchema } from '../schemas'
import Affiliate from './Affiliate'
import { useLocation  } from 'react-router-dom'
import useEditAffiliate from '../hooks/useEditAffiliate'

const EditAffiliate = () => {
  const location = useLocation();
  const { state } = location;
  const countryCode = state.phoneCode.substring(1);
   const { isFormSubmitting, handleAffiliateProfileUpdate }=useEditAffiliate();

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Update Affiliate</h3>
        </Col>
      </Row>

      <Card body>
        {state && (
          <Formik
            initialValues={{
              firstName:state.firstName, // Initial value for first name
              lastName:state.lastName, // Initial value for last name
              email: state.email, // Initial value for email
              phone: countryCode + state.phone,
              phoneCode: countryCode, // Initial value for phone
              state: state.state, // Initial value for state
              preferredContact: state.preferredContact, // Initial value for traffic source description
              trafficSource: state.trafficSource, // Initial value for attracting people details
              plan: state.plan,
              isTermsAccepted: state.isTermsAccepted
            }}
            validationSchema={updateStaffSchema()}
            onSubmit={(formValues) => handleAffiliateProfileUpdate(formValues)}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              handleBlur,
              setFieldValue
            }) => (
              <Affiliate
                values={values}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                isFormSubmitting={isFormSubmitting}
                isEdit={true}
              />
            )}
          </Formik>
        )}
      </Card>
    </div>
  )
}

export default EditAffiliate
