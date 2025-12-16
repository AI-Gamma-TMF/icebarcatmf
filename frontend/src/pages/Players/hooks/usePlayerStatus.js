import { useEffect, useState } from 'react'
import { useGetUserBanReasonQuery, useGetUserBanStatusQuery } from '../../../reactQuery/hooks/customQueryHook'
import { useTranslation } from 'react-i18next'
import { useDeletePlayerBanReason, useUpdateUserBanStatus } from '../../../reactQuery/hooks/customMutationHook'
import { toast } from '../../../components/Toast'
import { useQueryClient } from '@tanstack/react-query'

const usePlayerStatus = ({ playerId , setBtnClick}) => {
  const [limit, _setLimit] = useState(50)
  const [isAccountClose, setIsAccountClose] = useState(true)
  const [fetchEnabled, setFetchEnabled] = useState(false) // Prevent initial double call
  const queryClient = useQueryClient(); 
  const { t } = useTranslation(['translation']);

  const { data: reasonData } = useGetUserBanReasonQuery({
    params: {
      limit,
      isAccountClose
    },
    enabled: fetchEnabled, // Ensures API runs only when explicitly enabled
  });

  const { data: userStatusDetails } = useGetUserBanStatusQuery({
    params: {
      userId: playerId || ''
    },
    enabled: true,
  });

  

  const { mutate: updateUserStatusMutation } = useUpdateUserBanStatus({
    onSuccess: (data) => {
      setBtnClick(true)      
      toast(data.data.message, 'success') 
    }
  })

  const { mutate: deleteReasonMutation } = useDeletePlayerBanReason({
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast(data.message, 'success');
        queryClient.invalidateQueries('reasonsList'); // Invalidate reasonsList query after delete
      }
    },
  });

  useEffect(() => {
    if (!fetchEnabled) {
      setFetchEnabled(true);
    }
  }, [!isAccountClose]);

  return {
    t,
    reasonData,
    updateUserStatusMutation,
    isAccountClose,
    setIsAccountClose,
    deleteReasonMutation,
    userStatusDetails
  }
}

export default usePlayerStatus;
