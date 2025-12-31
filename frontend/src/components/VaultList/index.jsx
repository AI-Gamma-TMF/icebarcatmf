import { Table } from "@themesberg/react-bootstrap";
import { InlineLoader } from "../Preloader";
import PaginationComponent from "../Pagination";
import { Link } from "react-router-dom";

import useCheckPermission from "../../utils/checkPermission";
import { tableHeaders } from "./constants";
import {
  faArrowCircleDown,
  faArrowCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatPriceWithCommas } from "../../utils/helper";
const VaultList = ({
  page,
  setLimit,
  limit,
  setPage,
  totalPages,
  loading,
  data,
  sort,
  setSort,
  over,
  setOver,
  orderBy,
  setOrderBy,
  selected,
}) => {
  const { isHidden } = useCheckPermission();

  return (
    <>
      <Table
        bordered
        responsive
        hover
        size="sm"
        className="mb-0 text-center"
      >
        <thead>
          <tr>
            {tableHeaders.map((h) => (
              <th
                key={h.value}
                onClick={() => h.value !== "" && setOrderBy(h.value)}
                style={{
                  cursor: h.value !== "" ? "pointer" : "default",
                }}
                className={selected(h) ? "sortable active" : "sortable"}
              >
                {h.labelKey}{" "}
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
              <td colSpan={tableHeaders.length || 1} className="text-center py-4">
                <InlineLoader />
              </td>
            </tr>
          ) : data && data?.rows?.length > 0 ? (
            data?.rows?.map(({ ownerId, User, vault_gc_coin, total_vault_sc_coin }) => {
              return (
                <tr key={ownerId} className="text-center">
                  <td>{ownerId}</td>
                  <td>
                    {isHidden({ module: { key: "Users", value: "R" } }) ? (
                      User?.email
                    ) : (
                      <Link
                        to={`/admin/player-details/${ownerId}`}
                        className="text-link d-inline-block text-truncate"
                      >
                        {User?.email}
                      </Link>
                    )}
                  </td>
                  <td>
                    {isHidden({ module: { key: "Users", value: "R" } }) ? (
                      User?.username
                    ) : (
                      <Link to={`/admin/player-details/${ownerId}`}>
                        {User?.username}
                      </Link>
                    )}
                  </td>
                  <td>{vault_gc_coin ? formatPriceWithCommas(vault_gc_coin) : "0"}</td>
                  <td>
                    {total_vault_sc_coin
                      ? formatPriceWithCommas(total_vault_sc_coin)
                      : "0"}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={tableHeaders.length || 1}
                className="text-danger text-center py-4"
              >
                No data Found
              </td>
            </tr>
          )}
        </tbody>
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

export default VaultList;
