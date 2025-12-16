  import React, { useEffect, useState } from "react";
  import { Button, Form as BForm } from "@themesberg/react-bootstrap";
  import { ErrorMessage } from "formik";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
  import "./PackageImageStyle.scss";
  import { useGetPackageImageUrlMutation } from "../../../../../../reactQuery/hooks/customMutationHook";
  import Trigger from "../../../../../../components/OverlayTrigger";
  import SelectOrUploadImageModal from "./SelectOrUploadImageModal";

  const PackageImagePreview = ({
    values,
    setFieldValue,
    packageData,
    t,
    errors,
  }) => {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState("select");
    const [imageUrlData, setImageUrlData] = useState([]);
    const [localPackageImageUrl, setLocalPackageImageUrl] = useState(
      packageData?.imageUrl || null
    );

    const { mutate: packageImageUrlMutate } = useGetPackageImageUrlMutation({
      onSuccess: (res) => {
        setImageUrlData(res?.data?.imageUrlArray || []);
      },
      onError: (error) => {
        console.error("Error fetching image URLs:", error);
      },
    });

    useEffect(() => {
      packageImageUrlMutate();
    }, []);

    const handleImageSelect = (url) => {
      setFieldValue("image", null);
      setFieldValue("imageUrl", url);
      setLocalPackageImageUrl(null);
      setShowModal(false);
    };

    const handleFileChange = (event) => {
      const file = event.currentTarget.files?.[0];
      if (file) {
        setFieldValue("imageUrl", null);
        setFieldValue("image", file);
        setLocalPackageImageUrl(null);
        setShowModal(false);
      }
    };

    const clearImage = () => {
      setFieldValue("image", null);
      setFieldValue("imageUrl", null);
      setLocalPackageImageUrl(null);
    };

    const getPreviewSrc = () => {
      if (values?.image) return URL.createObjectURL(values.image);
      if (values?.imageUrl) return values.imageUrl;
      if (!values?.image && !values?.imageUrl && localPackageImageUrl)
        return localPackageImageUrl;
      return null;
    };

    return (
      <div className="package-image-preview-wrapper">
        <BForm.Text>
          <Trigger
            message={t("createPackage.inputFields.thumbnail.message")}
            id={"mes"}
          />

          <Button
            variant="primary"
            className="upload-button"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faArrowUpFromBracket} className="upload-icon" />
            Upload Image
          </Button>

          {!getPreviewSrc() ? (
            <BForm.Label className="image-label">
              Package Image <span className="text-danger">*</span>
            </BForm.Label>
          ) : (
            <div className="image-preview-container">
              <img
                alt="preview"
                src={getPreviewSrc()}
                className="preview-image"
              />
              <Button
                variant="danger"
                size="sm"
                className="clear-button"
                onClick={clearImage}
              >
                X
              </Button>
            </div>
          )}
        </BForm.Text>

        {errors?.imageUrl && errors?.image ? (
          <ErrorMessage component="div" name="imageUrl" className="text-danger" />
        ) : (
          <>
            <ErrorMessage component="div" name="image" className="text-danger" />
            <ErrorMessage component="div" name="imageUrl" className="text-danger" />
          </>
        )}

        <SelectOrUploadImageModal
          show={showModal}
          onClose={() => setShowModal(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          imageUrlData={imageUrlData}
          values={values}
          handleImageSelect={handleImageSelect}
          handleFileChange={handleFileChange}
        />
      </div>
    );
  };

  export default PackageImagePreview;
