import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getPromoCode } from '../../../utils/apiCalls'
import { getDateTime } from '../../../utils/dateFormatter'
import { useGetPackagesListingQuery } from '../../../reactQuery/hooks/customQueryHook'
import { errorHandler, useUpdatePromoCodeMutation } from '../../../reactQuery/hooks/customMutationHook'
import { toast } from '../../../components/Toast/index.jsx'

const useEditPromoCode = (promocodeId) => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState([]);
  const [isInitialValues, setIsInitialValues] = useState(true);

  const { data: promoDetail } = useQuery({
    queryKey: ['promoDetail', promocodeId],
    queryFn: ({ queryKey }) => {
      const params = { promocodeId: queryKey[1] };
      return getPromoCode(params);
    },
    select: (res) => res?.data?.promocodeDetail?.rows[0],
    refetchOnWindowFocus: false,
    onSuccess: () => {
      setIsInitialValues(false);
    }
  });

  const { data: packageData } = useGetPackagesListingQuery({
    params: {
      orderBy: 'packageId',
      sort: 'desc',
      isActive: 'active',
      firstPurchaseApplicable:false,
      welcomePurchaseBonusApplicable:false
    },
  });

  const { mutate: updatePromoCode, isLoading: updateLoading } = useUpdatePromoCodeMutation({
    onSuccess: () => {
      toast("Promotion Updated Successfully", "success");
      queryClient.invalidateQueries(['promoDetail', promocodeId]);
    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  const handleEditPromotionBonusSubmit = (formValues) => {
    const body = {
      promocodeId: Number(promocodeId),
      promocode: formValues.promocode,
      isActive: formValues.isActive,
      validTill: formValues.isValidUntil ? getDateTime(formValues.validTill) : null,
      maxUsersAvailed: formValues.maxUsersAvailed,
      perUserLimit: formValues.perUserLimit,
      isDiscountOnAmount: formValues.isDiscountOnAmount,
      discountPercentage: formValues.discountPercentage,
      packages: selectedId.length? selectedId : null,
    };
    updatePromoCode(body);
  };


  const handleAddGame = (e, item) => {
    const data = [...selectedId];
    if (e.target.checked) {
      data.push(item.packageId);
      setSelectedId(data);
    } else {
      const updatedSelectedId = data.filter(row => row !== item.packageId);
      setSelectedId(updatedSelectedId);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = packageData?.rows?.map(item => item.packageId) || [];
      setSelectedId(allIds);
    } else {
      setSelectedId([]);
    }
  };

  return {
    promoDetail, packageData, handleEditPromotionBonusSubmit, selectedId, setSelectedId, handleSelectAll,
    handleAddGame, updateLoading ,isInitialValues
  }
}

export default useEditPromoCode
