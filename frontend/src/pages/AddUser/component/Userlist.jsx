import React from "react";
import { Button, Table, Row } from "@themesberg/react-bootstrap";
import PaginationComponent from "../../../components/Pagination";
import Trigger from "../../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { InlineLoader } from "../../../components/Preloader";
import PlayerSearch from "../../EmailCenter/PlayerSearch";


const UserList = ({
  t,
  page,
  limit,
  setLimit,
  hasActions = false,
  setPage,
  totalPages,
  playersData,
  addUser,
  // search,
  // setSearch,
  // viewGames = false,
  // disablePagination = false,
  // hasAddGamesAction = false,
  // hasRemoveGamesAction = false,
  // getProviderName,
  // removeGames,
  // removeGame,
  loading,
  globalSearch, setGlobalSearch
}) => {
//   const { globalSearch, setGlobalSearch } = usePlayerListing();

  return (
    <div className="mt-1">
      <Row className="mb-2">
       
        <PlayerSearch
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          playersData={playersData}
        />
    

      </Row>

      <Table
        bordered
        striped
        responsive
        hover
        size="sm"
        className={"text-center"}
      >
        <thead className="thead-dark">
          <tr>
            {[
              // t('casinoGames.addGames.headers.id'),
              "Id",
              "Email",
              "Username",
              "Status",
              "Actions",

              // t('casinoGames.addGames.headers.actions'),
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
            {hasActions && <th>{t("casinoGames.addGames.headers.actions")}</th>}
          </tr>
        </thead>

        <tbody>
          {playersData?.count > 0 &&
            playersData?.rows?.map((player) => {
              return (
                <tr key={player.userId}>
                  <td>{player.userId}</td>
                  <td>{player.email}</td>
                  <td>{player.username || "NA"}</td>
                  <td>
                    {player.status === "Active" ? (
                      <span className="text-success">{player.status}</span>
                    ) : (
                      <span className="text-danger">{player.status}</span>
                    )}
                  </td>
                  <td>
                    <>
                      <Trigger
                        message="Add this User"
                        id={player.userId + "addUser"}
                      />
                      <Button
                        id={player.userId + "addUser"}
                        className="m-1"
                        size="sm"
                        variant="success"
                        onClick={() => addUser(player)}
                      >
                        <FontAwesomeIcon icon={faPlusSquare} />
                      </Button>
                    </>
                  </td>
                </tr>
              );
            })}
          {playersData?.count === 0 && (
            <tr>
              <td
                colSpan={hasActions ? 4 : 3}
                className="text-danger text-center"
              >
                No Data
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {loading && <InlineLoader />}

      {playersData?.count !== 0 && (
        <PaginationComponent
          page={playersData?.count < page ? setPage(1) : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </div>
  );
};

export default UserList;
