import React from "react";
import {
  Button,
  Col,
  Table,
  Form,
  Row,
  Spinner,
} from "@themesberg/react-bootstrap";

import Trigger from "../../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusSquare } from "@fortawesome/free-solid-svg-icons";

const AddedUserTable = ({
  selectedUser,
  removeUser,
  // addUserToTable,
  // loading,
  sendMail,
  sendMailLoading,templatedata
}) => {
  
  const handleSend = () => {
    if (selectedUser.length === 0) {
      alert("Please select at least one player");
      return;
    }

    const userSummary = selectedUser.map((user) => ({
      userId: user.userId,
      email: user.email,
    }));

    sendMail({ emailTemplateId:templatedata?.emailTemplateId,userData: userSummary });
  };
  return (
    <>
      <Row>
        <Col>
          <Form.Label>
            <h5>Users you add will update here </h5>
          </Form.Label>
        </Col>
        <Col className="text-right ">
          <Button
            variant="success"
            size="sm"
            // disabled={selectedGames?.length === 0 || loading}
            onClick={handleSend}
            style={{ height: "40px", width: "100px" }}
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
        </Col>
      </Row>

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
                        message="Remove this User"
                        id={player.userId + "remove user"}
                      />
                      <Button
                        id={player.userId + "remove user"}
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
          <h5>Not Added User</h5>
        </Form.Label>
      </Row>
    </>
  );
};

export default AddedUserTable;
