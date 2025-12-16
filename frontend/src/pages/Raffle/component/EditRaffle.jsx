import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  Table,
} from "@themesberg/react-bootstrap";
import {
  convertToUTC,
  getDateTime,
  getDateTimeByYMD,
} from "../../../utils/dateFormatter.js";
import Datetime from "react-datetime";
import { serialize } from "object-to-formdata";
import { toast } from "../../../components/Toast/index.jsx";
import {
  errorHandler,
  useUpdateRaffleMutation,
} from "../../../reactQuery/hooks/customMutationHook/index.js";
import Trigger from "../../../components/OverlayTrigger/index.jsx";
import { AdminRoutes } from "../../../routes.js";
import { getRaffleDetail } from "../../../utils/apiCalls.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { editRaffleSchema } from "../schemas.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCancel, faSave, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

const EditRaffle = ({ _data }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editRowId, setEditRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const { raffleId } = useParams();
  const yesterday = new Date(Date.now() - 86400000);
  // const [winnerList, setWinnerList] = useState([]);
  const [showRows, setShowRows] = useState(false);
  const [showWarring, setShowWarring] = useState(false);
  const [errorsNoOfWinner, setErrorsNoOfWinner] = useState({ noOfWinners: "" });
  const [errorsEachAmount, setErrorsEachAmount] = useState({ eachAmount: "" });

  const handleNoOfWinnersChange = (event) => {
    const value = event.target.value;

    // Allow only whole numbers
    if (value.includes(".") || value.includes(",")) {
      setErrorsNoOfWinner((prev) => ({
        ...prev,
        noOfWinners: "Decimal value not allowed",
      }));
    } else {
      setErrorsNoOfWinner((prev) => ({
        ...prev,
        noOfWinners: "",
      }));
    }

    setEditValues((prev) => ({
      ...prev,
      noOfWinners: value,
    }));
  };
  const handleEachAmountChange = (event) => {
    const value = event.target.value;

    // Allow only whole numbers
    if (value.includes(".") || value.includes(",")) {
      setErrorsEachAmount((prev) => ({
        ...prev,
        eachAmount: "Decimal value not allowed",
      }));
    } else {
      setErrorsEachAmount((prev) => ({
        ...prev,
        eachAmount: "",
      }));
    }

    setEditValues((prev) => ({
      ...prev,
      eachAmount: value,
    }));
  };
  const handleButtonClick = () => {
    setShowRows(!showRows);
  };
  const handleAddButtonClick = (
    date,
    noOfWinners,
    eachAmount,
    moreDetails,
    setFieldValue
  ) => {
    if (
      date &&
      noOfWinners &&
      eachAmount &&
      !isNaN(noOfWinners) &&
      !isNaN(eachAmount)
    ) {
      const newDetail = {
        date: convertToUTC(date),
        noOfWinners: noOfWinners,
        eachAmount: eachAmount,
      };
      const existingDetail = moreDetails || [];
      const alreadyExists = existingDetail.some(
        (pkg) => pkg.date === newDetail.date
      );
      if (alreadyExists) {
        toast(`Detail with the same date already exists in the list`, "error");
        return;
      }
      setFieldValue("moreDetails", [...existingDetail, newDetail]);
      setFieldValue("data", new Date());
      setFieldValue("noOfWinners", "");
      setFieldValue("eachAmount", "");
    } else {
      toast("Please fill in all required fields", "error");
    }
  };

  const { data: raffleDetail, refetch } = useQuery({
    queryKey: ['raffleDetail', raffleId],
    queryFn: () => {
      return getRaffleDetail(raffleId);
    },
    select: (res) => res?.data?.getRaffleDetail,
    refetchOnWindowFocus: false,
  });
  const { mutate: updateRaffle, isLoading: createLoading } =
    useUpdateRaffleMutation({
      onSuccess: () => {
        queryClient.invalidateQueries(['raffleDetail', raffleId], {
          refetchActive: true,
          refetchInactive: true,
        });
        toast("Raffle Updated Successfully", "success");
        navigate(AdminRoutes.Raffle);
      },
      onError: (error) => {
        toast(error.response.data.errors[0].description, "error");
        errorHandler(error);
      },
    });

  useEffect(() => {
    refetch();
  }, [raffleDetail, refetch]);

  const handleMoreDetalEditSubmit = (moreDetails, setFieldValue) => {
    setShowWarring(false);
    const existingDetail = moreDetails || [];
    const alreadyExists = existingDetail.some(
      (pkg) => +pkg.date === +editValues.date && pkg.date !== editRowId
    );

    if (alreadyExists) {
      toast(
        `Package with the same interval already exists in the list`,
        "error"
      );
      return;
    }
    const updatedMoreDetails = existingDetail.map((item, idx) =>
      idx === editValues.index
        ? {
            ...item,
            date: editValues.date,
            eachAmount: Number(editValues.eachAmount),
            noOfWinners: Number(editValues.noOfWinners),
          }
        : item
    );
    setFieldValue("moreDetails", updatedMoreDetails);

    setEditRowId(null);
  };

  const handleEditClick = (row, id) => {
    setShowWarring(true);
    setEditRowId(id);
    setEditValues({
      index: id,
      date: row.date,
      noOfWinners: row.noOfWinners,
      eachAmount: row.eachAmount,
    });
  };
  const handleEditRaffleSubmit = (formValues) => {
    const body = {
      ...formValues,
      raffleId: raffleId,
      title: formValues.title,
      subHeading: formValues.subHeading,
      description: formValues.description,
      wagerBaseAmtType: formValues.wagerBaseAmtType,
      wagerBaseAmt: formValues.wagerBaseAmt,
      startDate: convertToUTC(formValues.startDate),
      endDate: convertToUTC(formValues.endDate),
      prizeAmountGc: formValues.prizeAmountGc,
      prizeAmountSc: formValues.prizeAmountSc,
      isActive: formValues.isActive,
      winnerDetails: formValues?.winnerDetails ? formValues.winnerDetails : [],
      bannerImg: formValues.bannerImg,
      noOfWinners: formValues.noOfWinners,
      eachAmount: formValues.eachAmount,
      date: convertToUTC(formValues.date),
      termsAndConditions: formValues.termsAndConditions,
      moreDetails: formValues?.moreDetails?.length
        ? JSON.stringify(formValues?.moreDetails)
        : null,
    };
    updateRaffle(serialize(body));
  };
  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Edit Giveaways</h3>
        </Col>
      </Row>
      {raffleDetail ? (
        <Formik
          initialValues={{
            title: raffleDetail?.title,
            subHeading: raffleDetail?.subHeading,
            description: raffleDetail?.description,
            wagerBaseAmtType: raffleDetail?.wagerBaseAmtType,
            wagerBaseAmt: raffleDetail?.wagerBaseAmt,
            startDate: raffleDetail?.startDate
              ? getDateTime(raffleDetail?.startDate)
              : new Date(),
            endDate: raffleDetail?.startDate
              ? getDateTime(raffleDetail?.endDate)
              : new Date(),
            prizeAmountGc: raffleDetail?.prizeAmountGc,
            prizeAmountSc: raffleDetail?.prizeAmountSc,
            isActive: raffleDetail?.isActive,
            termsAndConditions: raffleDetail?.termsAndConditions,
            moreDetails: raffleDetail.moreDetails,
          }}
          validationSchema={editRaffleSchema}
          enableReinitialize={true}
          onSubmit={handleEditRaffleSubmit}
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
                    dateFormat="MM/DD/YYYY"
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
                    dateFormat="MM/DD/YYYY"
                    onChange={(e) => {
                      setFieldValue("endDate", e);
                    }}
                    value={values.endDate}
                    isValidDate={(e) => {
                      return (
                        e._d >= yesterday ||
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
                <Col className="d-grid">
                  <BForm.Label>Banner Image</BForm.Label>

                  <BForm.Text>
                    <Trigger message="mes" id={"mes"} />
                    <input
                      id={"mes"}
                      title=" "
                      name="bannerImg"
                      type="file"
                      onChange={(event) => {
                        setFieldValue(
                          "bannerImg",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                    {values?.bannerImg && (
                      <img
                        alt="not found"
                        width="100px"
                        src={URL.createObjectURL(values?.bannerImg)}
                      />
                    )}
                    {!values?.bannerImg && raffleDetail?.imageUrl && (
                      <img
                        alt="not found"
                        width="60px"
                        src={raffleDetail?.imageUrl}
                      />
                    )}
                  </BForm.Text>

                  <ErrorMessage
                    component="div"
                    name="bannerImg"
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
                                values.moreDetails,
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
                {showWarring && (
                  <p className="text-danger">
                    Please &apos;Save&apos; before submitting if you have made
                    any edits to the Detail.
                  </p>
                )}
                <Table
                  bordered
                  striped
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
                    {values.moreDetails?.length > 0 ? (
                      values.moreDetails?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {editRowId === index ? (
                              <>
                                <Datetime
                                  inputProps={{
                                    placeholder: "MM-DD-YYYY HH:MM",
                                    disabled: false,
                                    readOnly: true,
                                  }}
                                  dateFormat="MM/DD/YYYY"
                                  onChange={(event) => {
                                    setEditValues((prev) => ({
                                      ...prev,
                                      date: event,
                                    }));
                                  }}
                                  value={
                                    getDateTimeByYMD(editValues.date) || ""
                                  }
                                  isValidDate={(e) => {
                                    return (
                                      e._d >= yesterday ||
                                      getDateTimeByYMD(e._d) ===
                                        getDateTimeByYMD(new Date())
                                    );
                                  }}
                                  timeFormat={true}
                                />
                              </>
                            ) : (
                              getDateTimeByYMD(item.date)
                            )}
                          </td>
                          <td>
                            {editRowId === index ? (
                              <>
                                <BForm.Control
                                  type="number"
                                  min="1"
                                  placeholder="No of Winners"
                                  name="noOfWinners"
                                  value={editValues.noOfWinners}
                                  onChange={handleNoOfWinnersChange}
                                />
                                {errorsNoOfWinner.noOfWinners && (
                                  <div
                                    style={{
                                      color: "red",
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    {errorsNoOfWinner.noOfWinners}
                                  </div>
                                )}
                              </>
                            ) : (
                              item.noOfWinners
                            )}
                          </td>
                          <td>
                            {editRowId === index ? (
                              <>
                                <BForm.Control
                                  type="number"
                                  min="1"
                                  placeholder="Each Amount"
                                  name={"eachAmount"}
                                  value={editValues.eachAmount || ""}
                                  onChange={handleEachAmountChange}
                                />
                                {errorsEachAmount.eachAmount && (
                                  <div
                                    style={{
                                      color: "red",
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    {errorsEachAmount.eachAmount}
                                  </div>
                                )}
                              </>
                            ) : (
                              item.eachAmount
                            )}
                          </td>
                          <td>
                            {editRowId === index ? (
                              <>
                                <Trigger message={"Save"} id={index + "save"} />
                                <Button
                                  id={index + "save"}
                                  className="m-1"
                                  size="sm"
                                  variant="warning"
                                  disabled={
                                    errorsEachAmount.eachAmount ||
                                    errorsNoOfWinner.noOfWinners
                                  }
                                  onClick={() =>
                                    handleMoreDetalEditSubmit(
                                      values?.moreDetails,
                                      setFieldValue
                                    )
                                  }
                                >
                                  <FontAwesomeIcon icon={faSave} />
                                </Button>
                                <Trigger
                                  message={"Cancel"}
                                  id={index + "cancel"}
                                />

                                <Button
                                  id={index + "cancel"}
                                  className="m-1"
                                  size="sm"
                                  variant="warning"
                                  onClick={() => {
                                    setEditRowId(null), setShowWarring(false);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faCancel} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Trigger message={"Edit"} id={index + "edit"} />
                                <Button
                                  id={index + "edit"}
                                  className="m-1"
                                  size="sm"
                                  variant="warning"
                                  onClick={() => handleEditClick(item, index)}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                              </>
                            )}
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
                  disabled={
                    createLoading ||
                    errorsEachAmount.eachAmount ||
                    errorsNoOfWinner.noOfWinners
                  }
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default EditRaffle;
