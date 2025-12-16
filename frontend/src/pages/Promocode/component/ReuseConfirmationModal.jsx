import React from 'react'
import { Button, Modal, Row, Form as BForm, Tooltip, Spinner, OverlayTrigger } from '@themesberg/react-bootstrap'
import '../../../components/ConfirmationModal/modalStyle.scss'
import { Formik, ErrorMessage } from 'formik'
import Datetime from 'react-datetime'
import { SimpleEditFormContainer } from '../../../pages/PlayerDetails/style'
import { reusePromocodeSchema } from '../schemas'
import { getDateTime, getDateTimeByYMD, convertToUTC } from '../../../utils/dateFormatter'
import { useTranslation } from 'react-i18next'
import moment from 'moment';


export const ReuseConfirmationModal = ({
  reuseModalShow,
  setReuseModalShow,
  handleReusePromocodeYes,
  loading,
  selectedMaxUsersAvailed,
  selectedPerUserLimit,
}) => {
  const { t } = useTranslation(["translation"]);
  const yesterday = new Date(Date.now() - 86400000);

    return (
        <Modal show={reuseModalShow} onHide={() => setReuseModalShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{t("confirmationModal.areYouSure")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <BForm.Label>{t("You want to reuse the promocode?")}</BForm.Label>
                <SimpleEditFormContainer>
                    <Formik
                        initialValues={{
                            // isValidUntil: false,
                            validFrom: null,
                            validTill: null,
                            maxUsersAvailed: selectedMaxUsersAvailed || 0,
                            perUserLimit: selectedPerUserLimit || 0
                        }}
                        validationSchema={reusePromocodeSchema}
                        onSubmit={(formValues, { _resetForm }) => {
                            const data = {
                                validFrom: convertToUTC(formValues.validFrom) || null,
                                validTill: convertToUTC(formValues.validTill) || null,
                                maxUsersAvailed: parseInt(formValues.maxUsersAvailed),
                                perUserLimit: parseInt(formValues.perUserLimit),
                            };
                            handleReusePromocodeYes(data);
                            // resetForm();
                        }}
                    >
                        {({
                            values,
                            handleChange,
                            handleSubmit,
                            handleBlur,
                            setFieldValue,
                        }) => (
                            <div className="col-12 col-lg-12" border="primary">
                                <>
                                    <Row className="mt-3" style={{ position: "relative" }}>
                                        <div className="col-12 col-lg-12">
                                            {/* <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-valid-until">
                                                        Ends Validity
                                                    </Tooltip>
                                                }
                                            > */}

                      <div className="d-flex  gap-5 justify-content-between">
                        <h5 className="m-0 " style={{ fontSize: "18px" }}>
                          <BForm.Label>
                            Valid From
                            <span className="text-danger"> *</span>
                          </BForm.Label>
                        </h5>
                        <div className="flex-grow-1">
                          <div className="">
                            <Datetime
                              inputProps={{
                                placeholder: "MM-DD-YYYY",
                                disabled: false,
                                readOnly: true,
                              }}
                              dateFormat="MM/DD/YYYY"
                              timeFormat={true}
                              isValidDate={(current) =>
                                current.isAfter(moment().subtract(1, "days"))
                              }
                              onChange={(e) =>
                                setFieldValue("validFrom", moment(e).utc())
                              }
                              value={
                                values.validFrom
                                  ? moment(values.validFrom).local()
                                  : ""
                              }
                            />
                            <ErrorMessage
                              component="div"
                              name="validFrom"
                              className="text-danger"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="d-flex  gap-5 justify-content-between mt-3">
                        <h5 className="m-0 " style={{ fontSize: "18px" }}>
                          Valid Until
                          <span className="text-danger"> *</span>
                        </h5>
                        <div className="relative flex-grow-1">
                          {/* <BForm.Check
                                                            type="switch"
                                                            name="isValidUntil"
                                                            checked={values.isValidUntil}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            disabled={false}
                                                            style={{
                                                                position: "absolute",
                                                                top: "9px",
                                                                left: "auto",
                                                                right: "10px",
                                                                zIndex: 2,
                                                            }}
                                                        />
                                                        <ErrorMessage
                                                            component="div"
                                                            name="isValidUntil"
                                                            className="text-danger"
                                                        /> */}
                          {/* {values.isValidUntil === true ? ( */}
                          <>
                            <div className="">
                              <Datetime
                                inputProps={{
                                  placeholder: "MM-DD-YYYY",
                                  readOnly: true,
                                }}
                                dateFormat="MM-DD-YYYY"
                                onChange={(e) => {
                                  setFieldValue("validTill", e);
                                }}
                                value={
                                  values.validTill
                                    ? getDateTime(values.validTill)
                                    : values.validTill
                                }
                                isValidDate={(e) => {
                                  return (
                                    e._d > yesterday ||
                                    getDateTimeByYMD(e._d) ===
                                      getDateTimeByYMD(new Date())
                                  );
                                }}
                                timeFormat={true}
                              />
                              <ErrorMessage
                                component="div"
                                name="validTill"
                                className="text-danger"
                              />
                            </div>
                          </>
                          {/* ) : ( */}
                          {/* <>
                                                                <div className="">
                                                                    <BForm.Control
                                                                        type="number"
                                                                        name="validTill"
                                                                        min="0"
                                                                        disabled="true"
                                                                    />

                                                                    <ErrorMessage
                                                                        component="div"
                                                                        name="validTill"
                                                                        className="text-danger"
                                                                    />
                                                                </div>
                                                            </>
                                                        )} */}
                        </div>
                      </div>
                      {/* </OverlayTrigger> */}
                    </div>
                  </Row>
                  <Row className="mt-3" style={{ position: "relative" }}>
                    <div className="col-12 col-lg-12">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-valid-until">
                            Enter zero if you do not want to add a limit.
                          </Tooltip>
                        }
                      >
                        <div className="d-flex  gap-5  justify-content-between">
                          <h5 className="m-0 " style={{ fontSize: "18px" }}>
                            Max Users Availed
                          </h5>
                          <div className="relative flex-grow-1">
                            <>
                              <div className="">
                                <BForm.Control
                                  type="number"
                                  name="maxUsersAvailed"
                                  value={values.maxUsersAvailed}
                                  min="0"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <ErrorMessage
                                  component="div"
                                  name="maxUsersAvailed"
                                  className="text-danger"
                                />
                              </div>
                            </>
                          </div>
                        </div>
                      </OverlayTrigger>
                    </div>
                  </Row>
                  <Row className="mt-3" style={{ position: "relative" }}>
                    <div className="col-12 col-lg-12">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-valid-until">
                            Enter zero if you do not want to add a limit.
                          </Tooltip>
                        }
                      >
                        <div className="d-flex  gap-5  justify-content-between">
                          <h5 className="m-0 " style={{ fontSize: "18px" }}>
                            Per User Limit
                          </h5>
                          <div className="relative flex-grow-1">
                            <>
                              <div className="">
                                <BForm.Control
                                  type="number"
                                  name="perUserLimit"
                                  value={values.perUserLimit}
                                  min="0"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <ErrorMessage
                                  component="div"
                                  name="perUserLimit"
                                  className="text-danger"
                                />
                              </div>
                            </>
                          </div>
                        </div>
                      </OverlayTrigger>
                    </div>
                  </Row>
                </>
                <div className="d-flex justify-content-end mt-3">
                  <Button
                    variant="secondary"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="me-2"
                  >
                    {t("confirmationModal.yes")}
                    {loading && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setReuseModalShow(false);
                    }}
                  >
                    {t("confirmationModal.no")}
                  </Button>
                </div>
              </div>
            )}
          </Formik>
        </SimpleEditFormContainer>
      </Modal.Body>
    </Modal>
  );
};
