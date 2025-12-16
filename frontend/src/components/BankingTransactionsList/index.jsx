import { Table, Button } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { timeZones } from "../../pages/Dashboard/constants";
import RemarksModal from "../../pages/PlayerDetails/components/Verification/RemarksModal";
import { usePaymentRefundMutation } from "../../reactQuery/hooks/customMutationHook";
import useCheckPermission from "../../utils/checkPermission";
import {
  convertToTimeZone,
  formatPriceWithCommas,
  getFormattedTimeZoneOffset,
} from "../../utils/helper";
import { getItem } from "../../utils/storageUtils";
import { MoreDetail } from "../ConfirmationModal";
import PaginationComponent from "../Pagination";
import { InlineLoader } from "../Preloader";
import { TRANSACTION_STATUS, tableHeaders } from "./constants";
import { getDateTime } from "../../utils/dateFormatter";
import ModalView from "../Modal";
import { toast } from "../Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleDown,
  faArrowCircleUp,
} from "@fortawesome/free-solid-svg-icons";
const BankingTransactionsList = ({
  page,
  setLimit,
  limit,
  setPage,
  totalPages,
  loading,
  data,
  isAllUser,
  transactionRefetch,
  orderBy,
  setOrderBy,
  sort,
  setSort,
  over,
  setOver,
}) => {
  const { t } = useTranslation("players");
  const { isHidden } = useCheckPermission();
  const [paymentTransactionId, setPaymentTransactionId] = useState(null);
  const [transactionBankingId, setTransactionBankingId] = useState(null);
  const [show, setShow] = useState(false);
  const [moreDetailData, setMoreDetailData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [userId, setUserId] = useState(false);
  const timeZone = getItem("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();
  const _toggleModalForRefund = (
    actioneeId,
    paymentTransactionId,
    transactionBankingId
  ) => {
    setUserId(actioneeId);
    setPaymentTransactionId(paymentTransactionId);
    setTransactionBankingId(transactionBankingId);
    toggleModal();
  };

  const toggleModal = () => {
    setOpenModal(!openModal);
  };
  const closeModal = () => {
    setOpenModal(false);
  };

  const { mutate: refundPayment, isLoading: refundLoading } =
    usePaymentRefundMutation({
      onSuccess: (data) => {
        if (data.data.message) {
          toast(data.data.message, "success");
          transactionRefetch();
          closeModal();
        } else {
          toast(data.data.message, "error");
        }
      },
    });

  const onSubmit = (dataValue) => {
    const data = {
      userId,
      reason: dataValue.reason,
      paymentTransactionId,
      transactionBankingId,
    };
    refundPayment(data);
  };

  const selected = (h) => orderBy === h.value;

  const handleShowMoreDetails = (details) => {
    if (details) {
      try {
        const parsedDetails =
          typeof details === "string" ? JSON.parse(details) : details;
        setMoreDetailData(parsedDetails);
      } catch (e) {
        setMoreDetailData(null);
      }
    } else {
      setMoreDetailData(null);
    }
    setShow(true);
  };

  return (
    <>
      <ModalView
        openModal={openModal}
        toggleModal={toggleModal}
        size="lg"
        hideHeader
        center
        className="announcement-view-wrap"
        firstBtnClass="btn-primary"
        secondBtnClass="btn-secondary"
        hideFooter
      >
        <RemarksModal
          closeModal={closeModal}
          onSubmit={onSubmit}
          loading={refundLoading}
        />
      </ModalView>
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
            {tableHeaders(isAllUser)?.map((h, idx) => (
              <th
                key={idx}
                onClick={() => h.value !== "" && setOrderBy(h.value)}
                style={{
                  cursor: "pointer",
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
            {data && data?.rows?.length > 0 ? (
              data?.rows?.map(
                ({
                  actioneeName,
                  actioneeEmail,
                  transactionId,
                  amount,
                  gcCoin,
                  scCoin,
                  transactionType,
                  status,
                  createdAt,
                  userId,
                  moreDetails,
                }) => {
                  return (
                    <tr key={transactionId} className="text-center">
                      <td>{transactionId}</td>
                      <td>{userId}</td>
                      {!isAllUser ? (
                        <td>{actioneeName}</td>
                      ) : (
                        <td>
                          {isHidden({
                            module: { key: "Users", value: "R" },
                          }) ? (
                            <span>{actioneeEmail}</span>
                          ) : (
                            <Link
                              to={`/admin/player-details/${userId}`}
                              className="text-link d-inline-block text-truncate"
                            >
                              {actioneeEmail}
                            </Link>
                          )}
                        </td>
                      )}

                      <td>{formatPriceWithCommas(amount?.toFixed(2))}</td>
                      <td>{gcCoin ? formatPriceWithCommas(gcCoin) : "-"}</td>
                      <td>{scCoin ? formatPriceWithCommas(scCoin) : "-"}</td>
                      <td className="text-capitalize">{transactionType}</td>
                      <td>{TRANSACTION_STATUS[status]}</td>
                      <td>
                        {getDateTime(
                          convertToTimeZone(createdAt, timezoneOffset)
                        )}
                      </td>
                      <td>
                        <Button
                          style={{ padding: "3px 8px" }}
                          onClick={() => handleShowMoreDetails(moreDetails)}
                        >
                          More Details
                        </Button>
                      </td>
                      {/* {(transactionType === 'deposit' && status === 1)  ?
           <td><Button type='button' className='btn btn-success'                    
            onClick = {()=> toggleModalForRefund(actioneeId,paymentTransactionId, transactionBankingId)}>Void/Refund</Button></td>
             :
             <td> - </td>} */}
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td colSpan={9} className="text-danger text-center">
                  {t("noDataFound")}
                </td>
              </tr>
            )}
          </tbody>
        )}
      </Table>
      {data?.count !== 0 && (
        <PaginationComponent
          page={data?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}

      <MoreDetail
        show={show}
        setShow={setShow}
        moreDetailData={moreDetailData}
      />
    </>
  );
};

export default BankingTransactionsList;
