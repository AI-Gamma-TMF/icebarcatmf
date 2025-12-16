import React, { useState } from "react";

import { Formik, Form, ErrorMessage } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  Table,
} from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import {
  convertToUTC,
  formatDateMDY,
  getDateTime,
  getDateTimeByYMD,
} from "../../../utils/dateFormatter";
import Datetime from "react-datetime";
import { serialize } from "object-to-formdata";
import { toast } from "../../../components/Toast";
import {
  errorHandler,
  useCreateRaffleMutation,
} from "../../../reactQuery/hooks/customMutationHook/index.js";
import Trigger from "../../../components/OverlayTrigger/index.jsx";
import { AdminRoutes } from "../../../routes.js";
import { useNavigate } from "react-router-dom";
import { editRaffleSchema } from "../schemas.js";

const CreateRaffle = ({ _data }) => {
  const navigate = useNavigate();
  const yesterday = new Date(Date.now() - 86400000);

  const [winnerList, setWinnerList] = useState([]);
  const [showRows, setShowRows] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
  const handleButtonClick = () => {
    setShowRows(!showRows);
  };
  const handleAddButtonClick = (
    date,
    noOfWinners,
    eachAmount,
    setFieldValue
  ) => {
    if (
      date &&
      noOfWinners &&
      eachAmount &&
      !isNaN(noOfWinners) &&
      !isNaN(eachAmount)
    ) {
      setWinnerList((prev) => [
        ...prev,
        {
          date: convertToUTC(date),
          noOfWinners: noOfWinners,
          eachAmount: eachAmount,
        },
      ]);
      setFieldValue("data", new Date());
      setFieldValue("noOfWinners", "");
      setFieldValue("eachAmount", "");
      setShowRecord(true);
    } else {
      toast("Please fill in all required fields", "error");
    }
  };

  const { mutate: createRaffle, isLoading: createLoading } =
  useCreateRaffleMutation({
    onSuccess: () => {
      toast("Raffle Created Successfully", "success");
      navigate(AdminRoutes.Raffle);
    },
    onError: (error) => {
        
      errorHandler(error);
    },
  });

  const handleCreatePackageSubmit = (formValues) => {
    const body = {
      ...formValues,
      title: formValues.title,
      subHeading: formValues.subHeading,
      description: formValues.description,
      wagerBaseAmtType: formValues.wagerBaseAmtType,
      wagerBaseAmt: formValues.wagerBaseAmt,
      // startDate: formatDateYMD(formValues.startDate),
      // endDate: formatDateYMD(formValues.endDate),
      startDate: convertToUTC(formValues.startDate),
      endDate: convertToUTC(formValues.endDate),
      prizeAmountGc: formValues.prizeAmountGc,
      prizeAmountSc: formValues.prizeAmountSc,
      isActive: formValues.isActive,
      bannerImg: formValues.bannerImg,
      termsAndConditions: formValues.termsAndConditions,
      moreDetails: `${JSON.stringify(winnerList)}`,
    };
    createRaffle(serialize(body));
  };
  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Create Giveaways</h3>
        </Col>
      </Row>

      <Formik
        initialValues={{
          title: "",
          subHeading: "",
          description: "",
          wagerBaseAmt: "",
          wagerBaseAmtType: "SC",
          startDate: getDateTime(new Date(Date.now())),
          endDate: getDateTime(new Date(Date.now())),
          prizeAmountGc: 0,
          prizeAmountSc: 0,
          isActive: false,
          winnerDetails: [],
          bannerImg: "",
          termsAndConditions: "",
          date: getDateTime(new Date(Date.now())),
          noOfWinners: 0,
          eachAmount: 0,
        }}
        validationSchema={editRaffleSchema}
        onSubmit={handleCreatePackageSubmit}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
        }) => (
          <Form>
            <Row>
              <Col>
                <BForm.Label>Title</BForm.Label>

                <BForm.Control
                  type="text"
                  name="title"
                  min="0"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="title"
                  className="text-danger"
                />
              </Col>
              <Col>
                <BForm.Label>Sub Heading</BForm.Label>

                <BForm.Control
                  type="text"
                  name="subHeading"
                  min="0"
                  value={values.subHeading}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="subHeading"
                  className="text-danger"
                />
              </Col>
              <Col>
                <BForm.Label>Description</BForm.Label>

                <BForm.Control
                  type="text"
                  name="description"
                  min="0"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="description"
                  className="text-danger"
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <BForm.Label>
                  Wagerbase Amount Type
                  <span className="text-danger"> *</span>
                </BForm.Label>
                <BForm.Select
                  type="text"
                  name={"wagerBaseAmtType"}
                  value={values.wagerBaseAmtType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {
                    <>
                      <option key={"SC"} value={"SC"}>
                        SC
                      </option>
                      <option key={"GC"} value={"GC"} disabled>
                        GC
                      </option>
                    </>
                  }
                </BForm.Select>
              </Col>
              <Col>
                <BForm.Label>Wager Base Amount</BForm.Label>

                <BForm.Control
                  type="number"
                  name="wagerBaseAmt"
                  min="0"
                  value={values.wagerBaseAmt}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="wagerBaseAmt"
                  className="text-danger"
                />
              </Col>
              <Col>
                <BForm.Label>Prize Amount GC</BForm.Label>

                <BForm.Control
                  type="number"
                  name="prizeAmountGc"
                  min="0"
                  value={values.prizeAmountGc}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="prizeAmountGc"
                  className="text-danger"
                />
              </Col>
              <Col>
                <BForm.Label>Prize Amount SC</BForm.Label>

                <BForm.Control
                  type="number"
                  name="prizeAmountSc"
                  min="0"
                  value={values.prizeAmountSc}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="prizeAmountSc"
                  className="text-danger"
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <BForm.Label>
                  StartDate
                  <span className="text-danger"> *</span>
                </BForm.Label>
                <Datetime
                  inputProps={{
                    placeholder: "MM-DD-YYYY HH:MM",
                    disabled: false,
                    readOnly: true,
                  }}
                  dateFormat="MM-DD-YYYY"
                  onChange={(e) => {
                    setFieldValue("startDate", e);
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
                <ErrorMessage
                  component="div"
                  name="startDate"
                  className="text-danger"
                />
              </Col>
              <Col>
                <BForm.Label>
                  End Date
                  <span className="text-danger"> *</span>
                </BForm.Label>
                <Datetime
                  inputProps={{
                    placeholder: "MM-DD-YYYY HH:MM",
                    disabled: false,
                    readOnly: true,
                  }}
                  dateFormat="MM-DD-YYYY"
                  onChange={(e) => {
                    setFieldValue("endDate", e);
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
                <ErrorMessage
                  component="div"
                  name="endDate"
                  className="text-danger"
                />
              </Col>
              <Col>
                <BForm.Label>Active</BForm.Label>
                <BForm.Check
                  type="switch"
                  name="isActive"
                  checked={values.isActive}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  component="div"
                  name="isActive"
                  className="text-danger"
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <BForm.Label>Terms & Condition</BForm.Label>

                <BForm.Control
                  type="text"
                  name="termsAndConditions"
                  min="0"
                  value={values.termsAndConditions}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  component="div"
                  name="termsAndConditions"
                  className="text-danger"
                />
              </Col>
              <Col md={6} sm={12} className="mt-3 d-grid">
                <BForm.Label>Banner Image</BForm.Label>

                <BForm.Text>
                  <Trigger message="message" id={"mes"} />
                  <input
                    id={"mes"}
                    title=" "
                    name="bannerImg"
                    type="file"
                    onChange={(event) => {
                      setFieldValue("bannerImg", event.currentTarget.files[0]);
                    }}
                  />
                  {values?.bannerImg && (
                    <img
                      alt="not found"
                      width="100px"
                      src={URL.createObjectURL(values.bannerImg)}
                    />
                  )}
                  {/* {!values?.image && packageData?.imageUrl && (
                                        <img alt='not found' width='60px' src={packageData.imageUrl} />
                                    )} */}
                </BForm.Text>

                <ErrorMessage
                  component="div"
                  name="image"
                  className="text-danger"
                />
              </Col>
            </Row>
            <div className="mt-3">
              <>
                <Button
                  variant="outline-secondary"
                  className="f-right"
                  onClick={handleButtonClick}
                  hidden={showRows}
                >
                  Create
                </Button>
                {showRows && (
                  <>
                    <BForm.Label>
                      Note: Add the below fields to create winning detail.
                    </BForm.Label>
                    <Row className="mt-2">
                      <Col className="col-12 col-sm-4">
                        <BForm.Label>Date</BForm.Label>
                        <Datetime
                          inputProps={{
                            placeholder: "MM-DD-YYYY HH:MM",
                            disabled: false,
                            readOnly: true,
                          }}
                          dateFormat="MM/DD/YYYY"
                          onChange={(e) => {
                            setFieldValue("date", e);
                          }}
                          value={values.date}
                          isValidDate={(e) => {
                            return (
                              e._d >= yesterday ||
                              getDateTimeByYMD(e._d) ===
                                getDateTimeByYMD(new Date())
                            );
                          }}
                          timeFormat={true}
                        />
                        <ErrorMessage
                          component="div"
                          name="date"
                          className="text-danger"
                        />
                      </Col>
                      <Col className="col-12 col-sm-3">
                        <BForm.Label>No of Winners</BForm.Label>
                        <BForm.Control
                          type="number"
                          min="0"
                          placeholder="No of Winners"
                          name={"noOfWinners"}
                          value={values.noOfWinners}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          component="div"
                          name="noOfWinners"
                          className="text-danger"
                        />
                      </Col>
                      <Col className="col-12 col-sm-3">
                        <BForm.Label>Each Amount</BForm.Label>

                        <BForm.Control
                          type="number"
                          min="0"
                          placeholder="Each Amount"
                          name={"eachAmount"}
                          value={values.eachAmount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          component="div"
                          name="eachAmount"
                          className="text-danger"
                        />
                      </Col>
                      <Col className="col-12 col-sm-1">
                        <Button
                          style={{ "margin-top": "30px" }}
                          className="f-right"
                          variant="success"
                          onClick={() => {
                            handleAddButtonClick(
                              values.date,
                              values.noOfWinners,
                              values.eachAmount,
                              setFieldValue
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faPlusSquare} />
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
              </>
            </div>
            <div className="mt-4 d-flex justify-content-between align-items-center">
              <Button
                variant="warning"
                onClick={() => navigate(AdminRoutes.Raffle)}
              >
                Cancel
              </Button>

              <Button
                variant="success"
                onClick={() => {
                  handleSubmit();
                }}
                className="ml-2"
                disabled={createLoading}
              >
                Submit
                {createLoading && (
                  <Spinner
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
        )}
      </Formik>

      {showRecord && (
        <>
          <Table
            bordered
            striped
            responsive
            hover
            size="sm"
            className="text-center mt-4"
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>No. of Winners</th>
                <th>Each Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {winnerList?.length > 0 ? (
                winnerList.map((item, index) => (
                  <tr key={index}>
                    <td>{formatDateMDY(item.date)}</td>
                    <td>{item.noOfWinners}</td>
                    <td>{item.eachAmount}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          setWinnerList(
                            winnerList.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-danger text-center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default CreateRaffle;
