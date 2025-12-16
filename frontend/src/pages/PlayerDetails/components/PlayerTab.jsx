import React from "react";
import ActivityTable from "./Activity";
import { PlayerTabContainer } from "../style";

const PlayerTab = (props) => {
  const {
    basicInfo,
    // getUserDetails,
    // userData,
    // userDocuments,
    // handleVerify,
    // updateDocument,
    // show,
    // setShow,
    // handleYes,
    // handleClose,
    // showReasonModal,
    // status,
    // enable,
    // setEnable,
    // docLabels,
    // handleReRequest,
    // title,
    // imagePreviewModalShow,
    // setImagePreviewModalShow,
    // handleImagePreview,
    // imageUrl,
    // setImageUrl,
    // userLimits,
    // handelRefetchActivity,
    // docStatus,
    // setDocStatus,
    // currentSelectedTab,
    // setCurrentSelectedTab
  } = props;
  // const [selectedInnerButton, setSelectedInnerButton] = useState({});
  // const [openEditInfoModal, setOpenEditInfoModal] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  // const [showKYCModal, setShowKYCModal] = useState(false);
  // const [showKYCHistory, setShowKYCHistory] = useState(false);

  // const parentTabToggler = (itemValue) => {
  //   setCurrentSelectedTab(itemValue);
  // };
  // const handleCloseDocsModal = () => setShowModal(false);
  // const handleCloseKYCHistory = () => setShowKYCHistory(false);
  // const handleCloseKYCModal = () => setShowKYCModal(false);


  // const setSelectedInnerToggler = (dataValue) => {
  //   switch (dataValue.innerItem) {
  //     case "isBan":
  //     case "isRestrict":
  //     case "phoneVerified":
  //     case "isRedemptionSubscribed":
  //     case "isSubscribed":
  //     case "isInternalUser":
  //     case "addDeductCoinsChild":
  //     case "forceLogoutChild":
  //     case "passwordChild":
  //     case "removePwLock":
  //     case "isUserVerified":
  //     case "updateTier":
  //     case "socialSecurityChild":
  //       setOpenEditInfoModal(true);
  //       break;
  //     default:
  //       break;
  //   }
  //   setSelectedInnerButton(dataValue);
  // };
  return (
    <PlayerTabContainer>
     
        <ActivityTable basicInfo={basicInfo} />
      
    </PlayerTabContainer>
  );
};

export default PlayerTab;
