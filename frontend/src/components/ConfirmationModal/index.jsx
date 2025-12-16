import { useEffect, useState } from 'react'
import { Button, Col, Modal, Row, Form as BForm, Accordion, Spinner } from '@themesberg/react-bootstrap'
import './modalStyle.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import Trigger from '../OverlayTrigger'
import { toast } from '../Toast'
import CopyToClipboard from 'react-copy-to-clipboard'
import Datetime from 'react-datetime'
import { useQuery } from '@tanstack/react-query'
import { getGallery } from '../../utils/apiCalls'
import { useTranslation } from 'react-i18next'
import { formatDateYMD, getDateTime, addHours, getDateTimeByYMD, convertToUTC } from '../../utils/dateFormatter'
import { Formik, Form, ErrorMessage } from 'formik'
import { SimpleEditFormContainer } from '../../pages/PlayerDetails/style'
import { documentApproveSchema, editSimpleFormSchema } from '../../pages/PlayerDetails/components/EditInfo/schema'
import { SpinnerLoader } from "../Preloader";
import pdfImage from "../../assets/img/pages/pdfimage.png";
import { DocStatus } from "../UserDocsList/constants";
import axios from "axios";
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { reusePackageSchema } from '../../pages/Packages/schemas'
import { serialize } from 'object-to-formdata';
import PackageOverwritePrompt from '../../pages/Packages/components/PackageOverwritePrompt'
import { limitName } from '../ResponsibleGaming/constants'

