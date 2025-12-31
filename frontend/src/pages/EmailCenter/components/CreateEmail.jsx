import React, { useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";

import { Formik, Form } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Card,
  Button,
} from "@themesberg/react-bootstrap";
import EditEmailTemplate from "../../../components/EditEmailTemplate";
import useCreateTemplate from "../hooks/useCreateEmail";
import useTemplateListing from "../hooks/useTemplateListing";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { AdminRoutes } from "../../../routes";
import "./createEmail.scss";

const CreateEmail = ({ tempdata, _editfetch }) => {
  const navigate = useNavigate();
  const editdata = tempdata?.rows[0];
  const { createTemplate, createloading, editTemplate } =
    useCreateTemplate();
  const [title, setTitle] = useState("");
  const [Subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editdata) {
      setTitle(editdata?.templateName);
      setSubject(editdata?.subjectName);
      setContent(editdata?.contentHtml);
      setSelectedOptions(editdata?.dynamicFields);
      setTemplateType(editdata?.templateType);
    }
  }, [editdata]);

  const { keyData, templateType, setTemplateType } =
    useTemplateListing({
    isListingPage: false,
    isCreatePage:true
  
  });

  // const dynamicFields = editdata?.dynamicFields;

  const [selectedOptions, setSelectedOptions] = useState([]);

  const dropdownData = keyData?.dynamicEmailValues || {};

  // const options = Object.entries(dropdownData).map(([key, value]) => ({
  //   id: key,
  //   label: value,
  // }));

  // const handleCheckboxChange = (option) => {
  //   setSelectedOptions(
  //     (prev) =>
  //       prev.includes(option.id)
  //         ? prev.filter((id) => id !== option.id) // Uncheck
  //         : [...prev, option.id] // Check
  //   );
  // };
  // const handleCheckboxchange = (selected) => {
  //   setSelectedOptions(selected || []); // Update state, or reset to empty array if nothing is selected
  // };
  const options = Object.keys(dropdownData).map((key) => ({
    value: key,
    label: key,
  }));

  const handleSelectionChange = (selected) => {
    const selectedValues = selected
      ? selected.map((option) => option.value)
      : [];
    setSelectedOptions(selectedValues); // Store only the keys
  };
  // const handleEmailTemplateTypeChange = (selectedOption) => {
  //   setTemplateType(selectedOption);
  // };

  const selectStyles = {
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 99999,
    }),
  };
  return (
    <div className="dashboard-typography create-email-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="create-email-page__title">
            {tempdata ? "Edit Email Template" : "Create Email Template"}
          </h3>
          <p className="create-email-page__subtitle">
            Build the template content and validate selected dynamic keys
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(AdminRoutes.EmailCenter)}
          >
            Back
          </Button>
        </div>
      </div>
        {/* <Col className="col-2 text-end">
          <Button
            variant="success"
            className="f-right"
            size="sm"
            style={{ height: "40px", width: "100px" }}
            onClick={() => navigate(AdminRoutes.EmailSend)}
            hidden={isHidden({ module: { key: "CMS", value: "C" } })}
          >
            Test
          </Button>
        </Col> */}

      <Card className="dashboard-filters create-email-page__card mb-4">
        <Card.Body>
          <Row className="g-3 align-items-start">
            <Col xs={12} md={6} lg={4}>
              <BForm.Label>Email Template Type</BForm.Label>
              <Select
                classNamePrefix="email-create-select"
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
                options={[
                  { label: "Default", value: null },
                  { label: "Free Spin", value: "freeSpin" },
                ]}
                onChange={(selectedOption) =>
                  setTemplateType(selectedOption?.value ?? null)
                }
                value={
                  templateType !== null
                    ? { label: "Free Spin", value: "freeSpin" }
                    : { label: "Default", value: null }
                }
                placeholder="Select Template Type"
                isClearable
                styles={selectStyles}
              />
            </Col>
            <Col xs={12} md={6} lg={8}>
              <BForm.Label>
                Select Dynamic Keys{" "}
                <span className="create-email-page__hint">
                  {"(Put dynamic keys in {{}}*)"}
                </span>
              </BForm.Label>
              <Select
                classNamePrefix="email-create-select"
                menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                menuPosition="fixed"
                closeMenuOnSelect={false}
                components={makeAnimated()}
                isMulti
                options={options}
                onChange={handleSelectionChange}
                value={options.filter((option) =>
                  selectedOptions.includes(option.value)
                )}
                placeholder="Select Dynamic Keys"
                isClearable
                styles={selectStyles}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Formik
        initialValues={{
          templateName: editdata ? editdata?.templateName : "",
          subjectName: editdata ? editdata?.subjectName : "",
          contentHtml: editdata ? editdata?.contentHtml : "",
          dynamicFields: editdata ? editdata?.dynamicFields : [],
          templateType: editdata ? editdata?.templateType : null,
        }}
        // validationSchema={createEmailSchema(selectedOptions)}
        onSubmit={(_formValues) => {
          {
            tempdata
              ? editTemplate({
                  emailTemplateId: editdata?.emailTemplateId,
                  templateName: title,
                  subjectName: Subject,
                  contentHtml: content,
                  dynamicFields: selectedOptions,
                  templateType: templateType,
                })
              : createTemplate({
                  templateName: title,
                  subjectName: Subject,
                  contentHtml: content,
                  dynamicFields: selectedOptions,
                  templateType: templateType,
                });
          }
        }}
      >
        {({
          values,
          errors,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
        }) => (
          <Form>
            <Card className="dashboard-filters create-email-page__card">
              <Card.Body>
                <EditEmailTemplate
                  selectedOptions={selectedOptions}
                  values={values}
                  setFieldValue={setFieldValue}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  handleSubmit={handleSubmit}
                  navigate={navigate}
                  initValues={values}
                  errors={errors}
                  title={title}
                  setTitle={setTitle}
                  Subject={Subject}
                  setSubject={setSubject}
                  content={content}
                  setContent={setContent}
                  loading={createloading}
                />
              </Card.Body>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateEmail;
