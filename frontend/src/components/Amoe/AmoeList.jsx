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

 
  return (
    <>
      {status === "2" ? (
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
                <th> USERID</th>
                <th>ENTRY ID</th>
                <th>EMAIL</th>
                <th>SCANNED DATE</th>
                <th>REMARK</th>
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
                {data?.amoeBonusHistory &&
                data?.amoeBonusHistory?.rows?.length > 0 ? (
                  data?.amoeBonusHistory?.rows?.map((value, index) => {
                    return (
                      <tr
                        key={index}
                        className="text-center"
                        style={{
                          height: "40px",
                          verticalAlign: "middle",
                        }}
                      >
                        <td>{value?.userId}</td>
                        <td>{value?.entryId}</td>
                        <td>
                          <Link to={`/admin/player-details/${value?.userId}`}>
                            {value?.email}
                          </Link>
                          {/* )} */}
                        </td>
                        <td>
                          {getDateTime(
                            convertToTimeZone(value?.scannedDate, timezoneOffset)
                          )}
                        </td>
                        <td>{value?.remark}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-danger text-center">
                      No data Found
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </Table>
      ) : (
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
                  style={{
                    cursor: "default",
                  }}
                >
                  {h.labelKey}
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
              {data?.amoeBonusHistory &&
              data?.amoeBonusHistory?.rows?.length > 0 ? (
                data?.amoeBonusHistory?.rows?.map((value, index) => {
                  return (
                    <tr
                      key={index}
                      className="text-center"
                      style={{
                        height: "40px",
                        verticalAlign: "middle",
                      }}
                    >
                      <td>{value?.userId}</td>
                      <td>{value?.entryId}</td>
                      <td>
                          <Link to={`/admin/player-details/${value?.userId}`}>
                            {value?.email}
                          </Link>
                        {/* )} */}
                      </td>
                      <td>
                        {getDateTime(
                          convertToTimeZone(
                            value?.registeredDate,
                            timezoneOffset
                          )
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
                  <td colSpan={9} className="text-danger text-center">
                    No data Found
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </Table>
      )}

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