export const ConfirmationModal = ({
  show,
  setShow,
  handleYes,
  active,
  bonus,
  isBonus = false,
  loading = false,
  message,
  note,
  freeSpinstatus
}) => {
  const { t } = useTranslation(["translation"]);

  // Determine the modal body message
  const modalBody =
    message ||
    (isBonus
      ? `${t("confirmationModal.toggleStatus")} ${
          active ? "Active" : "In-Active"
        } ${
          bonus?.bonusType === "daily bonus"
            ? "all the daily bonuses"
            : bonus?.bonusType === "monthly bonus" && "all the monthly bonuses"
        }?`
      : `${t("confirmationModal.toggleStatus")} ${
          active ? "Active" : "In-Active"
        }`);

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("confirmationModal.areYouSure")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalBody}</Modal.Body>

        { freeSpinstatus && !active && (
          <p className="m-2  mb-0 text-muted" style={{ fontSize: '0.9rem', paddingLeft: '10px' }}>
            <strong>Note:</strong> {note}
          </p>
        )}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleYes} disabled={loading}>
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
        <Button variant="primary" onClick={() => setShow(false)}>
          {t("confirmationModal.no")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export const ScratchCardConfirmationModal = ({
  show,
  setShow,
  handleYes,
  confirmationData,
  bonus,
  isBonus = false,
  loading = false,
  message,
}) => {
  const { t } = useTranslation(['translation']);



  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t('confirmationModal.areYouSure')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Your daily consumed amount is  ${
          confirmationData?.lable === limitName.daily_budget_limit
            ? confirmationData?.dailyConsumedAmount
            : confirmationData?.lable === limitName.weekly_budget_limit
              ? confirmationData?.weeklyConsumedAmount
              : confirmationData?.monthlyConsumedAmount
        }, and you are trying to change the budget limit to ${confirmationData?.limit}
       . Do you agree to update?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleYes} disabled={loading}>
          {t('confirmationModal.yes')}
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
        <Button variant="primary" onClick={() => setShow(false)}>
          {t('confirmationModal.no')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export const RestoreConfirmationModal = ({ show, setShow, handleYes, active, bonus, isBonus = false, loading }) => {
  const { t } = useTranslation(['translation'])
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Restore Package </Modal.Title>
      </Modal.Header>

      <Modal.Body>Are you want to restore package?</Modal.Body>
      <Modal.Body>
        Note: This package is inactive. Please activate it after restoring.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleYes} disabled={loading}>
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

        <Button variant="primary" onClick={() => setShow(false)}>
          {t("confirmationModal.no")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const PlayerStatusConfirmationModal = ({
  show,
  setShow,
  handleYes,
  active,
  playerStatusDetail,
}) => {
  const { t } = useTranslation(["translation"]);
  const [isFav, setIsFav] = useState(false);
  return (
    <Formik
      initialValues={{
        reason: "",
      }}
      validationSchema={editSimpleFormSchema()}
      onSubmit={(formValues, { resetForm }) => {
        const data = {
          reason: formValues.reason,
          isFav: isFav,
        };
        handleYes(data);
        resetForm();
        setIsFav(false);
        setShow(false); // Close the modal after form submission
      }}
    >
      {({
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
      }) => (
        <Modal
          show={show}
          onHide={() => {
            setShow(false);
            setIsFav(false);
            resetForm(); // Reset form when modal is closed
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("confirmationModal.areYouSure")}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            Because of <strong>{playerStatusDetail?.remark || "-"}</strong> on{" "}
            <strong>{getDateTime(playerStatusDetail?.createdAt)}</strong>,{" "}
            <strong>
              {playerStatusDetail?.moreDetails?.firstName}{" "}
              {playerStatusDetail?.moreDetails?.lastName}
            </strong>{" "}
            marked this account as{" "}
            <strong>{!active ? "Active" : "In-Active"}</strong>.
            <div className="form-group">
              <label
                htmlFor="reason"
                className={touched.reason && errors.reason ? "text-danger" : ""}
              >
                Add your reason to {active ? "Active" : "In-Active"} user.
              </label>
              <BForm.Control
                as="textarea"
                name="reason"
                placeholder={"Enter reason"}
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                component="div"
                name="reason"
                className="text-danger"
              />
            </div>
            <div className="form-group fab-icon-wrap">
              <label
                htmlFor="reason"
                className={touched.reason && errors.reason ? "text-danger" : ""}
              >
                Favourite
              </label>
              <div className="fab-icon">
                <FontAwesomeIcon
                  icon={faStar}
                  size="1x"
                  style={{ color: isFav ? "#ffdd77" : "" }}
                  onClick={() => setIsFav(!isFav)}
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleSubmit}>
              {t("confirmationModal.yes")}
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                setIsFav(false);
                setShow(false);
                resetForm(); // Reset form when "No" button is clicked
              }}
            >
              {t("confirmationModal.no")}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Formik>
  );
};

export const DeleteConfirmationModal = ({
  deleteModalShow,
  setDeleteModalShow,
  handleDeleteYes,
  loading,
}) => {
  const { t } = useTranslation(["translation"]);
  return (
    <Modal show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("confirmationModal.areYouSure")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t("confirmationModal.deleteMessage")}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleDeleteYes}
          disabled={loading}
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
            setDeleteModalShow(false);
          }}
        >
          {t("confirmationModal.no")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const HideConfirmationModal = ({
  hideModalShow,
  setHideModalShow,
  handleHideYes,
  loading,
  hideMsg
}) => {
  const { t } = useTranslation(["translation"]);
  return (
    <Modal show={hideModalShow} onHide={() => setHideModalShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("confirmationModal.areYouSure")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{hideMsg}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleHideYes}
          disabled={loading}
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
            setHideModalShow(false);
          }}
        >
          {t("confirmationModal.no")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ReuseConfirmationModal = ({
  reuseModalShow,
  setReuseModalShow,
  handleReusePackageYes,
  loading,
  isSpecialPackage,
  showOverwriteModal,
  setShowOverwriteModal,
  overwriteFormValues,
  setOverwriteFormValues,
  existingPackageData,
  setExistingPackageData,
  isScratchCard
}) => {
  const { t } = useTranslation(["translation"]);
  const yesterday = new Date(Date.now() - 86400000);

  const handleAddHours = (setFieldValue, validFrom, hoursToAdd) => {
    validFrom =
      validFrom === null || validFrom === undefined
        ? new Date()
        : new Date(validFrom);
    const updatedValidTill = addHours(validFrom, hoursToAdd);
    setFieldValue("validTill", updatedValidTill);
  };

  return (
    <>
      <Modal
        show={reuseModalShow}
        onHide={() => setReuseModalShow(false)}
        backdrop="static"
        contentClassName="p-0 border-0 rounded-xl"
        dialogClassName="modal-dialog-centered"
      >
        <Modal.Header
          style={{
            backgroundColor: "#262B40",
            color: "#fff",
            padding: "16px 24px",
            borderBottom: "none",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
          closeButton
          closeVariant="white"
        >
          <Modal.Title
            style={{ fontWeight: "600", fontSize: "18px", color: "#fff" }}
          >
            Are you sure?
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            padding: "24px",
            backgroundColor: "#fff",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
          }}
        >
          <div style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
            Would you like to reuse the {isScratchCard ? 'scratch card' : 'package'}?
          </div>
          <SimpleEditFormContainer>
            <Formik
              initialValues={{
                isScheduledPackage: isSpecialPackage || false,
                validFrom: null,
                validTill: null,
              }}
              validationSchema={reusePackageSchema}
              onSubmit={(formValues, { resetForm }) => {
                let data = {};
                if (isScratchCard) {
                  data = { confirm: true }
                } else {
                  if (formValues.validFrom) {
                    data.validFrom = convertToUTC(formValues.validFrom);
                  }
                  if (formValues.validTill) {
                    data.validTill = convertToUTC(formValues.validTill);
                  }
                  setOverwriteFormValues(data)
                }
                handleReusePackageYes(serialize(data));
                resetForm();
              }}
            >
              {({
                values,
                handleChange,
                handleSubmit,
                handleBlur,
                setFieldValue,
              }) => (
                <div>
                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: isSpecialPackage ? "4px" : "0",
                      }}
                      hidden={isScratchCard}
                    >
                      <input
                        type="checkbox"
                        name="isScheduledPackage"
                        checked={values.isScheduledPackage}
                        onChange={(e) => {
                          if (!isSpecialPackage) {
                            handleChange(e);
                            if (!e.target.checked) {
                              setFieldValue("validFrom", null);
                              setFieldValue("validTill", null);
                            }
                          }
                        }}
                        onBlur={handleBlur}
                        disabled={isSpecialPackage}
                        style={{
                          width: "16px",
                          height: "16px",
                          accentColor: "#262B40",
                        }}
                      />
                      <label
                        htmlFor="isScheduledPackage"
                        style={{
                          margin: 0,
                          fontWeight: "600",
                          fontSize: "16px",
                          color: "#444",
                        }}
                      >
                        Scheduled Package
                      </label>
                    </div>

                    {isSpecialPackage && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#E63946",
                          marginLeft: "28px", // align with label start
                        }}
                      >
                        Note: Scheduled dates are required to reuse a special
                        package.
                      </div>
                    )}
                  </div>

                  {values.isScheduledPackage && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <label
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              marginBottom: "4px",
                              display: "block",
                            }}
                          >
                            Valid From
                          </label>
                          <Datetime
                            inputProps={{
                              placeholder: "MM-DD-YYYY HH:MM",
                              readOnly: true,
                              style: {
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                fontSize: "14px",
                              },
                            }}
                            dateFormat="MM-DD-YYYY"
                            onChange={(e) => {
                              setFieldValue("validFrom", e);
                            }}
                            value={
                              values.validFrom
                                ? getDateTime(values.validFrom)
                                : ""
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
                            name="validFrom"
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          />
                        </div>

                        <div style={{ flex: 1 }}>
                          <label
                            style={{
                              fontWeight: "600",
                              fontSize: "14px",
                              marginBottom: "4px",
                              display: "block",
                            }}
                          >
                            Valid Until
                          </label>
                          <Datetime
                            inputProps={{
                              placeholder: "MM-DD-YYYY HH:MM",
                              readOnly: true,
                              style: {
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                fontSize: "14px",
                              },
                            }}
                            dateFormat="MM-DD-YYYY"
                            onChange={(e) => {
                              setFieldValue("validTill", e);
                            }}
                            value={
                              values.validTill
                                ? getDateTime(values.validTill)
                                : ""
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
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleAddHours(setFieldValue, values.validFrom, 12)
                          }
                          disabled={!values.validFrom}
                          style={{
                            flex: 1,
                            backgroundColor: "#262B40",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "12px 0",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Valid Until 12 Hours
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleAddHours(setFieldValue, values.validFrom, 24)
                          }
                          disabled={!values.validFrom}
                          style={{
                            flex: 1,
                            backgroundColor: "#262B40",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "12px 0",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Valid Until 24 Hours
                        </button>
                      </div>
                    </>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "16px",
                    }}
                  >
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{
                        backgroundColor: "#D9D9D9",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 20px",
                        fontWeight: "600",
                        minWidth: "80px",
                      }}
                    >
                      {t("confirmationModal.yes") || "Yes"}
                      {loading && (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReuseModalShow(false)}
                      style={{
                        backgroundColor: "#262B40",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 20px",
                        fontWeight: "600",
                        minWidth: "80px",
                      }}
                    >
                      {t("confirmationModal.no") || "No"}
                    </button>
                  </div>
                </div>
              )}
            </Formik>
          </SimpleEditFormContainer>
        </Modal.Body>
      </Modal>

      <PackageOverwritePrompt
        show={showOverwriteModal}
        onClose={() => setShowOverwriteModal(false)}
        existingPackageData={existingPackageData}
        overwriteFormValues={overwriteFormValues}
        setOverwriteFormValues={setOverwriteFormValues}
        handleReusePackageYes={handleReusePackageYes}
        isReuse
      />
    </>
  );
};

