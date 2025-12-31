import React, { useState } from "react";
import useSubscriptionPlan from "./hooks/useSubscriptionPlan";
import { Button, Col, Row, Table, Form, Card } from "@themesberg/react-bootstrap";
import Trigger from "../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faEdit,
  faEye,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { AdminRoutes } from "../../routes";
import { allowedSubscriptionPlanKeysforOrder, PlanHeaders } from "./constants";
import { InlineLoader } from "../../components/Preloader";
import ImageViewer from "../../components/ImageViewer/ImageViewer";
import useCheckPermission from "../../utils/checkPermission";
import "./subscriptionListing.scss";

const SubscriptionPlan = () => {
  const {
    subscriptionPlanData,
    isLoading,
    show,
    setShow,
    navigate,
    handleShow,
    status,
    setStatus,
    handleYes,
    selected,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    search,
    setSearch
  } = useSubscriptionPlan();
  const { isHidden } = useCheckPermission()

  const [error, setError] = useState('')

  return (
    <>
      <div className="dashboard-typography subscription-page">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="subscription-page__title">Subscription Plan</h3>
            <p className="subscription-page__subtitle">
              Manage subscription plans, pricing, and visibility
            </p>
          </div>

          <div className="d-inline-flex align-items-center justify-content-end gap-2 flex-wrap">
            <Button
              className="admin-affiliate-page__create-btn"
              onClick={() => navigate(AdminRoutes.CreateSubscriptionPlan)}
              hidden={isHidden({ module: { key: "Subscription", value: "C" } })}
            >
              Create
            </Button>
          </div>
        </div>

        <Card className="dashboard-filters subscription-filters mb-4">
          <Card.Body>
            <Row className="g-3 align-items-end">
              <Col xs={12} md={6} lg={4}>
                <Form.Label>Subscription Name or Id</Form.Label>
                <Form.Control
                  type="search"
                  placeholder="Search by Subscription name or Id"
                  value={search}
                  onChange={(event) => {
                    setSearch(event?.target?.value?.replace(/[~`%^#)()><?]+/g, "").trim());
                    setError("");
                  }}
                />
                {!!error && <div className="text-danger mt-1">{error}</div>}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="dashboard-data-table">
          <div className="subscription-table-wrap">
            <Table striped responsive bordered className="mb-0 text-center" size="sm">
              <thead>
                <tr>
                  {PlanHeaders?.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => {
                        allowedSubscriptionPlanKeysforOrder.includes(h.value) &&
                          (setOrderBy(h.value) || setSort(sort === "ASC" ? "DESC" : "ASC"));
                      }}
                      style={{
                        cursor: allowedSubscriptionPlanKeysforOrder.includes(h.value) ? "pointer" : "default",
                      }}
                      className={selected(h) ? "sortable active" : "sortable"}
                    >
                      {h?.labelKey}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={PlanHeaders.length} className="text-center py-4">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : subscriptionPlanData?.rows?.length > 0 ? (
                  subscriptionPlanData?.rows?.map(
                    ({
                      subscriptionId,
                      name,
                      scCoin,
                      gcCoin,
                      monthlyAmount,
                      yearlyAmount,
                      weeklyPurchaseCount,
                      specialPlan,
                      thumbnail,
                      isActive,
                    }) => (
                      <tr key={subscriptionId} className="align-middle">
                        <td>{subscriptionId}</td>
                        <td>{name}</td>
                        <td>
                          {thumbnail ? (
                            <ImageViewer className="subscription-thumb" thumbnailUrl={thumbnail} />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>{monthlyAmount}</td>
                        <td>{yearlyAmount}</td>
                        <td>{weeklyPurchaseCount ? weeklyPurchaseCount : "-"}</td>
                        <td>{scCoin}</td>
                        <td>{gcCoin}</td>
                        <td>{specialPlan ? "true" : "false"}</td>
                        <td>
                          <span
                            className={
                              isActive ? "subscription-pill subscription-pill--active" : "subscription-pill subscription-pill--inactive"
                            }
                          >
                            {isActive ? "Active" : "In-Active"}
                          </span>
                        </td>
                        <td>
                          <div className="subscription-actions">
                            <Trigger message="View" id={subscriptionId + "view"} />
                            <Button
                              id={subscriptionId + "view"}
                              className="subscription-icon-btn"
                              size="sm"
                              variant="info"
                              hidden={isHidden({ module: { key: "Subscription", value: "R" } })}
                              onClick={() => {
                                navigate(`${AdminRoutes.ViewSubscriptionPlan.split(":").shift()}${subscriptionId}`);
                              }}
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Button>

                            <Trigger message="Edit" id={subscriptionId + "edit"} />
                            <Button
                              id={subscriptionId + "edit"}
                              className="subscription-icon-btn"
                              size="sm"
                              variant="warning"
                              hidden={isHidden({ module: { key: "Subscription", value: "U" } })}
                              onClick={() => {
                                navigate(`${AdminRoutes.EditSubscriptionPlan.split(":").shift()}${subscriptionId}`);
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>

                            {!isActive ? (
                              <>
                                <Trigger message="Set Status Active" id={subscriptionId + "active"} />
                                <Button
                                  id={subscriptionId + "active"}
                                  className="subscription-icon-btn"
                                  size="sm"
                                  variant="success"
                                  hidden={isHidden({ module: { key: "Subscription", value: "T" } })}
                                  onClick={() => handleShow(subscriptionId, isActive)}
                                >
                                  <FontAwesomeIcon icon={faCheckSquare} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Trigger message="Set Status In-Active" id={subscriptionId + "inactive"} />
                                <Button
                                  id={subscriptionId + "inactive"}
                                  className="subscription-icon-btn"
                                  size="sm"
                                  variant="danger"
                                  hidden={isHidden({ module: { key: "Subscription", value: "T" } })}
                                  onClick={() => handleShow(subscriptionId, isActive)}
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
                    <td colSpan={PlanHeaders.length} className="text-center py-4 subscription-empty">
                      No data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {show && (
        <ConfirmationModal
          setShow={() => setShow(false)}
          show={show}
          handleYes={handleYes}
          active={status}
          loading={isLoading}
        />
      )}
    </>
  );
};
export default SubscriptionPlan;
