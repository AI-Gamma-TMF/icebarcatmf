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
  Card,
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
import "./amoe.scss";

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
    <div className="dashboard-typography amoe-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="amoe-page__title">{t("amoe.amoeHeading")}</h3>
          <p className="amoe-page__subtitle">
            Review AMOE entries, scan status, and bonus configuration
          </p>
        </div>
      </div>

      {/* Tabs for Dashboard and List Filters */}
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="amoe-tabs"
        id="amoe-tabs"
      >
        {/* Dashboard Tab */}
        <Tab eventKey="dashboard" title="Dashboard">
          <div className="w-100">
            <AmoeDashboard amoeData={AmoeData} />
          </div>
        </Tab>

        {/* Filters and List Tab */}
        <Tab eventKey="filters" title="View">
          <Card className="dashboard-filters amoe-filters-card mb-4">
            <Card.Body>
              <Row className="g-3 align-items-end">
                <Col xs={12} lg={4}>
                  <Form.Label className="fw-bold">Amoe Bonus (in days)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      autoComplete="off"
                      value={amoeBonusTime}
                      onChange={(e) => setAmoeBonusTime(e.target.value)}
                      disabled={!isEditable}
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()
                      }
                    />
                  </InputGroup>
                  {errorMessage && <small className="text-danger">{errorMessage}</small>}
                </Col>

                <Col xs={12} lg="auto">
                  <div className="amoe-inline-actions">
                    {isEditable ? (
                      <>
                        <Trigger message="Update" id={"update"} />
                        <Button
                          id={"update"}
                          variant="warning"
                          onClick={handleUpdateClick}
                          disabled={
                            isUpdating ||
                            amoeBonusTime === AmoeData?.amoeBonusHistory?.amoeBonusTime
                          }
                        >
                          {isUpdating ? (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              style={{ marginLeft: "3px" }}
                            />
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
                          variant="primary"
                          onClick={handleEditClick}
                          hidden={isHidden({ module: { key: "Amoe", value: "U" } })}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="dashboard-filters amoe-filters-card mb-3">
            <Card.Body>
              <Row className="g-3">
                <Col xs={12} md={6} lg={4}>
                  <Form.Label>{t("amoe.filters.startDate")}</Form.Label>
                  <Datetime
                    key={startDate}
                    inputProps={{ readOnly: true }}
                    value={startDate}
                    onChange={handleStartDateChange}
                    timeFormat={false}
                  />
                  {errorStart && <div className="text-danger mt-1">{errorStart}</div>}
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Label>{t("amoe.filters.endDate")}</Form.Label>
                  <Datetime
                    key={endDate}
                    inputProps={{ readOnly: true }}
                    value={endDate}
                    onChange={handleEndDateChange}
                    timeFormat={false}
                  />
                  {errorEnd && <div className="text-danger mt-1">{errorEnd}</div>}
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Label>{t("amoe.filters.scannedDate")}</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Datetime
                      key={scannedDate}
                      inputProps={{ placeholder: "MM-DD-YYYY", readOnly: true }}
                      value={scannedDate}
                      onChange={(date) => setScannedDate(date)}
                      timeFormat={false}
                    />
                    <Trigger message="Reset Filters" id={"redo"} />
                    <Button id={"redo"} variant="secondary" onClick={resetFilters}>
                      <FontAwesomeIcon icon={faRedoAlt} />
                    </Button>
                  </div>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Label>Entry Id</Form.Label>
                  <Form.Control
                    value={entryId}
                    placeholder="Search By Entry Id"
                    onChange={(event) =>
                      setEntryId(event.target.value.replace(/[~`%^#)()><?]+/g, "").trim())
                    }
                  />
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    onChange={(e) => setStatus(e.target.value)}
                    value={status}
                  >
                    <option value="1">Success</option>
                    <option value="2">Failed</option>
                  </Form.Select>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Form.Label>{t("amoe.filters.search")}</Form.Label>
                  <Form.Control
                    value={search}
                    placeholder="Search By Email"
                    onChange={(event) =>
                      setSearch(event.target.value.replace(/[~`%^#)()><?]+/g, "").trim())
                    }
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>

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
    </div>
  );
};

export default AmoeData;
