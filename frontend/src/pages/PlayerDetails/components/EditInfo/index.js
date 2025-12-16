import React, { useState } from 'react'
import { toast } from '../../../../components/Toast'
import { useUpdateUserStatus, useUpdatePlayerPassword,useUpdateUserTierMutation, useUpdateCoinMutation, useUpdateRemovePwLock, useUpdateSocialSecurity, useUpdatePlayerForceLogout, useUpdateUserKYCMutation, useUpdateStaffCoinMutation, useUpdate2FaAuthStatus, useDeleteUsername, useCreateCanadianUserMutation, errorHandler } from '../../../../reactQuery/hooks/customMutationHook'
import { EditInfoContainer } from '../../style'
import ModalView from '../../../../components/Modal'
import SimpleEditForm from './SimpleEditForm'
import Preloader from '../../../../components/Preloader'
import AddDeductCoin from './AddDeductCoin'
import PlayerChangePwd from './PlayerChangePwd'
import MultiFieldEditForm from './MultiFieldEditForm'
import UserVerification from './UserVerification'
import { useUserStore } from '../../../../store/store'
import CustomModal from '../../../../components/CustomModal'
import EditTier from './EditTier'

const simpleEditFormExistForm = ['isBan', 'is2FaEnabled', 'isRestrict', 'phoneVerified', 'isInternalUser', 'canadianUser', 'isRedemptionSubscribed', 'isSubscribed', 'removePwLock', 'forceLogoutChild',]
const simpleAddCoinExistForm = ['addDeductCoinsChild','addDeduct1ScCoinChild','addDeduct2ScCoinsChild']
const simpleUserVerificationForm = ['isUserVerified']
const simpleChangePwdForm = ['passwordChild']
const multiFieldForm = ['socialSecurityChild']
const updateTier = ['updateTier']

