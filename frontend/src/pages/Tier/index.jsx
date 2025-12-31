import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Table } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PaginationComponent from "../../components/Pagination";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
} from "../../components/ConfirmationModal";
import {
  faArrowCircleDown,
  faArrowCircleUp,
  faCheckSquare,
  faEdit,
  faEye,
  faRedoAlt,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import Trigger from "../../components/OverlayTrigger";
import { InlineLoader } from "../../components/Preloader";
import useCheckPermission from "../../utils/checkPermission";
import { AdminRoutes } from "../../routes";
import { tableHeaders } from "./constants";
import useTierListing from "./hooks/useTierListing";
import { formatPriceWithCommas } from "../../utils/helper";
import "./tierListing.scss";

const limitTierList = 6;

const Tiers = () => {
  const {
    t,
    limit,
    page,
    loading,
    tierList,
    show,
    setLimit,
    setPage,
    setShow,
    totalPages,
    handleShow,
    handleYes,
    active,
    navigate,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    setOrderBy,
    selected,
    sort,
    setSort,
    over,
    setOver,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    updateloading,
    tierSearch,
    setTierSearch,
    resetFilters,
  } = useTierListing({ isUTC: true });

  const [allTiers, setAllTiers] = useState([]);

  useEffect(() => {
    if (tierList?.tiers?.rows?.length > 0 && allTiers?.length === 0) {
      setAllTiers(tierList?.tiers?.rows); // only set once on initial load
    }
  }, [tierList?.tiers]);

  const { isHidden } = useCheckPermission();

  const statusPill = (flag) => (
    <span
      className={`tier-status-pill ${
        flag ? "tier-status-pill--active" : "tier-status-pill--inactive"
      }`}
    >
      {flag ? "Active" : "Inactive"}
    </span>
  );

  return (
    <>
      <div className="dashboard-typography tier-list-page">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="tier-list-page__title">Tiers</h3>
            <p className="tier-list-page__subtitle">
              Manage tier thresholds and rewards
            </p>
          </div>

          <div className="d-flex justify-content-end">
            {tierList && !(tierList?.totalActiveTiers >= limitTierList) && (
              <Button
                variant="primary"
                size="sm"
                className="tier-list__action-btn"
                hidden={isHidden({ module: { key: "Tiers", value: "C" } })}
                onClick={() => navigate(AdminRoutes.tierCreate)}
              >
                Create
              </Button>
            )}
          </div>
        </div>

        <Card className="dashboard-filters mb-4">
          <Card.Body>
            <Row className="g-3 align-items-start">
              <Col xs={12} md={6} lg={4}>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  className="tier-filters__control"
                  type="search"
                  value={search}
                  placeholder="Search by Name or Tier Id"
                  onChange={(event) => {
                    setPage(1);
                    setSearch(
                      event?.target?.value.replace(/[~`!$%@^&*#=)()><?]+/g, "")
                    );
                  }}
                />
              </Col>

              <Col xs={12} md={6} lg={3}>
                <Form.Label>{t("casinoSubCategory.filters.status")}</Form.Label>
                <Form.Select
                  className="tier-filters__select"
                  onChange={(e) => {
                    setPage(1);
                    setStatusFilter(e?.target?.value);
                  }}
                  value={statusFilter}
                >
                  <option value="all">{t("casinoSubCategory.filters.all")}</option>
                  <option value="true">
                    {t("casinoSubCategory.filters.active")}
                  </option>
                  <option value="false">
                    {t("casinoSubCategory.filters.inactive")}
                  </option>
                </Form.Select>
              </Col>

              <Col xs={12} md={6} lg={3}>
                <Form.Label>Tier</Form.Label>
                <Form.Select
                  className="tier-filters__select"
                  name="tierSearch"
                  value={tierSearch}
                  onChange={(event) => {
                    setPage(1);
                    setTierSearch(event?.target?.value);
                  }}
                >
                  <option value="all">All</option>
                  {allTiers?.map((tier) => (
                    <option key={tier?.tierId} value={tier?.level}>
                      {tier?.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={12} md={6} lg={2} className="d-flex align-items-end">
                <div className="tier-filters__actions w-100">
                  <div className="flex-grow-1" />
                  <Trigger message="Reset Filters" id={"redo"} />
                  <Button id={"redo"} className="tier-reset-btn" onClick={resetFilters}>
                    <FontAwesomeIcon icon={faRedoAlt} />
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="dashboard-data-table">
          <div className="tier-table-wrap">
            <Table bordered responsive hover size="sm" className="mb-0 text-center">
              <thead>
                <tr>
                  {tableHeaders.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => h.value !== "" && setOrderBy(h.value)}
                      style={{ cursor: h.value !== "" ? "pointer" : "default" }}
                      className={selected(h) ? "sortable active" : "sortable"}
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
                {loading ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : tierList && tierList?.tiers?.count > 0 ? (
                  tierList?.tiers?.rows?.map(
                    ({
                      tierId,
                      name,
                      requiredXp,
                      bonusGc,
                      bonusSc,
                      weeklyBonusPercentage,
                      isWeekelyBonusActive,
                      monthlyBonusPercentage,
                      isMonthlyBonusActive,
                      level,
                      isActive,
                      icon,
                    }) => (
                      <tr key={tierId}>
                        <td>{tierId}</td>
                        <td>
                          <Trigger message={name} id={name} />
                          <span className="tier-name d-inline-block" title={name}>
                            {name}
                          </span>
                        </td>
                        <td>{formatPriceWithCommas(requiredXp)}</td>
                        <td>{formatPriceWithCommas(bonusGc)}</td>
                        <td>{formatPriceWithCommas(bonusSc)}</td>
                        <td>{weeklyBonusPercentage}</td>
                        <td>{statusPill(Boolean(isWeekelyBonusActive))}</td>
                        <td>{monthlyBonusPercentage}</td>
                        <td>{statusPill(Boolean(isMonthlyBonusActive))}</td>
                        <td>{level}</td>
                        <td>{statusPill(Boolean(isActive))}</td>
                        <td>
                          {icon ? (
                            <img
                              src={icon}
                              alt="tier icon"
                              width={44}
                              height={44}
                              className="img-thumbnail"
                              style={{ cursor: "pointer" }}
                              onClick={() => window.open(icon)}
                            />
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          <div className="tier-actions">
                            <Trigger message={"View"} id={tierId + "view"} />
                            <Button
                              id={tierId + "view"}
                              className="tier-icon-btn"
                              size="sm"
                              variant="info"
                              onClick={() =>
                                navigate(
                                  `${AdminRoutes.tierDetails.split(":").shift()}${tierId}`
                                )
                              }
                              hidden={isHidden({ module: { key: "Tiers", value: "R" } })}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>

                            <Trigger message="Edit" id={tierId + "edit"} />
                            <Button
                              id={tierId + "edit"}
                              className="tier-icon-btn"
                              size="sm"
                              variant="warning"
                              hidden={isHidden({ module: { key: "Tiers", value: "U" } })}
                              onClick={() => {
                                navigate(
                                  `${AdminRoutes.tierEdit.split(":").shift()}${tierId}`
                                );
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>

                            {!isActive ? (
                              <>
                                <Trigger
                                  message="Set Status Active"
                                  id={tierId + "active"}
                                />
                                <Button
                                  id={tierId + "active"}
                                  className="tier-icon-btn"
                                  size="sm"
                                  variant="success"
                                  hidden={isHidden({ module: { key: "Tiers", value: "T" } })}
                                  onClick={() => handleShow(tierId, isActive)}
                                >
                                  <FontAwesomeIcon icon={faCheckSquare} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Trigger
                                  message="Set Status In-Active"
                                  id={tierId + "inactive"}
                                />
                                <Button
                                  id={tierId + "inactive"}
                                  className="tier-icon-btn"
                                  size="sm"
                                  variant="danger"
                                  hidden={isHidden({ module: { key: "Tiers", value: "T" } })}
                                  onClick={() => handleShow(tierId, isActive)}
                                >
                                  <FontAwesomeIcon icon={faWindowClose} />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4 tier-empty">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {tierList?.tiers?.count !== 0 && (
          <PaginationComponent
            page={tierList?.tiers?.count < page ? setPage(1) : page}
            totalPages={totalPages}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        )}
      </div>

      {show && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
          loading={updateloading}
        />
      )}

      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleDeleteYes}
        />
      )}
    </>
  );
};

export default Tiers;


