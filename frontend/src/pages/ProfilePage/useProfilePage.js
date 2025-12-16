import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom'
import { toast } from '../../components/Toast'
import { useUserStore } from '../../store/store'
import { getAdminDetails, getSiteConfig } from '../../utils/apiCalls'
import { serialize } from 'object-to-formdata'
import { useDisable2FAMutation, errorHandler, useUpdateConfigMutation, useUpdateCredsMutation, useUpdateProfileMutation } from '../../reactQuery/hooks/customMutationHook'
import { Buffer } from 'buffer'
import { AdminRoutes } from '../../routes'
import { useTranslation } from 'react-i18next'
import { useGenerate2FAQuery } from '../../reactQuery/hooks/customQueryHook'

const useProfilePage = () => {
  const { t } = useTranslation(['profile'])
  const navigate = useNavigate()
  const [qrcodeUrlInfo, setqrCodeUrlInfo] = useState({
    isOpenModal: false,
    enabledForGetApi: false,
    qrString: ''
  })
  const [editable, setEditable] = useState(false)
  const [fetchAdmin, setFetchAdmin] = useState(false)
  const [editableCreds, setEditableCreds] = useState(false)
  const [siteConfigEditable, setSiteConfigEditable] = useState(false)
  const adminDetails = useUserStore((state) => state.userDetails)
  const [details, setDetails] = useState(adminDetails)
  const [selectedTab, setSelectedTab] = useState('overview')
  const setUserDetails = useUserStore((state) => state.setUserDetails)
  const [type, setType] = useState({ oldPassword: 'password', newPassword: 'password', confirmPassword: 'password' })
  const queryClient = useQueryClient()

  useQuery({
    queryKey: ['siteConfig'],
    queryFn: getSiteConfig,
    onSuccess: (data) => {
      setDetails({ ...adminDetails, siteConfig: data.config })
    },
    onError: (error) => {
      if (error?.response?.data?.errors.length > 0) {
        const { errors } = error.response.data;
        errors.map((error) => {
          if (error?.description) toast(error?.description, 'error')
        })
      }
    },
    refetchOnWindowFocus: false,
    enabled: adminDetails?.roleId === 1,
    select: (res) => res?.data
  })

  const { mutate: updateConfig, isLoading: siteConfigLoading } = useUpdateConfigMutation({
    onSuccess: (res) => {
      setSiteConfigEditable(false)
      toast(res?.data?.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['siteConfig'] })
    }
  })

  const updateSiteConfig = ({ data }) => {
    const siteConfBody = {
      siteName: data?.siteName,
      supportEmail: data?.supportEmailAddress,
      origin: data?.siteUrl,
      image: data?.siteLogo,
      mobileImage: data?.mobileImage,
      minRedeemableCoins: data?.minRedeemableCoins,
      maxRedeemableCoins: data?.maxRedeemableCoins,
      scToGcRate: data?.scToGcRate,
      xpScToGcRate: data?.xpScToGcRate,
      gcSpinLimit: data?.minGcSpinLimit,
      scSpinLimit: data?.minScSpinLimit,
      scVaultPercentage: data?.scVaultPercentage,
      gcVaultPercentage: data?.gcVaultPercentage,
      kycDepositAmount: data?.kycDepositAmount,
      kycRedeemAmount: data?.kycRedeemAmount,
      cardPurchaseAmount: data?.cardPurchaseAmount,
      amoeBonusTime: data?.amoeBonusAmount,
      vipMinQuestionnaireBonus: data?.vipMinQuestionnaireBonus,
      vipMaxQuestionnaireBonus: data?.vipMaxQuestionnaireBonus,
      vipNgrQuestionnaireMultiplier: data?.vipNgrQuestionnaireMultiplier
    }
    if (data?.authToken?.length > 0) siteConfBody.authToken = data.authToken
    const res = serialize(siteConfBody)
    updateConfig(res)
  }

  useQuery({
    queryKey: ['adminDetails'],
    queryFn: () => getAdminDetails({}),
    onSuccess: (res) => {
      setUserDetails(res?.data?.adminDetails)
      queryClient.invalidateQueries({ queryKey: ['siteConfig'] })
      setFetchAdmin(false)
    },
    onError: (error) => {
      if (error?.response?.data?.errors.length > 0) {
        const { errors } = error.response.data;
        errors.map((error) => {
          if (error?.description) toast(error?.description, 'error')
        })
      }
      navigate(AdminRoutes.AdminSignin)
    },
    refetchOnWindowFocus: false,
    enabled: !!fetchAdmin,
  })

  const { mutate: updateProfile, isLoading: loading } = useUpdateProfileMutation({
    onSuccess: (res) => {
      setEditable(false)
      toast(res?.data?.message, 'success')
      setFetchAdmin(true)
    }, onError: (error) => {
      setEditable(false)
      errorHandler(error)
    }
  })

  const updateData = (formValues) => {
    const data = {
      firstName: formValues?.firstName,
      lastName: formValues?.lastName
    }
    if (formValues?.oldPassword?.length > 0 && formValues?.newPassword?.length > 0) {
      data.oldPassword = Buffer.from(formValues?.oldPassword).toString('base64')
      data.newPassword = Buffer.from(formValues?.newPassword).toString('base64')
    }
    updateProfile(data)
  }

  const [preview, setPreview] = useState({
    image_preview: null,
    image_file: null
  })

  const handleImagePreview = (e) => {
    if (e.target.files[0]) {
      const imageAsBase64 = URL.createObjectURL(e.target.files[0])
      const imageAsFiles = e.target.files[0]
      setPreview({
        image_preview: imageAsBase64,
        image_file: imageAsFiles
      })
    }
  }

  const { mutate: updateCreds } = useUpdateCredsMutation({
    onSuccess: (res) => {
      setEditableCreds(false)
      toast(res?.data?.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['siteConfig'] })
    }
  })

  const updateCredentials = ({ data }) => {
    updateCreds({
      sendgridKey: Buffer.from(data.sendgridKey).toString('base64'),
      sendgridEmail: data.sendgridEmail
    })
  }

  const get2FASuccessToggler = (data) => {
    // setqrCodeUrl(data)
    const tempQrcodeUrlInfo = { ...qrcodeUrlInfo };
    QRCode.toString(data.authUrl, function (err, string) {
      if (err) throw err
      tempQrcodeUrlInfo.qrString = string
      setqrCodeUrlInfo(tempQrcodeUrlInfo)
    })
  }

  const toggleForQRModal = () => {
    const tempQrcodeUrlInfo = { ...qrcodeUrlInfo }
    tempQrcodeUrlInfo.isOpenModal = !tempQrcodeUrlInfo.isOpenModal
    setqrCodeUrlInfo(tempQrcodeUrlInfo)
  }
  const openQRModalToggle = () => {
    const tempQrcodeUrlInfo = { ...qrcodeUrlInfo }
    tempQrcodeUrlInfo.isOpenModal = true
    tempQrcodeUrlInfo.enabledForGetApi = true
    setqrCodeUrlInfo(tempQrcodeUrlInfo)
  }
  const {
    data: _dataInfo,
    isLoading: isGetOtpLoading
  } = useGenerate2FAQuery({ params: { id: details.adminUserId }, enabled: qrcodeUrlInfo.enabledForGetApi, successToggler: get2FASuccessToggler })

  const mutationDisable2FA = useDisable2FAMutation({
    onSuccess: (res) => {
      toast(res?.data?.message, 'success')
      setUserDetails({ ...adminDetails, authEnable: false })
    },
    onError: (error) => {
      console.log("**********", error);
    }
  })

  const disable2FA = () => {
    mutationDisable2FA.mutate()
  }

  return {
    details,
    loading,
    selectedTab,
    setSelectedTab,
    navigate,
    editable,
    setEditable,
    updateData,
    type,
    setType,
    editableCreds,
    updateCredentials,
    adminDetails,
    setEditableCreds,
    siteConfigEditable,
    setSiteConfigEditable,
    updateSiteConfig,
    preview,
    handleImagePreview,
    siteConfigLoading,
    t,
    qrcodeUrlInfo,
    toggleForQRModal,
    openQRModalToggle,
    isGetOtpLoading: isGetOtpLoading && qrcodeUrlInfo.enabledForGetApi,
    disable2FA,
    setUserDetails
  }
}

export default useProfilePage
