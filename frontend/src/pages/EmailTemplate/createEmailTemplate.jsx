import React, { useEffect, useState } from "react";
import {
    Col,
    Row,
    Form as BForm,
    Button,
    Dropdown,
    Tabs,
    Tab
  } from '@themesberg/react-bootstrap'
import { Formik, Form, ErrorMessage } from 'formik'
import useCreateEmailTemplate from './hooks/useCreateEmailTemplate'
import Datetime from 'react-datetime'
import CodepenEditor from '../../components/CodeEditor'
import { AdminRoutes } from '../../routes'
import { getDateTimeByYMD , formatDateYMD } from '../../utils/dateFormatter'
import { createEmailTemplateSchema } from './schema'
import Trigger from '../../components/OverlayTrigger'
import { faImages } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GalleryModal } from '../../components/ConfirmationModal'

const CreateEmailTemplate = ({ emailData }) => {
  const selectedTab = emailData
    ? Object.keys(emailData?.templateCode)[0]
    : "EN";

  const {
    t,
    isHidden,
    galleryModal,
    setGalleryModal,
    dynamicEmailKey,
    createEmailTemplateData,
    updateManualEmailTemplate,
    emailCategory,
    navigate,
    template,
    setTemplate,
  } = useCreateEmailTemplate(emailData?.templateCode, selectedTab);

  const content = emailData ? emailData?.templateCode : { EN: "" };
  const [requiredKeyData, setRequiredKeyData] = useState({});
  const [dynamicEmailKeyData, setDynamicEmailKeyData] = useState({});
  const [err, setErr] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const categoryChangeHandler = (e, handleChange) => {
    const index = e.nativeEvent.target.selectedIndex;
    setCategoryName(e.nativeEvent.target[index].text);
    handleChange(e);
  };

  useEffect(() => {
    dynamicEmailKey &&
      setDynamicEmailKeyData(
        dynamicEmailKey.EmailTemplate.filter(
          (item) => item.name === categoryName
        )[0]
      );
  }, [categoryName]);

  useEffect(() => {
    setDynamicEmailKeyData({
      name: "manual",
      required: emailData?.dynamicData,
      optional: [],
    });
  }, [emailData]);

  const showDynamicKeys = (e, item) => {
    requiredKeyData
      ? setRequiredKeyData({
          ...requiredKeyData,
          [item]: dynamicEmailKey?.keyDescription[item],
        })
      : setRequiredKeyData({
          [item]: dynamicEmailKey?.keyDescription[item],
        });
  };

  const onSubmitButtonClick = (setFieldValue, handleSubmit) => {
    if (template === "") {
      setErr("Content required");
    } else {
      handleSubmit();
      setErr("");
    }
  };

  return (
    <>
      <Row>
        <Col sm={8}>
          <h3>
            {!emailData
              ? t("createTemplate.title")
              : t("createTemplate.edit_title")}
          </h3>
        </Col>
        <Col className="d-flex justify-content-end align-items-center">
          <Trigger message="Gallery" id={"gallery"} />
          <Button
            id={"gallery"}
            hidden={isHidden({ module: { key: "ImageGallery", value: "R" } })}
            onClick={() => setGalleryModal(true)}
            variant="secondary"
          >
            <FontAwesomeIcon icon={faImages} />
          </Button>
        </Col>
      </Row>

      <Formik
        initialValues={{
          subject: emailData ? emailData?.label : "",
          language: selectedTab,
          templateEmailCategoryId: emailData
            ? emailData?.templateEmailCategoryId
            : "",
          scheduledAt: emailData ? new Date(emailData?.scheduledAt) : "",
        }}
        validationSchema={createEmailTemplateSchema(t)}
        onSubmit={(formValues, { resetForm }) => {
          let reqDynamicData = [];
          if (dynamicEmailKeyData) {
            if (dynamicEmailKeyData?.required)
              reqDynamicData = [...dynamicEmailKeyData.required];
            if (dynamicEmailKeyData?.optional)
              reqDynamicData = [
                ...reqDynamicData,
                ...dynamicEmailKeyData.optional,
              ];
          }
          emailData
            ? updateManualEmailTemplate({
                emailtemplateData: {
                  ...formValues,
                  emailTemplateId: +emailData?.emailTemplateId,
                  templateEmailCategoryId: +formValues.templateEmailCategoryId,
                  scheduledAt: getDateTimeByYMD(formValues?.scheduledAt),
                  templateCode: template || "",
                  dynamicData: dynamicEmailKeyData?.name ? reqDynamicData : [],
                },
              })
            : createEmailTemplateData({
                emailtemplateData: {
                  ...formValues,
                  templateEmailCategoryId: +formValues.templateEmailCategoryId,
                  scheduledAt: formValues?.scheduledAt,
                  templateCode: template || "",
                  dynamicData: dynamicEmailKeyData?.name ? reqDynamicData : [],
                },
              });
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
          <Form>
            <Row className="mb-3 align-items-center">
              <Col lg={4} md={6} sm={12}>
                <BForm.Label>
                  {t("createTemplate.subject")}{" "}
                  <span className="text-danger">*</span>
                </BForm.Label>

                <BForm.Control
                  type="text"
                  name="subject"
                  placeholder={t("createTemplate.subjectPlace")}
                  value={values.subject}
                  // disabled={details}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="subject"
                  className="text-danger"
                />
              </Col>

              <Col lg={4} md={6} sm={12}>
                <BForm.Label>
                  {t("createTemplate.emailCategory")}{" "}
                  <span className="text-danger">*</span>
                </BForm.Label>

                <BForm.Select
                  type="text"
                  name="templateEmailCategoryId"
                  size="sm"
                  className="w-100 cus-form-select"
                  value={values.templateEmailCategoryId}
                  onChange={(e) => {
                    categoryChangeHandler(e, handleChange);
                  }}
                  onBlur={handleBlur}
                >
                  <option value={""}>
                    {t("createTemplate.defaultCategoryOption")}
                  </option>
                  {emailCategory?.emailCategory?.map((item) => {
                    return (
                      <option
                        key={item.templateCategoryId}
                        value={item.templateCategoryId}
                      >
                        {item?.name?.EN}
                      </option>
                    );
                  })}
                </BForm.Select>

                <ErrorMessage
                  component="div"
                  name="templateEmailCategoryId"
                  className="text-danger"
                />
              </Col>
              <Col lg={4} md={6} sm={12}>
                <BForm.Label>
                  {t("createTemplate.scheduleTime")}{" "}
                  <span className="text-danger">*</span>
                </BForm.Label>
                <Datetime
                  inputProps={{
                    placeholder: t("createTemplate.timePlace"),
                    readOnly: true,
                  }}
                  dateFormat="YYYY-MM-DD"
                  onChange={(e) => {
                    setFieldValue("scheduledAt", getDateTimeByYMD(e._d));
                  }}
                  value={values.scheduledAt}
                  isValidDate={(e) => {
                    return (
                      e._d > new Date() ||
                      formatDateYMD(e._d) === formatDateYMD(new Date())
                    );
                  }}
                />
                <ErrorMessage
                  component="div"
                  name="scheduledAt"
                  className="text-danger"
                />
              </Col>
            </Row>
            {/* tabs will be increased in case of multilanguage */}
            <Row className="mb-3 align-items-center">
              <Col>
                <Tabs activeKey={selectedTab} className="nav-light mt-3">
                  <Tab
                    eventKey="EN"
                    title="EN"
                    mountOnEnter
                    tabClassName={"tab-active"}
                  >
                    <div className="mt-5">
                      <Row>
                        <Col>
                          <div className="d-flex mb-2 align-items-center">
                            <BForm.Label>
                              {t("createTemplate.content")}{" "}
                              <span className="text-danger">*</span>
                            </BForm.Label>
                            <Col />
                            <Col className="d-flex justify-content-end align-items-center">
                              <Dropdown className=" d-inline mx-2">
                                <Dropdown.Toggle id="dropdown-autoclose-outside">
                                  {t("createTemplate.dynamicKeys")}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className=" user-dropdown">
                                  {dynamicEmailKeyData?.required?.map?.(
                                    (item, index) => {
                                      return (
                                        <Dropdown.Item
                                          key={index}
                                          onClick={(e) =>
                                            showDynamicKeys(e, item)
                                          }
                                        >
                                          {`${item} `}
                                          {t("editTemplate.required")}
                                        </Dropdown.Item>
                                      );
                                    }
                                  )}
                                  {dynamicEmailKeyData?.optional?.map?.(
                                    (item, index) => {
                                      return (
                                        <Dropdown.Item
                                          key={index}
                                          onClick={(item) =>
                                            showDynamicKeys(item)
                                          }
                                        >
                                          {`${item} `}
                                          {t("editTemplate.optional")}
                                        </Dropdown.Item>
                                      );
                                    }
                                  )}
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>
                          </div>

                          <CodepenEditor
                            dynamicData={JSON.stringify(
                              requiredKeyData,
                              null,
                              2
                            )}
                            HTML={content?.[selectedTab] || ""}
                            initial="HTML"
                            mobileQuery={800}
                            height="80vh"
                            setTemplate={setTemplate}
                            themeTransitionSpeed={150}
                            setRequiredKeyData={setRequiredKeyData}
                            selectedTab={selectedTab}
                            setErr={setErr}
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
                            onClick={() => navigate(AdminRoutes.EmailTemplates)}
                          >
                            {t("createTemplate.cancel")}
                          </Button>

                          <div>
                            <Button
                              variant="success"
                              onClick={() =>
                                onSubmitButtonClick(setFieldValue, handleSubmit)
                              }
                              className="m-2"
                            >
                              {t("createTemplate.submit")}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                </Tabs>
                {galleryModal && (
                  <GalleryModal
                    galleryModal={galleryModal}
                    setGalleryModal={setGalleryModal}
                  />
                )}
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateEmailTemplate;
