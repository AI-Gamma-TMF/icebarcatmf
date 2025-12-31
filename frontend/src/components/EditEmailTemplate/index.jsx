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
import { toast } from "../Toast";

const EditEmailTemplate = ({
  values,
  // cmsKeys,
  setFieldValue,
  handleChange,
  handleBlur,
  selectedTab,
  navigate,
  create = false,
  handleSubmit,
  details = false,
  initValues = false,
  title,
  setTitle,
  Subject,
  setSubject,
  content,
  setContent,
  loading,
  selectedOptions,
}) => {
  const { t } = useTranslation(["cms"]);
  const [template, setTemplate] = useState("");
  const [titleErr, setTitleErr] = useState("");
  const [err, setErr] = useState("");
  // const [label, setLabel] = useState("");
  // const [showSubject, setShowSubject] = useState("");
  const [SUbjectErr, setSubjectErr] = useState("");
  const [requiredKeyData, setRequiredKeyData] = useState({});

  
  
  const onSubmitButtonClick = () => {
    const errors = []
  
    // Trim values to ensure no trailing spaces
    const trimmedTemplate = template.trim()
    const trimmedSubject = Subject.trim()
    const trimmedTitle = title.trim()
  
    // Validation checks
    if (!trimmedTemplate) {
      errors.push({
        field: 'template',
        message: t('inputField.content.errors.required'),
        toastMessage: t('inputField.content.errors.requiredToast'),
      })
    }
    if (!trimmedSubject) {
      errors.push({
        field: 'subject',
        message: 'Subject is required',
        toastMessage: 'Subject is Required',
      })
    }
    if (!trimmedTitle) {
      errors.push({
        field: 'title',
        message: 'Title is required',
        toastMessage: 'Title is Required',
      })
    }
  
    // Handle errors
    if (errors.length > 0) {
      errors.forEach((error) => {
        if (error.field === 'template') setErr(error.message)
        if (error.field === 'subject') setSubjectErr(error.message)
        if (error.field === 'title') setTitleErr(error.message)
        toast(error.toastMessage, 'error')
      })
      return
    }
  
    // Extract placeholders from the template
    const placeholders =
      trimmedTemplate.match(/{{(.*?)}}/g)?.map((match) => match.slice(2, -2).trim()) || []
  
    // Check for missing or extra keys
    const missingWords = selectedOptions.filter((word) => !placeholders.includes(word))
    const extraWords = placeholders.filter((word) => !selectedOptions.includes(word))
  
    if (missingWords.length > 0) {
      const message = `Template is missing required keys: ${missingWords.join(', ')}`
      setErr(message)
      toast(message, 'error')
      return
    }
  
    if (extraWords.length > 0) {
      const message = `Template contains invalid keys in {{}}: ${extraWords.join(', ')}`
      setErr(message)
      toast(message, 'error')
      return
    }
  
    // Set form values and handle submission
    setFieldValue('content', trimmedTemplate)
    setFieldValue('title', trimmedTitle)
    setFieldValue('Subject', trimmedSubject)
    handleSubmit()
  
    
  
    setErr('')
  }
  
  
  useEffect(() => {
    if (template) {
      setErr("");
    }
    const delayDebounceFn = setTimeout(() => {
      setContent(template);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [template]);

  
  return (
    <>
      <Row className="mt-3">
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
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              handleChange(e);
              setTitleErr("");
            }}
            onBlur={handleBlur}
            onPaste={(e) => {
              e.preventDefault();
            }}
            onKeyDown={(evt) => {
              if (["'", '"'].includes(evt.key)) {
                evt.preventDefault(); 
              }
            }}
            autoComplete="off"
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
        <Col xs={12} md={6} className="mb-3">
          <BForm.Label>
            {"Subject"} <span className="text-danger">* </span>
          </BForm.Label>
          <BForm.Control
            type="text"
            name="Subject"
            disabled={details}
            placeholder="Enter Subject"
            value={Subject}
            onChange={(e) => {
              setSubject(e.target.value);
              handleChange(e);
              setSubjectErr("");
            }}
            onBlur={handleBlur}
            onPaste={(e) => {
              e.preventDefault();
            }}
            onKeyDown={(evt) => {
              if (["'", '"'].includes(evt.key)) {
                evt.preventDefault(); 
              }
            }}
              autoComplete="off"
          />
          {SUbjectErr ? (
            <Row>
              <span className="text-danger">{SUbjectErr}</span>
            </Row>
          ) : (
            <ErrorMessage
              component="div"
              name="title"
              className="text-danger"
            />
          )}
        </Col>
      </Row>
      {initValues.cmsType != 2 && (
        <Row>
          <Col>
            <div className="d-flex mb-2 align-items-center">
              <BForm.Label>
                {t("inputField.content.label")}{" "}
                <span className="text-danger">*</span>
              </BForm.Label>
              <Col />
            </div>

            <CodepenEditor
              dynamicData={JSON.stringify(requiredKeyData, null, 2)}
              HTML={content || ""}
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
              name="content"
              className="text-danger"
            />
          </Col>
        </Row>
      )}
      {err && (
        <Row>
          <span className="text-danger">{err}</span>
        </Row>
      )}
      <Row>
        <Col className="edit-email-template__actions d-flex justify-content-between">
          <Button
            variant="warning"
            className="m-2 edit-email-template__btn"
            onClick={() => navigate(AdminRoutes.EmailCenter)}
          >
            Cancel
          </Button>

          <div>
            <Button
              variant="success"
              hidden={
                details ||
                (create && values?.content?.[selectedTab] !== undefined)
              }
              onClick={onSubmitButtonClick}
              className="m-2 edit-email-template__btn"
              disabled={loading || content?.[selectedTab] === ""}
            >
            Submit

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

export default EditEmailTemplate;
