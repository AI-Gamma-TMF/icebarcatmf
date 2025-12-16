import { useState } from "react";
import { useUpdateAffiliateMutation } from "../../../reactQuery/hooks/customMutationHook";
import { toast } from "../../../components/Toast";
import { useNavigate } from 'react-router-dom'
import { AdminRoutes } from "../../../routes";

const useEditAffiliate = () => {
    const[isFormSubmitting,setIsFormSubmitting]=useState(false);
    const navigate = useNavigate()

    const updateAffiliateProfile = useUpdateAffiliateMutation({
      onSuccess: (res) => {
        setIsFormSubmitting(false)
        toast.success(res?.data?.message)
        setTimeout(()=>{
          navigate(AdminRoutes.Affiliate)
        },2000)
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
  
    const handleAffiliateProfileUpdate = (formValues) => {
      setIsFormSubmitting(true)
      updateAffiliateProfile.mutate(formValues)
    }

    return {
        handleAffiliateProfileUpdate,
        isFormSubmitting
    }
}

export default useEditAffiliate
