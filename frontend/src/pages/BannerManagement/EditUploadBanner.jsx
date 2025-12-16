import {
  Button,
  Col,
  Modal,
  Row,
  Form as BForm,
  Spinner,
} from "@themesberg/react-bootstrap";
import { ErrorMessage, Form, Formik } from "formik";
import React from "react";
import { uploadBannerSchema } from "./schema.js";
import toast from "react-hot-toast";
const EditUploadBanner = ({
  t,
  type,
  data,
  show,
  setShow,
  createUpdate,
  loading,
}) => {
  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {type} {t("casinoBannerManagement.uploadBanner.title")}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            enableReinitialize
            initialValues={{
              mobileBannerImage: null,
              bannerImage: null,
              isActive: true,
              pageBannerId: data?.pageBannerId || "",
              visibility: 2,
              pageRoute: data?.pageRoute || "",
              navigateRoute: data?.navigateRoute || "",
              isNavigate: data?.isNavigate || false,
            }}
            validationSchema={uploadBannerSchema(type, t)}
            onSubmit={(formValues) => {
              if (
                formValues?.isNavigate === true &&
                formValues?.navigateRoute === ""
              ) {
                toast("Please fill naviagtion route", "error");
              } else {
                const data = {
                  isActive: true,
                  visibility: 2,
                  pageRoute: formValues.pageRoute,
                  navigateRoute:
                    formValues.isNavigate === true
                      ? formValues.navigateRoute
                      : "",
                  isNavigate: formValues.isNavigate,
                  desktopBannerImage: formValues.bannerImage,
                  mobileBannerImage: formValues.mobileBannerImage,
                };
                if (formValues.pageBannerId)
                  data.pageBannerId = formValues.pageBannerId;
                createUpdate(data);
              }
            }}
          >
            {({
              values,
              errors,
              handleSubmit,
              handleBlur,
              setFieldValue,
              handleChange,
            }) => {
              return (
                <Form>
                  <Row className="mt-3">
                    <Col className="d-flex">
                      <BForm.Label>Page Route</BForm.Label>
                    </Col>

                    <Col xs={9}>
                      <BForm.Control
                        type="text"
                        name="pageRoute"
                        placeholder="Enter Route"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.pageRoute}
                        onKeyDown={(evt) =>
                          [" "].includes(evt.key) && evt.preventDefault()
                        }
                      />
                      <ErrorMessage
                        component="div"
                        name="pageRoute"
                        className="text-danger"
                      />
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col className="d-flex">
                      <BForm.Label>Is Navigate</BForm.Label>
                    </Col>

                    <Col xs={9}>
                      <BForm.Check
                        type="checkbox"
                        className="mx-auto"
                        name="isNavigate"
                        onChange={(e) =>
                          setFieldValue("isNavigate", e.target.checked)
                        }
                        onBlur={handleBlur}
                        checked={values?.isNavigate}
                      />
                    </Col>
                  </Row>
                  {values.isNavigate && (
                    <Row className="mt-3">
                      <Col className="d-flex ">
                        <BForm.Label>Navigate To</BForm.Label>
                      </Col>
                      <Col xs={9}>
                        <BForm.Control
                          type="text"
                          name="navigateRoute"
                          placeholder="Enter Navigation Route"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.navigateRoute}
                          onKeyDown={(evt) =>
                            [" "].includes(evt.key) && evt.preventDefault()
                          }
                        />
                        {values?.isNavigate && values?.navigateRoute === "" && (
                          <small style={{ color: "red" }}>
                            Navigation route required.
                          </small>
                        )}
                      </Col>
                    </Row>
                  )}

                  <Row className="mt-3">
                    <Col>
                      <Row>
                        <Col className="d-flex align-items-center">
                          <Col>
                            <BForm.Label>
                              Desktop Banner
                              <span className="text-danger"> *</span>
                            </BForm.Label>
                          </Col>
                          <Col xs={9}>
                            <div className="custom-file-upload-wrap">
                              {!errors?.bannerImage &&
                                (type === "Create" ? (
                                  values?.bannerImage && (
                                    <Row className="text-center">
                                      <div
                                        style={{
                                          textAlign: "left",
                                        }}
                                      >
                                        <img
                                          alt="not found"
                                          style={{
                                            maxWidth: "200px",
                                            maxHeight: "200px",
                                            marginLeft: "0",
                                          }}
                                          src={
                                            values?.bannerImage &&
                                            URL.createObjectURL(
                                              values?.bannerImage
                                            )
                                          }
                                        />
                                      </div>
                                    </Row>
                                  )
                                ) : (
                                  <Row className="text-center">
                                    <Col>
                                      <img
                                        alt="exist data"
                                        style={{
                                          maxWidth: "200px",
                                          maxHeight: "200px",
                                          marginLeft: "0",
                                        }}
                                        src={
                                          values?.bannerImage
                                            ? URL.createObjectURL(
                                                values?.bannerImage
                                              )
                                            : data?.bannerImage
                                        }
                                      />
                                    </Col>
                                  </Row>
                                ))}
                              <div className="custom-file-upload-button">
                                <BForm.Control
                                  type="file"
                                  name="bannerImage"
                                  onChange={(event) => {
                                    const file = event.target.files[0];
                                    setFieldValue("bannerImage", file);
                                  }}
                                  onBlur={handleBlur}
                                />

                                <Button>File Upload</Button>
                              </div>
                            </div>
                            <ErrorMessage
                              component="div"
                              name="bannerImage"
                              className="text-danger"
                            />
                          </Col>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col>
                      <Row>
                        <Col className="d-flex align-items-center">
                          <Col>
                            <BForm.Label>
                              Mobile Banner
                              <span className="text-danger"> *</span>
                            </BForm.Label>
                          </Col>

                          <Col xs={9}>
                            <div className="custom-file-upload-wrap">
                              {!errors?.mobileBannerImage &&
                                (type === "Create" ? (
                                  values?.mobileBannerImage && (
                                    <Row className="text-center">
                                      <div
                                        style={{
                                          textAlign: "left",
                                        }}
                                      >
                                        <img
                                          alt="not found"
                                          style={{
                                            maxWidth: "200px",
                                            maxHeight: "200px",
                                            marginLeft: "0",
                                          }}
                                          src={
                                            values?.mobileBannerImage &&
                                            URL.createObjectURL(
                                              values?.mobileBannerImage
                                            )
                                          }
                                        />
                                      </div>
                                    </Row>
                                  )
                                ) : (
                                  <Row className="text-center">
                                    <Col>
                                      <img
                                        alt="exist data"
                                        style={{
                                          maxWidth: "200px",
                                          maxHeight: "200px",
                                          marginLeft: "0",
                                        }}
                                        src={
                                          values?.mobileBannerImage
                                            ? URL.createObjectURL(
                                                values?.mobileBannerImage
                                              )
                                            : data?.mobileBannerImage
                                        }
                                      />
                                    </Col>
                                  </Row>
                                ))}
                              <div className="custom-file-upload-button">
                                <BForm.Control
                                  type="file"
                                  name="mobileBannerImage"
                                  onChange={(event) => {
                                    const file = event.target.files[0];
                                    setFieldValue("mobileBannerImage", file);
                                  }}
                                  onBlur={handleBlur}
                                />

                                <Button>File Upload</Button>
                              </div>
                            </div>
                            <ErrorMessage
                              component="div"
                              name="mobileBannerImage"
                              className="text-danger"
                            />
                          </Col>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <div className="mt-4 d-flex justify-content-between align-items-center">
                    <Button variant="warning" onClick={() => setShow(false)}>
                      {t("casinoBannerManagement.uploadBanner.cancel")}
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => {
                        handleSubmit();
                      }}
                      className="ml-2"
                      disabled={loading}
                    >
                      {t("casinoBannerManagement.uploadBanner.submit")}
                      {loading && (
                        <Spinner
                          style={{ marginLeft: "4px" }}
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditUploadBanner;
