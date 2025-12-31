import React from "react";
import { Button, Row, Col, Table, Card } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdminRoutes } from "../../routes";
import {
  faEdit,
  faEye,
  faTrash,
  faPlus,
  faArrowCircleUp,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tableHeaders } from "./constants.js";
import PaginationComponent from "../../components/Pagination";
import useRedeemRulelist from "./hooks/useRedeemRulelist.js";
import { InlineLoader } from "../../components/Preloader";
import Trigger from "../../components/OverlayTrigger";
import { DeleteConfirmationModal } from "../../components/ConfirmationModal/index.jsx";
import useCheckPermission from "../../utils/checkPermission.js";
import "./redeemRuleListing.scss";
const RedeemRule = () => {
  // const { t } = useTranslation(["cms"]);
  const { isHidden } = useCheckPermission();
  const navigate = useNavigate();
  const { t } = useTranslation(["cms"]);
  const {
    loading,
    redeemRuleList,
    limit,
    page,
    handleDeleteModal,
    handleDeleteYes,
    setPage,
    setLimit,
    totalPages,
    deleteModalShow,
    setDeleteModalShow,
    deleteLoading,
    selected,
    orderBy,
    sort,
    setSort,
    setOrderBy,
    over,
    setOver,
  } = useRedeemRulelist();

  return (
    <>
      <div className="dashboard-typography redeem-rule-page">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="redeem-rule-page__title">Redeem Rule</h3>
            <p className="redeem-rule-page__subtitle">Create and manage redeem eligibility rules</p>
          </div>

          <div className="redeem-rule-page__actions">
            <Button
              variant="primary"
              className="redeem-rule-page__create-btn"
              size="sm"
              onClick={() => navigate(AdminRoutes.RedeemRuleCreate)}
              hidden={isHidden({ module: { key: "Transactions", value: "C" } })}
            >
              Create
            </Button>
          </div>
        </div>

        <Card className="dashboard-filters redeem-rule-filters mb-4">
          <Card.Body>
            <div className="text-muted small">Click a header to sort.</div>
          </Card.Body>
        </Card>

        <div className="dashboard-data-table">
          <div className="redeem-rule-table-wrap">
            <Table bordered striped responsive hover size="sm" className="mb-0 text-center">
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
                        (sort === "asc" ? (
                          <FontAwesomeIcon
                            style={over ? { color: "red" } : {}}
                            icon={faArrowCircleUp}
                            onClick={() => setSort("desc")}
                            onMouseOver={() => setOver(true)}
                            onMouseLeave={() => setOver(false)}
                          />
                        ) : (
                          <FontAwesomeIcon
                            style={over ? { color: "red" } : {}}
                            icon={faArrowCircleDown}
                            onClick={() => setSort("asc")}
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
                ) : redeemRuleList?.count > 0 ? (
                  redeemRuleList?.rows?.map((data) => {
                    const { ruleId, ruleName, isActive, ruleCondition } = data;
                    const checkUserId = (data) => {
                      const checkCondition = (condition) => {
                        if (
                          condition.field === "userId" &&
                          (condition.value === "true" || condition.value === "false")
                        ) {
                          return true;
                        }
                        if (condition.conditions) {
                          return condition.conditions.some(checkCondition);
                        }
                        return false;
                      };
                      return checkCondition(data);
                    };
                    const check = checkUserId(ruleCondition);

                    return (
                      <tr key={ruleId} className="align-middle">
                        <td>{ruleId}</td>
                        <td>{ruleName}</td>
                        <td>
                          <span
                            className={
                              isActive
                                ? "redeem-rule-pill redeem-rule-pill--active"
                                : "redeem-rule-pill redeem-rule-pill--inactive"
                            }
                          >
                            {isActive ? t("activeStatus") : t("inActiveStatus")}
                          </span>
                        </td>
                        <td>
                          <div className="redeem-rule-actions">
                            <Trigger message="View" id={ruleId + "view"} />
                            <Button
                              id={ruleId + "view"}
                              className="redeem-rule-icon-btn"
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                navigate(`${AdminRoutes.RedeemViewUser.split(":").shift()}${ruleId}`)
                              }
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>

                            <Trigger message="Edit" id={ruleId + "edit"} />
                            <Button
                              id={ruleId + "edit"}
                              className="redeem-rule-icon-btn"
                              size="sm"
                              variant="warning"
                              hidden={isHidden({ module: { key: "Transactions", value: "U" } })}
                              onClick={() =>
                                navigate(`${AdminRoutes.RedeemRuleEdit.split(":").shift()}${ruleId}`)
                              }
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>

                            <Trigger message={"Delete"} id={ruleId + "delete"} />
                            <Button
                              id={ruleId + "delete"}
                              className="redeem-rule-icon-btn"
                              size="sm"
                              variant="danger"
                              onClick={() => handleDeleteModal(ruleId)}
                              hidden={isHidden({ module: { key: "Transactions", value: "D" } })}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>

                            <Trigger message={"Select User"} id={ruleId + "selectUser"} />
                            <Button
                              id={ruleId + "selectUser"}
                              className="redeem-rule-icon-btn"
                              size="sm"
                              disabled={!check}
                              variant="info"
                              onClick={() => {
                                navigate(AdminRoutes.RedeemUserSelect, {
                                  state: { RuleData: data, isRedeemRule: true },
                                });
                              }}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-4 redeem-rule-empty">
                      {t("noDataFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleDeleteYes}
          loading={deleteLoading}
        />
      )}
      <PaginationComponent
        page={redeemRuleList?.count < page ? 1 : page}
        totalPages={totalPages}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
};

export default RedeemRule;
