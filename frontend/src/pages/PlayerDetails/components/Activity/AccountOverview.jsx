import { Button, Col, Row, Table} from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import {  useQueryClient } from '@tanstack/react-query'
import RedeemConfirmationForm from "./RedeemConfirmation";
import ModalView from "../../../../components/Modal";
import Preloader from "../../../../components/Preloader";
import { usePaymentRefundMutation, useUpdateWithdrawRequestMutation } from "../../../../reactQuery/hooks/customMutationHook";
import { toast } from "../../../../components/Toast";
import { getDateTime } from "../../../../utils/dateFormatter";
import RemarksModal from "../Verification/RemarksModal";

const AccountOverview = ({ setOpenAccountOverview, basicInfo,  currentDetails }) => {
  const [openRedeemModal, setOpenRedeemModal] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const queryClient = useQueryClient()
  const TRANSACTION_STATUS = {
    0: 'Pending',
    1: 'Success',
    2: 'Cancelled',
    3: 'Failed',
    4: 'Rollback',
    5: 'Approved',
    6: 'Declined',
    9: 'Void',
    10: 'Refund'
  }

  const { mutate: updateWithdrawalRequest, isLoading: updateLoading } = useUpdateWithdrawRequestMutation({
    onSuccess: (data) => {
      if (data.data.success) {
        toast('Withdraw request updated successfully', 'success')
        queryClient.invalidateQueries({ queryKey: ['withdrawList'] })
      } else {
        toast(data.data.message, 'error')
      }
    }, onError: (error) => {
      if (error?.response?.data?.errors.length > 0) {
        const { errors } = error.response.data;
        errors.map((error) => {
          if (error?.errorCode === 500) {
            toast('Something Went Wrong', 'error')
          }
          if (error?.description) {
            toast(error?.description, 'error')
          }
        })
      }
    }
  })


  const handleRedeem = () => {
    setOpenRedeemModal(true)
  };
  const toggleRedeemModal = () => {
    setOpenRedeemModal(!openRedeemModal)
  }
  const closeModal = () => {
    setOpenModal(false);
    setOpenRedeemModal(false)
  }

  const onSubmit = (dataValue) => {
    const data = {
      userId: basicInfo.userId,
      reason: dataValue.reason,
      status: dataValue.status,
      transactionId: currentDetails.payment_transaction_id,
      withdrawRequestId: ''
    }
    updateWithdrawalRequest(data)
  }

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const { mutate: refundPayment , isLoading : loading } = usePaymentRefundMutation({
    onSuccess: (data) => {
      if (data.data.message) {
        toast(data.data.message, 'success');
        closeModal();
        setOpenAccountOverview(false)
      } else {
        toast(data.data.message, 'error');
      }
    }
  });

  const initiateRefund = (dataValue) => {
    const data = {
      userId: basicInfo.userId,
      reason: dataValue.reason,
      paymentTransactionId :currentDetails.payment_transaction_id,
    };
    refundPayment(data);
  };

  return (
    <>
      <ModalView
        openModal={openRedeemModal}
        toggleModal={toggleRedeemModal}
        size='lg'
        hideHeader
        center
        className='announcement-view-wrap'
        firstBtnClass='btn-primary'
        secondBtnClass='btn-secondary'
        hideFooter
      >
        {
          updateLoading && <Preloader />
        }
        <RedeemConfirmationForm
          closeModal={closeModal}
          onSubmit={onSubmit}
        />
      </ModalView>
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
        <RemarksModal closeModal={closeModal} onSubmit={initiateRefund} loading={loading} />
      </ModalView>
      <Row>
        <Col>
          <Button
            variant='secondary'
            className='me-2 my-2'
            onClick={() =>
              setOpenAccountOverview(false)
            }
          >
            Activity Overview
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table
            bordered
            striped
            responsive
            hover
            size='sm'
            className='text-center'
          >
            <tbody>
              <tr>
                <td>Player First Name</td>
                <td>{basicInfo?.firstName ? basicInfo?.firstName : 'NA'}</td>
              </tr>
              <tr>
                <td>Player Last Name</td>
                <td>{basicInfo?.lastName ? basicInfo?.lastName : 'NA'}</td>
              </tr>
              <tr>
                <td>Player Id</td>
                <td>{basicInfo.userId}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{TRANSACTION_STATUS[currentDetails?.status]}</td>
              </tr>
              <tr>
                <td>Type</td>
                <td>{currentDetails?.transactiontype}</td>
              </tr>
              <tr>
                <td>Transaction Start Date</td>
                <td>{currentDetails?.created_at ? getDateTime(currentDetails?.created_at) : "NA"}</td>
              </tr>
              <tr>
                <td>Transaction End Date</td>

                <td>{currentDetails?.updated_at ? getDateTime(currentDetails?.updated_at) : "NA"}</td>
              </tr>
              {currentDetails?.transactiontype === 'redeem' && <tr>
                <td>Action</td>
                <td><Button onClick={handleRedeem}>Process Redemption</Button></td>
              </tr>
              }
               {(currentDetails?.transactiontype === 'Purchase' && currentDetails?.status === 1) && <tr>
                <td>Action</td>
                <td><Button onClick={()=> toggleModal()}>Void/Refund</Button></td>
              </tr>
              }
            </tbody>
          </Table>
        </Col>

        <Col>
          <Table
            bordered
            striped
            responsive
            hover
            size='sm'
            className='text-center'
          >
            <tbody>
              <tr>
                <td>Amount</td>
                <td>{currentDetails?.amount}$</td>
              </tr>
              <tr>
                <td>Package Info</td>
                <td>{currentDetails.transactiontype === 'Purchase' ? `GC Coin: ${currentDetails?.gccoin}, SC Coin: ${currentDetails?.sccoin}` : 'NA'}</td>
              </tr>
              <tr>
                <td>Transaction Id</td>
                <td>{currentDetails.payment_transaction_id}</td>
              </tr>
              <tr>
                <td>Account Name</td>
                <td>{basicInfo?.firstName ? basicInfo?.firstName : 'NA'}</td>
              </tr>
              <tr>
                <td>Account Number</td>
                <td></td>
              </tr>
              <tr>
                <td>Account Email</td>
                <td>{basicInfo.email}</td>
              </tr>
              <tr>
                <td>Account Detail</td>
                <td>{basicInfo.email}</td>
              </tr>
              <tr>
                <td>Bank Name</td>
                <td></td>
              </tr>
              <tr>
                <td>Bank Country</td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

export default AccountOverview;
