import { Card ,
  Button,
  Col,
  Row,
} from "@themesberg/react-bootstrap";
import RUG from "../react-upload-gallery-master/RUG";
import "../react-upload-gallery-master/style.scss";
import useUploadGallery from "./useUploadGallery";
import React from "react";
import { DeleteConfirmationModal } from "../ConfirmationModal";
import { toast } from "../Toast";
import EditUploadImage from "./Component/EditUploadImage";

const ReactUploadGallery = () => {
  const {
    initialState,
    customRequest,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    setImageDelete,
    isHidden,
    t,
    handleCreateEdit,
    type,
    show,
    data,
    setShow,
    uploadGalleryImage,
    // gallery,
    loading
  } = useUploadGallery();

  return (
    <Card className="mt-3">
      <Row>
        <Col>
          <h3 className="m-2">{t("title")}</h3>
        </Col>
        <Col xs="auto">
          <div className="d-flex justify-content-end align-items-center m-2">
            <Button
              hidden={isHidden({ module: { key: "Gallery", value: "C" } })}
              variant="success"
              size="sm"
              onClick={() => handleCreateEdit("Create", {})}
            >
              {t("Upload")}
            </Button>
          </div>
        </Col>
      </Row>
      {initialState?.length > 0 && (
        <RUG
          initialState={initialState}
          customRequest={customRequest}
          className="m-3"
          isHidden={isHidden}
          onConfirmDelete={(currentImage) => {
            if (!isHidden({ module: { key: "Gallery", value: "D" } })) {
              setDeleteModalShow(true);
              setImageDelete(currentImage);
            } else {
              toast(t("deletePermissionNotGrantedToast"), "error");
            }
          }}
          ssrSupport
          rules={{
            size: 1024,
          }}
          accept={["jpg", "jpeg", "png"]}
          onWarning={(type, rules) => {
            switch (type) {
              case "accept":
                toast(
                  `${t("extentionAllowedToast1")} ${rules.accept.join(
                    ", "
                  )} ${t("extentionAllowedToast2")}`,
                  "error"
                );
                break;

              case "size":
                toast(
                  `${t("imageSizeErrorToast1")} <= ${rules.size / 1024}${t(
                    "imageSizeErrorToast2"
                  )}`,
                  "error"
                );
                break;

              default:
            }
          }}
        />
      )}
      {initialState?.length < 1 && (
        <RUG
          initialState={[]}
          customRequest={customRequest}
          className="m-3"
          ssrSupport
          isHidden={isHidden}
          t={t}
        />
      )}
      {deleteModalShow && (
        <DeleteConfirmationModal
          handleDeleteYes={handleDeleteYes}
          setDeleteModalShow={setDeleteModalShow}
          deleteModalShow={deleteModalShow}
        />
      )}
       <EditUploadImage
        t={t}
        type={type}
        data={data}
        show={show}
        setShow={setShow}
        loading={loading}
        createUpdate={uploadGalleryImage}
      />
    </Card>
  );
};

export default ReactUploadGallery;
