import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from '../../../components/Toast'
import { useUpdateStaffMutation } from '../../../reactQuery/hooks/customMutationHook'
import { AdminRoutes } from '../../../routes'
import { Buffer } from 'buffer'
import { getAdminDetails } from '../../../utils/apiCalls'

const useEditAdmin = () => {
  const navigate = useNavigate()
  const { adminId } = useParams()
  const queryClient = useQueryClient()
  const { t } = useTranslation(['staff'])

  const { data: adminDetails } = useQuery({
    queryKey: ['staffDetail', adminId],
    queryFn: () => getAdminDetails({adminUserId: adminId}),
    select: (res) => res?.data?.adminDetails,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false
  })

  const { mutate: editAdmin,isLoading : loading } = useUpdateStaffMutation({onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['staffList'] })
    queryClient.invalidateQueries({ queryKey: ['staffDetail', adminId] })
    toast(t('editStaff.editSuccessToast'), 'success')
    navigate(AdminRoutes.Staff)
  }})

  const handleEditSubmit = (formValues) => {
    const preparedValues = {
      ...formValues,
      gcLimit: formValues.gcLimit === '' || !formValues?.addCoins  ? null : formValues.gcLimit,
      scLimit: formValues.scLimit === '' || !formValues?.addCoins  ? null : formValues.scLimit,
    };

    ([undefined, null].includes(preparedValues.permission) || Object.keys(preparedValues.permission).length < 1)
      ? toast(t('editStaff.selectPermissionErrorToast'), 'error')
      : editAdmin({
        ...preparedValues,
        adminId: adminDetails.adminUserId,
        password: Buffer.from(preparedValues.password).toString(
          'base64'
        )
      })
  }

  return {
    adminDetails,
    handleEditSubmit,
    t,
    loading 
  }
}

export default useEditAdmin
