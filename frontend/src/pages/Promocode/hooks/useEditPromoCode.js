import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getPromoCode } from '../../../utils/apiCalls'
import { useGetPackagesListingQuery } from '../../../reactQuery/hooks/customQueryHook'
import { errorHandler, useUpdatePromoCodeMutation } from '../../../reactQuery/hooks/customMutationHook'
import { toast } from '../../../components/Toast/index.jsx'
import { AdminRoutes } from '../../../routes.js'
import { useNavigate } from "react-router-dom";
import moment from 'moment';

const useEditPromoCode = (promocodeId) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState([]);
  const [isInitialValues, setIsInitialValues] = useState(true);

  const { data: promoDetail, isLoading : loading } = useQuery({
    queryKey: ['promoDetail', promocodeId],
    queryFn: ({ queryKey }) => { 
      const params = { promocodeSearch: queryKey[1] };
      return getPromoCode(params);
    },
    select: (res) => res?.data?.promocodeDetail?.rows[0],
    refetchOnWindowFocus: false,
    onSuccess: (_data) => {
      setIsInitialValues(false);
    }
  });

 const [limit, setLimit] = useState(15)
   const [page, setPage] = useState(1)
   const { data: packageData } = useGetPackagesListingQuery({
     params: {
       orderBy: "packageId",
       sort: "desc",
       isActive: "active",
       pageNo:page,
       limit:limit
     },
   });
  const totalPages = Math.ceil(packageData?.count / limit);
  const { mutate: updatePromoCode, isLoading: updateLoading } = useUpdatePromoCodeMutation({
    onSuccess: () => {
      toast("Promotion Updated Successfully", "success");     
      navigate(AdminRoutes.PromoCodeBonus)
    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  const handleEditPromotionBonusSubmit = (formValues) => {
    const body = {
      promocodeId: Number(promocodeId),
      promocode: formValues.promocode,
      description: formValues.description,
      isActive: formValues.isActive,
      validTill:  moment(formValues.validTill).utc().format() || null,
      validFrom: promoDetail?.status === 1 ? null : moment(formValues.validFrom).utc().format() ,
      maxUsersAvailed: formValues.maxUsersAvailed,
      perUserLimit: formValues.perUserLimit,
      isDiscountOnAmount: formValues.isDiscountOnAmount,
      discountPercentage: formValues.discountPercentage ,
      // bonusPercentage:formValues.bonusPercentage,
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
    handleAddGame, updateLoading ,isInitialValues, loading, limit, setLimit, page, setPage, totalPages
  }
}

export default useEditPromoCode