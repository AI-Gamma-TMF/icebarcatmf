import React from "react";
import {
  Modal,
  Button,
  Spinner,
  Form as BootstrapForm,
} from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { addImageBlockSchema } from "../schema";
import { toast } from "../../../components/Toast";

// Validation schema for image fields

const AddImagesModal = ({
  show,
  setShow,
  details,
  loading,
  setGameImages,
  existingImages,
}) => {
  console.log("🚀 ~ existingImages:", existingImages);
  const { t } = useTranslation(["translation"]);

  const initialValues = {
    images:
      existingImages?.length > 0
        ? existingImages.map((img) => ({
            imageCaption: img.caption || "", // map to Formik field names
            altText: img.altTag || "",
            file: null,
            imageUrl: img.imageUrl || "",
          }))
        : [{ imageCaption: "", altText: "", file: null, imageUrl: "" }],
  };

  const handleClose = (_resetForm) => {
    setShow(false);
    // resetForm();
  };


  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg">
      <Formik
        initialValues={initialValues}
        enableReinitialize={true} 
        validationSchema={addImageBlockSchema}
        onSubmit={(values, { _resetForm }) => {

          // const imageData = {
          //   imageMeta: values.images.map(({ imageCaption, altText }) => ({
          //     caption: imageCaption,
          //     altTag: altText,
          //   })),
          //   image: values.images.map(({ file }) => file),
          // };

          setGameImages(values?.images);
          toast(t("Images added successfully"), "success");
          // resetForm();
          setShow(false);
        }}
      >
        {({ resetForm, values, setFieldValue }) => (
          <Form>
            <Modal.Header closeButton onHide={() => handleClose(resetForm)}>
              <Modal.Title>{t("Add Images")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FieldArray name="images">
                {({ push, remove }) => (
                  <>
                    {values.images.map((img, index) => (
                      <div key={index} className="mb-4 border rounded p-3">
                        <BootstrapForm.Group
                          controlId={`images.${index}.imageCaption`}
                        >
                          <BootstrapForm.Label>
                            {t("Image Caption")}
                          </BootstrapForm.Label>
                          <Field
                            name={`images.${index}.imageCaption`}
                            placeholder={t("Enter Caption")}
                            as={BootstrapForm.Control}
                            readOnly={details}
                          />
                          <div className="text-danger small mt-1">
                            <ErrorMessage
                              name={`images.${index}.imageCaption`}
                            />
                          </div>
                        </BootstrapForm.Group>

                        <BootstrapForm.Group
                          controlId={`images.${index}.altText`}
                          className="mt-3"
                        >
                          <BootstrapForm.Label>
                            {t("Alt Text")}
                          </BootstrapForm.Label>
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
                        </BootstrapForm.Group>

                        <BootstrapForm.Group
                          controlId={`images.${index}.file`}
                          className="mt-3"
                        >
                          <BootstrapForm.Label>
                            {t("Image File")}
                          </BootstrapForm.Label>
                          <input
                            type="file"
                            name={`images.${index}.file`}
                            className="form-control"
                            accept="image/*"
                            disabled={details}
                            onChange={(e) => {
                              setFieldValue(
                                `images.${index}.file`,
                                e.currentTarget.files[0]
                              );
                            }}
                          />
                          <div className="text-danger small mt-1">
                            <ErrorMessage name={`images.${index}.file`} />
                          </div>
                        </BootstrapForm.Group>

                        {(img.file || img.imageUrl) && (
                          <div className="mt-3">
                            <BootstrapForm.Label>
                              {t("Preview")}
                            </BootstrapForm.Label>
                            <div
                              className="border p-2"
                              style={{ maxWidth: "200px" }}
                            >
                              <img
                                src={
                                  img.file
                                    ? URL.createObjectURL(img.file)
                                    : img.imageUrl
                                }
                                alt={`preview-${index}`}
                                className="img-fluid rounded"
                              />
                            </div>
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

                    {values.images.length < 6 && !details && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="mb-3"
                        onClick={() =>
                          push({ title: "", description: "", file: null })
                        }
                      >
                        {t("Add More Image")}
                      </Button>
                    )}

                    {values.images.length >= 6 && (
                      <div className="text-muted mb-3">
                        {t("Maximum of 6 images can be added")}
                      </div>
                    )}
                  </>
                )}
              </FieldArray>
            </Modal.Body>

            {!details && (
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => handleClose(resetForm)}
                >
                  {t("Cancel")}
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {t("Submit")}
                  {loading && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="ms-2"
                    />
                  )}
                </Button>
              </Modal.Footer>
            )}
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddImagesModal;
