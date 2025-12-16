import React from "react";
import { Button, Row, Col, Table } from "@themesberg/react-bootstrap";
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
      <Row>
        <Col className="col-10">
          <h3>Redeem Rule</h3>
        </Col>
        <Col className="col-2 text-end ">
          <Button
            variant="success"
            className="f-right"
            size="sm"
            style={{ height: "40px", width: "100px" }}
            onClick={() => navigate(AdminRoutes.RedeemRuleCreate)}
            hidden={isHidden({ module: { key: "Transactions", value: "C" } })}
          >
            Create
          </Button>
        </Col>
      </Row>
      {
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
                  onClick={() => h.value !== "" && setOrderBy(h.value)}
                  style={{
                    cursor: "default",
                  }}
                  className={selected(h) ? "border-3 border border-blue" : ""}
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

          {loading ? (
            <tr>
              <td colSpan={10} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : (
            <tbody>
              {redeemRuleList?.count > 0 ? (
                redeemRuleList?.rows?.map((data) => {
                  const { ruleId, ruleName, isActive, ruleCondition } = data;
                  const checkUserId = (data) => {
                    const checkCondition = (condition) => {
                      if (
                        condition.field === "userId" &&
                        (condition.value === "true" ||
                          condition.value === "false")
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
                    <tr key={ruleId}>
                      <td>{ruleId}</td>

                      <td>
                        {/* <Trigger message={ruleName} id={ruleName} />
                        <span
                          id={ruleName}
                          style={{
                            width: "150px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.CmsDetails.split(
                                ":"
                              ).shift()}${cmsPageId}`
                            )
                          }
                          className="text-link d-inline-block text-truncate"
                        >
                          {ruleName}
                        </span> */}
                        {ruleName}
                      </td>

                      <td>
                        {isActive ? (
                          <span className="text-success">
                            {t("activeStatus")}
                          </span>
                        ) : (
                          <span className="text-danger">
                            {t("inActiveStatus")}
                          </span>
                        )}
                      </td>
                      <td>
                        <Trigger message="View" id={ruleId + "view"} />
                        <Button
                          id={ruleId + "view"}
                          className="m-1"
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.RedeemViewUser.split(
                                ":"
                              ).shift()}${ruleId}`
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Button>
                        <Trigger message="Edit" id={ruleId + "edit"} />
                        <Button
                          id={ruleId + "edit"}
                          className="m-1"
                          size="sm"
                          variant="warning"
                          hidden={isHidden({
                            module: { key: "Transactions", value: "U" },
                          })}
                          onClick={() =>
                            navigate(
                              `${AdminRoutes.RedeemRuleEdit.split(
                                ":"
                              ).shift()}${ruleId}`
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>

                        <Trigger message={"Delete"} id={ruleId + "delete"} />
                        <Button
                          id={ruleId + "delete"}
                          className="m-1"
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteModal(ruleId)}
                          hidden={isHidden({
                            module: { key: "Transactions", value: "D" },
                          })}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>

                        <Trigger
                          message={"Select User"}
                          id={ruleId + "selectUser"}
                        />

                        <Button
                          id={ruleId + "selectUser"}
                          className="m-1"
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
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-danger text-center">
                    {t("noDataFound")}
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </Table>
      }
      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleDeleteYes}
          loading={deleteLoading}
        />
      )}
      {
        <PaginationComponent
          page={redeemRuleList?.count < page ? 1 : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      }
    </>
  );
};

export default RedeemRule;
