
import { toast } from "react-hot-toast";
import { useRef, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { useUpdateAffiliateMutation } from "../../../reactQuery/hooks/customMutationHook";
import { getAffiliateDetails } from "../../../utils/apiCalls";
import { useUserStore } from "../../../store/store";
// import { useNavigate } from 'react-router-dom';

const useEditProfile =() => {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const formikRef = useRef();

  const {userDetails, permissions} = useUserStore((state) => state)

  const setUserDetails = useUserStore((state) => state.setUserDetails);

  // const navigate = useNavigate();
  
  const {isInitialLoading: loading} = useQuery({
    queryKey: ['affiliateDetails'],
    queryFn: () =>{
        return getAffiliateDetails({affiliateId: userDetails.affiliateId})
    },
    onSuccess: (res) => {
      setUserDetails(res?.data?.getAffiliateDetail)
    },
    onError: (error) => {
      if(error?.response?.data?.errors.length > 0) {
        const {errors} = error.response.data;
        errors.map((error) => {
          if(error?.description) toast(error?.description, 'error')
        })
      }
   
    },
  })

 

  const updateAffiliateProfile = useUpdateAffiliateMutation({
    onSuccess: (res) => {

    setIsFormSubmitting(false)
      toast.success(res?.data?.message)
    },
    onError: (err) => {
  
    setIsFormSubmitting(false)
      if (err?.response?.data?.errors.length > 0) {
        const { errors } = err.response.data
        errors.forEach((error) => {
          if (error?.description) {
            toast.error(error?.description)
          }
        })
      }
    }
  })

  const handleOnSubmitPassword = (data) => {
    setIsFormSubmitting(true)
    updateAffiliateProfile.mutate(data)
  }

  return {
    handleOnSubmitPassword,
    isFormSubmitting,
    formikRef,
    userDetails,
    permissions,
    loading
  }
}

export default useEditProfile
