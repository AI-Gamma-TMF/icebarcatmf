import React from "react";
import UserList from "../../pages/AddUser/component/Userlist";
import {
  Button,
  Table,
  Form,
  Row,
} from "@themesberg/react-bootstrap";
import { toast } from '../../components/Toast'
import Trigger from "../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import usePlayerListing from "../../pages/Players/usePlayerListing";

const SelectUser = ({selectedUser, setSelectedUser,showSendButton,handleSend,isloading }) => {
  const {
    t,
    limit,
    setLimit,
    page,
    setPage,
    playersData,
    totalPages,
    loading,
    globalSearch,
    setGlobalSearch,
  } = usePlayerListing();

 

  const addUser = (user) => {
    const userExists = [...selectedUser].findIndex(
      (g) => g.userId === user.userId
    );

    if (userExists === -1) {
      setSelectedUser([...selectedUser, user]);
    } else {
      toast("User already added ", "error");
    }
  };
  const removeUser = (user) => {
    const updatedUser = [...selectedUser].filter(
      (g) => g.userId !== user.userId
    );
    setSelectedUser(updatedUser);
  };

  return (
    <div className="mt-3">
      <Row className="mt-2 d-flex">
        <div className="d-flex">
          {/* <div>
            <h5>{`${message}:${title}`}</h5>
          </div> */}

         {showSendButton &&  <div className="col text-end">
            <Button
              variant="success"
              size="sm"
              disabled={isloading || selectedUser.length === 0}
              onClick={handleSend}
              style={{
                height: "40px",
                width: "100px",
             
                alignItems: "center",
                justifyContent: "center",
              }}
        

            >
              Add
            
            </Button>
          </div> }
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
              {[
                // t('casinoGames.addGames.headers.id'),
                "Id",
                "Email",
                "Username",
                "Status",
                "Actions",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {selectedUser?.length > 0 &&
              selectedUser?.map((player) => {
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
                          message="Remove this user "
                          id={player.userId + "removeuser"}
                        />
                        <Button
                          id={player.userId + "removeuser"}
                          className="m-1"
                          size="sm"
                          variant="danger"
                          onClick={() => removeUser(player)}
                        >
                          <FontAwesomeIcon icon={faMinusSquare} />
                        </Button>
                      </>
                    </td>
                  </tr>
                );
              })}
            {selectedUser?.length === 0 && (
              <tr>
                <td colSpan={5} className="text-danger text-center">
                  No Data
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Row className="mt-4">
          <Form.Label>
            <h5>Select User </h5>
          </Form.Label>
        </Row>

        <UserList
          loading={loading}
          t={t}
          page={page}
          limit={limit}
          setLimit={setLimit}
          setPage={setPage}
          totalPages={totalPages}
          playersData={playersData}
          addUser={addUser}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />
      </Row>
    </div>
  );
};

export default SelectUser;
