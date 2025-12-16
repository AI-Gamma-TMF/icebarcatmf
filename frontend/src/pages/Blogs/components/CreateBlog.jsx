import React, { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Tabs,
  Tab,
} from "@themesberg/react-bootstrap";
import useCreateBlog from "../hooks/useCreateBlog";
import Select from "react-select";
import { blogValidationSchema } from "../schema";
import EditBlogTemplate from "../../../components/EditBlogTemplate";

const CreateBlog = ({ blogData, details }) => {
  const {
    navigate,
    createBlog,
    editBlog,
    blogId,
    setTemplate,
    selectedTab,
    t,
    loading,
    gamePagesList,
  } = useCreateBlog(blogData);
  // const { isHidden } = useCheckPermission();
  const [title, setTitle] = useState(blogData ? blogData?.title : "");
  const [content, setContent] = useState(blogData ? blogData?.contentBody : "");
  // const [image, setImage] = useState(null);
  // const [mobileDimension, setMobileDimension] = useState(false);
  const [desktopDimension, setDesktopDimension] = useState(false);
  const [gamePageList, setGamePagesList] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (gamePagesList) {
      const mappedData = gamePagesList?.map((game) => ({
        label: game?.title,
        value: game?.gamePageId,
      }));
      setGamePagesList(mappedData);
    }
  }, [gamePagesList]);

  useEffect(() => {
    if (blogData?.gamePages) {
      const existingGamePages = blogData?.gamePages?.map((game) => ({
        label: game?.title,
        value: game?.gamePageId,
      }));

      console.log(existingGamePages);
      setGames(existingGamePages);
    }
  }, [blogData]);

  const handleGameChange = (selected) => {
    setGames(selected);
  };

  const handleFileChange = (event, setFieldValue, field) => {
    const file = event.target.files[0];
    // setImage(file);

    // Validate file dimensions
    validateFileDimensions(file, field);

    // Optionally, you can update form field value
    setFieldValue(field, file);
  };

  const validateFileDimensions = (file, field) => {
    if (file && field === "mobileImage") {
      const img = new Image();
      img.onload = function () {
        if (img.width === 1200 && img.height === 300) {
          // setMobileDimension(true);
          // alert('Image dimensions must be less than or equal to 100x100 pixels.');
          // Clear the file input
          // setImage(null);
        } else {
          // setMobileDimension(false);
        }
      };
      img.src = URL.createObjectURL(file);
    } else {
      const img = new Image();
      img.onload = function () {
        if (img.width === 1013 && img.height === 593) {
          setDesktopDimension(false);
          // setImage(null);
        } else {
          setDesktopDimension(true);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const type = "CREATE";
  return (
    <>
      <Row className="w-100 m-auto">
        <Col xs={9}>
          <h3>
            {blogData
              ? `${!details ? "Edit Blog" : "View Blog"} ${blogData?.metaTitle}`
              : "Create Blog"}
          </h3>
        </Col>
      </Row>

      <Formik
        enableReinitialize={true}
        initialValues={{
          metaTitle: blogData?.metaTitle || "",
          metaDescription: blogData?.metaDescription || "",
          slug: blogData?.slug || "",
          schema: blogData?.schema || "",
          postHeading: blogData?.postHeading || "",
          bannerImageUrl: blogData?.bannerImageUrl || null,
          bannerImageAlt: blogData?.bannerImageAlt || "",
          contentBody: blogData?.contentBody || "",
          isActive: blogData?.isActive || false,
          isPopularBlog: blogData?.isPopularBlog || false,
          //   seoKeywords: "",
        }}
        validationSchema={blogValidationSchema}
        onSubmit={(formValues) => {
          formValues.contentBody = content?.EN;
          formValues.gamePageIds = games?.map((game) => game.value);
          console.log(formValues);

          !blogData
            ? createBlog({
                blogData: {
                  ...formValues,
                },
              })
            : editBlog({
                blogData: {
                  ...formValues,
                  blogPostId: parseInt(blogId),
                },
              });
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
            <Row className="mb-3 align-items-center">
              <Col xs="12" sm="6" lg="3">
                <BForm.Label>
                  {t("inputField.title.label")}{" "}
                  <span className="text-danger">*</span>
                </BForm.Label>
                <BForm.Control
                  type="text"
                  name="metaTitle"
                  value={values.metaTitle}
                  placeholder="Enter title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={details}
                  //   disabled="true"
                />
                <ErrorMessage
                  component="div"
                  name="metaTitle"
                  className="text-danger"
                />
              </Col>
              <Col xs="12" sm="6" lg="3">
                <BForm.Label>
                  {t("inputField.description.label")}{" "}
                  <span className="text-danger">*</span>
                </BForm.Label>
                <BForm.Control
                  type="text"
                  name="metaDescription"
                  value={values.metaDescription}
                  placeholder="Enter Description"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={details}
                  //   disabled="true"
                />
                <ErrorMessage
                  component="div"
                  name="metaDescription"
                  className="text-danger"
                />
              </Col>
              <Col xs="12" sm="6" lg="3">
                <BForm.Label>
                  {t("inputField.url.label")}{" "}
                  <span className="text-danger">*</span>
                </BForm.Label>
                <BForm.Control
                  type="text"
                  name="slug"
                  value={values.slug}
                  placeholder="Enter url"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={details}
                  //   disabled="true"
                />
                <ErrorMessage
                  component="div"
                  name="slug"
                  className="text-danger"
                />
              </Col>

              <Col xs="12" sm="6" lg="3">
                <BForm.Label>
                  {t("inputField.blogHeading.label")}{" "}
                  <span className="text-danger">*</span>
                </BForm.Label>
                <BForm.Control
                  type="text"
                  name="postHeading"
                  value={values.postHeading}
                  placeholder="Enter Heading"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  //   disabled="true"
                  readOnly={details}
                />
                <ErrorMessage
                  component="div"
                  name="postHeading"
                  className="text-danger"
                />
              </Col>
            </Row>
            <Row className="mb-3 align-items-center">
              <Col>
                <BForm.Label>
                  Banner Image
                  <span className="text-danger">*</span>
                </BForm.Label>
                <div className="custom-file-upload-wrap-blog">
                  {!errors?.bannerImageUrl &&
                    (type ? (
                      values?.bannerImageUrl && (
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
                                values?.bannerImageUrl instanceof File
                                  ? URL.createObjectURL(values.bannerImageUrl)
                                  : values.bannerImageUrl // fallback to existing image URL
                              }
                            />
                          </div>
                        </Row>
                      )
                    ) : (
                      <Row className="text-center">
                        <Col>
                          <img
                            alt="not found"
                            style={{
                              maxWidth: "200px",
                              maxHeight: "200px",
                              marginLeft: "0",
                            }}
                            src={
                              values?.bannerImageUrl instanceof File
                                ? URL.createObjectURL(values.bannerImageUrl)
                                : values.bannerImageUrl // fallback to existing image URL
                            }
                          />
                        </Col>
                      </Row>
                    ))}
                  <div className="custom-file-upload-button">
                    <BForm.Control
                      type="file"
                      name="bannerImageUrl"
                      onChange={(event) => {
                        handleFileChange(
                          event,
                          setFieldValue,
                          "bannerImageUrl"
                        );
                        // const file = event.target.files[0];
                        // setFieldValue("bannerImageUrl", file);
                      }}
                      onBlur={handleBlur}
                    />

                    <Button>File Upload</Button>
                  </div>
                </div>
                {desktopDimension ? (
                  <small style={{ color: "red" }}>
                    Image dimensions must be equal to 1013*593 pixels.
                  </small>
                ) : (
                  <>
                    {" "}
                    <ErrorMessage
                      component="div"
                      name="bannerImageUrl"
                      className="text-danger"
                    />
                  </>
                )}
              </Col>
              <Col xs="12" sm="6" lg="3">
                <BForm.Label>
                  {t("inputField.altDescription.label")}{" "}
                  <span className="text-danger">*</span>
                </BForm.Label>
                <BForm.Control
                  type="text"
                  name="bannerImageAlt"
                  value={values.bannerImageAlt}
                  placeholder="Enter Alt Content"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={details}

                  //   disabled="true"
                />
                <ErrorMessage
                  component="div"
                  name="bannerImageAlt"
                  className="text-danger"
                />
              </Col>
              <Col>
                <Col md={3}>
                  <BForm.Label>
                    {t("inputField.isActive.label")}{" "}
                    <span className="text-danger">*</span>
                  </BForm.Label>
                </Col>
                <Col>
                  <BForm.Check
                    type="switch"
                    name="isActive"
                    disabled={details}
                    // defaultChecked={values.isActive}
                    checked={values.isActive}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Col>
              </Col>

              <Col md={3}>
                <Col>
                  <BForm.Label>
                    {t("inputField.isPopular.label")}{" "}
                    <span className="text-danger">*</span>
                  </BForm.Label>
                </Col>
                <Col>
                  <BForm.Check
                    type="switch"
                    name="isPopularBlog"
                    disabled={details}
                    // defaultChecked={values.isPopularBlog}
                    checked={values.isPopularBlog}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Col>
              </Col>
            </Row>

            <Row>
              <Col className="my-2">
                <BForm.Label>
                  {t("Dynamic Schema")} <span className="text-danger">*</span>
                </BForm.Label>
                <BForm.Control
                  as="textarea"
                  rows={8} // increase height
                  style={{ width: "100%", resize: "vertical" }} // reduce width and allow vertical resizing
                  name="schema"
                  value={values.schema}
                  placeholder="Add Schema"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={details}
                />
                <ErrorMessage
                  component="div"
                  name="schema"
                  className="text-danger"
                />
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <div className="mb-3">
                  <BForm.Label>
                    {t("Related Games")} <span className="text-danger">*</span>
                  </BForm.Label>
                  <Select
                    options={gamePageList}
                    isMulti
                    value={games}
                    onChange={handleGameChange}
                    placeholder="Select Related Game Pages"
                    classNamePrefix="react-select"
                    className="react-select-container rounded border"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
                        boxShadow: state.isFocused
                          ? "0 0 0 0.25rem rgba(13,110,253,.25)"
                          : "none",
                        borderRadius: "0.375rem", // rounded corners
                        minHeight: "42px",
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#e9ecef",
                        borderRadius: "2px",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        fontSize: "0.85rem",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        fontSize: "0.9rem",
                        color: "#6c757d",
                      }),
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Tabs activeKey={selectedTab} className="nav-light mt-3">
              <Tab
                eventKey="EN"
                title="EN"
                mountOnEnter
                tabClassName={"tab-active"}
              >
                <div className="mt-5">
                  <EditBlogTemplate
                    values={blogData}
                    setFieldValue={setFieldValue}
                    selectedTab={selectedTab}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setTemp={setTemplate}
                    handleSubmit={handleSubmit}
                    navigate={navigate}
                    details={details}
                    initValues={values}
                    errors={errors}
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                    loading={loading}
                    isBlog={true}
                    desktopDimension={desktopDimension}
                  />
                </div>
              </Tab>
            </Tabs>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateBlog;
