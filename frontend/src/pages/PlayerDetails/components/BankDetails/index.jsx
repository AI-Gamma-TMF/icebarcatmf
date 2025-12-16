/*
Filename: Players/index.js
Description: View List of all users.
Author: uchouhan
Created at: 2023/03/03
Last Modified: 2023/03/30
Version: 0.1.0
*/
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Row, Col, Card, Button, Table } from '@themesberg/react-bootstrap'
import { tableHeaders } from './constants'
import { InlineLoader } from '../../../../components/Preloader'
import { BankDetailsContainer } from './style'
import ModalView from '../../../../components/Modal'
import BankAddModal from './BankAddModal'
import { usePlayerBankMutuation } from '../../../../reactQuery/hooks/customMutationHook'
import { useGetPlayerBankQuery } from '../../../../reactQuery/hooks/customQueryHook'

const BankDetails = (props) => {
  const { user } = props
  const [isOpenBankModal, setIsOpenBankModal] = useState(false)
  const toggleModal = () => {
    setIsOpenBankModal(!isOpenBankModal)
  }
  const closeModal = () => {
    setIsOpenBankModal(false)
  }

  const bankGetSuccessToggler = () => {

  }

  const {
    data: bankListData,
    isLoading: isBankListLoading,
    refetch: refatchBankList
  } = useGetPlayerBankQuery({ params: { userId: user.userId }, successToggler: bankGetSuccessToggler })

  const { mutate: addPlayerBankRequest } = usePlayerBankMutuation({
    onSuccess: (data) => {
      closeModal()
      refatchBankList()
      if (data.data.message) {
        toast(data.data.message, 'success')
      } else {
        toast(data.data.message, 'error')
      }
    },
    onError: (error) => {
      if (error?.response?.data?.errors.length > 0) {
        const {errors} = error.response.data;
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
  const onAddSubmit = (formValue) => {
    addPlayerBankRequest({
      userId: user.userId,
      bankName: formValue.nameOfBank,
      holderName: formValue.holderName,
      accountNumber: formValue.bankAccNumber,
      routingNumber: formValue.abaRouting,
      remark: formValue.remark
    })
  }
  return (
    <BankDetailsContainer>
      <Card className='p-2 mb-2'>
        <Row>
          <Col className='bank-head-wrap'>
            <h3>Player Bank Details</h3>
          </Col>
        </Row>
        {
          !(bankListData && bankListData?.bankDetailId) && 
            <Row>
              <Col className='bank-create-button'>
                <Button
                  variant='success'
                  className='mb-2 m-1'
                  size='sm'
                  onClick={toggleModal}
                >Add Bank Details
                </Button>
              </Col>
            </Row>
        }
        <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
          <thead className='thead-dark'>
            <tr>
              {
                tableHeaders.map((item, index) => {
                  return (
                    <th key={index}>{item.value}</th>
                  )
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              bankListData && bankListData?.bankDetailId &&
                <tr>
                  <td>{bankListData?.holderName}</td>
                  <td>{bankListData?.accountNumber}</td>
                  <td>{bankListData?.routingNumber}</td>
                  <td>{bankListData?.name}</td>
                  <td>-</td>
                </tr>
            }
          </tbody>
        </Table>
        {isBankListLoading && <InlineLoader />}
      </Card>
      <ModalView
        openModal={isOpenBankModal}
        toggleModal={toggleModal}
        size='lg'
        hideHeader
        center
        className='announcement-view-wrap'
        firstBtnClass='btn-primary'
        secondBtnClass='btn-secondary'
        hideFooter
      >
        {/* {
          isUpdateLoading && <Preloader />
        } */}
        <BankAddModal
          closeModal={closeModal}
          onSubmit={onAddSubmit}
        />
      </ModalView>
    </BankDetailsContainer>
  )
}
export default BankDetails