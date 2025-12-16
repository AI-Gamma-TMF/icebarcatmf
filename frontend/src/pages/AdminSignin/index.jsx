import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faUnlockAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  Spinner,
  Col,
  Row,
  Form as BForm,
  Container,
  InputGroup,
} from "@themesberg/react-bootstrap";
// Removed illustration background for custom casino theme
import { adminLoginSchema } from "./schema";
import useAdminSignin from "./useAdminSignin";
import QRBlock from "../ProfilePage/components/QRBlock";
import { Helmet } from "react-helmet";

const AdminSignIn = () => {
  const {
    loading,
    handleSignIn,
    t,
    qrcodeUrlInfo,
    toggleForQRModal,
    allowLogin,
  } = useAdminSignin();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <main>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5 casino-login-section">
        <Container>
          <Row
            className="justify-content-center"
          >
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="card shadow-soft border p-4 p-lg-5 w-100 fmxw-500 fade-in">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <div className="mb-2" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img 
                      height={80} 
                      width={400} 
                      style={{ objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(0, 229, 160, 0.3))" }}
                      src={'/GammaSweep_Logo.png'}
                      alt="SWEEP"
                      className="fade-in"
                    />
                  </div>
                  <div style={{ textAlign: "right", paddingRight: "10px", marginTop: "-20px" }}>
                    <span style={{ 
                      fontSize: "16px", 
                      background: "linear-gradient(135deg, #00E5A0 0%, #00FFAA 50%, #00D994 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      filter: "drop-shadow(0 0 10px rgba(0, 229, 160, 0.4))"
                    }}>
                      ICE Barcelona 26 Edition
                    </span>
                  </div>
                </div>

                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={adminLoginSchema(t)}
                  onSubmit={({ email, password }) =>
                    handleSignIn({ email, password })
                  }
                >
                  {({
                    touched,
                    errors,
                    values,
                    handleChange,
                    handleSubmit,
                    handleBlur,
                  }) => (
                    <div>
                      <Form>
                        <div className="form-group">
                          <label htmlFor="email">
                            {t("InputField.email.label")}
                          </label>

                          <InputGroup
                            className={
                              touched.email && errors.email
                                ? "border border-danger"
                                : ""
                            }
                          >
                            <InputGroup.Text>
                              <FontAwesomeIcon icon={faEnvelope} />
                            </InputGroup.Text>

                            <BForm.Control
                              name="email"
                              autoFocus
                              required
                              type="email"
                              placeholder="example@company.com"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </InputGroup>

                          <ErrorMessage
                            component="div"
                            name="email"
                            className="error-message"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="password" className="mt-3">
                            {t("InputField.password.label")}
                          </label>

                          <InputGroup
                            className={
                              touched.password && errors.password
                                ? "border border-danger"
                                : ""
                            }
                          >
                            <InputGroup.Text>
                              <FontAwesomeIcon icon={faUnlockAlt} />
                            </InputGroup.Text>

                            <BForm.Control
                              name="password"
                              required
                              type={`${showPassword ? "text" : "password"}`}
                              placeholder="qwerty"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <InputGroup.Text
                              style={{ cursor: "pointer" }}
                              className="b-1"
                            >
                              <FontAwesomeIcon
                                icon={
                                  !showPassword === true ? faEyeSlash : faEye
                                }
                                onClick={() => {
                                  setShowPassword((showPass) => !showPass);
                                }}
                              />
                            </InputGroup.Text>
                          </InputGroup>

                          <ErrorMessage
                            component="div"
                            name="password"
                            className="error-message"
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary btn-block mt-4 w-100"
                          disabled={loading || !values.email || !values.password}
                          style={{
                            width: '100%',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {loading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              {t("signInButton")}
                            </>
                          ) : (
                            t("signInButton")
                          )}
                        </button>
                      </Form>
                    </div>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>
        </Container>
        <QRBlock
          qrcodeUrlInfo={qrcodeUrlInfo}
          allowLogin={allowLogin}
          toggleForQRModal={toggleForQRModal}
        />
      </section>
    </main>
  );
};
export default AdminSignIn;
