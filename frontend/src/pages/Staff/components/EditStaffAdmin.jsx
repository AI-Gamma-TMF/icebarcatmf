import React from 'react'
import { Card, Row, Col } from '@themesberg/react-bootstrap'
import { Formik } from 'formik'
import { updateStaffSchema } from '../schemas'
import StaffForm from './StaffForm'
import useEditAdmin from '../hooks/useEditAdmin'

const EditStaffAdmin = () => {
  const {
    adminDetails,
    handleEditSubmit,
    t,
    loading
  } = useEditAdmin()

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>{t('editStaff.title')}</h3>
        </Col>
      </Row>

      <Card body>
        {adminDetails && (
          <Formik
            initialValues={{
              email: adminDetails?.email || '',
              password: '',
              adminUsername: adminDetails?.adminUsername || '',
              firstName: adminDetails?.firstName || '',
              lastName: adminDetails?.lastName || '',
              role: adminDetails?.AdminRole?.name || '',
              adminId: adminDetails?.parentId || '',
              permission:
                adminDetails?.userPermission?.permission || null,
              group:
                adminDetails?.group || '',
                scLimit: adminDetails?.scLimit || null,
                gcLimit: adminDetails?.gcLimit || null,
                addCoins:adminDetails?.addCoins|| true,
            }}
            validationSchema={updateStaffSchema(t)}
            onSubmit={(formValues) => handleEditSubmit(formValues)}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              handleBlur,
              setFieldValue,
             
            }) => (
              <StaffForm
                values={values}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                isEdit
                loading={loading}
              />
            )}
          </Formik>
        )}
      </Card>
    </div>
  )
}

export default EditStaffAdmin
