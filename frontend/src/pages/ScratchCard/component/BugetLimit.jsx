import { Row, Form as BForm, Button, Col, Modal, InputGroup } from '@themesberg/react-bootstrap';
import { ErrorMessage, Form, Formik } from 'formik';
import Select from 'react-select';
import React, { useRef } from 'react';
import { faEdit, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LimitContainer } from '../../../components/ResponsibleGaming/style.js';
import * as Yup from 'yup';
import { limitName, SESSION_OPTIONS } from '../../../components/ResponsibleGaming/constants';
import { ScratchCardConfirmationModal } from '../../../components/ConfirmationModal/index.jsx';
import { useState } from 'react';

const BugetLimit = ({ t, limit, show, setShow, updateLimit, resetLimit, scratchCardListData }) => {
  const [consumedAmount, setConsumedAmount] = useState(false);
  const [status, setStatus] = useState()
  const [confirmationData, setConfirmationData] = useState({})
  const [updateData, setUpdateData] = useState({})
  const [statusShow, setStatusShow] = useState(false)
  const labelArray = limit?.label?.split(' ');
  const actionRef = useRef('update');
  // this label is used for the validation schema. For example: weekly wager should be greater than daily wager
  const label = '' + (labelArray?.[0] === 'Weekly' ? 'Daily ' : 'Weekly ') + labelArray?.[1] + ' ' + labelArray?.[2];

  const placeholderFunction = (label) => {
    let placeholderMes = '';
    switch (label) {
      case limitName.take_break:
        placeholderMes = t('playerLimit.daysPlace');
        break;
      case limitName.session_limit:
        placeholderMes = t('playerLimit.hoursPlace');
        break;
      default:
        placeholderMes = t('playerLimit.limitPlace');
    }
    return placeholderMes;
  };

  const validationSchema = Yup.object().shape({
    limit: Yup.number()
      .required('Please enter a number')
      .positive('Please enter a positive number')
      .moreThan(0, 'Number must be greater than 0'),
  });
  const handleSubmitValidation = (formValues) => {
    if (limit?.label === limitName.daily_budget_limit &&
      formValues.limit < scratchCardListData?.data[0]?.dailyConsumedAmount ||
      limit?.label === limitName.weekly_budget_limit &&
      formValues.limit < scratchCardListData?.data[0]?.weeklyConsumedAmount ||
      limit?.label === limitName.monthly_budget_limit &&
      formValues.limit < scratchCardListData?.data[0]?.monthlyConsumedAmount) {
      setConsumedAmount(true);
      setStatusShow(true)
      setStatus(true)
      setConfirmationData({lable: limit?.label, limit:formValues.limit,
        dailyConsumedAmount:scratchCardListData?.data[0]?.dailyConsumedAmount,
          weeklyConsumedAmount:scratchCardListData?.data[0]?.weeklyConsumedAmount,
          monthlyConsumedAmount:scratchCardListData?.data[0]?.monthlyConsumedAmount,
       })
      setUpdateData({ formValues, label: limit?.label, type: limit?.label, keyType: actionRef.current })
    } else {
      updateLimit({ formValues, label: limit?.label, type: limit?.label, keyType: actionRef.current });
      setShow(false);
    }

  };
  const handleYes = () => {
    updateLimit(updateData);
    setConsumedAmount(false);
    setStatusShow(false)
    setStatus(false)
    setShow(false);
  }
  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set {limit?.label}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={{ limit: limit?.value || '' }}
            validationSchema={validationSchema}
            onSubmit={(formValues) => {
              handleSubmitValidation(formValues)

            }}
            onReset={(formValues) => {
              resetLimit({ formValues, label: limit?.label, type: limit?.label, });
              setShow(false);
            }}
          >
            {({ values, handleChange, handleSubmit, handleBlur, setFieldValue, handleReset }) => (
              <Form className='m-3'>
                <LimitContainer>
                  <div>
                    <Row>
                      <Col className='d-flex justify-content-between align-items-center flex-wrap'>
                        <Col className='col-12 col-sm-6'>
                          <BForm.Label>
                            {limit?.label}
                          </BForm.Label>
                        </Col>
                        {(limit?.label === limitName.daily_budget_limit ||
                          limit?.label === limitName.weekly_budget_limit ||
                          limit?.label === limitName.monthly_budget_limit) && (
                          <Col className='col-12 col-sm-6'>
                            <InputGroup>
                              <InputGroup.Text>Amount</InputGroup.Text>
                              <BForm.Control
                                type='number'
                                name='limit'
                                min='1'
                                placeholder={placeholderFunction(limit?.label)}
                                onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                                value={values.limit}
                                onChange={(e) => {
                                  // Only allow max 10 digits
                                  if (e.target.value.length <= 10) {
                                    handleChange(e);
                                  }
                                }}
                                onBlur={handleBlur}
                              />
                            </InputGroup>
                            <ErrorMessage component='div' name='limit' className='text-danger' />
                          </Col>
                          )}

                      </Col>
                    </Row>
                  </div>

                  <div className='mt-3 d-flex justify-content-between align-items-center'>
                    <Button
                      variant='warning'
                      onClick={() => {
                        setShow(false);
                      }}
                      className='ml-2'
                    >
                      {t('playerLimit.cancel')}
                    </Button>

                    {limit?.value ? (
                      <>
                        <Button variant='secondary'
                          onClick={() => {
                            actionRef.current = 'update';
                            handleSubmit();
                          }}>
                          Update
                        </Button>
                        <Button variant='secondary' onClick={handleReset}>
                          Reset
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant='success'
                        onClick={() => {
                          actionRef.current = 'set';
                          handleSubmit();
                        }}
                      >
                        {t('playerLimit.set')}
                      </Button>
                    )}
                  </div>
                </LimitContainer>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
      {consumedAmount &&
        <ScratchCardConfirmationModal
          setShow={setStatusShow}
          show={statusShow}
          handleYes={handleYes}
          active={status}
          confirmationData={confirmationData}
        />}
    </>
  );
};

export default BugetLimit;
