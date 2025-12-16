import {
  faArrowAltCircleDown,
  faArrowAltCircleUp,
} from "@fortawesome/free-regular-svg-icons";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  Table,
} from "@themesberg/react-bootstrap";
import { Formik, Form, ErrorMessage } from "formik";
import moment from "moment";
import { useState } from "react";
import Datetime from "react-datetime";
import { useNavigate, useParams } from "react-router-dom";

import { DeleteConfirmationModal } from "../../../components/ConfirmationModal/index.jsx";
import Trigger from "../../../components/OverlayTrigger/index.jsx";
import PaginationComponent from "../../../components/Pagination/index.jsx";
import { InlineLoader } from "../../../components/Preloader/index.jsx";
import { AdminRoutes } from "../../../routes.js";
import useCheckPermission from "../../../utils/checkPermission.js";
import { gameDiscountRateTableHeaders } from "../constant.js";
import useEditGameDiscountRate from "../hooks/useEditGameDiscountRate.js";
import { editProviderRateMatrixSchema } from "../schema.js";
import {
  getFormattedTimeZoneOffset,
} from "../../../utils/helper.js";
import { timeZones } from "../../Dashboard/constants.js";
import { getItem } from "../../../utils/storageUtils.js";
import {
  formatDateDDMMMYYYY,
} from "../../../utils/dateFormatter.js";

