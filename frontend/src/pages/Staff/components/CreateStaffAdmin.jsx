import React from 'react'
import { Row, Col, Card, Button } from '@themesberg/react-bootstrap'
import { Formik } from 'formik'
import { createAdminSchema } from '../schemas'
import { useNavigate } from 'react-router-dom'
import { Buffer } from 'buffer'
import { toast } from '../../../components/Toast'
import StaffForm from './StaffForm'
import { useCreateStaffAdminMutation } from '../../../reactQuery/hooks/customMutationHook'
import { AdminRoutes } from '../../../routes'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import '../staff.scss'

const CreateStaffAdmin = () => {
  const navigate = useNavigate()
  const { t } = useTranslation(['staff'])

  const { mutate: createStaffAdmin, isLoading: loading } = useCreateStaffAdminMutation({onSuccess: () => {
    toast(t('createStaff.createdSuccessToast'), 'success')
    navigate(AdminRoutes.Staff)
  }})

  const handleCreateSubmit = (formValues) => {
    if(formValues.role === 'Manager') delete formValues.adminId;
    else {
      formValues.adminId = Number(formValues?.adminId)
    }

    const preparedValues = {
      ...formValues,
      gcLimit: formValues.gcLimit === '' ? null : formValues.gcLimit,
      scLimit: formValues.scLimit === '' ? null : formValues.scLimit,
    };

    ([undefined, null].includes(preparedValues.permission) || Object.keys(preparedValues.permission).length < 1)
      ? toast(t('createStaff.selectPermissionErrorToast'), 'error')
      : createStaffAdmin({ ...preparedValues, password: Buffer.from(preparedValues.password).toString('base64') });
  }

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
          <h3 className="staff-page__title mb-0">{t('createStaff.title')}</h3>
        </Col>
      </Row>

      <Card className="staff-page__card p-4">
        <Formik
          initialValues={{
            email: '',
            password: '',
            adminUsername: '',
            firstName: '',
            lastName: '',
            role: null,
            permission: {},
            group: '',
            scLimit: null,
            gcLimit: null,
            addCoins:false,
          }}
          validationSchema={createAdminSchema(t)}
          onSubmit={(formValues) => handleCreateSubmit(formValues)}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            handleBlur,
            setFieldValue
          }) => (
            <StaffForm
              values={values}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              loading={loading}
            />
          )}
        </Formik>
      </Card>
    </div>
  )
}

export default CreateStaffAdmin
