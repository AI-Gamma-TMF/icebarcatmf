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
            {tableHeaders?.map((h, idx) => (
              <th
                key={idx}
                onClick={() =>
                  ["email", "totalScAdded", "totalScRemoved"].includes(
                    h.value
                  ) && handleStaffTableSorting(h)
                }
                style={{
                  cursor: ["email", "totalScAdded", "totalScRemoved"].includes(
                    h.value
                  )
                    ? "pointer"
                    : "default",
                }}
                className={selected(h) ? "border-3 border border-blue" : ""}
              >
                {h.labelKey}
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
        {isFetching ? (
          <tr>
            <td colSpan={10} className="text-center">
              <InlineLoader />
            </td>
          </tr>
        ) : (
          <tbody>
            {data && data?.rows?.length > 0 ? (
              data?.rows?.map((value, index) => {
                return (
                  <tr
                    key={index}
                    className="text-center"
                    style={{
                      height: "40px",
                      verticalAlign: "middle",
                    }}
                  >
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>{value?.email} </td>
                    <td>
                      {value?.firstName} {value?.lastName}
                    </td>
                    <td>{formatPriceWithCommas(value?.totalScAdded)}</td>
                    <td>{formatPriceWithCommas(value?.totalScRemoved)}</td>
                    <td>
                      <Link
                        to={{
                          pathname: `${AdminRoutes.StaffTransactionDetails.split(
                            ":"
                          ).shift()}${value?.adminUserId}`,
                        }}
                        style={{
                          color: "-webkit-link",
                          textDecoration: "underline",
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
                <td colSpan={9} className="text-danger text-center">
                  No data Found
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
    </>
  );
};

export default StaffSCCreditTable;
