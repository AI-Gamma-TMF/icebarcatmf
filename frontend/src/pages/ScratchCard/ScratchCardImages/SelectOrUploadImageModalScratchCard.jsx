import React from "react";
import { Modal, Tabs, Tab, Button, Spinner } from "@themesberg/react-bootstrap";

import "./ScratchCardImageStyle.scss"; 
import UploadIcon from "../../../components/react-upload-gallery-master/view/UploadIcon";

const SelectOrUploadImageModalScratchCard = ({
  show,
  onClose,
  activeTab,
  setActiveTab,
  imageUrlData,
  values,
  handleImageSelect,
  handleFileChange,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select or Upload Image</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Tabs
          id="image-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3 custom-tabs"
        >
          <Tab eventKey="select" title="Select Image">
            <div className="image-grid">
              {imageUrlData?.length === 0 ? (
                <div className="loader">
                  <Spinner animation="border" size="lg" role="status" />
                </div>
              ) : (
                imageUrlData?.map((url, index) => {
                  const isSelected = values?.imageUrl === url;
                  return (
                    <img
                      key={index}
                      src={url}
                      alt={`img-${index}`}
                      className={`image-item ${isSelected ? "selected" : ""}`}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = isSelected ? "scale(1.05)" : "scale(1)")
                      }
                      onClick={() => handleImageSelect(url)}
                    />
                  );
                })
              )}
            </div>
          </Tab>

          <Tab eventKey="upload" title="Upload File">
            <div className="upload-container">
              <div className="upload-icon-wrapper">
                <img src={UploadIcon} alt="Upload" className="upload-icon" />
              </div>

              <p className="upload-title"><strong>Select file from your Device.</strong></p>
              <p className="upload-subtitle">Supports: PNG, JPG, JPEG, WEBP</p>

              <Button className="upload-browse-btn" onClick={() => document.getElementById("hiddenFileInput").click()}>
                Browse
              </Button>

              <input
                type="file"
                id="hiddenFileInput"
                name="tempImage"
                accept=".jpg,.jpeg,.png,.webp"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default SelectOrUploadImageModalScratchCard;
