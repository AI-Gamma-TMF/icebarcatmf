import React, { useState } from "react";
import {
  Modal,
  Button,
  Spinner,
  Form as BootstrapForm,
} from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import useCreateGamePage from "../hooks/useCreateGamePage";
import { AdminRoutes } from "../../../routes";

// Schema
const cardSchema = Yup.object().shape({
  title: Yup.string()
    .required("Section title is required")
    .test(
      "no-leading-trailing-spaces-title",
      "Title must not have leading or trailing spaces",
      (value) => value === value?.trim()
    ),

  description: Yup.string()
    .required("Section description is required")
    .test(
      "no-leading-trailing-spaces-description",
      "Description must not have leading or trailing spaces",
      (value) => value === value?.trim()
    ),

  cards: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string()
          .required("Title is required")
          .test(
            "no-leading-trailing-spaces-title",
            "Title must not have leading or trailing spaces",
            (value) => value === value?.trim()
          ),
        description: Yup.string()
          .required("Description is required")
          .test(
            "no-leading-trailing-spaces-description",
            "Description must not have leading or trailing spaces",
            (value) => value === value?.trim()
          ),
        imageUrl: Yup.string().url().nullable(), // optional
        file: Yup.mixed()
          .nullable()
          .test("file-or-url", "Image is required", function (value) {
            const imageUrl = this.parent.imageUrl;
            if (imageUrl) return true;
            return value instanceof File;
          })
          .test(
            "fileFormat",
            "Only PNG, JPG, JPEG, and WEBP images are allowed",
            function (value) {
              // if no file uploaded, skip this (handled by required test)
              if (!value) return true;

              const supportedFormats = [
                "image/png",
                "image/jpg",
                "image/jpeg",
                "image/webp",
              ];
              return supportedFormats.includes(value.type);
            }
          ),
      })
    )
    .min(1, "At least one card is required"),
});

