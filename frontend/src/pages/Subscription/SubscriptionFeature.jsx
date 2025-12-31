import React from "react";
import useSubscriptionFeature from "./hooks/useSubscriptionFeature";
import { Button, Row, Col, Table, Card } from "@themesberg/react-bootstrap";
import { allowedSubscriptionFeatureKeysforOrder, featureHeaders } from "./constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faEdit,
  faEye,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import Trigger from "../../components/OverlayTrigger";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { AdminRoutes } from "../../routes";
import SubscriptionFeatureModal from "./EditSubscriptionFeature";
import useCheckPermission from "../../utils/checkPermission";
import { InlineLoader } from "../../components/Preloader";
import "./subscriptionListing.scss";

const SubscriptionFeature = () => {
  const {
    subscriptionFeatureData,
    isLoading,
    handleShow,
    show,
    setShow,
    subscriptionFeatureId,
    setSubscriptionFeatureId,
    handleYes,
    updateLoading,
    active,
    navigate,
    showSubscriptionModal,
    setShowSubscriptionModal,
    mode,
    setMode,
    sort,
    setSort,
    selected,
    setOrderBy,
    orderBy
  } = useSubscriptionFeature();

  const { isHidden } = useCheckPermission()

  return (
    <>
      <div className="dashboard-typography subscription-page">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="subscription-page__title">Subscription Features</h3>
            <p className="subscription-page__subtitle">Manage features and their visibility</p>
          </div>
        </div>

        <Card className="dashboard-filters subscription-filters mb-4">
          <Card.Body>
            <div className="text-muted small">Click a header to sort.</div>
          </Card.Body>
        </Card>

        <div className="dashboard-data-table">
          <div className="subscription-table-wrap">
            <Table striped responsive bordered className="mb-0 text-center" size="sm">
              <thead>
                <tr>
                  {featureHeaders.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => {
                        allowedSubscriptionFeatureKeysforOrder.includes(h.value) &&
                          (setOrderBy(h.value) || setSort(sort === "ASC" ? "DESC" : "ASC"));
                      }}
                      style={{ cursor: allowedSubscriptionFeatureKeysforOrder.includes(h.value) ? "pointer" : "default" }}
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
                    <td colSpan={featureHeaders.length} className="text-center py-4">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : subscriptionFeatureData?.length ? (
                  subscriptionFeatureData.map(({ subscriptionFeatureId, name, description, isActive }) => (
                    <tr key={subscriptionFeatureId}>
                      <td>{subscriptionFeatureId}</td>
                      <td>{name}</td>
                      <td>{description ? description : "-"}</td>
                      <td>
                        <span
                          className={
                            isActive
                              ? "subscription-pill subscription-pill--active"
                              : "subscription-pill subscription-pill--inactive"
                          }
                        >
                          {isActive ? "Active" : "In-Active"}
                        </span>
                      </td>
                      <td>
                        <div className="subscription-actions">
                          <Trigger message={"View"} id={subscriptionFeatureId + "view"} />
                          <Button
                            id={subscriptionFeatureId + "view"}
                            className="subscription-icon-btn"
                            size="sm"
                            variant="info"
                            hidden={isHidden({ module: { key: "Subscription", value: "R" } })}
                            onClick={() => {
                              setShowSubscriptionModal(true);
                              setMode("view");
                              setSubscriptionFeatureId(subscriptionFeatureId);
                            }}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>

                          <Trigger message="Edit" id={subscriptionFeatureId + "edit"} />
                          <Button
                            id={subscriptionFeatureId + "edit"}
                            className="subscription-icon-btn"
                            size="sm"
                            variant="warning"
                            hidden={isHidden({ module: { key: "Subscription", value: "U" } })}
                            onClick={() => {
                              setShowSubscriptionModal(true);
                              setMode("edit");
                              setSubscriptionFeatureId(subscriptionFeatureId);
                            }}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>

                          {!isActive ? (
                            <>
                              <Trigger message="Set Status Active" id={subscriptionFeatureId + "active"} />
                              <Button
                                id={subscriptionFeatureId + "active"}
                                className="subscription-icon-btn"
                                size="sm"
                                variant="success"
                                hidden={isHidden({ module: { key: "Subscription", value: "T" } })}
                                onClick={() => handleShow(subscriptionFeatureId, isActive)}
                              >
                                <FontAwesomeIcon icon={faCheckSquare} />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Trigger message="Set Status In-Active" id={subscriptionFeatureId + "inactive"} />
                              <Button
                                id={subscriptionFeatureId + "inactive"}
                                className="subscription-icon-btn"
                                size="sm"
                                variant="danger"
                                hidden={isHidden({ module: { key: "Subscription", value: "T" } })}
                                onClick={() => handleShow(subscriptionFeatureId, isActive)}
                              >
                                <FontAwesomeIcon icon={faWindowClose} />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={featureHeaders.length} className="text-center py-4 subscription-empty">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {showSubscriptionModal && (
        <SubscriptionFeatureModal
          show={showSubscriptionModal}
          setShow={setShowSubscriptionModal}
          mode={mode}
          subscriptionFeatureId={subscriptionFeatureId}
          setSubscriptionFeatureId={setSubscriptionFeatureId}
        />
      )}
      {show && (
        <ConfirmationModal
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
          loading={updateLoading}
        />
      )}
    </>
  );
};

export default SubscriptionFeature;
