import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Col,
  InputGroup,
  Row,
  Form as BForm,
  Button,
} from "@themesberg/react-bootstrap";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { changePasswordSchema } from "../schema";
import useChangePassword from "../Hooks/useChangePassword";
const ChangePassword = () => {
  const { handleOnSubmitPassword, formikRef } =
    useChangePassword();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize
      initialValues={{
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={changePasswordSchema}
      onSubmit={(values, { resetForm }) => {
        // Handle form submission logic
        // Reset the form after submission
        handleOnSubmitPassword(values, resetForm);
      }}
    >
      {({
        values,
        handleChange,
        // handleSubmit,
        // isValid,
        handleBlur,
        touched,
        errors,
      }) => {
        return (
          <Form className="p-0" style={{ margin: "40px 0px" }}>
            <Row style={{ margin: "10px 0px" }}>
              <Col className="col-lg-3 col-sm-6 col-12">
                <InputGroup
                  className={
                    touched.oldPassword && errors.oldPassword
                      ? "border border-danger"
                      : ""
                  }
                >
                  {/* <InputGroup.Text>
                              <FontAwesomeIcon icon={faUnlockAlt} />
                            </InputGroup.Text> */}

                  <BForm.Control
                    type={`${showOldPassword ? "text" : "password"}`}
                    name="oldPassword"
                    placeholder="Existing Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.oldPassword}
                  />
                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    className="b-1"
                  >
                    <FontAwesomeIcon
                      icon={showOldPassword === true ? faEyeSlash : faEye}
                      onClick={() => {
                        setShowOldPassword((showPass) => !showPass);
                      }}
                    />
                  </InputGroup.Text>
                </InputGroup>
                <ErrorMessage
                  component="div"
                  name="oldPassword"
                  className="text-danger"
                />
              </Col>
              <Col className="col-lg-3 col-sm-6 col-12">
                <InputGroup
                  className={
                    touched.newPassword && errors.newPassword
                      ? "border border-danger"
                      : ""
                  }
                >
                  <BForm.Control
                    type={`${showNewPassword ? "text" : "password"}`}
                    name="newPassword"
                    placeholder="New Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.newPassword}
                  />
                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    className="b-1"
                  >
                    <FontAwesomeIcon
                      icon={showNewPassword === true ? faEyeSlash : faEye}
                      onClick={() => {
                        setShowNewPassword((showPass) => !showPass);
                      }}
                    />
                  </InputGroup.Text>
                </InputGroup>
                <ErrorMessage
                  component="div"
                  name="newPassword"
                  className="text-danger"
                />
              </Col>
              <Col className="col-lg-3 col-sm-6 col-12">
                <InputGroup
                  className={
                    touched.confirmPassword && errors.confirmPassword
                      ? "border border-danger"
                      : ""
                  }
                >
                  <BForm.Control
                    type={`${showConfirmPassword ? "text" : "password"}`}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                  />
                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    className="b-1"
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword === true ? faEyeSlash : faEye}
                      onClick={() => {
                        setShowConfirmPassword((showPass) => !showPass);
                      }}
                    />
                  </InputGroup.Text>
                </InputGroup>
                <ErrorMessage
                  component="div"
                  name="confirmPassword"
                  className="text-danger"
                />
              </Col>
            </Row>
            <Row>
              <Col className="col-lg-3 col-sm-6 col-12">
                <Button
                  variant="primary"
                  type="submit"
                  style={{ margin: "15px" }}
                >
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => formikRef.current.resetForm()}
                  type="button"
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ChangePassword;
