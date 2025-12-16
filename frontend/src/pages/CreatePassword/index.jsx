import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
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
import BgImage from "../../assets/img/illustrations/adminlogin.svg";
import { createPasswordSchema } from "./schema";
import useCreatePassword from "./useCreatePassword";

const CreatePassword = () => {
  const {
    loading,
    handleCreatePassword,
    t,
  } = useCreatePassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row
            className="justify-content-center form-bg-image"
            style={{ backgroundImage: `url(${BgImage})` }}
          >
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center  mt-md-0">
                  <h3
                    className="mb-0"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      style={{ marginRight: "6px", display: "none" }}
                      src="/favicon-32x32.png"
                    />
                  </h3>
                </div>

                <Formik
                  initialValues={{ password: "",confirmPassword:"" }}
                  validationSchema={createPasswordSchema(t)}
                  onSubmit={(formData) =>
                   handleCreatePassword(formData)
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
                      <h2 style={{textAlign:"center"}}>Set Password</h2>

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


                        <div className="form-group">
                          <label htmlFor="confirmPassword" className="mt-3">
                            {t("InputField.confirmPassword.label")}
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
                              name="confirmPassword"
                              required
                              type={`${showConfirmPassword ? "text" : "password"}`}
                              placeholder="qwerty"
                              value={values.confirmPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <InputGroup.Text
                              style={{ cursor: "pointer" }}
                              className="b-1"
                            >
                              <FontAwesomeIcon
                                icon={
                                  !showConfirmPassword === true ? faEyeSlash : faEye
                                }
                                onClick={() => {
                                  setShowConfirmPassword((showPass) => !showPass);
                                }}
                              />
                            </InputGroup.Text>
                          </InputGroup>

                          <ErrorMessage
                            component="div"
                            name="confirmPassword"
                            className="error-message"
                          />
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary btn-block mt-4"
                          onClick={handleSubmit}
                        >
                          {loading && (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          )}
                          Create Password
                        </button>
                      </Form>
                    </div>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
export default CreatePassword;
