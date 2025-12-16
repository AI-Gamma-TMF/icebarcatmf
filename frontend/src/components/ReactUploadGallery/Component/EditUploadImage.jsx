import {
  Button,
  Col,
  Modal,
  Row,
  Form as BForm,
  Spinner,
} from "@themesberg/react-bootstrap";
import { ErrorMessage, Form, Formik } from "formik";
import React, { useState } from "react";
//   import { uploadBannerSchema } from './schema.js';
import toast from "react-hot-toast";
import { serialize } from 'object-to-formdata';
import { uploadGalleryImageSchema } from "./schema";


const EditUploadImage = ({
  t,
  type,
  data,
  show,
  setShow,
  createUpdate,
  loading,
}) => {
  // const [image, setImage] = useState(null);
  // const [startDateRequired, setStartDateRequired] = useState(false);
  // const [endDateRequired, setEndDateRequired] = useState(false);
  // const [pageNameData, setPageNameData] = useState([]);
  // const [mobileDimension, setMobileDimension] = useState(false);
  // const yesterday = new Date(Date.now() - 86400000);
  const [desktopDimension, setDesktopDimension] = useState(false);
  const handleFileChange = (event, setFieldValue, field) => {
    const file = event.target.files[0];
    // setImage(file);

    // Validate file dimensions
    validateFileDimensions(file, field);

    // Optionally, you can update form field value
    setFieldValue(field, file);
  };

  const validateFileDimensions = (file, field) => {
    if (file && field === "mobileImage") {
      const img = new Image();
      img.onload = function () {
        if (img.width === 1200 && img.height === 320) {
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
        if (img.width === 1013 && img.height === 593) {
          setDesktopDimension(false);
          // setImage(null);
        } else {
          setDesktopDimension(true);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };
  // const handleCheckoutChange = (e, setFieldValue) => {
  //   if (e.target.checked == true) {
  //     setFieldValue("isCountDown", e.target.checked);
  //     setStartDateRequired(true);
  //     setEndDateRequired(true);
  //   } else {
  //     setFieldValue("isCountDown", e.target.checked);
  //     setStartDateRequired(false);
  //     setEndDateRequired(false);
  //   }
  // };
  // const handleNavigateChange = (e, setFieldValue) => {
  //   if (e.target.checked == true) {
  //     setFieldValue("isNavigate", e.target.checked);
  //   } else {
  //     setFieldValue("isNavigate", e.target.checked);
  //   }
  // };
  // useEffect(() => {
  //   let permanentData = [{ label: 'casinoBannerManagement.constant.lobbySlider', value: 'lobbySlider' }, { label: 'casinoBannerManagement.constant.bonusPromotionPage', value: 'bonusPromotionPage' },]
  //   let data = pageNameOptions?.filter(y => !(bannersList?.rows?.find(x => x.pageName == y.value)))
  //   setPageNameData([...data, ...permanentData])
  // }, [bannersList])

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("Upload Image")}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            enableReinitialize
            initialValues={{
              bannerImage: null,
              name: data?.name || "",
            }}
              validationSchema={uploadGalleryImageSchema}
            onSubmit={(formValues) => {              
             if (desktopDimension) {
                toast("Image must be 1013X593 pixels", "error");
                return;
              } 
              else if(!formValues?.bannerImage){
                toast.error(t("Image is required"));
                return;
              }
              else {
                const data = {
                  name: formValues.name,
                };
                // if (formValues.mobileImage)
                //   data.mobileImage = formValues.mobileImage;
                if (formValues.bannerImage)
                  data.image = formValues.bannerImage;
                  createUpdate(serialize(data));
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
                  {/* <Row className='mt-3'>
                      <Col className='d-flex'>
                        <BForm.Label>
                          {t('casinoBannerManagement.inputField.pageName.label')}{' '}
                          <span className='text-danger'>*</span>
                        </BForm.Label>
                      </Col>
    
                      <Col xs={9}>
                        <BForm.Select
                          type='select'
                          name='pageName'
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.pageName}
                          disabled={data?.pageBannerId}
                        >
                          <option value='' disabled>
                            ---
                            {t(
                              'casinoBannerManagement.constant.selectPageName'
                            )}
                            ---
                          </option>
                          {data?.pageName ? <><option value={data.pageName}>{data?.pageName}</option></> :
                            <>
                              {
                                pageNameData?.map((info, index) =>
                                  <option key={index} value={info.value}>{t(info.label)}</option>
                                )
                              }
                            </>
                          }
                        </BForm.Select>
                        <ErrorMessage
                          component='div'
                          name='pageName'
                          className='text-danger'
                        />
                      </Col>
                    </Row> */}
                  {/* <Row className='mt-3'>
                      <Col className='d-flex'>
                        <BForm.Label>
                          {t('casinoBannerManagement.inputField.name.label')}
                          <span className='text-danger'>*</span>
                        </BForm.Label>
                      </Col>
    
                      <Col xs={9}>
                        <BForm.Control
                          type='text'
                          name='name'
                          placeholder={t(
                            'casinoBannerManagement.inputField.name.placeholder'
                          )}
          isActive: true
  visibility: 2
  pageRoute: ffffff
  navigateRoute: fffffffffffff
  isCountDown: false
  isNavigate: true
  startDate: 
  endDate: 
  desktopImage: (binary)                onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          disabled={data?.pageBannerId}
                        />
                        <ErrorMessage
                          component='div'
                          name='name'
                          className='text-danger'
                        />
                      </Col>
                    </Row> */}
                  {/*   
                    <Row className='mt-3'>
                      <Col className='d-flex'>
                        <BForm.Label>
                          {t('casinoBannerManagement.inputField.textOne.label')}
                        </BForm.Label>
                      </Col>
    
                      <Col xs={9}>
                        <BForm.Control
                          type='text'
                          name='textOne'
                          placeholder={t(
                            'casinoBannerManagement.inputField.textOne.placeholder'
                          )}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.textOne}
                        />
                        <ErrorMessage
                          component='div'
                          name='textOne'
                          className='text-danger'
                        />
                      </Col>
                    </Row> */}

                  <Row className="mt-3">
                    <Col className="d-flex">
                      <BForm.Label>Name</BForm.Label>
                    </Col>

                    <Col xs={9}>
                      <BForm.Control
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                      />
                      <ErrorMessage
                        component="div"
                        name="name"
                        className="text-danger"
                      />
                    </Col>
                  </Row>

                  {/* <Row className='mt-3'>
                      <Col className='d-flex'>
                        <BForm.Label>
                          {t('casinoBannerManagement.inputField.textThree.label')}
                        </BForm.Label>
                      </Col>
    
                      <Col xs={9}>
                        <BForm.Control
                          type='text'
                          name='textThree'
                          placeholder={t(
                            'casinoBannerManagement.inputField.textThree.placeholder'
                          )}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.textThree}
                        />
                        <ErrorMessage
                          component='div'
                          name='textThree'
                          className='text-danger'
                        />
                      </Col>
                    </Row>
     */}

                  {/* { values.isNavigate && <Row className='mt-3'>
                      <Col className='d-flex'>
                        <BForm.Label>
                         Navigate To
                        </BForm.Label>
                      </Col>
    
                      <Col xs={9}>
                        <BForm.Control
                          type='text'
                          name='navigateRoute'
                          placeholder="Enter Page Name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.navigateRoute}
                          onKeyDown={(evt) =>
                            [" "].includes(evt.key) &&
                            evt.preventDefault()
                          }
                        />
                        <ErrorMessage
                          component='div'
                          name='btnText'
                          className='text-danger'
                        />
                        {values?.isNavigate && values?.navigateRoute ==="" && <small style={{ color: 'red' }}>Navigation route required.</small>}
                      </Col>
                    </Row>} */}

                  {/* <Row className='mt-3'>
                      <Col className='d-flex'>
                        <BForm.Label>
                          {t(
                            'casinoBannerManagement.inputField.btnRedirection.label'
                          )}
                        </BForm.Label>
                      </Col>
    
                      <Col xs={9}>
                        <BForm.Select
                          ype='text'
                          name='btnRedirection'
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.btnRedirection}
                        >
                          <option value=''>
                            {t('casinoBannerManagement.constant.none')}
                          </option>
                          <option value='referAfriend'>
                            {t('casinoBannerManagement.constant.referAfriend')}
                          </option>
                          <option value='giveaway'>
                            {t('casinoBannerManagement.constant.giveaway')}
                          </option>
                          <option value='buyPage'>
                            {t('casinoBannerManagement.constant.buyPage')}
                          </option>
                          <option value='tournamentPage'>
                            {t('casinoBannerManagement.constant.tournamentPage')}
                          </option>
                          <option value='personalBonus'>
                            {t('casinoBannerManagement.constant.personalBonus')}
                          </option>
                        </BForm.Select>
                      </Col>
                    </Row> */}
                  {/* <Row className='mt-3'>
                      <Col className='d-flex'>
                        <BForm.Label>
                          Is CountDown
                        </BForm.Label>
                      </Col>
    
                      <Col xs={9}>
                        <BForm.Check
                          type='checkbox'
                          className='mx-auto'
                          name='isCountDown'
                          onChange={(e) => { handleCheckoutChange(e, setFieldValue) }}
                          onBlur={handleBlur}
                          value={values.isCountDown}
                          defaultChecked={values.isCountDown}
                        />
                      </Col>
                    </Row> */}
                  {/* {values.isCountDown == true ? <>
                      <Row className='mt-3'>
                        <Col className='d-flex'>
                          <BForm.Label>
                            Start Date
                          </BForm.Label>
                        </Col>
                        <Col xs={9}>
                          <Datetime
                            inputProps={{
                              placeholder: 'MM-DD-YYYY HH:MM',
                              // disabled: details
                            }}
                            dateFormat='MM/DD/YYYY'
                            onChange={(e) => {
                              setFieldValue('startDate', e);
                              setStartDateRequired(false)
                            }}
                            value={values.startDate}
                            isValidDate={(e) => {
                              return (
                                e._d > yesterday ||
                                getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
                              );
                            }}
                            timeFormat={true}
                          />
                          {startDateRequired && <small style={{ color: 'red' }}>Start Date Required.</small>}
                        </Col>
                      </Row>
                      <Row className='mt-3'>
                        <Col className='d-flex'>
                          <BForm.Label>
                            End Date
                          </BForm.Label>
                        </Col>
                        <Col xs={9}>
                          <Datetime
                            inputProps={{
                              placeholder: 'MM-DD-YYYY HH:MM',
                              // disabled: details
                            }}
                            dateFormat='MM/DD/YYYY'
                            onChange={(e) => {
                              setFieldValue('endDate', e);
                              setEndDateRequired(false)
                            }}
                            value={values.endDate}
                            isValidDate={(e) => {
                              return (
                                e._d > yesterday ||
                                getDateTimeByYMD(e._d) === getDateTimeByYMD(new Date())
                              );
                            }}
                            timeFormat={true}
                          />
                          {endDateRequired && <small style={{ color: 'red' }}>End Date Required.</small>}
    
                        </Col>
                      </Row>
                    </> : <></>}
     */}
                  <Row className="mt-3">
                    {/* <Col> */}
                    {/* <Row>
                          <Col className='d-flex align-items-center'>
                            <Col>
                              <BForm.Label>
                                {t(
                                  'casinoBannerManagement.inputField.mobileImage.label'
                                )}
                                <span className='text-danger'> *</span>
                              </BForm.Label>
                            </Col>
    
                            <Col xs={9}>
                              <BForm.Control
                                type='file'
                                name='mobileImage'
                                onChange={(event) => handleFileChange(event, setFieldValue, 'mobileImage')}
                                onBlur={handleBlur}
                              />
                              {mobileDimension ? <small style={{ color: 'red' }}>Image dimensions must be less than or equal to 684*280 pixels.</small> :
                                <> <ErrorMessage
                                  component='div'
                                  name='mobileImage'
                                  className='text-danger'
                                />
                                </>
                              }
                            </Col>
                          </Col>
                        </Row> */}
                    {/* {!errors?.mobileImage &&
                          (type === 'Create' ? (
                            values?.mobileImage && (
                              <Row className='text-center'>
                                <Col>
                                  <img
                                    alt='not found'
                                    className='mt-2'
                                    style={{
                                      maxWidth: '100px',
                                      maxHeight: '100px',
                                    }}
                                    src={
                                      values?.mobileImage &&
                                      URL.createObjectURL(values?.mobileImage)
                                    }
                                  />
                                </Col>
                              </Row>
                            )
                          ) : (
                            <Row className='text-center'>
                              <Col>
                                <img
                                  alt='not found'
                                  className='mt-2'
                                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                                  src={
                                    values?.mobileImage
                                      ? URL.createObjectURL(values?.mobileImage)
                                      : data?.mobileImageUrl
                                  }
                                />
                              </Col>
                            </Row>
                          ))} */}
                    {/* </Col> */}

                    <Col>
                      <Row>
                        <Col className="d-flex align-items-center">
                          <Col>
                            <BForm.Label>
                              Banner
                              <span className="text-danger"> *</span>
                            </BForm.Label>
                          </Col>

                          <Col xs={9}>
                            <div className="custom-file-upload-wrap">
                              {!errors?.bannerImage &&
                                (type === "Create" ? (
                                  values?.bannerImage && (
                                    <Row className="text-center">
                                      <div
                                        style={{
                                          textAlign: "left",
                                        }}
                                      >
                                        <img
                                          alt="not found"
                                          style={{
                                            maxWidth: "200px",
                                            maxHeight: "200px",
                                            marginLeft: "0",
                                          }}
                                          src={
                                            values?.bannerImage &&
                                            URL.createObjectURL(
                                              values?.bannerImage
                                            )
                                          }
                                        />
                                      </div>
                                    </Row>
                                  )
                                ) : (
                                  <Row className="text-center">
                                    <Col>
                                      <img
                                        alt="not found"
                                        style={{
                                          maxWidth: "200px",
                                          maxHeight: "200px",
                                          marginLeft: "0",
                                        }}
                                        src={
                                          values?.bannerImage
                                            ? URL.createObjectURL(
                                                values?.bannerImage
                                              )
                                            : data?.bannerImage
                                        }
                                      />
                                    </Col>
                                  </Row>
                                ))}
                              <div className="custom-file-upload-button">
                                <BForm.Control
                                  type="file"
                                  name="bannerImage"
                                  onChange={(event) =>
                                    handleFileChange(
                                      event,
                                      setFieldValue,
                                      "bannerImage"
                                    )
                                  }
                                  onBlur={handleBlur}
                                />

                                <Button>File Upload</Button>
                              </div>
                            </div>
                            {desktopDimension ? (
                              <small style={{ color: "red" }}>
                                Image dimensions must be equal to 1013*593
                                pixels.
                              </small>
                            ) : (
                              <>
                                {" "}
                                <ErrorMessage
                                  component="div"
                                  name="bannerImage"
                                  className="text-danger"
                                />
                              </>
                            )}
                          </Col>
                        </Col>
                      </Row>
                      {/* {!errors?.bannerImage&&
                          (type === 'Create' ? (
                            values?.bannerImage && (
                              <Row className='text-center'>
                                <Col>
                                  <img
                                    alt='not found'
                                    className='mt-2'
                                    style={{
                                      maxWidth: '100px',
                                      maxHeight: '100px',
                                    }}
                                    src={
                                      values?.bannerImage &&
                                      URL.createObjectURL(values?.bannerImage)
                                    }
                                  />
                                </Col>
                              </Row>
                            )
                          ) : (
                            <Row className='text-center'>
                              <Col>
                                <img
                                  alt='not found'
                                  className='mt-2'
                                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                                  src={
                                    values?.bannerImage
                                      ? URL.createObjectURL(values?.bannerImage)
                                      : data?.bannerImage
                                  }
                                />
                              </Col>
                            </Row>
                          ))} */}
                    </Col>
                  </Row>

                  <div className="mt-4 d-flex justify-content-between align-items-center">
                    <Button variant="warning" onClick={() => setShow(false)}>
                      {t("Cancel")}
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => {
                        handleSubmit();
                        // setImage(null);
                      }}
                      className="ml-2"
                      disabled={loading}
                    >
                      {t("Submit")}
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
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditUploadImage;
