import React from "react";



import UserList from "./component/Userlist";
import usePlayerListing from "../Players/usePlayerListing";

import {
  Button,
  Table,
  Form,
  Row,
  Spinner,
} from "@themesberg/react-bootstrap";

import Trigger from "../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusSquare } from "@fortawesome/free-solid-svg-icons";

const AddUser = ({ sendMail, sendMailLoading, templatedata, istestButton,isRedeemRule,
  editRedeemRule,
  RuleData,
  editloading}) => {
  const {
    t,
    selectedUser,
    addUser,
    removeUser,
    // orderBy,
    // selected,
    limit,
    setLimit,
    page,
    setPage,
    // search,
    // setSearch,
    playersData,
    totalPages,
    // navigate,
    loading,
    // kycOptions,
    // setKycOptions,
    // setOrderBy,
    // sort,
    // setSort,
    // over,
    // setOver,
    // handleStatusShow,
    // playerStatusDetail,
    // setStatusShow,
    // statusShow,
    // handleYes,
    // status,
    globalSearch,
    setGlobalSearch,
    // getCsvDownloadUrl,
    // playerId,
    // playerDetail,
    // updateloading,
  } = usePlayerListing();

  const handleSend = () => {
    if (selectedUser.length === 0) {
      alert("Please select at least one player");
      return;
    }

    const userSummary = selectedUser.map((user) => ({
      userId: user.userId,
      email: user.email,
    }));

    sendMail({
      emailTemplateId: Number(templatedata?.emailTemplateId),
      userData: userSummary,
      dynamicField: templatedata?.dynamicFields,
    });
  };
  const handleRedeemSend = () => {
    if (selectedUser.length === 0) {
      alert("Please select at least one player");
      return;
    }

    const userSummary = selectedUser.map(user => user.userId)

    editRedeemRule({
     ruleId: (RuleData?.ruleId),
     playerIds: userSummary,
      
     
    });
  };
  return (

      <div className="mt-3">
        <Row className="mt-2 d-flex">
          <div className="d-flex">
            <div>
              {istestButton ? (
                <h5>
                  Added Users: For test purpose you can add up to 10 users
                </h5>
              ) : (
                <h5>Added User</h5>
              )}
            </div>

            <div className="col text-end">
              <Button
                variant="success"
                size="sm"
                disabled={
                  sendMailLoading || editloading ||
                  (istestButton
                    ? selectedUser.length === 0 || selectedUser.length > 10
                    : selectedUser.length < 1)
                }
                onClick={isRedeemRule?handleRedeemSend :   handleSend}
                style={{ height: "40px", width: "100px", paddingRight: "0px",alignItems: "center",
                  justifyContent: "center" }}
                
              >
                Send
                {sendMailLoading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </Button>
            </div>
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

export default AddUser;
