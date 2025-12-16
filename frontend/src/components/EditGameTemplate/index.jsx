/* eslint-disable react/display-name */
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
} from "@themesberg/react-bootstrap";
import { ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminRoutes } from "../../routes";
import CodepenEditor from "../CodeEditor";

const EditGameTemplate = ({
  values,
  setFieldValue,
  handleChange,
  handleBlur,
  selectedTab,
  navigate,
  create = false,
  handleSubmit,
  details = false,
  // initValues = false,
  title,
  setTitle,
  content,
  setContent,
  loading,
  isBlog,
  // desktopDimension,
}) => {
  const { t } = useTranslation(["blogs"]);
  const [template, setTemplate] = useState("");
  const [titleErr, setTitleErr] = useState("");
  const [err, setErr] = useState("");
  const [label, setLabel] = useState("");
  const [requiredKeyData, setRequiredKeyData] = useState({});

  const blogSubmitButtonClick = () => {
    window.scroll(0, 0);
    handleSubmit();
  };

 
  useEffect(() => {
    if (template) {
      setErr("");
    }
    const delayDebounceFn = setTimeout(() => {
      setContent({
        ...content,
        [selectedTab]: template,
      });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [template]);

  // useEffect(() => {
  //   setFieldValue && setFieldValue("language", selectedTab);
  //   setLabel(label || values?.title?.[selectedTab] || values?.title?.EN);
  // }, [selectedTab]);

  useEffect(() => {
    setFieldValue("contentBody", label);
    setTitle({
      ...title,
      [selectedTab]: label,
    });
  }, [label]);
  return (
    <>
      <Row className="mt-3">
        <Col>
          <Col>
            {!isBlog && (
              <Col xs={12} md={6} className="mb-3">
                <BForm.Label>
                  {t("inputField.title.label")}{" "}
                  <span className="text-danger">* </span>
                </BForm.Label>
                <BForm.Control
                  type="text"
                  name="title"
                  disabled={details}
                  placeholder="Enter Title"
                  value={label}
                  onChange={(e) => {
                    setLabel(e.target.value);
                    handleChange(e);
                    setTitleErr("");
                  }}
                  onBlur={handleBlur}
                />

                {titleErr ? (
                  <Row>
                    <span className="text-danger">{titleErr}</span>
                  </Row>
                ) : (
                  <ErrorMessage
                    component="div"
                    name="title"
                    className="text-danger"
                  />
                )}
              </Col>
            )}
          </Col>
        </Col>
      </Row>
        <Row>
          <Col>
            <div className="d-flex mb-2 align-items-center">
              <BForm.Label>
                {t("HTML Content (Use % for image width and height)")}
                <span className="text-danger">*</span>
              </BForm.Label>
              <Col />
              {/* {initValues.cmsType != 3 && <Col className='d-flex justify-content-end align-items-center'>

              {!details &&
                <Dropdown className=' d-inline mx-2'>
                  <Dropdown.Toggle id='dropdown-autoclose-outside'>
                    {t('dynamicKeys')}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className=' user-dropdown'>
                    {cmsKeys?.dynamicKeys?.map?.((item, index) => {
                      return (
                        <Dropdown.Item
                          key={index}
                          onClick={() => showDynamicKeys(item)}
                        >
                          {`${item} `}
                          {item.required ? t('required') : t('optional')}
                        </Dropdown.Item>
                      )
                    })}
                  </Dropdown.Menu>
                </Dropdown>}
            </Col>} */}
            </div>

            <CodepenEditor
              dynamicData={JSON.stringify(requiredKeyData, null, 2)}
              HTML={content?.[selectedTab] || values?.htmlContent || ""}
              initial="HTML"
              mobileQuery={800}
              height="80vh"
              setTemplate={setTemplate}
              themeTransitionSpeed={150}
              setRequiredKeyData={setRequiredKeyData}
              selectedTab={selectedTab}
              setTemp={setTemplate}
              details={details}
            />

            <ErrorMessage
              component="div"
              name="contentBody"
              className="text-danger"
            />
          </Col>
        </Row>
      {err && (
        <Row>
          <span className="text-danger">{err}</span>
        </Row>
      )}
      <Row>
        <Col className="d-flex justify-content-between">
          <Button
            variant="warning"
            className="m-2"
            onClick={() => navigate(AdminRoutes.GamePages)}
          >
            {t("cancelButton")}
          </Button>

          <div>
            <Button
              variant="success"
              hidden={
                details ||
                (create && values?.content?.[selectedTab] !== undefined)
              }
              onClick={blogSubmitButtonClick}
              className="m-2"
              disabled={loading || content?.[selectedTab] === ""}
            >
              {t("submitButton")}

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
          </div>
        </Col>
      </Row>
    </>
  );
};

export default EditGameTemplate;
