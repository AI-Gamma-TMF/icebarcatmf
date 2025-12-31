import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Table,
  Form,
  Tabs,
  Tab
} from "@themesberg/react-bootstrap";
import { AdminRoutes } from "../../routes";
import { tableHeaders } from "./constant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleDown,
  faArrowCircleUp,
  faEye,
  faPlusSquare,
  faRecycle,
  faXmark,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faEdit, faSave } from "@fortawesome/free-regular-svg-icons";
import { InlineLoader } from "../../components/Preloader";
import Trigger from "../../components/OverlayTrigger";
import {
  DeleteConfirmationModal,
  ReuseConfirmationModal,
} from "../../components/ConfirmationModal";
import useScratchCard from "./hooks/useScratchCard";
import PaginationComponent from "../../components/Pagination";
import "./scratchcard.scss";
import { useLocation } from "react-router-dom";
import ScratchCardGraph from "./Graph/ScratchCardGraph";
import { formatPriceWithCommas } from "../../utils/helper";

const Scratchcard = () => {
  const {
    selected,
    handleDeleteModal,
    handleDeleteYes,
    handleSubmit,
    handleParentSubmit,
    handleEditClick,
    handleScratchcardName,
    handleEditParentClick,
    handleChangeParentIsActive,
    handleChangeIsAllow,
    error,
    setError,
    resetFilters,
    reward,
    setReward,
    totalPages,
    page,
    handleInputMaxReward,
    search,
    setSearch,
    limit,
    setEditErrors,
    handleInputpercentage,
    scratchcardId,
    setScratchcardId,
    handleInputPlayerLimit,
    scratchCardList,
    setDeleteModalShow,
    editValues,
    setEditRowId,
    editParentValues,
    deleteModalShow,
    editErrors,
    sort,
    setSort,
    editParentRowId,
    editRowId,
    setPage,
    loading,
    setEditParentRowId,
    setOrderBy,
    over,
    setOver,
    setLimit,
    navigate,
    handleChangeParentMessage,
    isHidden,
    handleReuseModal,
    isUnarchive,
    handleReuseScratchcardYes,
    setReuseModalShow,
    reuseModalShow,
    reuseLoading,
    orderBy,
  } = useScratchCard();
  const location = useLocation();
  const validTabs = ["dashboard", "scratch-card-data"];
  const queryTab = new URLSearchParams(location.search).get("tab");

  const initialTab = validTabs.includes(queryTab) ? queryTab : "dashboard";
  const [key, setKey] = useState(initialTab);

  // extract active tab from URL
  const tabFromURL =
    new URLSearchParams(location.search).get("tab") || "dashboard";

  // handle tab switch
  const handleTabChange = (k) => {
    setKey(k);
    const params = new URLSearchParams(location.search);
    params.set("tab", k);
    if (location.pathname === "/admin/unarchive-scratch-card") {
      navigate(`${AdminRoutes.ScratchCard}?${params.toString()}`, {
        replace: true,
      });
    } else {
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  };
  // Optional: sync tab from URL on reload/navigation (in case manually changed)
  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");

    if (location.pathname === "/admin/unarchive-scratch-card") {
      setKey("scratch-card-data");
    } else if (tab && validTabs.includes(tab)) {
      setKey(tab);
    } else {
      setKey("dashboard");
    }
  }, [location.pathname, location.search]);

  const handleTableSorting = (param) => {
    if (param.value === orderBy) {
      setSort(sort === "ASC" ? "DESC" : "ASC");
    } else {
      setOrderBy(param.value);
      setSort("ASC");
    }
  };

  return (
    <div className="scratch-card-page dashboard-typography">
      <Row className="d-flex align-items-center mb-2">
        <Col>
          <h3 className="scratch-card-page__title">
            {isUnarchive ? "Archive Scratch Card" : "Scratch Card"}
          </h3>
        </Col>
      </Row>

      <Col lg={12}>
        <Tabs
          activeKey={key}
          onSelect={handleTabChange}
          className="scratch-card-tabs"
          id="scratch-card-tabs"
        >
          <Tab eventKey="dashboard" title="Dashboard">
            <ScratchCardGraph isHitoricalTab={key} />
          </Tab>

          <Tab eventKey="scratch-card-data" title="Scratch Card Detail">
            <div className="mt-3">
              <Row className="d-flex align-items-center mb-2">
                <Col />

                {!isUnarchive && (
                  <Col xs="auto" className="d-flex justify-content-end gap-2">
                    <Button
                      className="scratch-card-page__action-btn"
                      variant="success"
                      hidden={isHidden({
                        module: { key: "ScratchCardConfiguration", value: "C" },
                      })}
                      size="sm"
                      onClick={() => navigate(AdminRoutes.CreateScratchCard)}
                    >
                      Create Scratch Card
                    </Button>
                    <Button
                      className="scratch-card-page__action-btn"
                      variant="warning"
                      size="sm"
                      onClick={() => {
                        setPage(1);
                        navigate(AdminRoutes.UnarchiveScratchCard);
                      }}
                      hidden={isHidden({
                        module: { key: "ScratchCardConfiguration", value: "U" },
                      })}
                    >
                      Archived
                    </Button>
                  </Col>
                )}
              </Row>

              <div className="scratch-card-page__card p-2 mb-2">
                <Row className="dashboard-filters scratch-card-filters g-3 align-items-end">
                  <Col xs={12} md={4}>
                    <Form.Label className="form-label">Scratch card Id</Form.Label>
                    <Form.Control
                      type="search"
                      value={scratchcardId}
                      placeholder="Scratch card Id"
                      onChange={(event) => {
                        const inputValue = event?.target?.value;
                        if (/^\d*$/.test(inputValue)) {
                          if (inputValue.length <= 10) {
                            setPage(1);
                            setScratchcardId(inputValue);
                            setError("");
                          } else {
                            setError("Scratch card Id cannot exceed 10 digits");
                          }
                        }
                      }}
                    />
                    {error && <div className="scratch-card-error">{error}</div>}
                  </Col>

                  <Col xs={12} md={4}>
                    <Form.Label className="form-label">Name</Form.Label>
                    <Form.Control
                      type="search"
                      value={search}
                      placeholder="Search by name"
                      onChange={(event) => {
                        setPage(1);
                        setSearch(event?.target?.value);
                      }}
                    />
                  </Col>

                  <Col xs={12} md="auto" className="ms-auto d-flex gap-2">
                    <Trigger message="Reset Filters" id={"scratchReset"} />
                    <Button id={"scratchReset"} variant="secondary" onClick={resetFilters}>
                      Reset
                    </Button>
                  </Col>
                </Row>

                <div className="dashboard-section-divider" />

                <div className="scratch-card-table-wrap table-responsive">
                  <Table
                    bordered
                    striped
                    responsive
                    hover
                    size="sm"
                    className="dashboard-data-table scratch-card-table text-center mt-3"
                  >
                    <thead className="thead-dark">
                      <tr>
                        {tableHeaders.map((h, idx) => (
                          <th
                            key={idx}
                            onClick={() => ["scratchCardId"].includes(h.value) && handleTableSorting(h)}
                            style={{
                              cursor: h.value === "scratchCardId" ? "pointer" : "default",
                            }}
                            className={selected(h) ? "border-3 border border-blue" : ""}
                          >
                            {h.labelKey}{" "}
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

                    {loading ? (
                      <tbody>
                        <tr>
                          <td colSpan={tableHeaders.length} className="text-center">
                            <InlineLoader />
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {scratchCardList?.data?.map((scratchCard, index) => {
                          const isOnlyOneChild =
                            scratchCard.scratchCardConfigs?.length === 1;
                          return (
                            <React.Fragment key={scratchCard.scratchCardId}>
                              {/* Parent Row */}

                              <tr>
                            <td>{scratchCard.scratchCardId}</td>
                            <td>
                              {editParentRowId === scratchCard.scratchCardId ? (
                                <>
                                  <Form.Control
                                    type="text"
                                    name="scratchCardName"
                                    value={
                                      editParentValues.scratchCardName || ""
                                    }
                                    onChange={handleScratchcardName}
                                  />
                                </>
                              ) : (
                                scratchCard.scratchCardName
                              )}
                            </td>
                            <td>
                              {editParentRowId === scratchCard.scratchCardId ? (
                                <Form.Check
                                  type="switch"
                                  name="isActive"
                                  checked={editParentValues?.isActive}
                                  onChange={handleChangeParentIsActive}
                                />
                              ) : scratchCard.isActive ? (
                                "Active"
                              ) : (
                                "Inactive"
                              )}
                            </td>
                            <td>
                              {editParentRowId === scratchCard.scratchCardId ? (
                                <>
                                  <Form.Control
                                    type="text"
                                    name="message"
                                    value={editParentValues.message || ""}
                                    onChange={handleChangeParentMessage}
                                  />
                                </>
                              ) : (
                                scratchCard.message
                              )}
                            </td>
                            <td>
                              {formatPriceWithCommas(
                                scratchCard.pendingToClaimScBonus
                              )}
                            </td>
                            <td>
                              {formatPriceWithCommas(
                                scratchCard.totalClaimedScBonus
                              )}
                            </td>
                            <td>
                              {formatPriceWithCommas(
                                scratchCard.pendingToClaimGcBonus
                              )}
                            </td>
                            <td>
                              {formatPriceWithCommas(
                                scratchCard.totalClaimedGcBonus
                              )}
                            </td>
                            <td className="ps-2" style={{ textAlign: "end" }}>
                              {!isUnarchive && (
                                <>
                                  {editParentRowId ===
                                  scratchCard.scratchCardId ? (
                                    <>
                                      <Trigger
                                        message={"Save"}
                                        id={scratchCard.scratchCardId + "save"}
                                      />
                                      <Button
                                        id={scratchCard.scratchCardId + "save"}
                                        className="m-1"
                                        size="sm"
                                        variant="warning"
                                        onClick={() =>
                                          handleParentSubmit({
                                            scratchCardId:
                                              scratchCard.scratchCardId,
                                            scratchCardName:
                                              editParentValues.scratchCardName,
                                            isActive: editParentValues.isActive,
                                            message: editParentValues.message,
                                          })
                                        }
                                        hidden={isHidden({
                                          module: {
                                            key: "ScratchCardConfiguration",
                                            value: "U",
                                          },
                                        })}
                                      >
                                        <FontAwesomeIcon icon={faSave} />
                                      </Button>
                                      <Trigger
                                        message={"Cancel"}
                                        id={
                                          scratchCard.scratchCardId + "cancel"
                                        }
                                      />

                                      <Button
                                        id={
                                          scratchCard.scratchCardId + "cancel"
                                        }
                                        className="m-1"
                                        size="sm"
                                        variant="warning"
                                        onClick={() => setEditParentRowId(null)}
                                        hidden={isHidden({
                                          module: {
                                            key: "ScratchCardConfiguration",
                                            value: "U",
                                          },
                                        })}
                                      >
                                        <FontAwesomeIcon icon={faXmark} />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Trigger
                                        message={"Edit"}
                                        id={scratchCard.scratchCardId + "edit"}
                                      />
                                      <Button
                                        id={scratchCard.scratchCardId + "edit"}
                                        className="m-1"
                                        size="sm"
                                        variant="warning"
                                        onClick={() =>
                                          handleEditParentClick(scratchCard)
                                        }
                                        hidden={isHidden({
                                          module: {
                                            key: "ScratchCardConfiguration",
                                            value: "U",
                                          },
                                        })}
                                      >
                                        <FontAwesomeIcon icon={faEdit} />
                                      </Button>
                                    </>
                                  )}
                                  <>
                                    <Trigger
                                      message={"Delete"}
                                      id={scratchCard.scratchCardId + "delete"}
                                    />
                                    <Button
                                      id={scratchCard.scratchCardId + "delete"}
                                      className="m-1"
                                      size="sm"
                                      variant="danger"
                                      onClick={() =>
                                        handleDeleteModal({
                                          scratchCardId:
                                            scratchCard.scratchCardId,
                                          configId: null,
                                        })
                                      }
                                      hidden={isHidden({
                                        module: {
                                          key: "ScratchCardConfiguration",
                                          value: "D",
                                        },
                                      })}
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                  </>
                                  <>
                                    <Trigger
                                      message="Add"
                                      id={scratchCard.scratchCardId + "add"}
                                    />
                                    <Button
                                      id={scratchCard.scratchCardId + "add"}
                                      className="m-1"
                                      size="sm"
                                      variant="success"
                                      onClick={() =>
                                        navigate(
                                          AdminRoutes.CreateScratchCard,
                                          {
                                            state: {
                                              parentData: scratchCard,
                                            },
                                          }
                                        )
                                      }
                                      hidden={isHidden({
                                        module: {
                                          key: "ScratchCardConfiguration",
                                          value: "C",
                                        },
                                      })}
                                    >
                                      <FontAwesomeIcon icon={faPlusSquare} />
                                    </Button>
                                  </>
                                  <>
                                    <Trigger
                                      message="Reuse Scratch Card"
                                      id={
                                        scratchCard.scratchCardId +
                                        "resueScratchCard"
                                      }
                                    />
                                    <Button
                                      id={
                                        scratchCard.scratchCardId +
                                        "resueScratchCard"
                                      }
                                      className="m-1"
                                      size="sm"
                                      variant="warning"
                                      onClick={() =>
                                        handleReuseModal(
                                          scratchCard.scratchCardId
                                        )
                                      }
                                      disabled={
                                        Number(scratchCard?.usedCount) === 0
                                      }
                                      hidden={isHidden({
                                        module: {
                                          key: "ScratchCardConfiguration",
                                          value: "U",
                                        },
                                      })}
                                    >
                                      <FontAwesomeIcon icon={faRecycle} />
                                    </Button>
                                  </>
                                </>
                              )}

                              <>
                                <Trigger
                                  message={"View"}
                                  id={scratchCard.scratchCardId + "view"}
                                />
                                <Button
                                  id={scratchCard.scratchCardId + "view"}
                                  className="m-1"
                                  size="sm"
                                  variant="info"
                                  onClick={() =>
                                    navigate(
                                      `${AdminRoutes.ViewScratchCard.split(
                                        ":"
                                      ).shift()}${scratchCard.scratchCardId}${
                                        isUnarchive ? "?isArchive=true" : ""
                                      }`
                                    )
                                  }
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </Button>
                              </>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                    {scratchCardList?.count === 0 && (
                      <tr>
                        <td colSpan={12} className="text-danger text-center">
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                    )}
                  </Table>
                </div>

                {scratchCardList?.count !== 0 && (
                  <PaginationComponent
                    page={scratchCardList?.count < page ? setPage(1) : page}
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
                  />
                )}

                {reuseModalShow && (
                  <ReuseConfirmationModal
                    reuseModalShow={reuseModalShow}
                    setReuseModalShow={setReuseModalShow}
                    handleReusePackageYes={handleReuseScratchcardYes}
                    loading={reuseLoading}
                    isScratchCard={true}
                  />
                )}

                {isUnarchive && (
                  <div className="mt-3 d-flex justify-content-between align-items-center">
                    <Button
                      variant="warning"
                      onClick={() => {
                        navigate(AdminRoutes.ScratchCard);
                        setPage(1);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Tab>
        </Tabs>
      </Col>
    </div>
  );
};

export default Scratchcard;
