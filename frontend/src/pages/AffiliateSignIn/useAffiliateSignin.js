import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLoginToken, removeLoginToken, setLoginToken } from '../../utils/storageUtils'
import { AffiliateRoute } from '../../routes'
import { useMutation } from '@tanstack/react-query'
import { AffiliateLogin } from '../../utils/apiCalls'
import { toast } from '../../components/Toast'
import { useUserStore } from '../../store/store'
import { useTranslation } from 'react-i18next'
import { Buffer } from 'buffer'

const useAffiliateSignin = () => {
  const { t } = useTranslation(['adminSignIn'])
  const setUserDetails = useUserStore((state) => state.setUserDetails)
  const navigate = useNavigate()
  const [loginResponse, setLoginResponse] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const onSuccess = (res) => {
    if(res?.data?.authEnable){
      setLoginResponse(res)
      setOpenModal(true)
    } else {
      setUserDetails(res?.data.affiliate)
      window.localStorage.setItem('affiliateUserId', res?.data.affiliate?.role?.roleId)
      window.localStorage.setItem('userId', res?.data.affiliate?.role?.name)
      toast(t('signInSuccessToast'), 'success')
      navigate(AffiliateRoute.AffiliateProfile)
    }
  }

  const toggleForQRModal = () => {
    setOpenModal((current) => !current)
  }

  const allowLogin = () => {
    setUserDetails(loginResponse?.data)
    setLoginToken(loginResponse?.data.adminUsername)
    toast(t('signInSuccessToast'), 'success')
    navigate(AffiliateRoute.AffiliateProfile)
  }

  const mutation = useMutation({
    mutationKey: ['affiliateLogin'],
    mutationFn: (data) => AffiliateLogin(data),
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
       navigate(AffiliateRoute.AffiliateProfile)
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

export default useAffiliateSignin
