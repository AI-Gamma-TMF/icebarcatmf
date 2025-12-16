import React, { useEffect, useState } from 'react';
import PersonalDetails from './PersonalDetails';
// import { useTranslation } from 'react-i18next';
import { Row, Col, Button, Card } from '@themesberg/react-bootstrap';
import { useGetPlayerBankQuery } from '../../../../reactQuery/hooks/customQueryHook';
import BankVerificationDetails from './BankVerificationDetails';
import Veriff from './Veriff';
import ModalView from '../../../../components/Modal';
import { toast } from '../../../../components/Toast';
import RemarksModal from './RemarksModal';
import { useUpdateUserStatus } from '../../../../reactQuery/hooks/customMutationHook';
import UploadDocsModal from './UploadDocsModal';
import VerifyModal from './VerifyModal';
import KYCModal from './KYCModal';
import KYCHistoryModal from './KYCHistoryModal';

const VerificationDetails = ({
  basicInfo,
  userDocuments,
  showModal,
  showKYCHistory,
  showKYCModal,
  handleClose,
  handleImagePreview,
  handleCloseKYCModal,
  handleCloseKYCHistory,
  getUserDetails,
  userData,
  handelRefetchActivity
}) => {
  // const { t } = useTranslation('verification');
  const [openModal, setOpenModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [verificationType, setVerificationType] = useState('');
  const [personalInfoChecked, setPersonalInfoChecked] = useState(false);
  const [veriffChecked, setVeriffChecked] = useState(false);
  // const [lexinexisChecked, setLexinexisChecked] = useState(false);
  const [bankDetailsChecked, setBankDetailsChecked] = useState(false);
  const [verifiedAccount, setVerifiedAccount] = useState(false)

  useEffect(() => {
    if (basicInfo?.bankStatus === 'APPROVED') {
      setBankDetailsChecked(true);
    }

    if (basicInfo?.veriffStatus === 'APPROVED') {
      setVeriffChecked(true);
    }
    if (basicInfo?.profileStatus === 'APPROVED') {
      setPersonalInfoChecked(true);
    }
    if(basicInfo?.moreDetails?.verified) {
      setVerifiedAccount(true)
    }
  }, [basicInfo]);

  const handleCheckboxChange = (type) => {
    setOpenModal(true);
    setVerificationType(type);
  };

  const handleVerifyButton = () => {
    setOpenVerifyModal(true);
    setVerificationType('verifyAccount');
  };
  const toggleModal = () => {
    setOpenModal(!openModal);
  };
  const closeModal = () => {
    setOpenModal(false);
  };

  const toggleVerifyModal = () => {
    setOpenVerifyModal(!openModal);
  };
  const closeVerifyModal = () => {
    setOpenVerifyModal(false);
  };
  const onSuccess = () => {
    switch (verificationType) {
      case 'veriff':
        setVeriffChecked(!veriffChecked);
        break;
      case 'personalDetailsVerified':
        setPersonalInfoChecked(!personalInfoChecked);
        break;
      case 'bankDetails':
        setBankDetailsChecked(!bankDetailsChecked);
        break;
      case 'verifyAccount':
        setVerifiedAccount(!verifiedAccount)
        break;
      default:
        break;
    }
  };

  const onSubmit = (dataValue) => {
    let type = '';
    let action = '';
    switch (verificationType) {
      case 'veriff':
        type = 7;
        action = veriffChecked;
        break;
      case 'personalDetailsVerified':
        type = 9;
        action = personalInfoChecked;
        break;
      case 'bankDetails':
        type = 10;
        action = bankDetailsChecked;
        break;
      default:
        break;
    }
    const data = {
      userId: basicInfo.userId,
      reason: dataValue.reason,
      action: !action,
      type: type,
    };
    updateUserStatusRequest(data);
  };

  const onVerifySubmit = (dataValue) => {
    const data = {
      userId: basicInfo.userId,
      reason: dataValue.reason,
      action: !verifiedAccount,
      type: 11,
    };
    updateUserStatusRequest(data);
  };

  const bankGetSuccessToggler = () => {};
  const {
    data: bankListData,
    // isLoading: isBankListLoading,
  } = useGetPlayerBankQuery({
    params: { userId: basicInfo.userId },
    successToggler: bankGetSuccessToggler,
  });

  const { mutate: updateUserStatusRequest } =
    useUpdateUserStatus({
      onSuccess: (data) => {
        if (data.data.message) {
          toast(data.data.message, 'success');
          onSuccess();
          closeModal();
          closeVerifyModal();
        } else {
          toast(data.data.message, 'error');
        }
        handelRefetchActivity(true)
      },
      onError: (error) => {
        if (error?.response?.data?.errors.length > 0) {
          const { errors } = error.response.data;
          errors.map((error) => {
            if (error?.errorCode === 500) {
              toast('Something Went Wrong', 'error');
            }
            if (error?.description) {
              toast(error?.description, 'error');
            }
          });
        }
      },
    });

  return (
    <>
      <ModalView
        openModal={openModal}
        toggleModal={toggleModal}
        size='lg'
        hideHeader
        center
        className='announcement-view-wrap'
        firstBtnClass='btn-primary'
        secondBtnClass='btn-secondary'
        hideFooter
      >
        <RemarksModal closeModal={closeModal} onSubmit={onSubmit} />
      </ModalView>
      <ModalView
        openModal={openVerifyModal}
        toggleModal={toggleVerifyModal}
        size='lg'
        hideHeader
        center
        className='announcement-view-wrap'
        firstBtnClass='btn-primary'
        secondBtnClass='btn-secondary'
        hideFooter
      >
        <VerifyModal closeModal={closeVerifyModal} onSubmit={onVerifySubmit} verifiedAccount={verifiedAccount} />
      </ModalView>


      <KYCHistoryModal
        handleClose={handleCloseKYCHistory}
        showModal={showKYCHistory}
        userId={basicInfo?.userId}
      />

       <KYCModal
        handleClose={handleCloseKYCModal}
        showModal={showKYCModal}
        userData = {userData}
        userId={basicInfo?.userId}
        getUserDetails= {getUserDetails}
      />

       <UploadDocsModal
        handleClose={handleClose}
        showModal={showModal}
        userId={basicInfo?.userId}
      /> 

      <Veriff
        handleCheckboxChange={handleCheckboxChange}
        basicInfo={basicInfo}
        veriffChecked={veriffChecked}
      />
      <PersonalDetails
        basicInfo={basicInfo}
        handleCheckboxChange={handleCheckboxChange}
        updateUserStatusRequest={updateUserStatusRequest}
        personalInfoChecked={personalInfoChecked}
        userDocuments={userDocuments}
        handleImagePreview={handleImagePreview}
      />
      <BankVerificationDetails
        bankListData={bankListData}
        basicInfo={basicInfo}
        handleCheckboxChange={handleCheckboxChange}
        bankDetailsChecked={bankDetailsChecked}
        userDocuments={userDocuments}
        handleImagePreview={handleImagePreview}
      />

            <Row className='my-5'>
                <Col className='col-padding'>
                    <Card className='card-overview'>
                        <div className='div-overview'>

                            <div className='d-flex justify-content-between m-1 align-items-center'>
                                <h5>Account Status</h5>
                                <span><Button
                                onClick ={handleVerifyButton}
                                    variant='success'
                                    className='m-2'
                                >
                                   {verifiedAccount ? 'Verified' : 'Verify'}
                                </Button></span>
                            </div>

                        </div>
                    </Card>
                </Col>
            </Row>
    </>
  );
};

export default VerificationDetails;
