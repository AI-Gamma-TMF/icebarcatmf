import React, { useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";

import { Formik, Form } from "formik";
import {
  Col,
  Row,
  Form as BForm} from "@themesberg/react-bootstrap";
import EditEmailTemplate from "../../../components/EditEmailTemplate";
import useCreateTemplate from "../hooks/useCreateEmail";
import useTemplateListing from "../hooks/useTemplateListing";
import "./DropdownStyles.scss";
import Select from "react-select";
import makeAnimated from "react-select/animated";

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

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "500px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 999,
    }),
  };
  return (
    <>
      <Row className="">
        <Col>
          <h3>{tempdata ? "Edit Email Template" : "Create Email Template"} </h3>
        </Col>
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
      </Row>

      <Row className="mt-4">
        <Col>
          <div>
            <BForm.Label className="w-50">Email Template Type</BForm.Label>
            <Select
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
              styles={customStyles}
            />
          </div>
        </Col>
        <Col>
          <div>
            <BForm.Label className="w-50">
              Select Dynamic Keys <span>{`(Put dynamic keys in {{}}*)`}</span>
            </BForm.Label>
            <Select
              closeMenuOnSelect={false}
              components={makeAnimated()}
              isMulti
              options={options}
              onChange={handleSelectionChange}
              value={options.filter((option) =>
                selectedOptions.includes(option.value)
              )}
              placeholder={`Select Dynamic Keys`}
              isClearable
              styles={customStyles}
            />
          </div>
        </Col>
        
      </Row>

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
            <Row className="mb-3 align-items-center justify-content-between"></Row>

            <div className="mt-5">
              <EditEmailTemplate
                selectedOptions={selectedOptions}
                values={values}
                setFieldValue={setFieldValue}
                handleChange={handleChange}
                handleBlur={handleBlur}
                // setTemp={setTemplate}
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
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateEmail;
