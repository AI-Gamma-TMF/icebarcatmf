import React from 'react'
import {
  Button,
  Card,
  Form as BForm,
  Row,
  Col,
  Badge,
  Spinner,
  InputGroup
} from '@themesberg/react-bootstrap'
import { Form, Field, ErrorMessage } from 'formik'
import Trigger from '../../../components/OverlayTrigger'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import CreatableSelect from 'react-select/creatable'
import { toast } from '../../../components/Toast'
import { AdminRoutes } from '../../../routes'
import useStaffForm from '../hooks/useStaffForm'
import { customLabel, permissionLabel } from '../../../utils/helper'
import '../staff.scss'

const StaffForm = ({
  values,
  handleChange,
  handleSubmit,
  handleBlur,
  setFieldValue,
  loading,
  isEdit = false
}) => {
  const {
    navigate,
    data,
    adminRole,
    adminDetails,
    type,
    setType,
    groupOptions,
    setGroupOptions,
    selectedGroup,
    setSelectedGroup,
    t
  } = useStaffForm({ group: values?.group, role: values.role, adminId: values.adminId })

  const groupChangeHandler = (option) => {
    if (option === null) {
      setSelectedGroup()
      setFieldValue('group', '')
    } else {
      setSelectedGroup({ label: option?.label, value: option?.value })
      setFieldValue('group', option?.value)
    }
  }

  const roleChangeHandler = (e) => {
    handleChange(e)
    if (e.target.value === 'Support') {
      setFieldValue('permission', {})
      setFieldValue('adminId', '')
    }
  }

  const permissionHandler = (e, key) => {
    if (e.target.value === 'R' || e.target.value === 'DR' || values?.permission?.[key]?.includes('R')) {
      if (key === 'VipManagedBy') {
        const hasVipManagementRead =
          values?.permission?.VipManagement &&
          values?.permission?.VipManagement.includes('R');
    
        if (!hasVipManagementRead) {
          toast(
            t('staffFields.permissions.vipManagementReadRequiredErrorToast'),
            'error'
          );
          return;
        }
      }
      if (e.target.value === 'R' && !e.target.checked) {
        delete values.permission[key]
        setFieldValue(
          'permission',
          values.permission
        )
      } else {
        handleChange(e)
      }
    } else {
      toast(
        t('staffFields.permissions.selectReadPermissionErrorToast'),
        'error'
      )
    }
  }

  const sortedPermissions = Object.keys(adminDetails?.userPermission?.permission || {})
    .sort()
    .reduce((acc, key) => {
      acc[key] = adminDetails.userPermission.permission[key].sort();
      return acc;
    }, {});

  return (
    <>
      <Form>
        <Row className='g-3'>
          <Col xs={12} md={6}>
            <BForm.Label className="form-label">{t('staffFields.email.label')}<span className="text-danger"> *</span></BForm.Label>

            <BForm.Control
              className="staff-form__input"
              type='text'
              name='email'
              placeholder={t('staffFields.email.placeholder')}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isEdit}
            />

            <ErrorMessage
              component='div'
              name='email'
              className='text-danger mt-1'
            />
          </Col>

          <Col xs={12} md={6}>
            <BForm.Label className="form-label">{t('staffFields.password.label')}<span className="text-danger"> *</span></BForm.Label>

            <Trigger message='Must be atleast 8 characters long with 1 uppercase and 1 lowercase letters, 1 special character and 1 digit' id={'info'} />
            <InputGroup id={'info'} className="staff-form__input-group d-flex">
              <BForm.Control
                className="staff-form__input flex-grow-1"
                type={type}
                name='password'
                placeholder={t('staffFields.password.placeholder')}
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <InputGroup.Text className='staff-form__input-icon d-flex align-items-center'>
                <FontAwesomeIcon
                  icon={type === 'password' ? faEyeSlash : faEye}
                  onClick={() => {
                    type === 'password' ? setType('text') : setType('password')
                  }}
                />
              </InputGroup.Text>
            </InputGroup>

            <ErrorMessage
              component='div'
              name='password'
              className='text-danger mt-1'
            />
          </Col>
        </Row>

        <Row className='g-3 mt-2'>
          <Col xs={12} md={6}>
            <BForm.Label className="form-label">{t('staffFields.firstName.label')}<span className="text-danger"> *</span></BForm.Label>

            <BForm.Control
              className="staff-form__input"
              type='text'
              name='firstName'
              placeholder={t('staffFields.firstName.placeholder')}
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <ErrorMessage
              component='div'
              name='firstName'
              className='text-danger mt-1'
            />
          </Col>

          <Col xs={12} md={6}>
            <BForm.Label className="form-label">{t('staffFields.lastName.label')}<span className="text-danger"> *</span></BForm.Label>

            <BForm.Control
              className="staff-form__input"
              type='text'
              name='lastName'
              placeholder={t('staffFields.lastName.placeholder')}
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <ErrorMessage
              component='div'
              name='lastName'
              className='text-danger mt-1'
            />
          </Col>
        </Row>

        <Row className='g-3 mt-2'>
          <Col xs={12} md={6}>
            <BForm.Label className="form-label">{t('staffFields.username.label')}<span className="text-danger"> *</span></BForm.Label>

            <BForm.Control
              className="staff-form__input"
              type='text'
              name='adminUsername'
              placeholder={t('staffFields.username.placeholder')}
              value={values.adminUsername}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
            />

            <ErrorMessage
              component='div'
              name='adminUsername'
              className='text-danger mt-1'
            />
          </Col>

          <Col xs={12} md={6}>
            <BForm.Label className="form-label">{t('staffFields.group.label')}<span className="text-danger"> *</span></BForm.Label>

            <CreatableSelect
              isClearable
              name='group'
              onCreateOption={(option) => {
                groupOptions?.length > 0
                  ? setGroupOptions([
                    ...groupOptions,
                    { label: option, value: option }
                  ])
                  : setGroupOptions([
                    { label: option, value: option }
                  ])
                setSelectedGroup({ label: option, value: option })
                setFieldValue('group', option)
              }}
              options={groupOptions}
              value={selectedGroup}
              classNamePrefix='staff-select'
              className="staff-form__select"
              // Prevent menu being clipped inside glass cards / responsive containers
              menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
              menuPosition="fixed"
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 99999 })
              }}
              onChange={(option) => groupChangeHandler(option)}
            />

            <ErrorMessage
              component='div'
              name='group'
              className='text-danger mt-1'
            />
          </Col>

          <Col xs={12} md={12} lg={6} className='mt-2'>
            <BForm.Label className="form-label d-flex align-items-center">
              {t('staffFields.addCoins.label')}
              <BForm.Check
                type='switch'
                name='addCoins'
                checked={values.addCoins}
                onChange={handleChange}
                onBlur={handleBlur}
                className="ms-3"
              />
            </BForm.Label>

            <ErrorMessage
              component='div'
              name='addCoins'
              className='text-danger mt-1'
            />
          </Col>

        </Row>

        {values.addCoins && (
          <Row className='g-3 mt-2'>
            <Col xs={12} md={6}>
              <BForm.Label className="form-label">
                {t('staffFields.gcLimit.label')}
              </BForm.Label>

              <BForm.Control
                className="staff-form__input"
                type='number'
                name='gcLimit'
                min='1'
                onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                placeholder={t('staffFields.gcLimit.placeholder')}
                value={values.gcLimit}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <ErrorMessage
                component='div'
                name='gcLimit'
                className='text-danger mt-1'
              />
            </Col>

            <Col xs={12} md={6}>
              <BForm.Label className="form-label">
                {t('staffFields.scLimit.label')}
              </BForm.Label>

              <BForm.Control
                className="staff-form__input"
                type='number'
                name='scLimit'
                min='1'
                onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                placeholder={t('staffFields.scLimit.placeholder')}
                value={values.scLimit}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <ErrorMessage
                component='div'
                name='scLimit'
                className='text-danger mt-1'
              />
            </Col>
          </Row>
        )}

        <Row className='g-3 mt-2'>
          <Col xs={12} md={6}>
            <BForm.Label className="form-label">{t('staffFields.role.label')}<span className="text-danger"> *</span></BForm.Label>

            <BForm.Select
              className="staff-form__select"
              name='role'
              value={values.role || ''}
              disabled={isEdit}
              onChange={(e) => roleChangeHandler(e)}
              onBlur={handleBlur}
            >
              <option value='' disabled key=''>
                {t('staffFields.role.selectRole')}
              </option>
              {adminRole?.map((roles, index) => {
                return (
                  roles.name !== 'Admin' &&
                  <option key={index} value={roles && roles.name}>
                    {roles && roles.name}
                  </option>
                )
              })}
            </BForm.Select>

            <ErrorMessage component='div' name='role' className='text-danger mt-1' />
          </Col>

          {values.role === 'Support' && (
            <Col xs={12} md={6}>
              <BForm.Label className="form-label">{t('staffFields.manager.label')}</BForm.Label>

              <BForm.Select
                className="staff-form__select"
                name='adminId'
                value={values.adminId || ''}
                disabled={isEdit}
                onChange={(e) => { handleChange(e) }}
                onBlur={handleBlur}
              >
                <option value='' disabled>
                  {t('staffFields.manager.selectManager')}
                </option>
                {data &&
                  data?.rows?.map((admin, index) => {
                    return (
                      <option
                        key={index}
                        value={admin && admin.adminUserId}
                      >
                        {admin && `${admin?.firstName} ${admin?.lastName}`}
                      </option>
                    )
                  })}
              </BForm.Select>

              <ErrorMessage
                component='div'
                name='adminId'
                className='text-danger mt-1'
              />
            </Col>
          )}
        </Row>

        {(['Manager'].includes(values?.role) ||
          values.adminId) && (
            <Card className='mt-4 staff-form__permissions-card'>
              <Card.Header className="staff-form__permissions-header">
                {t('staffFields.permissions.label')}
              </Card.Header>
              {!loading && adminDetails?.userPermission && (
                <Card.Body className='px-2 px-md-4 py-3'>
                  {Object.keys(
                    adminDetails?.userPermission?.permission
                  ).map((key, index) => {
                    return (
                      ((values.role === 'Support' && key === 'Admins')
                        ? null
                        : (
                          <Row key={index} className='permission-row g-2 align-items-center py-2'>
                            <Col xs={12} md={4} lg={3}>
                              <BForm.Label className="form-label fw-bold mb-0">{key}</BForm.Label>
                            </Col>

                            <Col xs={12} md={8} lg={9} className='d-flex flex-wrap gap-2'>
                              {sortedPermissions[
                                key
                              ].map((value, index) => {
                                return (
                                  <label key={index} className="mb-0">
                                    {sortedPermissions[
                                      key
                                    ].includes('R')
                                      ? (
                                        <Field
                                          className='d-none'
                                          type='checkbox'
                                          name={`permission[${key}]`}
                                          value={value}
                                          onChange={(e) => permissionHandler(e, key)}
                                        />
                                      )
                                      : (
                                        <Field
                                          className='d-none'
                                          type='checkbox'
                                          name={`permission[${key}]`}
                                          value={value}
                                          onChange={handleChange}
                                        />
                                      )}

                                    <Badge
                                      className='staff-form__permission-badge'
                                      type='button'
                                      bg={
                                        values?.permission?.[key]?.includes(value)
                                          ? 'success'
                                          : 'secondary'
                                      }
                                    >
                                      {key === 'Alert' ? customLabel(value, t) : permissionLabel(value, t)}
                                    </Badge>
                                  </label>
                                )
                              })}
                            </Col>
                          </Row>)
                      ))
                  })}

                </Card.Body>
              )}
            </Card>
          )}

        <div className='mt-4 d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-3'>
          <Button
            variant='warning'
            className="staff-form__button staff-form__button--cancel"
            onClick={() => navigate(AdminRoutes.Staff)}
          >
            {t('staffFields.cancelButton')}
          </Button>

          <Button
            variant='success'
            className="staff-form__button staff-form__button--submit"
            onClick={() => {
              handleSubmit()
            }}
            disabled={loading}
          >
            {t('staffFields.submitButton')}
            {loading && (
              <Spinner
                as='span'
                animation='border'
                size="sm"
                role='status'
                aria-hidden='true'
                className="ms-2"
              />
            )}
          </Button>

        </div>
      </Form>
    </>
  )
}

export default StaffForm
