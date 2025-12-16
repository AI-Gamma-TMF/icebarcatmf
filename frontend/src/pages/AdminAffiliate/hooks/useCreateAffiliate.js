
import { useNavigate } from 'react-router-dom'
import { useAffiliateMutation } from '../../../reactQuery/hooks/customMutationHook'
import { toast } from '../../../components/Toast'
import { AdminRoutes } from '../../../routes'
import { useState } from 'react'

const useCreateAffiliate = () => {
    const navigate = useNavigate()
    const[isFormSubmitting,setIsFormSubmitting]=useState(false);

    const onAffiliateSuccess = () => {
        setIsFormSubmitting(false)
        toast("Affiliate Created Successfully", 'success')
        setTimeout(()=>{
            navigate(AdminRoutes.Affiliate)
        },2000)
     
       }
     
    const onAffiliateError = (err) => {
        setIsFormSubmitting(false)
         if (err?.response?.data?.errors.length > 0) {
           const { errors } = err.response.data
           console.log('errors',errors)
           errors.forEach((error) => {
             if (error?.description) {
               if (error.errorCode === 3007) {
                console.log(error)
               } else toast(error?.description,"error")
             }
           })
         }
       }
    
    
      const affiliateMutation = useAffiliateMutation({
        onSuccess: onAffiliateSuccess,
        onError: onAffiliateError
      })
    
      const handleCreateAffiliate = (formValues) => {
         setIsFormSubmitting(true)
         affiliateMutation.mutate(formValues);
      }
 return {
    handleCreateAffiliate,
    isFormSubmitting
 }
}

export default useCreateAffiliate