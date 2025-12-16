import React from "react";
import useSubscriptionFeature from "./hooks/useSubscriptionFeature";
import { Button, Row, Table } from "@themesberg/react-bootstrap";
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
      <Row>
        <h3>Subscription Features</h3>
      </Row>
      <Table striped responsive bordered className="text-center mt-3">
        <thead className="thead-dark">
          <tr>
            {featureHeaders.map((h, idx) => (
              <th
                key={idx}
                onClick={() => {
                  (allowedSubscriptionFeatureKeysforOrder.includes(h.value) &&
                    (setOrderBy(h.value) || setSort(sort === 'ASC' ? 'DESC' : 'ASC')))
                }} style={{
                  cursor: 'pointer'
                }}
                className={
                  selected(h)
                    ? 'border-3 border border-blue'
                    : ''
                }
              >
                {h?.labelKey}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subscriptionFeatureData &&
            subscriptionFeatureData?.map(
              ({ subscriptionFeatureId, name, description, isActive }) => (
                <tr key={subscriptionFeatureId}>
                  <td>{subscriptionFeatureId}</td>
                  <td>{name}</td>
                  <td>{description ? description : '-'}</td>
                  <td
                    className={`${isActive ? "text-success" : "text-danger"}`}
                  >
                    {isActive ? "Active" : "In-Active"}
                  </td>
                  <td>
                    <Trigger
                      message={"View"}
                      id={subscriptionFeatureId + "view"}
                    />
                    <Button
                      id={subscriptionFeatureId + "view"}
                      className="m-1"
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

                    <Trigger
                      message="Edit"
                      id={subscriptionFeatureId + "edit"}
                    />
                    <Button
                      id={subscriptionFeatureId + "edit"}
                      className="m-1"
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
                        <Trigger
                          message="Set Status Active"
                          id={subscriptionFeatureId + "active"}
                        />
                        <Button
                          id={subscriptionFeatureId + "active"}
                          className="m-1"
                          size="sm"
                          variant="success"
                          hidden={isHidden({ module: { key: "Subscription", value: "T" } })}
                          onClick={() =>
                            handleShow(subscriptionFeatureId, isActive)
                          }
                        >
                          <FontAwesomeIcon icon={faCheckSquare} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Trigger
                          message="Set Status In-Active"
                          id={subscriptionFeatureId + "inactive"}
                        />
                        <Button
                          id={subscriptionFeatureId + "inactive"}
                          className="m-1"
                          size="sm"
                          variant="danger"
                          hidden={isHidden({ module: { key: "Subscription", value: "T" } })}
                          onClick={() =>
                            handleShow(subscriptionFeatureId, isActive)
                          }
                        >
                          <FontAwesomeIcon icon={faWindowClose} />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              )
            )}
        </tbody>
      </Table>
 {isLoading && <InlineLoader />}
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
