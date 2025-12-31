import React from "react";
import { Table } from "@themesberg/react-bootstrap";
import { InlineLoader } from "../Preloader";
import PaginationComponent from "../Pagination";
import { tableHeaders } from "./constants";
import { getDateTime } from "../../utils/dateFormatter";
import { Link } from "react-router-dom";
import {
  convertToTimeZone,
  getFormattedTimeZoneOffset,
} from "../../utils/helper";
import { getItem } from "../../utils/storageUtils";
import { timeZones } from "../../pages/Dashboard/constants";
// import useCheckPermission from "../../utils/checkPermission";

const AmoeList = ({
  page,
  setLimit,
  limit,
  setPage,
  totalPages,
  loading,
  data,
  status,
}) => {
  // const { isHidden } = useCheckPermission();
  const timeZone = getItem("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();

 
  const isFailed = status === "2";
  const failedHeaders = ["USERID", "ENTRY ID", "EMAIL", "SCANNED DATE", "REMARK"];
  const activeHeaders = tableHeaders.map((h) => h.labelKey);
  const headers = isFailed ? failedHeaders : activeHeaders;

  return (
    <>
      <div className="dashboard-data-table">
        <div className="amoe-table-wrap">
          <Table bordered hover responsive size="sm" className="mb-0 text-center">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={headers.length} className="text-center py-4">
                    <InlineLoader />
                  </td>
                </tr>
              ) : data?.amoeBonusHistory?.rows?.length ? (
                data.amoeBonusHistory.rows.map((value, index) => {
                  return isFailed ? (
                    <tr key={index} className="text-center">
                      <td>{value?.userId}</td>
                      <td>{value?.entryId}</td>
                      <td>
                        <Link to={`/admin/player-details/${value?.userId}`}>
                          {value?.email}
                        </Link>
                      </td>
                      <td>
                        {getDateTime(
                          convertToTimeZone(value?.scannedDate, timezoneOffset)
                        )}
                      </td>
                      <td>{value?.remark}</td>
                    </tr>
                  ) : (
                    <tr key={index} className="text-center">
                      <td>{value?.userId}</td>
                      <td>{value?.entryId}</td>
                      <td>
                        <Link to={`/admin/player-details/${value?.userId}`}>
                          {value?.email}
                        </Link>
                      </td>
                      <td>
                        {getDateTime(
                          convertToTimeZone(value?.registeredDate, timezoneOffset)
                        )}
                      </td>
                      <td>
                        {getDateTime(
                          convertToTimeZone(value?.scannedDate, timezoneOffset)
                        )}
                      </td>
                      <td>{value?.scAmount}</td>
                      <td>{value?.gcAmount}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={headers.length} className="text-center py-4 amoe-empty">
                    No data Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {data?.amoeBonusHistory?.count !== 0 && (
        <PaginationComponent
          page={data?.amoeBonusHistory?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </>
  );
};

export default AmoeList;
