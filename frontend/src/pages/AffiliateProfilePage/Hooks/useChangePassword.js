
import { toast } from "react-hot-toast"
import { useCallback, useRef, useState } from "react"
import { useUpdateAffiliateProfileMutation } from "../../../reactQuery/hooks/customMutationHook"

const useChangePassword =() => {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const formikRef = useRef();
  const changePasswordMutation = useUpdateAffiliateProfileMutation({
  onSuccess: (res) => {
   formikRef.current.resetForm();
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

  const handleOnSubmitPassword = useCallback(async (data) => {
    setIsFormSubmitting(true)
    changePasswordMutation.mutate({
      oldPassword: window.btoa(data.oldPassword),
      newPassword: window.btoa(data.newPassword)
    })
  }, [])

  return {
 
    handleOnSubmitPassword,
    isFormSubmitting,
    changePasswordMutation,
    formikRef
  }
}

export default useChangePassword
