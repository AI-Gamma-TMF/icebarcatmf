import React, { useState } from "react";
import { Row, Col, Button } from "@themesberg/react-bootstrap";
import Overview from "./components/Overview";
import Preloader from "../../components/Preloader";
import usePlayerDetails from "./usePlayerDetails";
import EditPlayer from "./components/EditPlayer";
import CasinoGameSearch from "./components/CasinoGameSearch";
import ActivityLogs from "./components/ActivityLogs";
import { useNavigate } from "react-router-dom";
import { AdminRoutes } from "../../routes";
import WalletDetail from "./components/WalletDetail";
import ActionDetail from "./ActionDetail";
import ActivityTable from "./components/Activity/ActivityTable";
import useCheckPermission from "../../utils/checkPermission";
import ReferralDetail from "./components/ReferralDetails/ReferralDetail";
import EditInfo from "./components/EditInfo";
import Trigger from "../../components/OverlayTrigger";

const PlayerDetails = () => {
  const navigate = useNavigate();
  const [currentSelectedTab, setCurrentSelectedTab] = useState("editParent");
  const {
    userData,
    loading,
    basicInfo,
    alertInfo,
    getUserDetails,
    t,
    refetchActivity,
    handelRefetchActivity,
    refetchForPlayerData,
    limitLabels,
  } = usePlayerDetails();
  const { isHidden } = useCheckPermission();
  const [editPlayerDetailAccordionOpen, setEditPlayerDetailAccordionOpen] =
    useState(false);
  const [walletDetailAccordionOpen, setWalletDetailAccordionOpen] =
    useState(true);
  const [activityAccordionOpen, setActivityAccordionOpen] = useState(false);
  const [referralAccordionOpen, setReferralAccordionOpen] = useState(false);
  const [actionAccordionOpen, setActionAccordionOpen] = useState(false);
  const [feedbackAccordionOpen, setFeedbackAccordionOpen] = useState(false);
  const [openDeleteUserModal, setIsOpenDeleteUserModa] = useState(false);

  const handleDeleteUsername = () => {
    setIsOpenDeleteUserModa(true);
  };
  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <>
          <Row>
            <Col
              className="d-flex flex-wrap "
              style={{ alignItems: "center" }}
              xs={12}
              md={8}
            >
              <h3>{t("playerDetails.title")}&nbsp;</h3>
              <h3 className="text-break">
                <div className="d-flex">{userData?.username}</div>
              </h3>
              <div style={{ marginLeft: "20px" }}>
                {userData?.username !== null ? (
                  <Button
                    variant="outline-secondary"
                    className="me-2 my-2 "
                    onClick={handleDeleteUsername}
                  >
                    Username Profanity
                  </Button>
                ) : (
                  <></>
                )}
              </div>
              <div>
                {limitLabels?.map(({ image, message }, index) => {
                  return (
                    <>
                      {image !== "" && (
                        <>
                          <Trigger message={message} id={`rsg-img-${index}`} />
                          <img
                            id={`rsg-img-${index}`}
                            style={{ margin: "5px", width: "20px" }}
                            src={image}
                            alt="rsg-img"
                          />
                        </>
                      )}{" "}
                    </>
                  );
                })}
              </div>
            </Col>
            <Col className="d-flex justify-content-end ">
              <Button
                variant="primary"
                className="me-2 my-2"
                onClick={() => navigate(AdminRoutes.Players)}
              >
                Player Search
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              <Overview
                basicInfo={basicInfo}
                alertInfo={alertInfo}
                userLimits={userData?.userLimit}
                user={userData}
                getUserDetails={getUserDetails}
                t={t}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <WalletDetail
                user={userData}
                accordionOpen={walletDetailAccordionOpen}
                setAccordionOpen={setWalletDetailAccordionOpen}
                t={t}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <EditPlayer
                userData={userData}
                accordionOpen={editPlayerDetailAccordionOpen}
                setAccordionOpen={setEditPlayerDetailAccordionOpen}
                getUserDetails={getUserDetails}
              />
            </Col>
          </Row>
          {!isHidden({ module: { key: "Users", value: "U" } }) ||
          !isHidden({ module: { key: "Users", value: "T" } }) ? (
            <Row>
              <Col>
                <ActionDetail
                  basicInfo={userData}
                  userData={userData}
                  getUserDetails={getUserDetails}
                  userLimits={userData?.userLimit}
                  handelRefetchActivity={handelRefetchActivity}
                  currentSelectedTab={currentSelectedTab}
                  setCurrentSelectedTab={setCurrentSelectedTab}
                  accordionOpen={actionAccordionOpen}
                  setAccordionOpen={setActionAccordionOpen}
                  refetchForPlayerData={refetchForPlayerData}
                />
              </Col>
            </Row>
          ) : (
            ""
          )}
          <Row>
            <Col>
              <ActivityTable
                basicInfo={userData}
                accordionOpen={activityAccordionOpen}
                setAccordionOpen={setActivityAccordionOpen}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <ActivityLogs
                user={userData}
                refetchActivity={refetchActivity}
                handelRefetchActivity={handelRefetchActivity}
                accordionOpen={feedbackAccordionOpen}
                setAccordionOpen={setFeedbackAccordionOpen}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <ReferralDetail
                user={userData}
                accordionOpen={referralAccordionOpen}
                setAccordionOpen={setReferralAccordionOpen}
                t={t}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              {currentSelectedTab === "" && (
                <CasinoGameSearch user={userData} />
              )}
            </Col>
          </Row>
        </>
      )}

      <EditInfo
        basicInfo={userData}
        selectedInnerButton={{}}
        openEditInfoModal={openDeleteUserModal}
        setOpenEditInfoModal={setIsOpenDeleteUserModa}
        getUserDetails={getUserDetails}
        handelRefetchActivity={handelRefetchActivity}
        isDeleteModal
      />
    </>
  );
};

export default PlayerDetails;