export const ApproveRejectModal = ({
  show,
  setShow,
  handleYes,
  status,
  imageUrl,
  docStatus,
}) => {
  const { t } = useTranslation(["translation"]);

  const [docUrl, setDocUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  function getUrlExtension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          "X-AUTH-CLIENT": process.env.REACT_APP_X_AUTH_CLIENT,
          "X-HMAC-SIGNATURE": imageUrl?.signature,
        };
        const response = await axios.get(imageUrl?.documentUrl, {
          headers: headers,
          responseType: "blob",
        });
        const urlCreator = window.URL || window.webkitURL;
        const fileUrl = urlCreator.createObjectURL(response.data);
        setDocUrl(fileUrl);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    imageUrl?.signature ? fetchData() : setLoading(false);
  }, []);

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Player Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SimpleEditFormContainer>
          <Row className="mt-3 d-block">
            {loading ? (
              <div style={{ marginLeft: "80px" }}>
                <SpinnerLoader />
              </div>
            ) : (
              <Col>
                {getUrlExtension(imageUrl?.documentUrl) === "pdf" ? (
                  <img
                    src={pdfImage}
                    onClick={() => window.open(imageUrl?.documentUrl)}
                    style={{ border: "1px solid grey", borderRadius: "12px" }}
                    className="mb-2 w-50 mx-auto d-block"
                  />
                ) : (
                  <img
                    src={imageUrl?.signature ? docUrl : imageUrl?.documentUrl}
                    width="200"
                    height="150"
                    alt={imageUrl?.signature ? docUrl : imageUrl?.documentUrl}
                    onClick={() =>
                      window.open(
                        imageUrl?.signature ? docUrl : imageUrl?.documentUrl
                      )
                    }
                    style={{ border: "1px solid grey", borderRadius: "12px" }}
                    className="mb-2 w-50 mx-auto d-block"
                  />
                )}
              </Col>
            )}
          </Row>
          {(docStatus == 1 || docStatus == 2) ? <div className='fw-bold'>Status: {DocStatus?.[docStatus]}
          </div> : (<Formik
            initialValues={{
              reason: '',
              expiryDate: '',
              status: ''
            }}
            validationSchema={documentApproveSchema()}
            onSubmit={(formValues, { resetForm }) => {
              if (status === 'approved') {
                handleYes(formValues.reason, '', formValues.expiryDate, formValues.status);
              }
              resetForm();
            }}
          >
            {({ values, setFieldValue, handleChange, handleBlur, handleSubmit }) => (
              <Form>
                {/* <Row className='mt-3'>
                  <Col key={1} className='mt-2 text-center' xs={6}>
                    {loading ? (
                      <div style={{ marginLeft: "80px" }}>
                        <SpinnerLoader />
                      </div>
                    ) : (
                      <Col>
                        {getUrlExtension(imageUrl?.documentUrl) === "pdf" ? (
                          <img
                            src={pdfImage}
                            onClick={() => window.open(imageUrl?.documentUrl)}
                            style={{ border: "1px solid grey", borderRadius: "12px" }}
                            className='mb-2'
                          />
                        ) : (
                          <img
                            src={imageUrl?.signature ? docUrl : imageUrl?.documentUrl}
                            width='200'
                            height='150'
                            alt={imageUrl?.signature ? docUrl : imageUrl?.documentUrl}
                            onClick={() => window.open(imageUrl?.signature ? docUrl : imageUrl?.documentUrl)}
                            style={{ border: "1px solid grey", borderRadius: "12px" }}
                            className='mb-2'
                          />
                        )}
                      </Col>
                    )}
                  </Col>
                </Row> */}
                  <Row className="mt-3">
                    <Col>
                      <BForm.Label>
                        Document Expiry Date{" "}
                        <span className="text-danger">*</span>
                      </BForm.Label>
                      <Datetime
                        inputProps={{
                          placeholder: "YYYY-MM-DD",
                          readOnly: true,
                        }}
                        dateFormat="YYYY-MM-DD"
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue("expiryDate", formatDateYMD(e._d));
                        }}
                        value={values.expiryDate}
                        isValidDate={(e) => {
                          return (
                            e._d > new Date() ||
                            formatDateYMD(e._d) === formatDateYMD(new Date())
                          );
                        }}
                        timeFormat={false}
                      />
                      <ErrorMessage
                        component="div"
                        name="expiryDate"
                        className="text-danger"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <BForm.Label>
                        Status <span className="text-danger">*</span>
                      </BForm.Label>
                      <div>
                        <BForm.Check
                          type="radio"
                          inline
                          label="Approved"
                          name="status"
                          value="approved"
                          checked={values.status === "approved"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <BForm.Check
                          type="radio"
                          inline
                          label="Rejected"
                          name="status"
                          value="rejected"
                          checked={values.status === "rejected"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <BForm.Check
                          type="radio"
                          inline
                          label="Hold"
                          name="status"
                          value="hold"
                          checked={values.status === "hold"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>

                      <ErrorMessage
                        component="div"
                        name="status"
                        className="text-danger"
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <BForm.Label>
                        Remarks
                        <span className="text-danger"> *</span>
                      </BForm.Label>

                      <BForm.Control
                        type="text"
                        as="textarea"
                        rows="3"
                        name="reason"
                        value={values.reason}
                        placeholder={"Enter Reason"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <ErrorMessage
                        component="div"
                        name="reason"
                        className="text-danger"
                      />
                    </Col>
                  </Row>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleSubmit}>
                      {t("confirmationModal.yes")}
                    </Button>

                    <Button variant="primary" onClick={() => setShow(false)}>
                      {t("confirmationModal.no")}
                    </Button>
                  </Modal.Footer>
                </Form>
              )}
            </Formik>
          )}
        </SimpleEditFormContainer>
      </Modal.Body>
    </Modal>
  );
};

