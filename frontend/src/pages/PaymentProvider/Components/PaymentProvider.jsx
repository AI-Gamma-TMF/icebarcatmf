import React from "react";
import { Table, Button, Card } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleDown,
  faArrowCircleUp,
  faCheckSquare,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import usePaymentProvider from "../hooks/usePaymentProvider";
import { paymentProviderHeader } from "../constants";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { InlineLoader } from "../../../components/Preloader";
import Trigger from "../../../components/OverlayTrigger";
import "../paymentProvider.scss";

const PaymentProvider = () => {
  const {
    loading,
    paymentProviderList,
    handleShow,
    handleYes,
    show,
    setShow,
    active,
    selected,
    orderBy,
    sort,
    setSort,
    setOrderBy,
    over,
    setOver,
  } = usePaymentProvider();

  return (
    <>
      <div className="dashboard-typography payment-provider-page">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="payment-provider-page__title">Payment Provider</h3>
            <p className="payment-provider-page__subtitle">Enable/disable payment methods</p>
          </div>
        </div>

        <Card className="dashboard-filters payment-provider-filters mb-4">
          <Card.Body>
            <div className="text-muted small">Click a header to sort.</div>
          </Card.Body>
        </Card>

        <div className="dashboard-data-table">
          <div className="payment-provider-table-wrap">
            <Table bordered striped responsive hover size="sm" className="mb-0 text-center">
              <thead>
                <tr>
                  {paymentProviderHeader?.map((h, idx) => (
                    <th
                      key={idx}
                      onClick={() => h.value !== "" && setOrderBy(h.value)}
                      style={{ cursor: h.value !== "" ? "pointer" : "default" }}
                      className={selected(h) ? "sortable active" : "sortable"}
                    >
                      {h?.label}{" "}
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
                    <td colSpan={paymentProviderHeader.length} className="text-center py-4">
                      <InlineLoader />
                    </td>
                  </tr>
                ) : paymentProviderList?.length > 0 ? (
                  paymentProviderList?.map(({ paymentMethodId, methodName, paymentProvider, isActive }) => {
                    return (
                      <tr key={paymentMethodId} className="align-middle">
                        <td>{paymentMethodId}</td>
                        <td>{methodName}</td>
                        <td>{paymentProvider}</td>
                        <td>
                          <span
                            className={
                              isActive
                                ? "payment-provider-pill payment-provider-pill--active"
                                : "payment-provider-pill payment-provider-pill--inactive"
                            }
                          >
                            {isActive ? "Active" : "In Active"}
                          </span>
                        </td>
                        <td>
                          <div className="payment-provider-actions">
                            {!isActive ? (
                              <>
                                <Trigger message={"set Payment Provider Active"} id={paymentMethodId + "active"} />
                                <Button
                                  id={paymentMethodId + "active"}
                                  className="payment-provider-icon-btn"
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleShow(paymentMethodId, isActive)}
                                >
                                  <FontAwesomeIcon icon={faCheckSquare} />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Trigger message={"set Payment Provider Inactive"} id={paymentMethodId + "inactive"} />
                                <Button
                                  id={paymentMethodId + "inactive"}
                                  className="payment-provider-icon-btn"
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleShow(paymentMethodId, isActive)}
                                >
                                  <FontAwesomeIcon icon={faWindowClose} />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={paymentProviderHeader.length} className="text-center py-4 payment-provider-empty">
                      No Data Found
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
          setShow={setShow}
          show={show}
          handleYes={handleYes}
          active={active}
          loading={loading}
        />
      )}
    </>
  );
};

export default PaymentProvider;
