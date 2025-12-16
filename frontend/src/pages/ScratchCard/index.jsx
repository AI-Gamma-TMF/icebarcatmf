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
  faCancel,
  faEye,
  faPlusSquare,
  faRecycle,
  faRedoAlt,
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
    <>
      <Col>
        <h3>{isUnarchive ? "Archive Scratch Card" : "Scratch Card"}</h3>
      </Col>
      <Col lg={12}>
        <Tabs
          activeKey={key}
          onSelect={handleTabChange}
          className="ps-2"
          id="amoe-tabs"
        >
          <Tab eventKey="dashboard" title="Dashboard">
            <ScratchCardGraph isHitoricalTab={key} />
          </Tab>
          <Tab eventKey="scratch-card-data" title="Scratch Card Detail">
            <div className="mt-4">
              <Row className="mb-2">
                {!isUnarchive && (
                  <Col>
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="success"
                        hidden={isHidden({
                          module: {
                            key: "ScratchCardConfiguration",
                            value: "C",
                          },
                        })}
                        size="sm"
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                          navigate(AdminRoutes.CreateScratchCard);
                        }}
                      >
                        Create Scratch Card
                      </Button>
                      <Button
                        variant="warning"
                        size="md"
                        className="px-3 py-2"
                        onClick={() => {
                          setPage(1);
                          navigate(AdminRoutes.UnarchiveScratchCard);
                        }}
                        hidden={isHidden({
                          module: {
                            key: "ScratchCardConfiguration",
                            value: "U",
                          },
                        })}
                      >
                        Archived
                      </Button>
                    </div>
                  </Col>
                )}
              </Row>
              <Row>
                <Col xs={12} md={4} className="mb-3">
                  <Form.Label>Scratch card Id</Form.Label>
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
                  {error && (
                    <div style={{ color: "red", marginTop: "5px" }}>
                      {error}
                    </div>
                  )}
                </Col>

                <Col xs={12} md={4} className="mb-3">
                  <div className="d-flex justify-content-start align-items-center w-100 flex-wrap">
                    <Form.Label>Name</Form.Label>

                    <Form.Control
                      type="search"
                      value={search}
                      placeholder={"Search by name"}
                      onChange={(event) => {
                        setPage(1);
                        setSearch(event?.target?.value);
                      }}
                    />
                  </div>
                </Col>
                <Col xs={2} md={1} style={{ marginTop: "30px" }}>
                  <Trigger message="Reset Filters" id={"redo"} />
                  <Button id={"redo"} variant="success" onClick={resetFilters}>
                    <FontAwesomeIcon icon={faRedoAlt} />
                  </Button>
                </Col>
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
                    {tableHeaders.map((h, idx) => (
                      <th
                        key={idx}
                        onClick={() =>
                          ["scratchCardId"].includes(h.value) &&
                          handleTableSorting(h)
                        }
                        style={{
                          cursor:
                            h.value === "scratchCardId" ? "pointer" : "default",
                        }}
                        className={
                          selected(h) ? "border-3 border border-blue" : ""
                        }
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
                  <tr>
                    <td colSpan={10} className="text-center">
                      <InlineLoader />
                    </td>
                  </tr>
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
                                        <FontAwesomeIcon icon={faCancel} />
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
            </div>
            {isUnarchive && (
              <div className="mt-4 d-flex justify-content-between align-items-center">
                <Button
                  variant="warning"
                  onClick={() => {
                    navigate(AdminRoutes.ScratchCard), setPage(1);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </Tab>
        </Tabs>
      </Col>
    </>
  );
};

export default Scratchcard;
