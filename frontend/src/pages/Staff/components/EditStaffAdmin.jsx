import React from 'react'
import { Card, Row, Col, Button } from '@themesberg/react-bootstrap'
import { Formik } from 'formik'
import { updateStaffSchema } from '../schemas'
import StaffForm from './StaffForm'
import useEditAdmin from '../hooks/useEditAdmin'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { AdminRoutes } from '../../../routes'
import '../staff.scss'

const EditStaffAdmin = () => {
  const {
    adminDetails,
    handleEditSubmit,
    t,
    loading
  } = useEditAdmin()
  
  const navigate = useNavigate()

  return (
    <div className="staff-page dashboard-typography">
      <Row className="d-flex align-items-center mb-3">
        <Col xs="auto">
          <Button
            variant="link"
            className="staff-page__back-btn p-0"
            onClick={() => navigate(AdminRoutes.Staff)}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </Button>
        </Col>
        <Col>
          <h3 className="staff-page__title mb-0">{t('editStaff.title')}</h3>
        </Col>
      </Row>

      <Card className="staff-page__card p-4">
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
