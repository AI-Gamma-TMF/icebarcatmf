import React from "react";
import { Button, Modal , Spinner } from "@themesberg/react-bootstrap";
import "./modalStyle.scss";
import { useTranslation } from "react-i18next";



const ImportCsvModal = ({
  show,
  setShow,
  handleYes,
  loading,
  importedFile,
  // importAction,
  // setImportAction,
}) => {
  const { t } = useTranslation(["translation"]);

  // const handleSwitchChange = () => {
  //   setImportAction(!importAction);
  // };

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        //setImportedFile(null)
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("Confirm Import Action")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center align-items-center mb-2">
          <label>{`Filename : ${importedFile.name || ""}`}</label>
        </div>
      </Modal.Body>

      <Modal.Footer>
        

        <Button
          variant="warning"
          onClick={() => {
            setShow(false);
            //setImportedFile(null)
          }}
        >
          Cancel
        </Button>
        <Button variant="success" onClick={handleYes} disabled={loading}>
        Send
          {loading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportCsvModal;
