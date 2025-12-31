import React from "react";
import { Table } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleUp,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { tableHeaders } from "../constants";
import { InlineLoader } from "../../../components/Preloader";
import { AdminRoutes } from "../../../routes";
import PaginationComponent from "../../../components/Pagination";
import { formatPriceWithCommas } from "../../../utils/helper";
// import useCheckPermission from '../../../utils/checkPermission';

const StaffSCCreditTable = ({
  page,
  setLimit,
  limit,
  setPage,
  totalPages,
  // loading,
  data,
  orderBy,
  setOrderBy,
  sort,
  setSort,
  over,
  setOver,
  selected,
  isFetching,
}) => {
  // const { isHidden } = useCheckPermission()
  const handleStaffTableSorting = (param) => {
    if (param.value === orderBy) {
      setSort(sort === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(param.value);
      setSort("asc");
    }
  };

  return (
    <>
      <div className="table-responsive dashboard-table admin-coins-table">
        <Table size="sm" className="text-center dashboard-data-table admin-coins-table__table">
          <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>
          <thead>
            <tr>
              {tableHeaders?.map((h, idx) => {
                const sortable = ["email", "totalScAdded", "totalScRemoved"].includes(
                  h.value
                );
                return (
                  <th
                    key={idx}
                    onClick={() => sortable && handleStaffTableSorting(h)}
                    style={{ cursor: sortable ? "pointer" : "default" }}
                  >
                    {h.labelKey}
                    {selected(h) && (
                      <>
                        {sort === "asc" ? (
                          <FontAwesomeIcon
                            style={over ? { color: "rgba(0,229,160,0.92)" } : {}}
                            icon={faArrowCircleUp}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSort("desc");
                            }}
                            onMouseOver={() => setOver(true)}
                            onMouseLeave={() => setOver(false)}
                          />
                        ) : (
                          <FontAwesomeIcon
                            style={over ? { color: "rgba(0,229,160,0.92)" } : {}}
                            icon={faArrowCircleDown}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSort("asc");
                            }}
                            onMouseOver={() => setOver(true)}
                            onMouseLeave={() => setOver(false)}
                          />
                        )}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={10} className="text-center">
                  <InlineLoader />
                </td>
              </tr>
            ) : data && data?.rows?.length > 0 ? (
              data?.rows?.map((value, index) => {
                return (
                  <tr key={index}>
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>{value?.email}</td>
                    <td>
                      {value?.firstName} {value?.lastName}
                    </td>
                    <td>{formatPriceWithCommas(value?.totalScAdded)}</td>
                    <td>{formatPriceWithCommas(value?.totalScRemoved)}</td>
                    <td>
                      <Link
                        className="admin-coins-table__link"
                        to={{
                          pathname: `${AdminRoutes.StaffTransactionDetails.split(
                            ":"
                          ).shift()}${value?.adminUserId}`,
                        }}
                      >
                        Show Transaction
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="text-center">
                  <span className="admin-coins-empty">No data found</span>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {data?.count !== 0 && (
        <PaginationComponent
          page={data?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </>
  );
};

export default StaffSCCreditTable;
