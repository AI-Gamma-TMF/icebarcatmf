import React, { useState } from "react";
import { Table, Button } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { InlineLoader } from "../Preloader";
import PaginationComponent from "../Pagination";
import { tableHeaders, tableHeadersForPlayer } from "./constants";
import { getDateTime } from "../../utils/dateFormatter";
import { Link } from "react-router-dom";
import {
  convertToTimeZone,
  getFormattedTimeZoneOffset,
} from "../../utils/helper";
import { timeZones } from "../../pages/Dashboard/constants";
import { getItem } from "../../utils/storageUtils";
import { MoreDetail } from "../ConfirmationModal";
import useCheckPermission from "../../utils/checkPermission";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleDown,
  faArrowCircleUp,
} from "@fortawesome/free-solid-svg-icons";

const CasinoTransactionsList = ({
  page,
  setLimit,
  limit,
  setPage,
  totalPages,
  loading,
  data,
  isAllUser,
  orderBy,
  setOrderBy,
  sort,
  setSort,
  over,
  setOver,
  selected,
}) => {
  const { t } = useTranslation("players");
  const { isHidden } = useCheckPermission();
  const timeZone = getItem("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();
  const [show, setShow] = useState(false);
  const [moreDetailData, setMoreDetailData] = useState(null);
  const AMOUNT_TYPES = {
    0: "GC",
    1: "SC",
    2: "GC + SC",
  };

  const TRANSACTION_STATUS = {
    0: "Pending",
    1: "Success",
    2: "Cancelled",
    3: "Failed",
    4: "Rollback",
    5: "Approved",
    6: "Declined",
    9: "Void",
    10: "Refund",
  };

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
            {isAllUser
              ? tableHeaders()?.map((h, idx) => (
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
                ))
              : tableHeadersForPlayer()?.map((h, idx) => (
                  <th
                    key={idx}
                    style={{
                      cursor: "pointer",
                    }}
                    className=""
                  >
                    {t(h.labelKey)}{" "}
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
            {data &&
              data?.rows?.map(
                ({
                  casinoTransactionId,
                  transactionId,
                  gameId,
                  actionType,
                  amount,
                  amountType,
                  userId,
                  status,
                  updatedAt,
                  gc,
                  sc,
                  name,
                  moreDetails,
                  email,
                  userName,
                }) => {
                  return (
                    <tr key={casinoTransactionId} className="text-center">
                      <td>{casinoTransactionId}</td>
                      <td>
                        {transactionId}
                        {/* <Trigger message='Copy' id={`${transactionId}_copy`} />
                    <CopyToClipboard
                      text={transactionId}
                      onCopy={() => {
                        toast('Payment id copied to clipboard', 'success')
                      }}
                    >
                      <span
                      id={`${transactionId}_copy`}
                      style={{ cursor: 'pointer' }}
>
                      {transactionId}
                    </span>
                    </CopyToClipboard> */}
                      </td>
                      {isAllUser && (
                        <td>
                          {isHidden({
                            module: { key: "Users", value: "R" },
                          }) ? (
                            email
                          ) : (
                            <Link
                              to={`/admin/player-details/${userId}`}
                              className="text-link d-inline-block text-truncate"
                            >
                              {email}
                            </Link>
                          )}
                        </td>
                      )}
                      <td>{userId || "-"}</td>
                      <td>{userName || "-"}</td>
                      <td>
                        <span>{gameId?.toUpperCase()}</span>
                      </td>
                      {/* <td>{MasterCasinoGame ? MasterCasinoGame.name : '-'}</td> */}
                      <td>{name || "-"}</td>
                      <td>{actionType}</td>
                      <td>
                        {amountType === 2
                          ? `${gc?.toFixed(2)} + ${sc?.toFixed(2)}`
                          : amountType === 0
                          ? `${gc?.toFixed(2)}`
                          : amount?.toFixed(2)}
                      </td>
                      <td>{AMOUNT_TYPES[amountType]}</td>
                      <td>{TRANSACTION_STATUS[status]}</td>
                      {/* <td>{currencyCode}</td> */}
                      <td>
                        {updatedAt
                          ? getDateTime(
                              convertToTimeZone(updatedAt, timezoneOffset)
                            )
                          : ""}
                      </td>
                      <td>
                        <Button
                          style={{ padding: "3px 8px" }}
                          onClick={() => handleShowMoreDetails(moreDetails)}
                        >
                          More Details
                        </Button>
                      </td>
                    </tr>
                  );
                }
              )}

            {data?.count === 0 && (
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

export default CasinoTransactionsList;
