import { Row, Form as BForm, Button, Col, Modal, InputGroup } from '@themesberg/react-bootstrap'
import { ErrorMessage, Form, Formik } from 'formik'
import Select from 'react-select'
import React from 'react'
import { limitsSchema, setDisableUserlimitsSchema } from './schema'
import { SESSION_OPTIONS, limitName } from './constants'

const DailyLimit = ({
  t,
  limit,
  show,
  setShow,
  updateLimit,
  currencyCode
}) => {
  const labelArray = limit?.label?.split(' ')

  // this label is used for the validation schema. For example: weekly wager should be greater than daily wager 
  const label = '' + (labelArray?.[0] === 'Weekly' ? 'Daily ' : 'Weekly ') + labelArray?.[1] + ' ' + labelArray?.[2]

  const placeholderFunction = (label) => {
    let placeholderMes = ''
    switch (label) {
      case limitName.take_break:
        placeholderMes = t('playerLimit.daysPlace')
        break;
      case limitName.session_limit:
        placeholderMes = t('playerLimit.hoursPlace')
        break;
      default:
        placeholderMes = t('playerLimit.limitPlace')
    }
    return placeholderMes
  }

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Set {limit?.label}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{ limit: limit?.value || '' }}
          validationSchema={
            (limit?.label === limitName.take_break || limit?.label === limitName.session_limit)
              ? setDisableUserlimitsSchema(t)
              : limitsSchema({ minimum: limit?.minimum, currLabel: limit?.label, label, t })
}
          onSubmit={(formValues) => {
            limit?.label === limitName.session_limit ? updateLimit({ formValues, label: limit?.label }) : updateLimit({ formValues, label: limit?.label, type: limit?.label })
            setShow(false)
          }}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            handleBlur
          }) => (
            <Form className='m-3'>
              <div>
                <Row>
                  <Col className='d-flex justify-content-between align-items-center'>
                    <Col>
                      <BForm.Label>{(limit?.label === limitName.take_break || limit?.label === limitName.session_limit) ? t('playerLimit.timePeriod') : limit?.label}</BForm.Label>
                    </Col>
                    <Col>
                      <Select
                        placeholder='Session Reminder'
                        className='react-select'
                        classNamePrefix='react-select'
                        options={SESSION_OPTIONS}
                      />
                      <ErrorMessage
                        component='div'
                        name='limit'
                        className='text-danger'
                      />
                    </Col>
                    <Col>
                      <InputGroup>
                        {(limit?.label !== limitName.take_break && limit?.label !== limitName.session_limit) && <InputGroup.Text>{currencyCode}</InputGroup.Text>}
                        <BForm.Control
                          type='number'
                          name='limit'
                          placeholder={placeholderFunction(limit?.label)}
                          value={values.limit}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </InputGroup>
                      <ErrorMessage
                        component='div'
                        name='limit'
                        className='text-danger'
                      />

                    </Col>
                  </Col>
                </Row>

              </div>

              <div className='mt-3 d-flex justify-content-between align-items-center'>
                <Button
                  variant='warning'
                  onClick={() => {
                    setShow(false)
                  }}
                  className='ml-2'
                >
                  {t('playerLimit.cancel')}
                </Button>

                <Button
                  variant='success'
                  onClick={() => {
                    handleSubmit()
                  }}
                >
                  {t('playerLimit.set')}
                </Button>

              </div>

            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default DailyLimit