const EditGameDiscountRate = () => {
  const navigate = useNavigate();
  const { categoryGameId } = useParams();
  const { isHidden } = useCheckPermission();
  const {
    gameDiscountRate,
    loading,
    handleEditProviderRateSubmit,
    handleCreateSubmit,
    updateLoading,
    isInitialValues,
    setIsInitialValues,
    setOrderBy,
    selected,
    over,
    setOver,
    sort,
    setSort,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    handleDelete,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    deleteLoading,

    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useEditGameDiscountRate(categoryGameId);
  const timeZone = getItem("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();

  const [selectedMatrix, setSelectedMatrix] = useState(null);

  const [errorEnd, setErrorEnd] = useState("");
  const [errorStart, setErrorStart] = useState("");

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (!endDate) {
      if (date > new Date()) {
        setEndDate(date);
      } else setEndDate(new Date());
    }
    if (endDate && date && date.isAfter(endDate)) {
      setErrorStart("Start date cannot be greater than end date.");
    } else {
      setErrorEnd("");
      setErrorStart("");
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date && date.isBefore(startDate)) {
      setErrorEnd("End date must be greater than the start date.");
    } else {
      setErrorStart("");
      setErrorEnd("");
    }
  };

  // console.log('rateMatrixList ::', aggregatorNameOptions, providerNameOptions, totalPages, rateMatrixList);

  // const handleMonthYearChange = (date, event) => {
  //   const selectedDate = moment(date);
  //   const today = moment();

  //   const start = selectedDate.clone().startOf("month");

  //   // If selected month is current month, set end to today
  //   const end = selectedDate.isSame(today, "month")
  //     ? today.clone().endOf("day")
  //     : selectedDate.clone().endOf("month");

  //   setStartDate(start);
  //   setEndDate(end);
  //   setErrorStart("");
  //   setErrorEnd("");
  // };

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Game Discount Rate</h3>
        </Col>
      </Row>
      <Formik
        enableReinitialize={isInitialValues}
        initialValues={{
          discountPercentage: selectedMatrix?.discountPercentage ?? "",
          gameMonthlyDiscountId: selectedMatrix?.gameMonthlyDiscountId ?? "",
          startDate: selectedMatrix?.startMonthDate
            ? moment.utc(selectedMatrix.startMonthDate)
            : null,
          endDate: selectedMatrix?.endMonthDate
            ? moment.utc(selectedMatrix.endMonthDate)
            : null,
        }}
        validationSchema={editProviderRateMatrixSchema}
        onSubmit={(values, actions) => {
          const finalValues = {
            ...values,
            startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
            endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
          };

          if (selectedMatrix) {
            handleEditProviderRateSubmit(finalValues);
          } else {
            handleCreateSubmit(finalValues);
          }

          actions.resetForm();
          setSelectedMatrix(null);
        }}
      >
        {({ values, handleChange, handleSubmit, handleBlur, setValues }) => (
          <Form>
            <Row>
              <Col sm={6} lg={3}>
                <BForm.Label className="mb-1 mt-2">
                  Select Month (Start - End){" "}
                  <span className="text-danger">*</span>
                </BForm.Label>
                <Datetime
                  dateFormat="MMMM YYYY"
                  timeFormat={false}
                  value={values.startDate}
                  onChange={(date) => {
                    const selectedDate = moment.utc(date);
                    const start = selectedDate.clone().startOf("month");
                    const end = selectedDate.clone().endOf("month");

                    setValues({
                      ...values,
                      startDate: start,
                      endDate: end,
                    });
                  }}
                  closeOnSelect
                  inputProps={{
                    readOnly: true,
                    placeholder: "Select Month",
                    value:
                      values.startDate && values.endDate
                        ? `${values.startDate.format("DD MMM YYYY")} - ${values.endDate.format("DD MMM YYYY")}`
                        : ""
                  }}
                  isValidDate={() => true}
                // isValidDate={(currentDate) =>
                //   currentDate.isSameOrAfter(moment(), "month")
                // }
                />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="text-danger"
                />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="text-danger"
                />
              </Col>
              <Col sm={6} lg={3}>
                <BForm.Label className="mb-1 mt-2">
                  Discount Percentage (%) <span className="text-danger">*</span>
                </BForm.Label>
                <BForm.Control
                  type="number"
                  name="discountPercentage"
                  placeholder="Enter Discount Percentage"
                  value={values.discountPercentage}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  min={0}
                  max={100}
                  onWheel={(e) => e.target.blur()}
                />
                <ErrorMessage
                  name="discountPercentage"
                  component="div"
                  className="text-danger"
                />
              </Col>
            </Row>

            <div className="mt-4 d-flex justify-content-between align-items-center">
              <Button
                variant="warning"
                onClick={() => navigate(AdminRoutes.CasinoGames)}
              >
                Cancel
              </Button>
              <div>
                {selectedMatrix && (
                  <Button
                    variant="secondary mx-2"
                    onClick={() => setSelectedMatrix(null)}
                  >
                    Reset
                  </Button>
                )}

                <Button
                  variant="success"
                  onClick={handleSubmit}
                  hidden={isHidden({
                    module: {
                      key: "CasinoManagement",
                      value: selectedMatrix ? "U" : "C",
                    },
                  })}
                // disabled={updateLoading || !dirty}
                >
                  {selectedMatrix ? "Update Rate" : "Add Rate"}
                  {updateLoading && (
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
            </div>
          </Form>
        )}
      </Formik>

      <Row className="mt-4">
        <Col xs="auto">
          <h5 className="mb-0">Game Discount Rate Table</h5>
        </Col>
        <Row className="mt-4">
          <Col sm={6} lg={2}>
            <BForm.Label
              style={{
                marginBottom: "0",
                marginRight: "15px",
                marginTop: "5px",
              }}
            >
              Start Date
            </BForm.Label>
            <Datetime
              key={startDate}
              value={startDate}
              onChange={handleStartDateChange}
              timeFormat={false}
              inputProps={{ placeholder: "MM/DD/YYYY", readOnly: true }}
            />
            {errorStart && (
              <div style={{ color: "red", marginTop: "5px" }}>{errorStart}</div>
            )}
          </Col>

          <Col sm={6} lg={2}>
            <BForm.Label
              style={{
                marginBottom: "0",
                marginRight: "15px",
                marginTop: "5px",
              }}
            >
              End Date
            </BForm.Label>
            <Datetime
              key={endDate || "disabled"}
              value={endDate}
              timeFormat={false}
              onChange={handleEndDateChange}
              inputProps={{
                placeholder: "MM/DD/YYYY",
                disabled: startDate === "",
                readOnly: true,
              }}
            />
            {errorEnd && (
              <div style={{ color: "red", marginTop: "5px" }}>{errorEnd}</div>
            )}
          </Col>

          {/* <Col sm={6} lg={2}>
            <BForm.Label
              style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}
            >
              Select Month
            </BForm.Label>

            <Datetime
              dateFormat="MMMM YYYY"
              timeFormat={false}
              value={startDate}
              onChange={handleMonthYearChange}
              closeOnSelect={true} // this is key
              inputProps={{ placeholder: "Select Month", readOnly: true }}
              isValidDate={(currentDate) => {
                // Disallow future months and years
                return currentDate.isSameOrBefore(moment(), 'month');
              }}
            />
            {(errorStart || errorEnd) && (
              <div style={{ color: "red", marginTop: "5px" }}>
                {errorStart || errorEnd}
              </div>
            )}
          </Col> */}
        </Row>

        <Table
          bordered
          striped
          responsive
          hover
          size="sm"
          className="text-center mt-4"
        >
          <thead className="thead-dark">
            <tr>
              {gameDiscountRateTableHeaders.map((h, idx) => (
                <th
                  key={idx}
                  onClick={() => h.value !== "action" && setOrderBy(h.value)}
                  style={{ cursor: h.value !== "action" && "pointer" }}
                  className={selected(h) ? "border-3 border border-blue" : ""}
                >
                  {h.labelKey}{" "}
                  {selected(h) &&
                    (sort === "ASC" ? (
                      <FontAwesomeIcon
                        style={over ? { color: "red" } : {}}
                        icon={faArrowAltCircleUp}
                        onClick={() => setSort("DESC")}
                        onMouseOver={() => setOver(true)}
                        onMouseLeave={() => setOver(false)}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={over ? { color: "red" } : {}}
                        icon={faArrowAltCircleDown}
                        onClick={() => setSort("ASC")}
                        onMouseOver={() => setOver(true)}
                        onMouseLeave={() => setOver(false)}
                      />
                    ))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center">
                  <InlineLoader />
                </td>
              </tr>
            ) : gameDiscountRate?.gameMonthlyDiscountDetail?.rows?.length >
              0 ? (
              gameDiscountRate?.gameMonthlyDiscountDetail?.rows?.map(
                ({
                  gameMonthlyDiscountId,
                  startMonthDate,
                  endMonthDate,
                  discountPercentage,
                }) => (
                  <tr key={gameMonthlyDiscountId}>
                    <td> {formatDateDDMMMYYYY(startMonthDate)}</td>
                    <td>{formatDateDDMMMYYYY(endMonthDate)}</td>
                    <td>{discountPercentage ?? "-"}</td>
                    <td>
                      <Trigger
                        message="Edit"
                        id={gameMonthlyDiscountId + "edit"}
                      />
                      <Button
                        id={gameMonthlyDiscountId + "edit"}
                        hidden={isHidden({
                          module: { key: "CasinoManagement", value: "U" },
                        })}
                        className="m-1"
                        size="sm"
                        variant="warning"
                        onClick={() => {
                          setSelectedMatrix({
                            gameMonthlyDiscountId,
                            startMonthDate,
                            endMonthDate,
                            discountPercentage,
                          });
                          setIsInitialValues(true);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>

                      <Trigger
                        message="Delete"
                        id={gameMonthlyDiscountId + "delete"}
                      />
                      <Button
                        id={gameMonthlyDiscountId + "delete"}
                        hidden={isHidden({
                          module: { key: "CasinoManagement", value: "D" },
                        })}
                        className="m-1"
                        size="sm"
                        variant="warning"
                        onClick={() => handleDelete(gameMonthlyDiscountId)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan={4} className="text-danger text-center">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {gameDiscountRate?.gameMonthlyDiscountDetail?.count !== 0 && (
          <PaginationComponent
            page={
              gameDiscountRate?.gameMonthlyDiscountDetail?.count < page
                ? setPage(1)
                : page
            }
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}

        {deleteModalShow && (
          <DeleteConfirmationModal
            deleteModalShow={deleteModalShow}
            setDeleteModalShow={setDeleteModalShow}
            handleDeleteYes={handleDeleteYes}
            loading={deleteLoading}
          />
        )}
      </Row>
    </div>
  );
};

export default EditGameDiscountRate;
