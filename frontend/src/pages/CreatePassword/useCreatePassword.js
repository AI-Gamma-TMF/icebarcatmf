import { useEffect, useState } from 'react'
import { useNavigate , useLocation } from 'react-router-dom'
import { getAffiliateLoginToken, removeLoginToken } from '../../utils/storageUtils'
import { AffiliateRoute } from '../../routes'
import { useMutation } from '@tanstack/react-query'
import { createAffiliatePassword } from '../../utils/apiCalls'
import { toast } from '../../components/Toast'
// import { useUserStore } from '../../store/store'
import { useTranslation } from 'react-i18next'
import { Buffer } from 'buffer'
const useCreatePassword = () => {
  const { t } = useTranslation(['adminSignIn'])
  // const setUserDetails = useUserStore((state) => state.setUserDetails)

  const navigate = useNavigate()
  
  const location = useLocation(); 
   const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const[resetPasswordToken,_setResetPasswordToken]=useState(token);

  const onSuccess = () => {
      toast("Password created successfully", 'success')
      navigate(AffiliateRoute.AffiliateSignIn)
  }

  const mutation = useMutation({
    mutationKey: ['createAffiliatePassword'],
    mutationFn: (data) => createAffiliatePassword(data),
    onSuccess: onSuccess,
    onError: (error) => {
      if(error?.response?.data?.errors.length > 0) {
        const {errors} = error.response.data;
        errors.map((error) => {
          if(error?.description) toast(error?.description, 'error')
        })
      }
    }
  });
  
  useEffect(() => {
    if (getAffiliateLoginToken()) {
      navigate(AffiliateRoute.Dashboard)
    } else {
      removeLoginToken()
    }
  }, [])

  const handleCreatePassword = ({ password }) =>  mutation.mutate({password: Buffer.from(password).toString('base64'),token:resetPasswordToken})

  return {
    loading: mutation.isLoading,
    handleCreatePassword,
    t,
    token
  }
}

export default useCreatePassword