export const GalleryModal = ({ galleryModal, setGalleryModal }) => {
  const { data: gallery } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => getGallery(),
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.gallery,
  });
  const { t } = useTranslation(["translation"]);

  return (
    <Modal show={galleryModal} onHide={() => setGalleryModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t("confirmationModal.galleryTitle")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="text-center align-items-center">
          {gallery?.length > 0 ? (
            gallery?.map((img, index) => {
              return (
                <Col key={index} md={3} className="imagecontainer">
                  <CopyToClipboard
                    text={img?.imageUrl}
                    onCopy={() => {
                      setGalleryModal(false);
                      toast(
                        t("confirmationModal.copiedToClipboardToast"),
                        "success"
                      );
                    }}
                  >
                    <img
                      src={img?.imageUrl}
                      width="200"
                      height="150"
                      style={{
                        border: "2px solid aliceblue",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                      className="mb-2"
                    />
                  </CopyToClipboard>
                  <div className="text">{img?.name}</div>
                  <Trigger
                    message={t("confirmationModal.copyUrl")}
                    id={img?.name}
                  />
                  <CopyToClipboard
                    text={img?.imageUrl}
                    onCopy={() => {
                      setGalleryModal(false);
                      toast(
                        t("confirmationModal.copiedToClipboardToast"),
                        "success"
                      );
                    }}
                  >
                    <Button
                      id={img?.name}
                      className="copy d-flex align-items-center"
                      variant="light"
                    >
                      <FontAwesomeIcon icon={faCopy} />
                    </Button>
                  </CopyToClipboard>
                </Col>
              );
            })
          ) : (
            <h4 className="text-danger">
              {t("confirmationModal.galleryNoImage")}
            </h4>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export const ResetConfirmationModal = ({ show, setShow, handleYes, data }) => {
  const { t } = useTranslation(["translation"]);
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("confirmationModal.areYouSure")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {t("confirmationModal.resetMessage")} {data}?
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            handleYes(data);
            setShow(false);
          }}
        >
          {t("confirmationModal.yes")}
        </Button>

        <Button variant="primary" onClick={() => setShow(false)}>
          {t("confirmationModal.no")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const ApproveRedeemConfirmation = ({
  show,
  setShow,
  handleYes,
  type
}) => {
  const { t } = useTranslation(["translation"]);
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("confirmationModal.areYouSure")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* {redeemRequest?.paymentProvider !== 'Prizeout' && <><p className='text-success'>Successful {redeemRequest?.paymentProvider} Transactions.</p>
        <p className='text-danger'>Failed {redeemRequest?.paymentProvider} Transactions.</p>
        </>}  */}
        <p>
          {type === "approved"
            ? t("confirmationModal.approveMessage")
            : type === "approvedAll"
            ? t("confirmationModal.approveAllMessage")
            : t("confirmationModal.cancelMessage")}
          ?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            handleYes();
            setShow(false);
          }}
        >
          {t("confirmationModal.yes")}
        </Button>

        <Button variant="primary" onClick={() => setShow(false)}>
          {t("confirmationModal.no")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const RedeemMoreDetail = ({
  show,
  setShow,
  handleYes,
  moreDetailData,
  reasonData,
}) => {
  // const { t } = useTranslation(['translation'])
  const renderDetails = (details) => {
    if (Array.isArray(details)) {
      return (
        <ul>
          {details.map((item, index) => (
            <li key={index}>{renderDetails(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof details === "object" && details !== null) {
      return (
        <div>
          {Object.keys(details).map((key, index) => (
            <p key={index}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)} : </strong>
              {renderDetails(details[key])}
            </p>
          ))}
        </div>
      );
    } else {
      return <span>{details}</span>;
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Redeem More Detail </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "525px", overflowY: "auto" }}>
        <p>Name : {moreDetailData.data?.name}</p>
        <p>User Payment Email : {moreDetailData.data?.actionableEmail}</p>
        <p>
          Total Purchase Amount : {moreDetailData.data?.totalPurchaseAmount}
        </p>
        <p>Total Redeem Amount : {moreDetailData.data?.totalRedeemedAmount}</p>
        <p>Total GGR : {moreDetailData.data?.totalGGR}</p>

        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>View More Details</Accordion.Header>
            <Accordion.Body>
              <Row className="mt-3">
                <Col>
                  {reasonData ? (
                    renderDetails(reasonData)
                  ) : (
                    <p>No additional details available.</p>
                  )}
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            handleYes();
            setShow(false);
          }}
        >
          Back
        </Button>

        {/* <Button variant='primary' onClick={() => setShow(false)}>
          {t('confirmationModal.no')}
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export const MoreDetail = ({ show, setShow, moreDetailData }) => {
  const renderDetails = (details) => {
    if (Array.isArray(details)) {
      return (
        <ul>
          {details.map((item, index) => (
            <li key={index}>{renderDetails(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof details === "object" && details !== null) {
      return (
        <div>
          {Object.keys(details).map((key, index) => (
            <p key={index}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)} : </strong>
              {renderDetails(details[key])}
            </p>
          ))}
        </div>
      );
    } else {
      return <span>{details}</span>;
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>More Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "525px", overflowY: "auto" }}>
        {moreDetailData ? (
          renderDetails(moreDetailData)
        ) : (
          <p>No additional details available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const SubPackageExists = ({ show, setShow }) => {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Disable SubPackages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Kindly Disable all the subpackage intervals to make{" "}
        <b>Edit/ Delete/ Reuse</b> this package.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const VipStatusConfirmationModal = ({
  show,
  setShow,
  handleYes,
  vipStatusValue,
  loading = false,
  // userId,
  // active,
  // bonus,
  // isBonus = false,
  // message,
}) => {
  const { t } = useTranslation(["translation"]);
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("confirmationModal.areYouSure")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You want to{" "}
        {vipStatusValue === "approved"
          ? "approve this user as a VIP member?"
          : "revoke this user's VIP status?"}{" "}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleYes} disabled={loading}>
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
        <Button variant="primary" onClick={() => setShow(false)}>
          {t("confirmationModal.no")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const VipManagedByModal = ({
  show,
  setShow,
  loading = false,
  handleYes,
}) => {
  const { t } = useTranslation(["translation"]);
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{t("confirmationModal.areYouSure")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You want to assign this admin as the manager for the selected user?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleYes} disabled={loading}>
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
        <Button variant="primary" onClick={() => setShow(false)}>
          {t("confirmationModal.no")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
