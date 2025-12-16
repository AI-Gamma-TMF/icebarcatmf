import React, { useState } from "react";
import useSubscriptionPlan from "./hooks/useSubscriptionPlan";
import { Button, Col, Row, Table, Form } from "@themesberg/react-bootstrap";
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
      <Row className="d-flex justify-content-between">
        <h3 className="w-auto">Subscription Plan</h3>
        <Button
          className="w-auto me-3"
          onClick={() => navigate(AdminRoutes.CreateSubscriptionPlan)}
          hidden={isHidden({ module: { key: "Subscription", value: "C" } })}
        >
          Create
        </Button>
      </Row>

      <Row>
        <Col xs={5}>
          <Form.Label>
            Subscription Name or Id
          </Form.Label>

          <Form.Control
            type='search'
            placeholder='Search by Subscription name or Id'
            value={search}
            onChange={(event) => {
              setSearch(event?.target?.value?.replace(/[~`%^#)()><?]+/g, "").trim());
              setError('')
            }}
          />
        </Col>
      </Row>

      <Table striped responsive bordered className="text-center mt-3">
        <thead className="thead-dark">
          <tr>
            {PlanHeaders?.map((h, idx) => (
              <th
                key={idx}
                onClick={() => {
                  (allowedSubscriptionPlanKeysforOrder.includes(h.value) &&
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
          {isLoading ? (
            <tr>
              <td colSpan={13} className="text-center">
                <InlineLoader />
              </td>
            </tr>
          ) : subscriptionPlanData && subscriptionPlanData?.rows?.length > 0 ? (
            subscriptionPlanData?.rows?.map(
              ({
                subscriptionId,
                name,
                description,
                scCoin,
                gcCoin,
                monthlyAmount,
                yearlyAmount,
                weeklyPurchaseCount,
                platform,
                specialPlan,
                thumbnail,
                // features,
                isActive
              }) => (
                <tr key={subscriptionId} style={{ height: "100px" }}>
                  <td>{subscriptionId}</td>
                  <td>{name}</td>
                  <td>
                    {thumbnail ? (
                      <ImageViewer style={{
                        height: "80px",
                        width: "80px"
                      }}
                        thumbnailUrl={thumbnail}
                      />
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
                  <td
                    className={`${isActive ? "text-success" : "text-danger"}`}
                  >
                    {isActive ? "Active" : "In-Active"}
                  </td>
                  <td>
                    <Trigger
                      message="View"
                      id={subscriptionId + "view"}
                    />
                    <Button
                      id={subscriptionId + 'view'}
                      className='m-1'
                      size='sm'
                      variant='info'
                      hidden={isHidden({ module: { key: 'Subscription', value: 'R' } })}
                      onClick={() => {
                        navigate(`${AdminRoutes.ViewSubscriptionPlan.split(':').shift()}${subscriptionId}`);
                      }}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Button>

                    <Trigger
                      message="Edit"
                      id={subscriptionId + "edit"}
                    />

                    <Button
                      id={subscriptionId + 'edit'}
                      className='m-1'
                      size='sm'
                      variant='warning'
                      hidden={isHidden({ module: { key: 'Subscription', value: 'U' } })}
                      onClick={() => {
                        navigate(`${AdminRoutes.EditSubscriptionPlan.split(':').shift()}${subscriptionId}`);
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>

                    {!isActive ? (
                      <>
                        <Trigger
                          message="Set Status Active"
                          id={subscriptionId + "active"}
                        />
                        <Button
                          id={subscriptionId + "active"}
                          className="m-1"
                          size="sm"
                          variant="success"
                          hidden={isHidden({ module: { key: "Subscription", value: "T" } })}
                          onClick={() =>
                            handleShow(subscriptionId, isActive)
                          }
                        >
                          <FontAwesomeIcon icon={faCheckSquare} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Trigger
                          message="Set Status In-Active"
                          id={subscriptionId + "inactive"}
                        />
                        <Button
                          id={subscriptionId + "inactive"}
                          className="m-1"
                          size="sm"
                          variant="danger"
                          hidden={isHidden({ module: { key: "Subscription", value: "T" } })}
                          onClick={() =>
                            handleShow(subscriptionId, isActive)
                          }
                        >
                          <FontAwesomeIcon icon={faWindowClose} />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              )
            )
          ) : (
            <tr>
              <td colSpan={13} className="text-danger text-center">
                No data Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

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
