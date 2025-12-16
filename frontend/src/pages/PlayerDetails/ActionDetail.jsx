import { Row, Col, Button, Accordion } from "@themesberg/react-bootstrap";
import EditInfo from "./components/EditInfo";

import { PlayersTabInfo } from "./constants";
import ResponsibleGaming from "../../components/ResponsibleGaming";
import BankDetails from "./components/BankDetails";
import { PlayerTabContainer } from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const ActionDetail = (props) => {
  const {
    basicInfo,
    getUserDetails,
    userData,
    userLimits,
    handelRefetchActivity,
    currentSelectedTab,
    accordionOpen, setAccordionOpen,refetchForPlayerData
  } = props;
  const [selectedInnerButton, setSelectedInnerButton] = useState({});
  const [openEditInfoModal, setOpenEditInfoModal] = useState(false);
  // const [promoBan, setPromoBan] = useState(false);

  // const { setStatusShow, statusShow, handleYes, status, handleStatusShow,
  //   playerId,
  //   playerDetail, updateloading,
  // } = usePlayerListing();

  // useEffect(()=>{
  //   getUserDetails()
  // },[promoBan])

  const setSelectedInnerToggler = (dataValue) => {
    switch (dataValue.innerItem) {
      case "isBan":
      case "is2FaEnabled":
      case "isRestrict":
      case "phoneVerified":
      case "isRedemptionSubscribed":
      case "isSubscribed":
      case "isInternalUser":
      case "addDeductCoinsChild":
      case "addDeduct1ScCoinChild":
      case "addDeduct2ScCoinsChild":
      case "forceLogoutChild":
      case "passwordChild":
      case "removePwLock":
      case "isUserVerified":
      case "updateTier":
      case "socialSecurityChild":
      case "canadianUser":
        setOpenEditInfoModal(true);
        break;
      // case "promocodeBan":
      //   handleStatusShow(userData.userId, userData?.blockedUsers?.isAvailPromocodeBlocked, userData, userData)
      //   break;
      default:
        break;
    }
    setSelectedInnerButton(dataValue);
  };
  return (
    <>
      <Row className='mt-4' onClick={() => setAccordionOpen(!accordionOpen)} style={{ cursor: 'pointer' }}>
        <h5 className='accordian-heading'>
          <span>Player Action</span>
          <span>{accordionOpen ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />} </span>
        </h5>
      </Row>

      <Accordion activeKey={accordionOpen ? '0' : ''}>
        <Accordion.Item eventKey="0">
          <Accordion.Body>
            <PlayerTabContainer>
              <Row className='mt-5 player-tab-wrap'>
                <Col className='text-center p-0'>
                  {PlayersTabInfo[currentSelectedTab]?.childLabel?.map(
                    (innerItem, index) => {
                      if (innerItem.key === "is2FaEnabled" && !userData?.is2FAEnable) {
                        return null;
                      }
                      return (
                        <Button
                          disabled={
                            innerItem.key === "passwordChild" || 
                            (innerItem.key === "removePwLock" &&
                            basicInfo.passwordAttempt <= 4 || ((innerItem.key === "isInternalUser" || innerItem.key === "isBan" || innerItem.key === "isRestrict") && userData.isInternalUser))
                          }
                          variant='warning'
                          className='me-2 my-2 edit-inner-tabwrap'
                          key={index}
                          onClick={() =>
                            setSelectedInnerToggler({
                              currentSelectedTab,
                              innerItem: innerItem.key,
                              type: innerItem?.type,
                            })
                          }
                        >
                          {innerItem?.label}
                        </Button>
                      );
                    }
                  )}
                  {selectedInnerButton?.innerItem === "limitsChild" &&
                    currentSelectedTab === "editParent" && (
                      <Col>
                        <ResponsibleGaming
                          userLimits={userLimits}
                          user={userData}
                          currencyCode={userData?.currencyCode}
                          getUserDetails={getUserDetails}
                          refetchForPlayerData={refetchForPlayerData}
                        />
                      </Col>
                    )}
                  {selectedInnerButton?.innerItem === "bankDetailsChild" &&
                    selectedInnerButton?.currentSelectedTab === "editParent" && (
                      <Col>
                        <BankDetails user={userData} />
                      </Col>
                    )}
                </Col>
              </Row>
              {selectedInnerButton?.currentSelectedTab === "editParent" && (
                <EditInfo
                  basicInfo={basicInfo}
                  selectedInnerButton={selectedInnerButton}
                  openEditInfoModal={openEditInfoModal}
                  setOpenEditInfoModal={setOpenEditInfoModal}
                  getUserDetails={getUserDetails}
                  handelRefetchActivity={handelRefetchActivity}
                />
              )}

              {/* <PromocodeBlockModal
                setShow={setStatusShow}
                show={statusShow}
                handleYes={handleYes}
                active={status}
                playerId={playerId}
                playerDetail={playerDetail}
                loading={updateloading}
                modalText={'Player'}
              /> */}

            </PlayerTabContainer>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default ActionDetail;
