import React, { useState } from "react";
import useFreeSpinDetails from "./hooks/useFreeSpinDetails";
import {
  Row,
  Col,
  Button,
  Table,
  Card,
  Form,
  Accordion,
} from "@themesberg/react-bootstrap";
import PaginationComponent from "../../../components/Pagination";
import "./freespin.scss";
import FreeSpinGames from ".";
import { formatDateYMD, getDateTime } from "../../../utils/dateFormatter";
import { convertToTimeZone, formatNumber } from "../../../utils/helper";
import useFreeSpinListing from "./hooks/useFreeSpinListing";
import Trigger from "../../../components/OverlayTrigger";
import {
  faRedoAlt,
  faTrash,
  faTrashCanArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InlineLoader } from "../../../components/Preloader";
import useCheckPermission from "../../../utils/checkPermission";
import {
  errorHandler,
  useBootFreeSpinMutation,
  useUpdateFreeSpinGrantMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import { toast } from "../../../components/Toast";
import SelectUser from "../../../components/SelectUser";
const ViewFreeSpin = () => {
  const {
    viewData,
    userData,
    userLoading,
    userRefetch,
    setPage,
    limit,
    setLimit,
    totalPages,
    page,
    search,
    setSearch,
    statusSearch,
    setStatusSearch,
  } = useFreeSpinDetails({
    isEdit: false,
    isView: true,
  });
  const displayValue = (value, isDecimal = false, decimalPlaces = null) => {
    if (value === null || value === undefined)
      return decimalPlaces ? `0.${"0".repeat(decimalPlaces)}` : "0";
    return formatNumber(value, { isDecimal, decimalPlaces });
  };
  const { isHidden } = useCheckPermission();
  const [statusShow, setStatusShow] = useState(false);
  const [isBootedAction, setIsBootedAction] = useState(null);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const freeSpinExist = viewData?.data?.freeSpinExist;
  const gameInfo = viewData?.data?.gameInfo;
  const recordSummary = viewData?.data?.recordSummary;
  const status = freeSpinExist?.status;
  const updatePlayer = useBootFreeSpinMutation({
    onSuccess: (res) => {
      if (res?.data) {
        toast(res?.data?.message, "success");
      }
      userRefetch();
      setStatusShow(false);
    },
    onError: (error) => {
      if (error?.response?.data?.errors.length > 0) {
        const { errors } = error.response.data;
        errors.map((error) => {
          if (error?.description) toast(error?.description, "error");
        });
      }
      setStatusShow(false);
    },
  });

  const handleOnSubmit = async () => {
    if (!itemToUpdate) return;

    const payload = {
      freeSpinId: freeSpinExist?.freeSpinId,
      userId: itemToUpdate,
      isAddUser: isBootedAction,
    };

    updatePlayer.mutate(payload);
  };

  const handleActionClick = (id, action) => {
    setItemToUpdate(id);
    setIsBootedAction(action);
    setStatusShow(true);
  };
  const handleAccordionToggle = () => {
    setIsAccordionOpen((prev) => !prev);
  };
  const { mutate: updateFreeSpinGrant, isLoading: updateLoading } =
    useUpdateFreeSpinGrantMutation({
      onSuccess: (res) => {
        if (res?.data) {
          toast(res?.data?.message, "success");
        }
        userRefetch();
        setSelectedUser([]);
        setIsAccordionOpen(false);
      },
      onError: (errors) => {
        errorHandler(errors);
      },
    });
  const userSummary = selectedUser.map((user) => ({
    userId: user.userId,
    email: user.email,
  }));

  const handleSend = () => {
    const body = {
      freeSpinId: freeSpinExist?.freeSpinId,

      users: userSummary ? userSummary : [],
    };

    updateFreeSpinGrant(body);
  };

  return (
    <>
      <Row className="align-items-center justify-content-between mb-3">
        <Col>
          <h3>{`View Free Spin : ${freeSpinExist?.title} `}</h3>
        </Col>
      
{freeSpinExist?.subscriptionId && (
  <Col xs="auto">
    <div
      className="px-3 py-2 border rounded text-center"
      style={{ minWidth: '120px', color: 'black' }}
    >
      Subscription : {freeSpinExist?.subscription?.name}
    </div>
  </Col>
)}


        <Col xs="auto">

          <div
            className={`px-3 py-2 border rounded text-center ${
              freeSpinExist?.status == "0"
                ? "text-warning"
                : status == "1"
                ? "text-success"
                : status == "2"
                ? "text-muted"
                : status == "3"
                ? "text-danger"
                : ""
            }`}
            style={{ minWidth: "120px" }}
          >
            {status == "0"
              ? "Upcoming"
              : status == "1"
              ? "Ongoing"
              : status == "2"
              ? "Completed"
              : status == "3"
              ? "Cancelled"
              : "----"}
          </div>
        </Col>
   

      </Row>
      <Card className="p-3 spin-card">
        <Row className="g-3">
          <Col xs={6} md={4} lg={3}>
            <Card className="spin-card">
              <img src="/svg/free-spin-amount.svg" alt="Free Spin Amount" />
              <div className="spin-detail">
                <h5 className="purple">{freeSpinExist?.freeSpinAmount}</h5>
                <p>Free spin Amount</p>
              </div>
            </Card>
          </Col>

          <Col xs={6} md={4} lg={3}>
            <Card className="spin-card">
              <img src="/svg/free-spin-round.svg" alt="Free Spin Round" />
              <div className="spin-detail">
                <h5 className="blue">{freeSpinExist?.freeSpinRound}</h5>
                <p>Free spin Round</p>
              </div>
            </Card>
          </Col>

          <Col xs={6} md={4} lg={3}>
            <Card className="spin-card">
              <img src="/svg/start-date.svg" alt="Start Date" />
              <div className="spin-detail">
                <h5 className="green">
                  {getDateTime(freeSpinExist?.startDate)}
                </h5>
                <p>Start Date</p>
              </div>
            </Card>
          </Col>

          {freeSpinExist?.endDate && <Col xs={6} md={4} lg={3}>
            <Card className="spin-card">
              <img src="/svg/expiry-date.svg" alt="Expiry Date" />
              <div className="spin-detail">
                <h5 className="orange">
                  {" "}
                  {getDateTime(freeSpinExist?.endDate)}
                </h5>
                <p>Expiry Date</p>
              </div>
            </Card>
          </Col>}

         {freeSpinExist?.daysValidity  && <Col xs={6} md={4} lg={3}>
            <Card className="spin-card">
              <img src="/svg/expiry-date.svg" alt="Expiry Date" />
              <div className="spin-detail">
                <h5 className="orange">
                  {" "}
                  {freeSpinExist?.daysValidity}
                </h5>
                <p>Validity Period(Days)</p>
              </div>
            </Card>
          </Col>}

          <Col xs={6} md={4} lg={3}>
            <Card className="spin-card">
              <img src="/svg/game-name.svg" alt="Game Name" />
              <div className="spin-detail">
                <h5 className="dark-blue">{gameInfo?.gameName}</h5>
                <p>Game Name</p>
              </div>
            </Card>
          </Col>

          <Col xs={6} md={4} lg={3}>
            <Card className="spin-card">
              <img src="/svg/provider-name.svg" alt="Provider Name" />
              <div className="spin-detail">
                <h5 className="yellow">{gameInfo?.providerName}</h5>
                <p>Provider Name</p>
              </div>
            </Card>
          </Col>

          <Col xs={6} md={4} lg={3}>
            <Card className="spin-card">
              <img src="/svg/coin-type.svg" alt="Coin Type" />
              <div className="spin-detail">
                <h5 className="pink">{freeSpinExist?.coinType}</h5>
                <p>Coin Type</p>
              </div>
            </Card>
          </Col>

          <Col xs={6} md={4} lg={3}>
            <Card className="spin-card">
              <img src="/svg/free-spin-type.svg" alt="Free Spin Type" />
              <div className="spin-detail">
                <h5 className="red">{freeSpinExist?.freeSpinType}</h5>
                <p>Free spin Type</p>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      <div>
        <h3 className="py-3">Summary</h3>
        <Row className="g-3">
          <Col style={{ width: "20%" }}>
            <Card className="spin-card blue-bg">
              <img src="/total-user.png" alt="Free Spin Amount" />
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(recordSummary?.totalUsers, true, 2)}
                </h5>
                <p>Total user</p>
              </div>
            </Card>
          </Col>{" "}
          <Col style={{ width: "20%" }}>
            <Card className="spin-card green-bg">
              <img src="/total-claimed.png" alt="Free Spin Amount" />
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(recordSummary?.totalClaimed, true, 2)}
                </h5>
                <p>Total Claimed</p>
              </div>
            </Card>
          </Col>{" "}
          <Col style={{ width: "20%" }}>
            <Card className="spin-card orange-bg">
              <img src="/total-pending.png" alt="Free Spin Amount" />
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(recordSummary?.totalPending, true, 2)}
                </h5>
                <p>Total pending User</p>
              </div>
            </Card>
          </Col>{" "}
          <Col style={{ width: "20%" }}>
            <Card className="spin-card pink-bg">
              <img src="/expired-users.png" alt="Free Spin Amount" />
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(recordSummary?.totalExpired, true, 2)}
                </h5>
                <p>Total Expired User</p>
              </div>
            </Card>
          </Col>
          <Col style={{ width: "20%" }}>
            <Card className="spin-card green-bg">
              <img src="/total-claimed.png" alt="Free Spin Amount" />
              <div className="spin-detail">
                <h5 className="purple">
                  {displayValue(recordSummary?.totalWinAmount, true, 2)}
                </h5>
                <p>Total Free Spin Win</p>
              </div>
            </Card>
          </Col>{" "}
        </Row>
      </div>

      <Row className="mt-4">
        <Col xs="12" sm="6" lg="3" className="mb-3">
          <Form.Label>Search by Username or Email or UserId</Form.Label>
          <Form.Control
            type="search"
            value={search}
            placeholder="Search by Username or Email or UserId"
            onChange={(event) => {
              setPage(1);
              setSearch(
                event.target.value.replace(/[~`%^#)()><?]+/g, "").trim()
              );
            }}
          />
        </Col>
        <Col sm={6} lg={2}>
          <Form.Label column="sm">Status</Form.Label>
          <Form.Select
            onChange={(e) => {
              setPage(1);
              setStatusSearch(e.target.value);
            }}
            handleUpdateSpinSubmit
            value={statusSearch}
          >
            <option hidden>Select Status</option>
            <option value="PENDING">Pending</option>
            <option value="EXPIRED">Expired</option>
            <option value="CLAIMED">Claimed</option>
            <option value="CANCELLED">Cancelled</option>
          </Form.Select>
        </Col>
        <Col
          xs="12"
          sm="6"
          lg="1"
          className="d-flex align-items-center mt-3 mb-0"
        >
          <Trigger message="Reset Filters" id={"redo"} />

          <Button
            id={"redo"}
            variant="success"
            onClick={() => {
              setSearch("");
              setLimit(15);
              setPage(1), setStatusSearch("");
            }}
          >
            <FontAwesomeIcon icon={faRedoAlt} />
          </Button>
        </Col>
      </Row>
      {(freeSpinExist?.status == "0" || freeSpinExist?.status == "1") &&
        freeSpinExist?.freeSpinType === "directGrant" && (
          <Row>
            <Accordion activeKey={isAccordionOpen ? "0" : null}>
              <Accordion.Item eventKey="0">
                <Accordion.Header onClick={handleAccordionToggle}>
                  Add User
                </Accordion.Header>
                <Accordion.Body>
                  <SelectUser
                    showSendButton={true}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    handleSend={handleSend}
                    isloading={updateLoading}
                  />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Row>
        )}
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
              "UserId",
              "Email",
              "USERNAME",
              "TOTAL WIN",
              "Status",
              "Free SPIN ID",
              "ACTION",
            ].map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        {userLoading ? (
          <tr>
            <td colSpan={10} className="text-center">
              <InlineLoader />
            </td>
          </tr>
        ) : (
          <tbody>
            {userData?.count > 0 ? (
              userData?.rows?.map((user) => (
                <tr key={user?.userId}>
                  <td>{user?.userId}</td>
                  <td>{user?.email}</td>
                  <td>{user?.username}</td>
                  <td>{user?.totalWinAmount}</td>
                  <td>{user?.status}</td>
                  <td>{user?.userBonusId}</td>
                  <td>
                    <Trigger message="Boot" id={user?.userId + "boot"} />
                    <Button
                      id={user?.userId + "boot"}
                      className="btn btn-danger m-1"
                      size="sm"
                      hidden={isHidden({
                        module: { key: "CasinoManagement", value: "U" },
                      })}
                      disabled={user?.status !== "PENDING"}
                      onClick={() => handleActionClick(user?.userId, false)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                    <Trigger message="Unboot" id={user?.userId + "unboot"} />
                    <Button
                      id={user?.userId + "unboot"}
                      className="btn btn-warning m-1"
                      style={{
                        fontSize: "17px",
                        padding: "2px 8px",
                        color: "#000",
                      }}
                      hidden={isHidden({
                        module: { key: "CasinoManagement", value: "U" },
                      })}
                      size="sm"
                      disabled={
                        user?.status === "PENDING" ||
                        user?.status === "CLAIMED" ||
                        freeSpinExist?.status == "2" ||
                        freeSpinExist?.status == "3"
                      }
                      onClick={() => handleActionClick(user?.userId, true)} // Unboot action (false)
                    >
                      <FontAwesomeIcon icon={faTrashCanArrowUp} />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="text-danger text-center">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        )}
      </Table>
      {userData?.count !== 0 && (
        <PaginationComponent
          page={userData?.count < page ? 1 : page}
          totalPages={totalPages}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />
      )}
      <ConfirmationModal
        setShow={setStatusShow}
        show={statusShow}
        handleYes={handleOnSubmit}
        message={
          <span>
            {" "}
            Are you sure you want to {isBootedAction ? "unboot" : "boot"} the
            player ?
          </span>
        }
        loading={updatePlayer.isLoading}
      />
    </>
  );
};

export default ViewFreeSpin;
