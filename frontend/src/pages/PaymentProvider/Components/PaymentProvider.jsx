import React from "react";
import { Table, Button } from "@themesberg/react-bootstrap";
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
      <div className="d-flex justify-content-between">
        <h3>Payment Provider</h3>
      </div>
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
            {paymentProviderHeader?.map((h, idx) => (
              <th
                key={idx}
                onClick={() => h.value !== "" && setOrderBy(h.value)}
                style={{
                  cursor: "pointer",
                }}
                className={selected(h) ? "border-3 border border-blue" : ""}
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
        {loading ? (
          <tr>
            <td colSpan={10} className="text-center">
              <InlineLoader />
            </td>
          </tr>
        ) : (
          <tbody>
            {paymentProviderList && paymentProviderList?.length > 0 ? (
              paymentProviderList?.map(
                ({
                  paymentMethodId,
                  methodName,
                  paymentProvider,
                  isActive,
                }) => {
                  return (
                    <tr key={paymentMethodId} className="text-center">
                      <td>{paymentMethodId}</td>
                      <td>{methodName}</td>
                      <td>{paymentProvider}</td>
                      <td>
                        {isActive ? (
                          <span className="text-success">Active</span>
                        ) : (
                          <span className="text-danger">In Active</span>
                        )}
                      </td>
                      <td>
                        {!isActive ? (
                          <>
                            <Trigger
                              message={"set Payment Provider Active"}
                              id={paymentMethodId + "active"}
                            />
                            <Button
                              id={paymentMethodId + "active"}
                              className="m-1"
                              size="sm"
                              variant="success"
                              onClick={() =>
                                handleShow(paymentMethodId, isActive)
                              }
                            >
                              <FontAwesomeIcon icon={faCheckSquare} />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Trigger
                              message={"set Payment Provider Inactive"}
                              id={paymentMethodId + "inactive"}
                            />
                            <Button
                              id={paymentMethodId + "inactive"}
                              className="m-1"
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                handleShow(paymentMethodId, isActive)
                              }
                            >
                              <FontAwesomeIcon icon={faWindowClose} />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td colSpan={9} className="text-danger text-center">
                  {"No Data Found"}
                </td>
              </tr>
            )}
          </tbody>
        )}
      </Table>

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
