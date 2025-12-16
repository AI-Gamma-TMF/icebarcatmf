import React from "react";
import { createSubCategorySchema, editSubCategorySchema } from "../schema";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  Modal,
} from "@themesberg/react-bootstrap";
import useCreateSubCategory from "../hooks/useCreateSubCategory";
import Trigger from "../../../components/OverlayTrigger";

const CreateSubCategory = ({
  selectedSubCategory,
  handleClose,
  showModal,
  type,
  // casinoCategories,
}) => {
  const {
    // masterGameCategoryId: editMasterGameCategoryId,
    masterGameSubCategoryId,
    name: editName,
    isActive: editIsActive,
    isFeatured: editIsFeatured,
    slug: editSlug
  } = !!selectedSubCategory && selectedSubCategory;

  const { t, loading, updateCasinoMenu, createCasinoMenu } =
    useCreateSubCategory(handleClose);

  const handleSubCategorySubmit = ({
    isActive,
    subCategoryName,
    // masterGameCategoryId,
    thumbnail,
    selectedThumbnail,
    isFeatured,
    slug
  }) => {
    const data = {
      isActive,
      // masterGameCategoryId: 1,
      name: JSON.stringify({ EN: subCategoryName }),
      isFeatured: slug ? false : isFeatured,
      slug: slug || null
    };
    if (thumbnail) data.thumbnail = thumbnail;
    if (selectedThumbnail) data.selectedThumbnail = selectedThumbnail;
    if (masterGameSubCategoryId)
      data.masterGameSubCategoryId = masterGameSubCategoryId;
    editName ? updateCasinoMenu(data) : createCasinoMenu(data);
  };

  // const options = [
  //   { value: "long", label: "Long" },
  //   { value: "short", label: "Short" },
  // ];

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {type} {t("casinoSubCategory.createSubCategory.title")}
        </Modal.Title>
      </Modal.Header>

      <Formik
        enableReinitialize
        initialValues={{
          isActive: type === "Edit" ? editIsActive : false,
          subCategoryName: type === "Edit" ? selectedSubCategory?.name?.EN : "",
          // masterGameCategoryId: editMasterGameCategoryId || "",
          thumbnail: null,
          selectedThumbnail: null,
          slug: type === "Edit" ? editSlug : null,
          isFeatured: type === "Edit" ? editIsFeatured : false,
        }}
        validationSchema={
          type === "Edit"
            ? editSubCategorySchema(t)
            : createSubCategorySchema(t)
        }
        onSubmit={handleSubCategorySubmit}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
        }) => (
          <Form>
            <Modal.Body>
              <Row className="mt-3">
                <Col>
                  <BForm.Label>
                    {t("casinoSubCategory.inputField.categoryName.label")}{" "}
                    <span className="text-danger">*</span>
                  </BForm.Label>
                  <BForm.Control
                    type="text"
                    name="subCategoryName"
                    placeholder={t(
                      "casinoSubCategory.inputField.categoryName.placeholder"
                    )}
                    value={values.subCategoryName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />

                  <ErrorMessage
                    component="div"
                    name="subCategoryName"
                    className="text-danger"
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <BForm.Label>
                    {t("casinoSubCategory.inputField.slug.label")}{" "}
                  </BForm.Label>
                  <BForm.Select
                    value={values.slug}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="slug"
                  >
                    <option value="">
                      {t("casinoSubCategory.inputField.slug.option")}{" "}
                    </option>
                    <option value="jackpot">Jackpot</option>
                  </BForm.Select>

                  <ErrorMessage
                    component="div"
                    name="slug"
                    className="text-danger"
                  />
                </Col>
              </Row>

              {/* <Row className="mt-3">
                <Col>
                  <BForm.Label>
                    {t("casinoSubCategory.inputField.category.label")}{" "}
                    <span className="text-danger">*</span>
                  </BForm.Label>

                  <BForm.Select
                    value={values.masterGameCategoryId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="masterGameCategoryId"
                  >
                    <option value="">
                      {t("casinoSubCategory.inputField.category.option")}{" "}
                    </option>

                    {casinoCategories &&
                      casinoCategories?.rows?.map((c) => (
                        <option
                          key={c?.masterGameCategoryId}
                          value={c?.masterGameCategoryId}
                        >
                          {c?.name?.EN}
                        </option>
                      ))}
                  </BForm.Select>

                  <ErrorMessage
                    component="div"
                    name="masterGameCategoryId"
                    className="text-danger"
                  />
                </Col>
              </Row> */}


              <Row className="mt-3">
                <Col className="d-grid">
                  <BForm.Label>
                    {t("casinoSubCategory.inputField.thumbnail.label2")}
                  </BForm.Label>

                  <BForm.Text>
                    <Trigger
                      message={t(
                        "casinoSubCategory.inputField.thumbnail.message"
                      )}
                      id={"mes2"}
                    />
                    <input
                      id={"mes2"}
                      title=" "
                      name="thumbnail"
                      type="file"
                      onChange={(event) => {
                        setFieldValue(
                          "thumbnail",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                    {values?.thumbnail && (
                      <img
                        alt="not found"
                        width="60px"
                        src={URL.createObjectURL(values.thumbnail)}
                      />
                    )}
                    {!values?.thumbnail &&
                      selectedSubCategory?.imageUrl?.thumbnailUrl && (
                        <img
                          alt="not found"
                          width="60px"
                          src={
                            selectedSubCategory?.imageUrl?.thumbnailUrl
                          }
                        />
                      )}
                  </BForm.Text>

                  <ErrorMessage
                    component="div"
                    name="thumbnail"
                    className="text-danger"
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                <Col className="d-grid">
                  <BForm.Label>
                    {t("casinoSubCategory.inputField.thumbnail.label3")}
                  </BForm.Label>

                  <BForm.Text>
                    <Trigger
                      message={t(
                        "casinoSubCategory.inputField.thumbnail.message"
                      )}
                      id={"mes3"}
                    />
                    <input
                      id={"mes3"}
                      title=" "
                      name="selectedThumbnail"
                      type="file"
                      onChange={(event) => {
                        setFieldValue(
                          "selectedThumbnail",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                    {values?.selectedThumbnail && (
                      <img
                        alt="not found"
                        width="60px"
                        src={URL.createObjectURL(values.selectedThumbnail)}
                      />
                    )}
                    {!values?.selectedThumbnail &&
                      selectedSubCategory?.imageUrl?.selectedThumbnailUrl && (
                        <img
                          alt="not found"
                          width="60px"
                          src={
                            selectedSubCategory?.imageUrl?.selectedThumbnailUrl
                          }
                        />
                      )}
                  </BForm.Text>

                  <ErrorMessage
                    component="div"
                    name="selectedThumbnail"
                    className="text-danger"
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                <Col className="d-flex">
                  <BForm.Label>
                    {t("casinoSubCategory.inputField.active.label")}
                  </BForm.Label>

                  <BForm.Check
                    type="checkbox"
                    className="mx-auto"
                    name="isActive"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.isActive}
                    defaultChecked={editIsActive}
                  />
                </Col>

                <Col className="d-flex">
                  <BForm.Label>
                    {t("casinoSubCategory.inputField.featured.label")}
                  </BForm.Label>

                  <BForm.Check
                    type="checkbox"
                    className="mx-auto"
                    name="isFeatured"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={Boolean(values.slug)} // disable if any slug is selected
                    checked={!values.slug && values.isFeatured} // uncheck if slug is selected
                  />
                </Col>
              </Row>
            </Modal.Body>

            <div className="mt-4">
              <Modal.Footer className="d-flex justify-content-between align-items-center">
                <Button variant="warning" onClick={() => handleClose()}>
                  {t("casinoSubCategory.createSubCategory.cancel")}
                </Button>

                <Button
                  variant="success"
                  onClick={handleSubmit}
                  className="ml-2"
                  disabled={loading}
                >
                  {t("casinoSubCategory.createSubCategory.submit")}
                  {loading && (
                    <Spinner
                      style={{ marginLeft: "4px" }}
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                </Button>
              </Modal.Footer>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CreateSubCategory;
