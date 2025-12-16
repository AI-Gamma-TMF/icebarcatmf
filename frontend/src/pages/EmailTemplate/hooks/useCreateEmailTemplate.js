import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getEmailDynamicData, getEmailCategoryData } from '../../../utils/apiCalls'
import { AdminRoutes } from '../../../routes'
import { useCreateEmailTemplateMutation, useUpdateManualTemplateMutation } from '../../../reactQuery/hooks/customMutationHook'
import { useTranslation } from 'react-i18next'
import { toast } from '../../../components/Toast'
import useCheckPermission from '../../../utils/checkPermission'


const useCreateEmailTemplate = (templateCode, selectedTab) => {
    const navigate = useNavigate()
    // const queryClient = useQueryClient();
    // const { emailTemplateId } = useParams()
    const [galleryModal, setGalleryModal] = useState(false)
    const [template, setTemplate] = useState(templateCode ? templateCode[selectedTab] : '')
    const { t } = useTranslation(['emailTemplate'])

    const { isHidden } = useCheckPermission()

    const { data: emailCategory } = useQuery({
        queryKey: ['emailCategory'],
        queryFn: getEmailCategoryData,
        select: (res) => res?.data,
        refetchOnWindowFocus: false,
    })

    const { data: dynamicEmailKey } = useQuery({
      queryKey: ['dynamicEmailKey'],
      queryFn: getEmailDynamicData,
      select: (res) => res?.data,
      refetchOnWindowFocus: false,
    })

    const { mutate: createEmailTemplateMutate } = useCreateEmailTemplateMutation({onSuccess: () => {
        toast(t('createTemplateToast'), 'success')
        navigate(AdminRoutes.EmailTemplates)
      }})

  const { mutate: updateManualTemplate } = useUpdateManualTemplateMutation({onSuccess: () => {
    toast(t('updateTemplateToast'), 'success')
    navigate(AdminRoutes.EmailTemplates)
  },
})

    const createEmailTemplateData = (data) => createEmailTemplateMutate(data.emailtemplateData)
    const updateManualEmailTemplate= (data) => updateManualTemplate(data.emailtemplateData, data.formValues)

    return {
        t,
        isHidden,
        dynamicEmailKey,
        createEmailTemplateData,
        updateManualEmailTemplate,
        emailCategory,
        navigate,
        template,
        setTemplate,
        galleryModal,
        setGalleryModal
      }
}

export default useCreateEmailTemplate