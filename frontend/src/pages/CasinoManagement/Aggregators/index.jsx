import { Button, Row, Col, Table, Form, Card } from "@themesberg/react-bootstrap";
import PaginationComponent from "../../../components/Pagination";
import {
  ConfirmationModal,
  HideConfirmationModal,
} from "../../../components/ConfirmationModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Trigger from "../../../components/OverlayTrigger";
import useAggregatorListing from "./useAggregatorListing";
import CreateAggregator from "./components/CreateAggregator";
import useCheckPermission from "../../../utils/checkPermission";
import {
  faCheckSquare,
  faWindowClose,
  faArrowCircleUp,
  faArrowCircleDown,
  faRedoAlt,
  faFan,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { hideAggregatorMsg, tableHeaders } from "./constants";
import { InlineLoader } from "../../../components/Preloader";
import "./aggregators.scss";
const CasinoAggregator = () => {
  const {
    aggregators,
    limit,
    setLimit,
    page,
    setPage,
    search,
    setSearch,
    // setCategoryFilter,
    // categoryFilter,
    // statusFilter,
    // setStatusFilter,
    totalPages,
    handleStatusShow,
    handleYes,
    statusShow,
    setStatusShow,
    show,
    handleClose,
    handleShow,
    loading,
    isFetching,
    status,
    t,
    createAggregator,
    name,
    setOrderBy,
    selected,
    sort,
    setSort,
    over,
    setOver,
    updateloading,
    aggregatorStatus,
    setAggregatorStatus,
    handleFreeSpin,
    hideModalShow,
    setHideModalShow,
    handleHideYes,
    hideLoading,
    handleHide,
    setFreeSpinStatusShow,
    handleFreeSpinYes,
    freeSpinStatusShow,
    freeSpinstatus,
    updateFreeSpinloading,
  } = useAggregatorListing();
  const { isHidden } = useCheckPermission();

  const resetFilters = () => {
    setSearch("");
    setAggregatorStatus("all");
  };

  return (
    <div className="aggregators-page dashboard-typography">
      <Row className="d-flex align-items-center mb-2">
        <Col sm={8}>
          <h3 className="aggregators-page__title">Casino Aggregators</h3>
        </Col>
        <Col sm={4} className="d-flex justify-content-end">
          <Button
            variant="success"
            size="sm"
            className="aggregators-page__create-btn"
            onClick={handleShow}
            hidden={isHidden({ module: { key: "CasinoManagement", value: "C" } })}
          >
            Create
          </Button>
        </Col>
      </Row>

      <Card className="p-2 mb-2 aggregators-page__card">
        <Row className="dashboard-filters aggregators-filters g-3 align-items-end">
          <Col xs={12} md={4}>
            <Form.Label className="form-label">Search</Form.Label>
            <Form.Control
              className="aggregators-filters__control"
              type="search"
              value={search}
              placeholder="Search by Id or Name"
              onChange={(event) => {
                setPage(1);
                setSearch(event?.target?.value);
              }}
            />
          </Col>

          <Col xs={12} md={3}>
            <Form.Label className="form-label">Status</Form.Label>
            <Form.Select
              value={aggregatorStatus}
              onChange={(event) => {
                setPage(1);
                setAggregatorStatus(event?.target?.value);
              }}
            >
              <option value="all">All</option>
              <option value="true">Active</option>
              <option value="false">In-active</option>
            </Form.Select>
          </Col>

          <Col xs={12} md="auto" className="ms-auto d-flex justify-content-end">
            <Trigger message="Reset Filters" id={"redo"} />
            <Button
              id={"redo"}
              variant="success"
              className="aggregators-page__reset-btn"
              onClick={resetFilters}
            >
              <FontAwesomeIcon icon={faRedoAlt} />
            </Button>
          </Col>
        </Row>

        <div className="dashboard-section-divider" />

        <div className="table-responsive aggregators-table-wrap">
          <Table hover size="sm" className="dashboard-data-table aggregators-table">
            <thead>
              <tr>
                {tableHeaders.map((h, idx) => (
                  <th
                    key={idx}
                    onClick={() =>
                      h.value !== "" &&
                      (setOrderBy(h.value) || setSort(sort === "ASC" ? "DESC" : "ASC"))
                    }
                    style={{ cursor: h.value !== "" ? "pointer" : "default" }}
                    className={selected(h) ? "border-3 border border-blue" : ""}
                  >
                    {t(h.labelKey)}{" "}
                    {selected(h) &&
                      (sort === "ASC" ? (
                        <FontAwesomeIcon
                          style={over ? { color: "red" } : {}}
                          icon={faArrowCircleUp}
                          onClick={() => setSort("DESC")}
                          onMouseOver={() => setOver(true)}
                          onMouseLeave={() => setOver(false)}
                        />
                      ) : (
                        <FontAwesomeIcon
                          style={over ? { color: "red" } : {}}
                          icon={faArrowCircleDown}
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
              {loading && !aggregators?.rows?.length ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center">
                    <InlineLoader />
                  </td>
                </tr>
              ) : (
                <>
                  {aggregators?.rows?.map(
                    ({
                      name,
                      masterGameAggregatorId,
                      isActive,
                      freeSpinAllowed,
                      adminEnabledFreespin,
                    }) => (
                      <tr key={masterGameAggregatorId}>
                        <td>{masterGameAggregatorId}</td>

                        <td>
                          <Trigger message={name} id={masterGameAggregatorId + "name"} />
                          <span
                            id={masterGameAggregatorId + "name"}
                            className="d-inline-block text-truncate aggregators-table__name"
                            style={{ cursor: "pointer", textTransform: "uppercase" }}
                          >
                            {name}
                          </span>
                        </td>

                        <td>
                          {isActive ? (
                            <span className="text-success">Active</span>
                          ) : (
                            <span className="text-danger">In Active</span>
                          )}
                        </td>

                        {!isHidden({ module: { key: "CasinoManagement", value: "U" } }) ||
                        !isHidden({ module: { key: "CasinoManagement", value: "T" } }) ? (
                          <td className="aggregators-table__actions">
                            {!isActive ? (
                              <>
                                <Trigger message="Set Status Active" id={masterGameAggregatorId + "active"} />
                                <Button
                                  id={masterGameAggregatorId + "active"}
                                  className="m-1"
                                  size="sm"
                                  variant="success"
                                  onClick={() =>
                                    handleStatusShow(masterGameAggregatorId, isActive, name, freeSpinAllowed)
                                  }
                                  hidden={isHidden({ module: { key: "CasinoManagement", value: "T" } })}
                                >
                                  <FontAwesomeIcon icon={faCheckSquare} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Trigger message="Set Status In-Active" id={masterGameAggregatorId + "inactive"} />
                                <Button
                                  id={masterGameAggregatorId + "inactive"}
                                  className="m-1"
                                  size="sm"
                                  variant="danger"
                                  onClick={() =>
                                    handleStatusShow(masterGameAggregatorId, isActive, name, freeSpinAllowed)
                                  }
                                  hidden={isHidden({ module: { key: "CasinoManagement", value: "T" } })}
                                >
                                  <FontAwesomeIcon icon={faWindowClose} />
                                </Button>
                              </>
                            )}

                            <Trigger message="Hide" id={masterGameAggregatorId + "hide"} />
                            <Button
                              id={masterGameAggregatorId + "hide"}
                              hidden={isHidden({ module: { key: "CasinoManagement", value: "D" } })}
                              className="m-1"
                              size="sm"
                              variant="warning"
                              onClick={() => handleHide(masterGameAggregatorId)}
                            >
                              <FontAwesomeIcon icon={faEyeSlash} />
                            </Button>

                            {freeSpinAllowed &&
                              (!adminEnabledFreespin ? (
                                <>
                                  <Trigger message="Enable Free Spin" id={masterGameAggregatorId + "enable"} />
                                  <Button
                                    id={masterGameAggregatorId + "enable"}
                                    className="m-1"
                                    size="sm"
                                    variant="success"
                                    onClick={() => handleFreeSpin(masterGameAggregatorId, adminEnabledFreespin)}
                                    hidden={isHidden({ module: { key: "CasinoManagement", value: "T" } })}
                                  >
                                    <FontAwesomeIcon icon={faFan} />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Trigger message="Disable FreeSpin" id={masterGameAggregatorId + "disable"} />
                                  <Button
                                    id={masterGameAggregatorId + "disable"}
                                    className="m-1"
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleFreeSpin(masterGameAggregatorId, adminEnabledFreespin)}
                                    hidden={isHidden({ module: { key: "CasinoManagement", value: "T" } })}
                                  >
                                    <FontAwesomeIcon icon={faFan} />
                                  </Button>
                                </>
                              ))}
                          </td>
                        ) : (
                          <td>NA</td>
                        )}
                      </tr>
                    )
                  )}

                  {aggregators?.count === 0 && (
                    <tr>
                      <td colSpan={tableHeaders.length} className="text-danger text-center">
                        No data found
                      </td>
                    </tr>
                  )}

                  {isFetching && (
                    <tr>
                      <td colSpan={tableHeaders.length} className="text-center">
                        <InlineLoader />
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {aggregators?.count !== 0 && !loading && (
        <PaginationComponent
          page={aggregators?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      <ConfirmationModal
        setShow={setStatusShow}
        show={statusShow}
        handleYes={handleYes}
        active={status}
        name={name}
        loading={updateloading}
        note="Deactivating this Aggregator will cancel all associated Free Spins ."
        freeSpinstatus={freeSpinstatus}
      />
      <ConfirmationModal
        setShow={setFreeSpinStatusShow}
        show={freeSpinStatusShow}
        handleYes={handleFreeSpinYes}
        active={freeSpinstatus}
        loading={updateFreeSpinloading}
        message="Update Free Spin Status"
      />
      <CreateAggregator
        handleClose={handleClose}
        show={show}
        createAggregator={createAggregator}
        loading={loading}
      />

      {hideModalShow && (
        <HideConfirmationModal
          hideModalShow={hideModalShow}
          setHideModalShow={setHideModalShow}
          handleHideYes={handleHideYes}
          loading={hideLoading}
          hideMsg={hideAggregatorMsg}
        />
      )}
    </div>
  );
};

export default CasinoAggregator;