const EditInfo = (props) => {
  const { basicInfo, selectedInnerButton, openEditInfoModal, setOpenEditInfoModal, getUserDetails, handelRefetchActivity } = props
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const toggleSuccessModal = () => {
    setOpenEditInfoModal(!openEditInfoModal)
  }
  const closeModal = () => {
    setOpenEditInfoModal(false)
  }

  const adminDetails = useUserStore((state) => state.userDetails)

  const { mutate: updateUserStatusRequest, isLoading: isUpdateLoading } = useUpdateUserStatus({
    
    onSuccess: (data) => {
      
      if (data.data.message) {
        getUserDetails()
        toast(data.data.message, 'success')
        closeModal()
        handelRefetchActivity(true)
      } else {
        toast(data.data.message, 'error')
      }
      
    },
    onError: (error) => {
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

  const { mutate: update2FaAuthRequest } = useUpdate2FaAuthStatus({
    onSuccess: (data) => {
      if (data.data.message) {
        getUserDetails()
        toast(data.data.message, 'success')
        closeModal()
        handelRefetchActivity(true)
      } else {
        toast(data.data.message, 'error')
      }
    },
    onError: (error) => {
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

  const { mutate: updatePasswordRequest, isLoading: isChangePwdLoading } = useUpdatePlayerPassword({
    onSuccess: (data) => {
      if (data.data.message) {
        toast(data.data.message, 'success')
        updatePlayerForceLogoutReq({ userId: basicInfo.userId, reason: 'Password changed' })
        closeModal()
        handelRefetchActivity(true)
      } else {
        toast(data.data.message, 'error')
      }
    },
    onError: (error) => {
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
  const { mutate: updateRemovePwLockRequest, isLoading: isRemovePwLockLoading } = useUpdateRemovePwLock({
    onSuccess: (data) => {
      if (data.data.message) {
        getUserDetails()
        toast(data.data.message, 'success')
        closeModal()
        handelRefetchActivity(true)
      } else {
        toast(data.data.message, 'error')
      }
    },
    onError: (error) => {
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

  const { mutate: addCoinRequest, isLoading: isAddCoinLoading } = useUpdateCoinMutation({
    onSuccess: (data) => {
      if (data.data.message) {
        toast(data.data.message, 'success')
        getUserDetails()
        closeModal()
        handelRefetchActivity(true)
      } else {
        toast(data.data.message, 'error')
      }
    },
    onError: (error) => {
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

  const { mutate: addStaffCoinRequest, isLoading: isAddStaffCoinLoading } = useUpdateStaffCoinMutation({
    onSuccess: (data) => {
      if (data.data.message) {
        toast(data.data.message, 'success')
        getUserDetails()
        closeModal()
        handelRefetchActivity(true)
      } else {
        toast(data.data.message, 'error')
      }
    },
    onError: (error) => {
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

  const { mutate: updateUserVerification ,isLoading:verifyloading } = useUpdateUserKYCMutation({
    onSuccess: () => {
      toast("User Verification Level updated successfully", "success");
      getUserDetails()
      closeModal();
    },
  })
 
  const { mutate: updateSocialSecurityRequest, isLoading: isUpdateSocailSecurityLoading } = useUpdateSocialSecurity({
    onSuccess: (data) => {
      if (data.data.message) {
        getUserDetails()
        handelRefetchActivity(true)
        toast(data.data.message, 'success')
        closeModal()
      } else {
        toast(data.data.message, 'error')
      }
    },
    onError: (error) => {
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

  const { mutate: updatePlayerForceLogoutReq, isLoading: isForceLogoutLoading } = useUpdatePlayerForceLogout({
    onSuccess: (data) => {
      if (data.data.message) {
        toast(data.data.message, 'success')
        closeModal()
      } else {
        toast(data.data.message, 'error')
      }
    },
    onError: (error) => {
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

  const { mutate: deleteUsername, isLoading: createLoading } = useDeleteUsername({
    onSuccess: () => {
      toast("User name deleted successfully", "success");
      getUserDetails()
      closeModal();
    }
  })

  const { mutate: createCanadianUser } =
    useCreateCanadianUserMutation({
      onSuccess: (res) => {
        if (res?.data?.success) {
          getUserDetails();
          toast(res?.data?.message, "success");
          closeModal();
          handelRefetchActivity(true);
        } else {
          toast(res?.data?.message, "error");
        }
      },
      onError: (error) => {
        errorHandler(error);
        closeModal();
      },
    });

  const onUpdateToggler = (dataValue, favType) => {
    let data
    if (selectedInnerButton.innerItem === 'removePwLock' || selectedInnerButton.innerItem === 'forceLogoutChild') {
      data = {
        userId: basicInfo.userId,
        reason: dataValue.reason,
        favorite: favType
      }
    } else if (selectedInnerButton.innerItem === 'socialSecurityChild') {
      data = {
        userId: basicInfo.userId,
        reason: dataValue.reason,
        favorite: favType,
        ssn: dataValue.ssn.toString()
      }
    } else if (selectedInnerButton.innerItem === 'phoneVerified') {
      data = {
        userId: basicInfo.userId,
        reason: dataValue.reason,
        type: selectedInnerButton.type || '',
        favorite: favType,
        kycLevel: "K3",
      }
    }
    else if (selectedInnerButton.innerItem === 'is2FaEnabled') {
      data = {
        userId: basicInfo.userId,
        reason: dataValue.reason,
        favorite: favType
      }
    }
    else {
      data = {
        userId: basicInfo.userId,
        reason: dataValue.reason,
        type: selectedInnerButton.type || '', // 1: phoneVerification, 2: Restrict User, 3: Ban Unban User, 4: Mark Test , 5: Redemption Subscription, 6: Subscripyion,
        favorite: favType
      }
    }

    let tempAction = false
    switch (selectedInnerButton.innerItem) {
      case 'isBan':
      case 'is2FaEnabled':
      case 'isRestrict':
      case 'isUserVerified':
      case 'phoneVerified':
      case 'isInternalUser':
      case 'canadianUser':
        tempAction = !(basicInfo[selectedInnerButton.innerItem])
        break
      case 'isRedemptionSubscribed':
      case 'isSubscribed':
        tempAction = !basicInfo?.moreDetails[selectedInnerButton.innerItem]
        break
      default:
        break
    }

    switch (selectedInnerButton.innerItem) {
      case 'isBan':
      case 'isRestrict':
      case 'isUserVerified':
      case 'isInternalUser':
      case 'isRedemptionSubscribed':
      case 'isSubscribed':
        data.action = tempAction
        updateUserStatusRequest(data)
        break
      case "canadianUser":
          createCanadianUser({userId: data?.userId})
          break;
      case 'is2FaEnabled':
        update2FaAuthRequest(data)
        break
      case 'phoneVerified':
        updateUserVerification(data)
        break
      case 'removePwLock':
        updateRemovePwLockRequest(data)
        break
      case 'socialSecurityChild':
        updateSocialSecurityRequest(data)
        break
      case 'forceLogoutChild':
        updatePlayerForceLogoutReq(data)
        break
      default:
        break
    }
  }
  const onUpdatePasswordToggler = (dataValue, favType) => {
    const data = {
      userId: basicInfo.userId,
      password: btoa(dataValue.password),
      reason: dataValue.reason,
      favorite: favType
    }
    updatePasswordRequest(data)
  }
  const onUpdateCoinToggle = (dataValue) => {
    const data = {
      coinType: dataValue.coinType.value,
      operationType: Number(dataValue.operationType.value),
      gcAmount: 0,
      scAmount: 0,
      remarks: dataValue.reason,
      userId: basicInfo.userId
    }
    if (dataValue.coinType.value === 'gc') {
      data.gcAmount = Number(dataValue.gcAmount)
    } else if (dataValue.coinType.value === 'sc') {
      if(showConfirmModal && dataValue.scAmount){
        data.scAmount = Number(dataValue.scAmount)
      }else{
        data.scAmount = Number(dataValue.gcAmount)
      }
    }
    else if (dataValue.coinType.value === 'wsc') {
      data.scAmount = Number(dataValue.gcAmount)
    }
    else if (dataValue.coinType.value === 'bsc') {
      data.scAmount = Number(dataValue.gcAmount)
    }
    else if (dataValue.coinType.value === 'psc') {
      data.scAmount = Number(dataValue.gcAmount)
    }
    else {
      data.scAmount = Number(dataValue.scAmount)
      data.gcAmount = Number(dataValue.gcAmount)
    }
    if (adminDetails?.userPermission?.permission?.Admins) {
      addCoinRequest(data)
    } else {
      addStaffCoinRequest(data)
    }
  }
  const onUpdateUserVerification = (dataValue) => {
    const data = {
      kycLevel: dataValue.verificationLevel.value,
      userId: basicInfo.userId
    }
    updateUserVerification(data)
  }
  const { mutate: updateUserTier ,isLoading:Tierloading } = useUpdateUserTierMutation({
    onSuccess: () => {
      toast("User  Level updated successfully", "success");
      getUserDetails()
      closeModal();
    },
    onError: (error) => {

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
  const onUpdateUserLevel = (dataValue) => {
    
    const data = {
      tierId: Number(dataValue?.tierLevel),
      userId: basicInfo.userId
    }
    updateUserTier(data)
  }

  const onDeleteUsername =(dataValue) =>{
    const data={
      userId: basicInfo.userId,
      userName : basicInfo.username,
      reason : dataValue.reason
    }
    deleteUsername(data)
  }

  const handleOpenModal = (values) => {
    setFormValues(values);
    setShowConfirmModal(true);
    closeModal()
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    onUpdateCoinToggle(formValues);
  };
  return (
    <EditInfoContainer>
      <ModalView
        openModal={openEditInfoModal}
        toggleModal={toggleSuccessModal}
        size='lg'
        hideHeader
        center
        className='announcement-view-wrap'
        firstBtnClass='btn-primary'
        secondBtnClass='btn-secondary'
        hideFooter
      >
        {
          isUpdateLoading || isRemovePwLockLoading || isUpdateSocailSecurityLoading && <Preloader />
        }
        {
          simpleEditFormExistForm.includes(selectedInnerButton.innerItem) &&
          <SimpleEditForm
            closeModal={closeModal}
            onSubmit={onUpdateToggler}
            basicInfo={basicInfo}
            selectedInnerButton={selectedInnerButton}
            createLoading={isUpdateLoading ||  isForceLogoutLoading || verifyloading }

          />
        }
         {
          props.isDeleteModal &&
          <SimpleEditForm
            closeModal={closeModal}
            onSubmit={onDeleteUsername}
            basicInfo={basicInfo}
            selectedInnerButton={selectedInnerButton}
            createLoading={createLoading}
            isDelete
          />
        }
        {
          simpleAddCoinExistForm.includes(selectedInnerButton.innerItem) &&
          <AddDeductCoin
            closeModal={closeModal}
            onSubmit={onUpdateCoinToggle}
            basicInfo={basicInfo}
            selectedInnerButton={selectedInnerButton}
            isLoading={isAddCoinLoading || isAddStaffCoinLoading}
            showConfirmModal={showConfirmModal}
            setShowConfirmModal={setShowConfirmModal}
            handleOpenModal={handleOpenModal}
          />
        }
        {
          updateTier.includes(selectedInnerButton.innerItem) &&
          <EditTier
          closeModal={closeModal}
          onSubmit={onUpdateUserLevel}
          basicInfo={basicInfo}
          selectedInnerButton={selectedInnerButton}
          isLoading={Tierloading }
          />
        }
        {
          simpleUserVerificationForm.includes(selectedInnerButton.innerItem) &&
          <UserVerification
            closeModal={closeModal}
            onSubmit={onUpdateUserVerification}
            basicInfo={basicInfo}
            selectedInnerButton={selectedInnerButton}
            isLoading={verifyloading }
          />
        }
        {
          simpleChangePwdForm.includes(selectedInnerButton.innerItem) &&
          <PlayerChangePwd
            closeModal={closeModal}
            onSubmit={onUpdatePasswordToggler}
            basicInfo={basicInfo}
            selectedInnerButton={selectedInnerButton}
            isLoading={isChangePwdLoading}
          />
        }{
          multiFieldForm.includes(selectedInnerButton.innerItem) &&
          <MultiFieldEditForm
            closeModal={closeModal}
            onSubmit={onUpdateToggler}
            basicInfo={basicInfo}
            selectedInnerButton={selectedInnerButton}
          />
        }

        {/*  */}
      </ModalView>
        {
          showConfirmModal && (
            <CustomModal
              showModal={showConfirmModal}
              handleClose={() => setShowConfirmModal(false)}
              handleSubmit={handleConfirmSubmit}
              TextMessage={`Are you sure you  want to ${formValues.operationType.label} ${formValues.gcAmount || formValues.scAmount} ${formValues.coinType.label} to this User`}
              btnMsg="Yes"
              HeaderMsg="Confirm !"
            />
          )}
    </EditInfoContainer>
  )
}

export default EditInfo
