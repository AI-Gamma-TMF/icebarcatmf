import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Form,
  InputGroup,
  Spinner,
  Tabs,
  Tab,
} from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import Datetime from "react-datetime";
import Trigger from "../OverlayTrigger";
import AmoeList from "./AmoeList";
import useAmoeList from "../../pages/PlayerDetails/hooks/useAmoeList";
import { useUpdateAmoeBonusTime } from "../../reactQuery/hooks/customMutationHook";
import { toast } from "../Toast";
import AmoeDashboard from "./AmoeDashboard";
import useCheckPermission from "../../utils/checkPermission";

const AmoeData = () => {
  const {
    t,
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    AmoeRefetch,
    AmoeData,
    loading,
    search,
    setSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    scannedDate,
    setScannedDate,
    resetFilters,
    status,
    setStatus,
    entryId,
    setEntryId,
    queryClient,
  } = useAmoeList({ isUTC: false });

  const [isEditable, setIsEditable] = useState(false);
  const [amoeBonusTime, setAmoeBonusTime] = useState(
    Number(AmoeData?.amoeBonusHistory?.amoeBonusTime)
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [key, setKey] = useState("dashboard"); // State for managing the active tab
  const { isHidden } = useCheckPermission();
  const [errorEnd, setErrorEnd] = useState("");
  const [errorStart, setErrorStart] = useState("");
  const { mutate: updateAmoeBonusTime, isLoading: isUpdating } =
    useUpdateAmoeBonusTime({
      onSuccess: (res) => {
        toast(res?.data?.message, "success");
        queryClient.invalidateQueries({
          queryKey: ["AmoeList"],
        });
      },
    });

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleUpdateClick = async () => {
    setErrorMessage("");

    const amoeBonus = Number(amoeBonusTime);
    if (!amoeBonus) {
      setErrorMessage("Bonus Time should be greater than 0.");
      return;
    }

    // Validate the bonus time
    if (isNaN(amoeBonus)) {
      setErrorMessage("Please enter a valid number.");
      return;
    }

    if (amoeBonusTime <= 0) {
      setErrorMessage("Bonus Time should be greater than 0.");
      return;
    }
    try {
      const payload = {
        amoeBonusTime: amoeBonusTime,
      };
      await updateAmoeBonusTime(payload);
      setIsEditable(false);
    } catch (error) {
      console.error("Error updating bonus time:", error);
    }
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
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
  useEffect(() => {
    if (AmoeData?.amoeBonusHistory?.amoeBonusTime !== undefined) {
      setAmoeBonusTime(AmoeData.amoeBonusHistory.amoeBonusTime);
    }
  }, [AmoeData]);

  return (
    <>
      <Row className="mb-3">
        <Col sm={12}>
          <h3>{t("amoe.amoeHeading")}</h3>
        </Col>
      </Row>

      {/* Tabs for Dashboard and List Filters */}
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="ps-2"
        id="amoe-tabs"
      >
        {/* Dashboard Tab */}
        <Tab eventKey="dashboard" title="Dashboard">
          <div className="w-100 m-auto">
            <AmoeDashboard amoeData={AmoeData} />
          </div>
        </Tab>

        {/* Filters and List Tab */}
        <Tab eventKey="filters" title="View">
          <div className=" d-flex mt-5 w-100 justify-content-between mb-3">
            <Col className="col-lg-4 d-flex gap-2  align-items-end ">
              <div>
                <label className="fw-bold form-label">
                  Amoe Bonus (in days)
                </label>
                <span className="mb-0">
                  <InputGroup>
                    <input
                      type="number"
                      className="form-control"
                      autoComplete="off"
                      value={amoeBonusTime}
                      onChange={(e) => setAmoeBonusTime(e.target.value)}
                      disabled={!isEditable}
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-", "."].includes(evt.key) &&
                        evt.preventDefault()
                      }
                    />
                  </InputGroup>
                  {errorMessage && (
                    <small className="text-danger">{errorMessage}</small>
                  )}
                </span>
              </div>

              {isEditable ? (
                <>
                  <Trigger message="Update" id={"update"} />
                  <Button
                    id={"update"}
                    variant="warning"
                    onClick={handleUpdateClick}
                    className="ml-2 mt-4"
                    style={{ maxHeight: "44px" }}
                    disabled={
                      isUpdating ||
                      amoeBonusTime ===
                        AmoeData?.amoeBonusHistory?.amoeBonusTime
                    }
                  >
                    {isUpdating ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          style={{ marginLeft: "3px" }}
                        />
                      </>
                    ) : (
                      "Update"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Trigger message="Edit" id={"edit"} />
                  <Button
                    id={"edit"}
                    className="mt-4"
                    variant="primary"
                    onClick={handleEditClick}
                    style={{ maxHeight: "44px" }}
                    hidden={isHidden({ module: { key: "Amoe", value: "U" } })}
                  >
                    Edit
                  </Button>
                </>
              )}
            </Col>
          </div>

          <Row className="w-100 m-auto py-2 px-3 rounded bg-light mt-2">
            <Row>
              <Col className="col-lg-4 col-sm-6 col-12 mt-2 mt-sm-0">
                <Form.Label>{t("amoe.filters.startDate")}</Form.Label>
                <Datetime
                  key={startDate}
                  inputProps={{ readOnly: true }}
                  value={startDate}
                  onChange={handleStartDateChange}
                  timeFormat={false}
                />
                {errorStart && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {errorStart}
                  </div>
                )}
              </Col>
              <Col className="col-lg-4 col-sm-6 col-12 mt-2 mt-sm-0">
                <Form.Label>{t("amoe.filters.endDate")}</Form.Label>
                <Datetime
                  key={endDate}
                  inputProps={{ readOnly: true }}
                  value={endDate}
                  onChange={handleEndDateChange}
                  timeFormat={false}
                />
                {errorEnd && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {errorEnd}
                  </div>
                )}
              </Col>
              <Col className="col-lg-4 gap-2 col-sm-6 col-12 mt-2 mt-sm-0">
                <Form.Label>{t("amoe.filters.scannedDate")}</Form.Label>
                <div className="d-flex scan-date align-items-center gap-2">
                  <Datetime
                    key={scannedDate}
                    inputProps={{
                      placeholder: "MM-DD-YYYY",
                      readOnly: true,
                    }}
                    style={{ width: "100%" }}
                    value={scannedDate}
                    onChange={(date) => setScannedDate(date)}
                    timeFormat={false}
                  />

                  <Trigger message="Reset Filters" id={"redo"} />
                  <Button
                    id={"redo"}
                    variant="success"
                    onClick={resetFilters}
                    // className="mt-4"
                  >
                    <FontAwesomeIcon icon={faRedoAlt} />
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  // type="search"
                  value={entryId}
                  placeholder="Search By Entry Id"
                  className="w-full rounded "
                  style={{ appearance: "none" }}
                  onChange={(event) =>
                    setEntryId(
                      event.target.value.replace(/[~`%^#)()><?]+/g, "").trim()
                    )
                  }
                />
                {/* <FontAwesomeIcon style={{ position: 'absolute', right: '15px', top: '44px' }} icon={faMagnifyingGlass} /> */}
              </Col>
              <Col style={{ marginRight: "15px" }}>
                <Form.Label
                  column="sm"
                  style={{ marginBottom: "0", marginRight: "15px" }}
                >
                  Status
                </Form.Label>

                <Form.Select
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  value={status}
                  style={{ minWidth: "230px" }}
                >
                  <option value="1">Success</option>
                  <option value="2">Failed</option>
                </Form.Select>
              </Col>

              <Col>
                <Form.Label>{t("amoe.filters.search")}</Form.Label>
                <Form.Control
                  // type="search"
                  value={search}
                  placeholder="Search By Email"
                  className="w-full rounded "
                  style={{ appearance: "none" }}
                  onChange={(event) =>
                    setSearch(
                      event.target.value.replace(/[~`%^#)()><?]+/g, "").trim()
                    )
                  }
                />
                {/* <FontAwesomeIcon style={{ position: 'absolute', right: '15px', top: '44px' }} icon={faMagnifyingGlass} /> */}
              </Col>
            </Row>
          </Row>

          <AmoeList
            page={page}
            setLimit={setLimit}
            limit={limit}
            setPage={setPage}
            totalPages={totalPages}
            data={AmoeData}
            loading={loading}
            amoeRefetch={AmoeRefetch}
            status={status}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default AmoeData;