const CreateGamePageCard = ({
  // setShow,
  loading,
  // existingImages = [],
  details = false,
  gameCardDetails,
}) => {

  const { t } = useTranslation(["translation"]);
  const { gamePageId, gamePageCardId } = useParams();
  const [desktopDimension, setDesktopDimension] = useState(false);
  // const [mobileDimension, setMobileDimension] = useState(false);
  // const [image, setImage] = useState(null);
  const { createGamePageCard, updateGameCard, navigate } = useCreateGamePage();

  const validateFileDimensions = (file, field) => {
    if (file && field === "mobileImage") {
      const img = new Image();
      img.onload = function () {
        if (img.width === 354 && img.height === 234) {
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
        if (img.width === 354 && img.height === 234) {
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

  const initialValues = {
    title: gameCardDetails?.title || "",
    description: gameCardDetails?.description || "",
    cards: gameCardDetails?.image?.length
      ? gameCardDetails?.image?.map((img) => ({
          title: img?.caption || "",
          description: img?.altTag || "",
          file: null,
          imageUrl: img?.imageUrl || "",
        }))
      : [
          {
            title: "",
            description: "",
            file: null,
            imageUrl: "",
          },
        ],
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={cardSchema}
      onSubmit={(values) => {
        const imageData = {
          imageMeta: values?.cards?.map(({ title, description, imageUrl }) => ({
            caption: title,
            altTag: description,
            ...(imageUrl && { imageUrl: imageUrl }),
            ...(imageUrl && { isUpdateImage: true }),
          })),
          image: values?.cards
            ?.map(({ file }) => file)
            ?.filter((file) => file != null),
        };

        // const image = (imageData?.image || [])
        //   .filter((img) => img && typeof img === "object" && img?.file != null)
        //   .map(({ file }) => file);

        const shouldUpdateImage =
          (!imageData?.imageMeta ||
            !imageData?.imageMeta.some((meta) => meta?.imageUrl)) &&
          (!imageData?.image || imageData?.image.length === 0);

        const payload = {
          title: values?.title,
          description: values?.description,
          imageMeta: imageData?.imageMeta,
          image: imageData?.image,
          ...(shouldUpdateImage && { isClearImage: true }),
        };

        !gameCardDetails
          ? createGamePageCard({
              gamePageData: {
                ...payload,
                gamePageId: parseInt(gamePageId),
              },
            })
          : updateGameCard({
              gamePageData: {
                ...payload,
                gamePageId: parseInt(gamePageId),
                gamePageCardId: parseInt(gamePageCardId),
              },
            });

        console.log(payload);
      }}
    >
      {({ values, setFieldValue, _resetForm }) => (
        <Form>
          <Modal.Header>
            <Modal.Title>{t("Add Card Section")}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* Section Title */}
            <BootstrapForm.Group className="my-3">
              <BootstrapForm.Label>
                {t("Card Section Title")}
              </BootstrapForm.Label>
              <Field
                name="title"
                className="form-control"
                placeholder={t("Enter Section Title")}
                readOnly={details}
              />
              <div className="text-danger small">
                <ErrorMessage name="title" />
              </div>
            </BootstrapForm.Group>

            {/* Section Description */}
            <BootstrapForm.Group className="mb-4">
              <BootstrapForm.Label>
                {t("Card Section Description")}
              </BootstrapForm.Label>
              <Field
                name="description"
                as="textarea"
                className="form-control"
                placeholder={t("Enter Section Description")}
                rows={3}
                readOnly={details}
              />
              <div className="text-danger small">
                <ErrorMessage name="description" />
              </div>
            </BootstrapForm.Group>

            <FieldArray name="cards">
              {({ push, remove }) => (
                <>
                  {values.cards.map((card, index) => (
                    <div key={index} className="mb-4 border rounded p-3">
                      {/* Card Title */}
                      <BootstrapForm.Group>
                        <BootstrapForm.Label>
                          {t("Card Image Title")}
                        </BootstrapForm.Label>
                        <Field
                          name={`cards.${index}.title`}
                          placeholder={t("Enter Image Title")}
                          className="form-control"
                          readOnly={details}
                        />
                        <div className="text-danger small mt-1">
                          <ErrorMessage name={`cards.${index}.title`} />
                        </div>
                      </BootstrapForm.Group>

                      {/* Card Description */}
                      <BootstrapForm.Group className="mt-3">
                        <BootstrapForm.Label>
                          {t(
                            "Card Image Description (Keep the resolution at 354×234 pixels.)"
                          )}
                        </BootstrapForm.Label>
                        <Field
                          name={`cards.${index}.description`}
                          placeholder={t("Enter Image Description")}
                          as="textarea"
                          rows={2}
                          className="form-control"
                          readOnly={details}
                        />
                        <div className="text-danger small mt-1">
                          <ErrorMessage name={`cards.${index}.description`} />
                        </div>
                      </BootstrapForm.Group>

                      {/* Image File Upload */}
                      <BootstrapForm.Group className="mt-3">
                        <BootstrapForm.Label>
                          {t("Card Image")}
                        </BootstrapForm.Label>
                        <input
                          type="file"
                          name={`cards.${index}.file`}
                          className="form-control"
                          accept="image/*"
                          disabled={details || card.imageUrl}
                          onChange={(e) => {
                            handleFileChange(
                              e,
                              setFieldValue,
                              `cards.${index}.file`
                            );
                          }}
                        />
                        {desktopDimension ? (
                          <small style={{ color: "red" }}>
                            Card dimensions must be equal to 354 x 234 pixels.
                          </small>
                        ) : (
                          <div className="text-danger small mt-1">
                            <ErrorMessage name={`cards.${index}.file`} />
                          </div>
                        )}
                      </BootstrapForm.Group>

                      {/* Preview */}
                      {(card.file || card.imageUrl) && (
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
                                card.file
                                  ? URL.createObjectURL(card.file)
                                  : card.imageUrl
                              }
                              alt={`preview-${index}`}
                              className="img-fluid rounded"
                            />
                          </div>
                        </div>
                      )}
                      {card?.imageUrl && (
                        <div className="mt-2">
                          {" "}
                          <BootstrapForm.Label>
                            {t("Image exists. Remove card or upload new.")}
                          </BootstrapForm.Label>
                        </div>
                      )}

                      {/* Remove button */}
                      {!details && values.cards.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="mt-3"
                          onClick={() => remove(index)}
                        >
                          {t("Remove Card")}
                        </Button>
                      )}
                    </div>
                  ))}

                  {/* Add More Button */}
                  {!details && values?.cards?.length < 5 && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="mb-3"
                      onClick={() =>
                        push({
                          title: "",
                          description: "",
                          file: null,
                          imageUrl: "",
                        })
                      }
                    >
                      {t("Add More Cards")}
                    </Button>
                  )}

                  {values.cards.length >= 5 && (
                    <div className="text-muted mb-3">
                      {t("Maximum of 5 images can be added")}
                    </div>
                  )}
                </>
              )}
            </FieldArray>
          </Modal.Body>

          {!details && (
            <Modal.Footer>
              <Button
                variant="warning"
                className="m-2"
                onClick={() => navigate(AdminRoutes.GamePages)}
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
  );
};

export default CreateGamePageCard;
