import React, { useEffect, useState } from "react";
import useCheckPermission from "../../utils/checkPermission";
import { Button, Form, Row, Col, Table, Card } from "@themesberg/react-bootstrap";
import { AdminRoutes } from "../../routes";
import useBonusListing from "./hooks/useBonusListing";
import { InlineLoader } from "../../components/Preloader";
import { formatDateMDY } from "../../utils/dateFormatter";
import Trigger from "../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faEdit,
  faEye,
  faWindowClose,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "../../components/Pagination";
import {
  ConfirmationModal,
  DeleteConfirmationModal,
} from "../../components/ConfirmationModal";
import { getItem } from "../../utils/storageUtils";
import { timeZones } from "../Dashboard/constants";
import {
  convertToTimeZone,
  formatAmountWithCommas,
  getFormattedTimeZoneOffset,
} from "../../utils/helper";
import "./bonusListing.scss";

const BonusListing = () => {
  const { isHidden } = useCheckPermission();
  const [dataBonus, setDataBonus] = useState([]);

  const {
    t,
    navigate,
    limit,
    page,
    search,
    setPage,
    setLimit,
    setSearch,
    bonusTypeFil,
    setBonusTypeFil,
    handleStatusShow,
    statusShow,
    setStatusShow,
    handleDeleteModal,
    status,
    handleYes,
    bonusData,
    totalPages,
    loading,
    active,
    setActive,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    bonus,
    updateloading,
  } = useBonusListing();

  useEffect(() => {
    const set = new Set();
    bonusData?.rows?.map((bonus) => {
      set.add(bonus?.bonusType);
    });
    setDataBonus(Array.from(set));
  }, [bonusData]);
  const timeZone = getItem("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();
  const tableHeaders = [
    t("headers.id"),
    t("headers.name"),
    t("headers.userCount"),
    t("headers.validFrom"),
    t("headers.status"),
    t("headers.action"),
  ];

  return (
    <div className="dashboard-typography bonus-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="bonus-page__title">{t("title")}</h3>
          <p className="bonus-page__subtitle">Manage bonuses, status, and details</p>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="primary"
            size="sm"
            className="bonus-page__create-btn"
            onClick={() => navigate(AdminRoutes.BonusCreate)}
            hidden={isHidden({ module: { key: "Bonus", value: "C" } })}
          >
            Create
          </Button>
        </div>
      </div>

      <Card className="dashboard-filters mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col xs="12" sm="6" lg="4">
              <Form.Label>{t("filter.search")}</Form.Label>
              <Form.Control
                type="search"
                value={search}
                placeholder={t("filter.searchPlace")}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ""));
                }}
              />
            </Col>
            <Col xs="12" sm="6" lg="3">
              <Form.Label>{t("filter.status")}</Form.Label>
              <Form.Select
                value={active}
                onChange={(event) => {
                  setPage(1);
                  setActive(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ""));
                }}
              >
                <option key="" value="">
                  {t("filter.all")}
                </option>
                <option key="true" value>
                  {t("filter.active")}
                </option>
                <option key="false" value={false}>
                  {t("filter.inActive")}
                </option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="dashboard-data-table">
        <div className="bonus-table-wrap">
          <Table bordered hover responsive size="sm" className="mb-0 text-center">
            <thead>
              <tr>
                {tableHeaders.map((h) => (
                  <th key={h}>{h}</th>
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
              ) : Boolean(bonusData) && bonusData?.rows?.length ? (
                bonusData.rows.map((bonus) => {
                  const {
                    bonusId,
                    bonusName,
                    validFrom,
                    claimedCount,
                    isActive,
                  } = bonus;

                  if (bonusName === "Postal Code Bonus") return null;

                  return (
                    <tr key={bonusId}>
                      <td>{bonusId}</td>
                      <td>{bonusName}</td>
                      <td>{formatAmountWithCommas(claimedCount) || "-"}</td>
                      <td>
                        {validFrom
                          ? formatDateMDY(convertToTimeZone(validFrom, timezoneOffset))
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={
                            isActive
                              ? "bonus-pill bonus-pill--active"
                              : "bonus-pill bonus-pill--inactive"
                          }
                        >
                          {isActive ? t("filter.active") : t("filter.inActive")}
                        </span>
                      </td>
                      <td>
                        <div className="bonus-actions">
                          {bonusName !== "Scratch Card Bonus" && (
                            <>
                              <Trigger message={t("message.edit")} id={bonusId + "edit"} />
                              <Button
                                id={bonusId + "edit"}
                                className="bonus-icon-btn"
                                size="sm"
                                variant="warning"
                                onClick={() =>
                                  navigate(`${AdminRoutes.BonusEdit.split(":").shift()}${bonusId}`)
                                }
                                hidden={isHidden({ module: { key: "Bonus", value: "U" } })}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                            </>
                          )}

                          <Trigger message={t("message.view")} id={bonusId + "view"} />
                          <Button
                            id={bonusId + "view"}
                            className="bonus-icon-btn"
                            size="sm"
                            variant="info"
                            onClick={() => {
                              if (bonusName === "Scratch Card Bonus") {
                                navigate(AdminRoutes.ScratchCard);
                              } else {
                                navigate(`${AdminRoutes.BonusDetails.split(":").shift()}${bonusId}`);
                              }
                            }}
                            hidden={isHidden({ module: { key: "Bonus", value: "R" } })}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>

                          {bonusName !== "Scratch Card Bonus" && (
                            <>
                              {!isActive ? (
                                <>
                                  <Trigger message={t("message.statusActive")} id={bonusId + "active"} />
                                  <Button
                                    id={bonusId + "active"}
                                    className="bonus-icon-btn"
                                    size="sm"
                                    variant="success"
                                    onClick={() => handleStatusShow(bonus, isActive)}
                                    hidden={isHidden({ module: { key: "Bonus", value: "T" } })}
                                  >
                                    <FontAwesomeIcon icon={faCheckSquare} />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Trigger message={t("message.statusInactive")} id={bonusId + "inactive"} />
                                  <Button
                                    id={bonusId + "inactive"}
                                    className="bonus-icon-btn"
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleStatusShow(bonus, isActive)}
                                    hidden={isHidden({ module: { key: "Bonus", value: "T" } })}
                                  >
                                    <FontAwesomeIcon icon={faWindowClose} />
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center py-4 bonus-empty">
                    {t("noDataFound")}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      {bonusData?.count !== 0 && (
        <PaginationComponent
          page={bonusData?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      {statusShow && (
        <ConfirmationModal
          isBonus={true}
          bonus={bonus}
          setShow={setStatusShow}
          show={statusShow}
          handleYes={handleYes}
          active={status}
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
    </div>
  );
};

export default BonusListing;
