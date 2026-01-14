import {
  Button,
  Col,
  Modal,
  Row,
  Form as BForm,
  Spinner,
} from '@themesberg/react-bootstrap';
import { Form, Formik } from 'formik';
import React, { useRef } from 'react';
import toast from "react-hot-toast";
const EditUploadPromotion = ({
  type,
  data,
  show,
  setShow,
  createUpdate,
  loading,
}) => {
  const fileInputRef = useRef(null);

  // const [image, setImage] = useState(null);
  const handleFileChange = (event, setFieldValue, field) => {
    const file = event.target.files[0];
    // setImage(file);
    validateFileDimensions(file, field);
    setFieldValue(field, file);
  };

  const validateFileDimensions = (file, field) => {
    console.log(field);    
    const img = new Image();
    img.src = URL.createObjectURL(file);
  };

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>
            {type} Promotion thumbnail
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            enableReinitialize
            initialValues={{
              promotionThumbnailImage: null,
              isActive: true,
              name: data?.name || '',
              promotionThumbnailId: data?.promotionThumbnailId || '',
              navigateRoute: data.navigateRoute || "",
            }}
            onSubmit={(formValues) => {
              if (formValues.name === '' && formValues.promotionThumbnailImage === null) {
                toast.error("Please fill name and thumnail fields atleast.");
              } else {
                const data = {
                  isActive: true,
                  name: formValues.name,
                  promotionThumbnailImage: formValues.promotionThumbnailImage || null,
                  navigateRoute: formValues.navigateRoute
                };
                if (formValues.promotionThumbnailImage)
                  data.promotionThumbnailImage = formValues.promotionThumbnailImage;
                if (formValues.promotionThumbnailId)
                  data.promotionThumbnailId = formValues.promotionThumbnailId
                createUpdate(data);
              }
            }}
          >
            {({
              values,
              errors,
              handleSubmit,
              handleBlur,
              setFieldValue,
              handleChange,
            }) => {

              return (
                <Form>
                  <Row className='mt-3'>
                    <Col className='d-flex'>
                      <BForm.Label>
                        Name
                      </BForm.Label>
                    </Col>

                    <Col xs={9}>
                      <BForm.Control
                        type='text'
                        name='name'
                        placeholder="Enter Name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        onKeyDown={(evt) =>
                          [" "].includes(evt.key) &&
                          evt.preventDefault()
                        }
                      />
                    </Col>
                  </Row>
                  {values.name !== 'dailyBonus' && values.name !== 'welcomeBonus' ?
                    <Row className='mt-3'>
                      <Col>
                        <Row>
                          <Col className='d-flex align-items-center'>
                            <Col>
                              <BForm.Label>
                                Navigation Route
                              </BForm.Label>
                            </Col>
                            <Col xs={9}>
                              <BForm.Control
                                type='text'
                                name='navigateRoute'
                                placeholder="Enter Navigation Route"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.navigateRoute}
                                onKeyDown={(evt) =>
                                  [" "].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                              />
                            </Col>
                          </Col>
                        </Row>
                      </Col>
                    </Row> : <> </>
                  }

                  <Row className='mt-3'>
                    <Col>
                      <Row>
                        <Col className='d-flex align-items-center'>
                          <Col>
                            <BForm.Label>
                              Thumbnail
                            </BForm.Label>
                          </Col>


                          <Col xs={9}>
                            <div className="custom-file-upload-wrap">
                              {!errors?.promotionThumbnailImage &&
                                (type === 'Create' ? (
                                  values?.promotionThumbnailImage && (
                                    <Row className='text-center'>
                                      <div style={{
                                        textAlign: 'left'
                                      }}>
                                        <img
                                          alt='not found'

                                          style={{
                                            maxWidth: '200px',
                                            maxHeight: '200px',
                                            marginLeft: '0'
                                          }}
                                          src={
                                            values?.promotionThumbnailImage &&
                                            URL.createObjectURL(values?.promotionThumbnailImage)
                                          }
                                        />
                                      </div>
                                    </Row>
                                  )
                                ) : (
                                  <Row className='text-center'>
                                    <Col>
                                      <img
                                        alt='exist data'

                                        style={{
                                          maxWidth: '200px',
                                          maxHeight: '200px',
                                          marginLeft: '0'
                                        }}
                                        src={
                                          values?.promotionThumbnailImage
                                            ? URL.createObjectURL(values?.promotionThumbnailImage)
                                            : data?.promotionThumbnailImages}
                                      />
                                    </Col>
                                  </Row>
                                ))}
                              <div className="custom-file-upload-button">
                                <BForm.Control
                                  type='file'
                                  name='promotionThumbnailImage'
                                  accept="image/*"
                                  ref={fileInputRef}
                                  onChange={(event) => handleFileChange(event, setFieldValue, 'promotionThumbnailImage')}
                                  onBlur={handleBlur}
                                />

                                <Button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click?.()}
                                >
                                  File Upload
                                </Button>
                              </div>

                              {values?.promotionThumbnailImage?.name ? (
                                <div className="mt-2 small text-muted">
                                  Selected: {values.promotionThumbnailImage.name}
                                </div>
                              ) : null}



                            </div>
                          </Col>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <div className='mt-4 d-flex justify-content-between align-items-center'>
                    <Button variant='warning' onClick={() => setShow(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant='success'
                      onClick={() => {
                        handleSubmit();
                        // setImage(null);
                      }}
                      className='ml-2'
                      disabled={loading}
                    >
                      Submit
                      {loading && (
                        <Spinner
                          style={{ marginLeft: '4px' }}
                          as='span'
                          animation='border'
                          size='sm'
                          role='status'
                          aria-hidden='true'
                        />
                      )}
                    </Button>
                  </div>
                </Form>
              )
            }}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditUploadPromotion;
