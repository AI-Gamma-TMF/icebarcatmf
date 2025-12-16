import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Col, Row, Form as BForm, Button, Spinner, Modal } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { spinWheelValidationSchema } from "./schemas";


const EditSpinWheel = ({ show, setShow, handleEditSpinWheel, detail ,  isLoading}) => {
    const { t } = useTranslation(['translation'])
  
   
    return (
      <Formik
        initialValues={{
          wheelDivisionId: detail?.wheelDivisionId,
          sc: detail?.sc,
          gc: detail?.gc,
          isAllow: detail?.isAllow,
          playerLimit: detail?.playerLimit,
          priority: detail?.priority,
        }}
        validationSchema={spinWheelValidationSchema}
        enableReinitialize
        onSubmit={handleEditSpinWheel}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
        }) => (
          <Form>
            <Modal show={show} onHide={() => setShow(false)}>
              <Modal.Header closeButton>
                <Modal.Title>{t('confirmationModal.areYouSure')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <BForm.Label>Wheel Division Id</BForm.Label>

                  <BForm.Control
                    type="text"
                    name="wheelDivisionId"
                    min="0"
                    value={values.wheelDivisionId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={true}
                  />

                  <ErrorMessage
                    component="div"
                    name="wheelDivisionId"
                    className="text-danger"
                  />
                </Row>
                <Row>
                  <BForm.Label>SC</BForm.Label>

                  <BForm.Control
                    type="number"
                    name="sc"
                    min="0"
                    value={values.sc}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    component="div"
                    name="sc"
                    className="text-danger"
                  />
                </Row>
                <Row>
                  <BForm.Label>GC</BForm.Label>

                  <BForm.Control
                    type="number"
                    name="gc"
                    min="0"
                    value={values.gc}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    component="div"
                    name="gc"
                    className="text-danger"
                  />
                </Row>
                <Row>
                  <BForm.Label>Is Allow</BForm.Label>
                  <BForm.Check
                    type='checkbox'
                    name='isAllow'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    checked={values.isAllow}
                   />
                  

                  <ErrorMessage
                    component="div"
                    name="isAllow"
                    className="text-danger"
                  />
                </Row>
                <Row>
                  <BForm.Label>Player Limit</BForm.Label>

                  <BForm.Control
                    type="number"
                    name="playerLimit"
                    min="0"
                    value={values.playerLimit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <ErrorMessage
                    component="div"
                    name="playerLimit"
                    className="text-danger"
                  />
                </Row>
                <Row >
                  <Col>
                    <BForm.Label>
                    Priority
                    </BForm.Label>

                    <BForm.Select
                      type='text'
                      name='priority'
                      value={values.priority}
                      onChange={handleChange}
                    >
                      <option value='' disabled>Select Priority</option>
                      <option value='1'>Rarely</option>
                      <option value='2'>Sometimes</option>
                      <option value='3'>Usually</option>
                      <option value='4'>Frequently</option>
                      <option value='5'>Most of the time</option>
                    </BForm.Select>
                    <ErrorMessage
                      component='div'
                      name='priority'
                      className='text-danger'
                    />
                  </Col>
                </Row>
              </Modal.Body>

              <Modal.Footer>
                <Button variant='secondary' onClick={() => { handleSubmit()}} disabled={  isLoading}>
                  {t('confirmationModal.yes')}{isLoading&& (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
                </Button>

                <Button variant='primary' onClick={() => setShow(false)}>
                  {t('confirmationModal.no')}
                </Button>
              </Modal.Footer>
            </Modal>

          </Form>
        )}
      </Formik>
    )
  }

  export default EditSpinWheel;