import { Row, Form as BForm, Button, Col, Modal, InputGroup } from '@themesberg/react-bootstrap';
import { ErrorMessage, Form, Formik } from 'formik';
import Select from 'react-select';
import React from 'react';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SESSION_OPTIONS, limitName } from './constants';
import { LimitContainer } from './style';
import * as Yup from 'yup';
const Limit = ({ t, limit, show, setShow, updateLimit, currencyCode, resetLimit }) => {
  const labelArray = limit?.label?.split(' ');

  // this label is used for the validation schema. For example: weekly wager should be greater than daily wager
  const _label = '' + (labelArray?.[0] === 'Weekly' ? 'Daily ' : 'Weekly ') + labelArray?.[1] + ' ' + labelArray?.[2];

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

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Set {limit?.label}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Formik
          initialValues={{ limit: limit?.value || '', reason: '', isFavorite: false }}
          validationSchema={!limit?.label === limitName.self_exclusion ? validationSchema : null}
          onSubmit={(formValues) => {
            limit?.label === limitName.session_limit
              ? updateLimit({ formValues, label: limit?.label })
              : updateLimit({ formValues, label: limit?.label, type: limit?.label });
            setShow(false);
          }}
          onReset={(formValues) => {
            resetLimit({ formValues, label: limit?.label, type: limit?.label });
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
                          {limit?.label === limitName.take_break || limit?.label === limitName.session_limit
                            ? t('playerLimit.timePeriod')
                            : limit?.label}
                        </BForm.Label>
                      </Col>
                      {limit?.label === limitName.session_limit && (
                        <Col className='col-12 col-sm-6'>
                          <InputGroup>
                            <Select
                              defaultValue={SESSION_OPTIONS.find((item) => item.value === Number(values.limit))}
                              placeholder='Session Reminder'
                              className='react-select'
                              classNamePrefix='react-select'
                              options={SESSION_OPTIONS}
                              onChange={(e) => {
                                setFieldValue('limit', e.value);
                              }}
                            />
                          </InputGroup>
                          <ErrorMessage component='div' name='limit' className='text-danger' />
                        </Col>
                      )}
                      {(limit?.label === limitName.daily_purchase_limit ||
                        limit?.label === limitName.weekly_purchase_limit ||
                        limit?.label === limitName.monthly_purchase_limit) && (
                        <Col className='col-12 col-sm-6'>
                          <InputGroup>
                            <InputGroup.Text>{currencyCode}</InputGroup.Text>
                            <BForm.Control
                              type='number'
                              name='limit'
                              min='1'
                              placeholder={placeholderFunction(limit?.label)}
                              onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                              value={values.limit}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </InputGroup>
                          <ErrorMessage component='div' name='limit' className='text-danger' />
                        </Col>
                      )}
                      {(limit?.label === limitName.daily_bet_limit ||
                        limit?.label === limitName.weekly_bet_limit ||
                        limit?.label === limitName.monthly_bet_limit) && (
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
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </InputGroup>
                          <ErrorMessage component='div' name='limit' className='text-danger' />
                        </Col>
                      )}
                      {limit?.label === limitName.take_break && (
                        <Col className='col-12 col-sm-6'>
                          <InputGroup>
                            <InputGroup.Text>Break Time </InputGroup.Text>
                            <BForm.Control
                              type='number'
                              name='limit'
                              min='1'
                              placeholder={placeholderFunction(limit?.label)}
                              onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
                              value={values.limit}
                              onChange={(e) => {
                                if (e.target.value.length > 3) e.preventDefault();
                                else handleChange(e);
                              }}
                              onBlur={handleBlur}
                            />
                            {/* <Select
                              defaultValue={SWEEP_BREAK.find((item) => Number(item.value) === Number(values.limit))}
                              placeholder='Take a Break'
                              className='react-select'
                              classNamePrefix='react-select'
                              options={SWEEP_BREAK}
                              onChange={(e) => {
                                setFieldValue('limit', e.value);
                              }}
                            /> */}
                          </InputGroup>
                          <ErrorMessage component='div' name='limit' className='text-danger' />
                        </Col>
                      )}
                      {limit?.label === limitName.self_exclusion && (
                        <Col className='col-12 col-sm-6'>
                          <InputGroup>
                            Do you want to {limit?.selfExclusion ? 'remove from exclusion' : 'exlude this player'} ?
                          </InputGroup>
                        </Col>
                      )}
                    </Col>
                  </Row>
                  <Row className='my-4'>
                    <Col className='d-flex justify-content-between align-items-center flex-wrap'>
                      <Col className='col-12 col-sm-6'>
                        <BForm.Label>Favourite</BForm.Label>
                      </Col>
                      <Col className='col-12 col-sm-6'>
                        {/* <FontAwesomeIcon icon={faEdit}  style={{color: "#d1b81a",}} />
                        <FontAwesomeIcon icon={faStar}  style={{color: "#d1b81a",}} /> */}
                        <InputGroup className='limit-star'>
                          <FontAwesomeIcon
                            icon={faStar}
                            size='2x'
                            style={{ color: values.isFavorite ? '#ffdd77' : '' }}
                            onClick={() => setFieldValue('isFavorite', !values.isFavorite)}
                          />
                        </InputGroup>
                      </Col>
                    </Col>
                  </Row>
                  <Row className='my-4'>
                    <Col className='d-flex justify-content-between align-items-center flex-wrap'>
                      <Col className='col-12 col-sm-6'>
                        <BForm.Label>Reason</BForm.Label>
                      </Col>
                      <Col className='col-12 col-sm-6'>
                        <InputGroup>
                          <BForm.Control
                            as='textarea'
                            type='textarea'
                            name='reason'
                            placeholder='Reason'
                            value={values.reason}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </InputGroup>
                      </Col>
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
                    <Button variant='secondary' onClick={handleReset}>
                      Reset
                    </Button>
                  ) : (
                    <Button
                      variant='success'
                      onClick={() => {
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
  );
};

export default Limit;
