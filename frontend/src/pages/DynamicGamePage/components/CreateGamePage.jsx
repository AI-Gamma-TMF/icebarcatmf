import React, { useEffect, useState } from "react";
import { Formik, Form, FieldArray, Field, ErrorMessage } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Tabs,
  Tab,
} from "@themesberg/react-bootstrap";
import useCreateGamePage from "../hooks/useCreateGamePage";
import EditGameTemplate from "../../../components/EditGameTemplate";
import { gamePageValidationSchema } from "../schema";

const CreateGamePage = ({ gamePageData, details }) => {
  const {
    navigate,
    updateGamePage,
    createGame,
    gamePageId,
    setTemplate,
    selectedTab,
    t,
    loading,
  } = useCreateGamePage(gamePageData);
  // const { isHidden } = useCheckPermission();
  const [title, setTitle] = useState(gamePageData ? gamePageData?.title : "");
  const [content, setContent] = useState(
    gamePageData ? gamePageData?.htmlContent : ""
  );
  // const [image, setImage] = useState(null);
  // const [mobileDimension, setMobileDimension] = useState(false);
  const [desktopDimension, setDesktopDimension] = useState(false);
  // const [isAddImageModal, setIsAddImageModal] = useState(false);
  // const [gameImages, setGameImages] = useState([]);
  

  const validateFileDimensions = (file, field) => {
    if (file && field === "mobileImage") {
      const img = new Image();
      img.onload = function () {
        if (img.width === 209 && img.height === 294) {
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
        if (img.width === 209 && img.height === 294) {
          setDesktopDimension(false);
          // setImage(null);
        } else {
          setDesktopDimension(true);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleFileChange = (event, setFieldValue, field) => {
    const file = event.target.files[0];
    // setImage(file);
    // Validate file dimensions
    validateFileDimensions(file, field);

    // Optionally, you can update form field value
    setFieldValue(field, file);
  };

  useEffect(() => {
    // setGameImages(gamePageData?.image);
  }, [gamePageData]);

  // const type = "CREATE";
  return (
    <>
      <Row className="w-100 m-auto">
        <Col xs={9}>
          <h3>
            {gamePageData
              ? `${!details ? "Edit Game Page : " : "View Game Page: "} ${
                  gamePageData?.title
                }`
              : "Create Game Page"}
          </h3>
        </Col>
      </Row>

      <Formik
        enableReinitialize={true}
        initialValues={{
          title: gamePageData?.title || "",
          metaTitle: gamePageData?.metaTitle || "",
          metaDescription: gamePageData?.metaDescription || "",
          heading: gamePageData?.heading || "",
          slug: gamePageData?.slug || "",
          htmlContent: gamePageData?.htmlContent || "",
          isActive: gamePageData?.isActive || false,
          schema: gamePageData?.schema || "",
          images:
            gamePageData?.image?.length > 0
              ? gamePageData?.image?.map((img) => ({
                  imageCaption: img.caption || "", // map to Formik field names
                  altText: img.altTag || "",
                  file: null,
                  imageUrl: img.imageUrl || "",
                }))
              : [{ imageCaption: "", altText: "", file: null }],
        }}
        validationSchema={gamePageValidationSchema}
        onSubmit={(formValues) => {
          // Optional image validation
          // if (gameImages.length === 0) {
          //   toast("Games Images are required", "error");
          //   return;
          // }

          // Extract and remove `images` from formValues
          const { images, ...rest } = formValues;

          // Build image-related fields
          const imageMeta = (images || [])
            .filter((img) => img && typeof img === "object")
            .map(({ imageCaption, altText, imageUrl }) => ({
              caption: imageCaption,
              altTag: altText,
              ...(imageUrl && { imageUrl: imageUrl }),
              ...(imageUrl && { isUpdateImage: true }),
            }));

          const image = (images || [])
            .filter((img) => img && typeof img === "object" && img.file != null)
            .map(({ file }) => file);

          const shouldUpdateImage =
            (!imageMeta || !imageMeta.some((meta) => meta?.imageUrl)) &&
            (!image || image.length === 0);

          // Build the final payload
          const payload = {
            ...rest,
            htmlContent: content?.EN,
            imageMeta,
            image,
            ...(shouldUpdateImage && { isClearImage: true }),
          };

          console.log("Final payload:", payload);

          // Submit
          !gamePageData
            ? createGame({
                gamePageData: payload,
              })
            : updateGamePage({
                gamePageData: {
                  ...payload,
                  gamePageId: parseInt(gamePageId),
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
                  name="title"
                  value={values.title}
                  placeholder="Enter title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={details}
                  //   disabled="true"
                />
                <ErrorMessage
                  component="div"
                  name="title"
                  className="text-danger"
                />
              </Col>
              <Col xs="12" sm="6" lg="3">
                <BForm.Label>
                  {t("Heading")} <span className="text-danger">*</span>
                </BForm.Label>
                <BForm.Control
                  type="text"
                  name="heading"
                  value={values.heading}
                  placeholder="Enter Heading"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  readOnly={details}
                  //   disabled="true"
                />
                <ErrorMessage
                  component="div"
                  name="heading"
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
              <Col>
                <Col>
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
            </Row>
            <Row className="mb-3 align-items-center">
              <Col xs="12" sm="6" lg="3">
                <BForm.Label>
                  {t("Meta Title")} <span className="text-danger">*</span>
                </BForm.Label>
                <BForm.Control
                  type="text"
                  name="metaTitle"
                  value={values.metaTitle}
                  placeholder="Enter Meta Title"
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
                  {t("Description")} <span className="text-danger">*</span>
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

            {/* Images Stepper Form */}

            <BForm.Label>
              {gamePageData
                ? `${
                    !details
                      ? "Edit Game Images (Keep the resolution at 209×294 pixels.)"
                      : "View Game Images"
                  }`
                : "Add Game Images (Keep the resolution at 209×294 pixels.)"}
              <span className="text-danger">*</span>
            </BForm.Label>

            <FieldArray name="images">
              {({ push, remove }) => (
                <>
                  {values.images.map((img, index) => (
                    <div key={index} className="mb-4 border rounded p-3">
                      <BForm.Group controlId={`images.${index}.imageCaption`}>
                        <BForm.Label>{t("Image Caption")}</BForm.Label>
                        <Field
                          name={`images.${index}.imageCaption`}
                          placeholder={t("Enter Caption")}
                          as={BForm.Control}
                          readOnly={details}
                        />
                        <div className="text-danger small mt-1">
                          <ErrorMessage name={`images.${index}.imageCaption`} />
                        </div>
                      </BForm.Group>

                      <BForm.Group
                        controlId={`images.${index}.altText`}
                        className="mt-3"
                      >
                        <BForm.Label>{t("Alt Text")}</BForm.Label>
                        <Field
                          name={`images.${index}.altText`}
                          placeholder={t("Enter Alt Text")}
                          as="textarea"
                          rows={2}
                          className="form-control"
                          readOnly={details}
                        />
                        <div className="text-danger small mt-1">
                          <ErrorMessage name={`images.${index}.altText`} />
                        </div>
                      </BForm.Group>

                      <BForm.Group
                        controlId={`images.${index}.file`}
                        className="mt-3"
                      >
                        <BForm.Label>{t("Image File")}</BForm.Label>
                        <input
                          type="file"
                          name={`images.${index}.file`}
                          className="form-control"
                          accept="image/*"
                          disabled={details || img.imageUrl}
                          onChange={(e) =>
                            handleFileChange(
                              e,
                              setFieldValue,
                              `images.${index}.file`
                            )
                          }
                        />

                        {desktopDimension ? (
                          <small style={{ color: "red" }}>
                            Image dimensions must be equal to 209*294 pixels.
                          </small>
                        ) : (
                          <div className="text-danger small mt-1">
                            <ErrorMessage name={`images.${index}.file`} />
                          </div>
                        )}
                      </BForm.Group>

                      {(img.file || img.imageUrl) && (
                        <div className="mt-3">
                          <BForm.Label>{t("Preview")}</BForm.Label>
                          <div
                            className="border p-2"
                            style={{ maxWidth: "200px" }}
                          >
                            <img
                              src={
                                img.file instanceof File
                                  ? URL.createObjectURL(img.file)
                                  : img.imageUrl
                              }
                              alt={`preview-${index}`}
                              className="img-fluid rounded"
                            />
                          </div>
                        </div>
                      )}
                      {img?.imageUrl && (
                        <div className="mt-2">
                          {" "}
                          <BForm.Label>
                            {t("Image exists. Remove card or upload new.")}
                          </BForm.Label>
                        </div>
                      )}

                      {values.images.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="mt-3"
                          onClick={() => remove(index)}
                        >
                          {t("Remove")}
                        </Button>
                      )}
                    </div>
                  ))}

                  {values.images.length < 5 && !details && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="mb-3"
                      onClick={() =>
                        push({ imageCaption: "", altText: "", file: null })
                      }
                    >
                      {t("Add More Image")}
                    </Button>
                  )}

                  {values.images.length >= 5 && (
                    <div className="text-muted mb-3">
                      {t("Maximum of 5 images can be added")}
                    </div>
                  )}
                </>
              )}
            </FieldArray>

            {/* <Row>
              <Col>
                <Col>
                  <BForm.Label>
                    {gamePageData
                      ? `${!details ? "Edit Images : " : "View Images: "}`
                      : "Add Image"}{" "}
                    <span className="text-danger">*</span>
                  </BForm.Label>
                </Col>
                <Col>
                  <Button
                    variant="success"
                    onClick={handleImageButtonClick}
                    className="m-2"
                    // disabled={loading || content?.[selectedTab] === ""}
                  >
                    {gamePageData
                      ? `${!details ? "Edit Images" : "View Images"}`
                      : "Add Image"}{" "}
                  </Button>
                </Col>
              </Col>
            </Row> */}
            <Tabs activeKey={selectedTab} className="nav-light mt-3">
              <Tab
                eventKey="EN"
                title="EN"
                mountOnEnter
                tabClassName={"tab-active"}
              >
                <div className="mt-5">
                  <EditGameTemplate
                    values={gamePageData}
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
      {/* {isAddImageModal && ( 
        <AddImagesModal
          show={isAddImageModal}
          setShow={setIsAddImageModal}
          handleSubmit={() => console.log("called")}
          setGameImages={setGameImages}
          existingImages={gameImages}
          details={details}
          // blogId={blogId}
          // loading={deleteLoading}
        />
      )} */}
    </>
  );
};

export default CreateGamePage;
