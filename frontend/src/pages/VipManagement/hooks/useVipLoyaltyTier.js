import { toast } from '../../../components/Toast';
import { useUpdateVipUserLoyaltyTier } from '../../../reactQuery/hooks/customMutationHook';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getVipLoyaltyTier } from '../../../utils/apiCalls';
import { useState } from 'react';

const useVipLoyaltyTier = () => {
  const queryClient = useQueryClient();

  const [statusShow, setStatusShow] = useState(false);

  const { mutate: updateLoyaltyTier, isLoading: isVipLoyaltyTierLoading } = useUpdateVipUserLoyaltyTier({
    onSuccess: (res) => {
      toast(res?.data?.message, 'success');
      queryClient.invalidateQueries({
        queryKey: ['vipLoyaltyTierUPdate'],
      });
      setStatusShow(false);
    },
    onError: (err) => {
      const error = err?.response?.data?.errors?.[0];
      console.log(error);
      toast(error?.description, 'error');
    },
  });

  const { data: vipLoyalTierData, isLoading: isVipLoyaltyTierDataLoading } = useQuery({
    queryKey: ['vipLoyalTierData'],
    queryFn: () => {
      return getVipLoyaltyTier();
    },
    select: (res) => res?.data,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const handleUpdateTier = (data) => {
    updateLoyaltyTier(data);
  };

  return {
    updateLoyaltyTier,
    isVipLoyaltyTierLoading,
    vipLoyalTierData,
    isVipLoyaltyTierDataLoading,
    handleUpdateTier,
    statusShow,
    setStatusShow,
  };
};
export default useVipLoyaltyTier;
