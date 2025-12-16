import { Col, Modal, Row } from "@themesberg/react-bootstrap";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SpinnerLoader } from "../Preloader";
import pdfImage from '../../assets/img/pages/pdfimage.png'

export const ImagePreviewModal = ({
  imagePreviewModalShow,
  setImagePreviewModalShow,
  imageUrl,
  setImageUrl,
}) => {
  const [docUrl, setDocUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  function getUrlExtension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          "X-AUTH-CLIENT": process.env.REACT_APP_X_AUTH_CLIENT,
          "X-HMAC-SIGNATURE": imageUrl?.signature,
        };
        const response = await axios.get(imageUrl?.documentUrl, {
          headers: headers,
          responseType: "blob",
        });
        const urlCreator = window.URL || window.webkitURL;
        const fileUrl = urlCreator.createObjectURL(response.data);
        setDocUrl(fileUrl);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    imageUrl?.signature ? fetchData() : setLoading(false);
  }, []);

  return (
    <Modal
      show={imagePreviewModalShow}
      onHide={() => {
        setImagePreviewModalShow(false);
        setImageUrl({ name: "", preview: [] });
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Document Preview For {imageUrl?.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {imageUrl ? (
          <Row xs={12} className='d-flex justify-content-center'>
            {/* {imageUrl?.preview?.map((url, index) => imageUrl?.preview?.length - 1 === index  && ( */}
            <Col key={1} className='mt-2 text-center' xs={6}>
              {loading ? (
                <div style={{ marginLeft: "80px" }}>
                  <SpinnerLoader />
                </div>
              ) : (
                <Col>
                  {getUrlExtension(imageUrl?.documentUrl) === "pdf" ? (
                    <img
                      src={pdfImage}
                      onClick={() => window.open(imageUrl?.documentUrl)}
                      style={{ border: "1px solid grey", borderRadius: "12px" }}
                      className='mb-2'
                    />
                  ) : (
                    <img
                      src={imageUrl?.signature ? docUrl : imageUrl?.documentUrl}
                      width='200'
                      height='150'
                      alt={imageUrl?.signature ? docUrl : imageUrl?.documentUrl}
                      onClick={() => window.open(imageUrl?.signature ? docUrl : imageUrl?.documentUrl)}
                      style={{ border: "1px solid grey", borderRadius: "12px" }}
                      className='mb-2'
                    />
                  )}
                </Col>
              )}
              <Col>
                <label>
                  {imageUrl?.preview?.length - 1
                    ? "Latest Document Preview"
                    : "Document Preview"}
                </label>
              </Col>
            </Col>

            {/* ))} */}
          </Row>
        ) : (
          "No Preview Found"
        )}
      </Modal.Body>
    </Modal>
  );
};
