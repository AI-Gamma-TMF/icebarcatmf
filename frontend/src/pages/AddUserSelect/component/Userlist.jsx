import React,{ useState } from 'react'
import { Button, Table, Row, Col, Form } from "@themesberg/react-bootstrap";
import PaginationComponent from "../../../components/Pagination";
import { InlineLoader } from "../../../components/Preloader";
import PlayerSearch from "../../EmailCenter/PlayerSearch";
import usePlayerListing from '../../Players/usePlayerListing';



const UserList = ({
 
  
 

  // viewGames = false,
  // disablePagination = false,
  hasActions = false,
  // hasAddGamesAction = false,
  // hasRemoveGamesAction = false,
 
  editRedeemRule,RuleData
}) => {
//   const { globalSearch, setGlobalSearch } = usePlayerListing();
const {
  t,  
  // addUser,  
  // orderBy,
  // search, 
  limit,
  setLimit,
  page,
  setPage,
  playersData,
  totalPages, 
  loading,  
  globalSearch,
  setGlobalSearch,
 
} = usePlayerListing()
const [selectedUsers, setSelectedUsers] = useState([])

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    )
  }
  
  const handleRedeemSend = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one player");
      return;
    }

    const userSummary = selectedUsers

    editRedeemRule({
     ruleId: (RuleData?.ruleId),
     playerIds: userSummary,
      
     
    });
  };
  return (
    <div className="mt-1">

<div className="d-flex justify-content-between">
        <div >
        <h5>Select User </h5>
        </div>
        
        <div >
          { (
            <Col>
              <div>
              <Button
                variant="success"
                size="sm"
               
                onClick={handleRedeemSend}
                style={{ height: "40px", width: "100px", paddingRight: "0px",alignItems: "center",
                  justifyContent: "center" }}
                
              >
                Add User
              
              </Button>
              </div>
            </Col>
          )}
        </div>
      </div>

      
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
                  
                  <td className='text-center'>
                    <Form.Check
                      type='checkbox'
                      checked={selectedUsers.includes(player.userId)}
                      onChange={() => handleSelectUser(player.userId)}
                      className='d-inline-block'
                    />
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
