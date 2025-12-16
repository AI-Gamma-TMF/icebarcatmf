import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLoginToken, removeLoginToken, setLoginToken } from '../../utils/storageUtils'
import { AdminRoutes, AffiliateRoute } from '../../routes'
import { useMutation } from '@tanstack/react-query'
import { adminLogin } from '../../utils/apiCalls'
import { toast } from '../../components/Toast'
import { useUserStore } from '../../store/store'
import { useTranslation } from 'react-i18next'
import { Buffer } from 'buffer'

const useAdminSignin = () => {
  const { t } = useTranslation(['adminSignIn'])
  const setUserDetails = useUserStore((state) => state.setUserDetails)
  const navigate = useNavigate()
  const [loginResponse, setLoginResponse] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const role="Affiliate"

  const onSuccess = (res) => {
    if(res?.data?.authEnable){
      setLoginResponse(res)
      setOpenModal(true)
    } else {
      setUserDetails(res?.data)
      setLoginToken(res?.data.adminUsername)
      toast(t('signInSuccessToast'), 'success')
      navigate(AdminRoutes.Dashboard)
    }
  }

  const toggleForQRModal = () => {
    setOpenModal((current) => !current)
  }

  const allowLogin = () => {
    setUserDetails(loginResponse?.data)
    setLoginToken(loginResponse?.data.adminUsername)
    toast(t('signInSuccessToast'), 'success')
    navigate(AdminRoutes.Dashboard)
  }

  const mutation = useMutation({
    mutationKey: ['userDetails'],
    mutationFn: (data) => adminLogin(data),
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
    if (getLoginToken()) {
      navigate( !role==="Affiliate" ? AffiliateRoute.Dashboard : AdminRoutes.Dashboard)
    } else {
      removeLoginToken()
    }
  }, [])

  const handleSignIn = ({ email, password }) =>  mutation.mutate({email, password: Buffer.from(password).toString('base64')})

  return {
    loading: mutation.isLoading,
    handleSignIn,
    t,
    qrcodeUrlInfo: { isOpenModal: openModal },
    allowLogin,
    toggleForQRModal
  }
}

export default useAdminSignin
