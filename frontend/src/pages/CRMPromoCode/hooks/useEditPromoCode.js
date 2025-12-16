import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPromoCode } from "../../../utils/apiCalls";
import { useGetPackagesListingQuery } from "../../../reactQuery/hooks/customQueryHook";
import {
  errorHandler,
  useUpdatePromoCodeMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { toast } from "../../../components/Toast/index.jsx";
import { AdminRoutes } from "../../../routes.js";
import { useNavigate } from "react-router-dom";


const useEditPromoCode = (crmPromotionId) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState([]);
  const [isInitialValues, setIsInitialValues] = useState(true);

  const { data: promoDetail, isLoading: loading } = useQuery({
    queryKey: ["promoDetail", crmPromotionId],
    queryFn: ({ queryKey }) => {
      const params = { promocodeSearch: queryKey[1], crmPromocode: true };
      return getPromoCode(params);
    },
    select: (res) => res?.data?.promocodeDetail?.rows[0],
    refetchOnWindowFocus: false,
    onSuccess: () => {
      setIsInitialValues(false);
    },
  });

  const { data: packageData} =
    useGetPackagesListingQuery({
      params: {
        orderBy: "packageId",
        sort: "desc",
        isActive: 'active',
      },
    });

  const { mutate: updatePromoCode, isLoading: updateLoading } =
    useUpdatePromoCodeMutation({
      onSuccess: () => {
        toast("Promotion Updated Successfully", "success");
        navigate(AdminRoutes.CRMPromoCode);
      },
      onError: (error) => {
        errorHandler(error);
      },
    });

  const handleEditPromotionBonusSubmit = (formValues) => {
    const body = {
      promocodeId: Number(crmPromotionId),
      promocode: formValues.promocode,
      isActive: formValues.isActive,
      maxUsersAvailed: formValues.maxUsersAvailed,
      perUserLimit: formValues.perUserLimit,
      isDiscountOnAmount: formValues.isDiscountOnAmount,
      discountPercentage: formValues.discountPercentage,
      packages: selectedId.length ? selectedId : null,
    };
    updatePromoCode(body);
  };

  const handleAddGame = (e, item) => {
    const data = [...selectedId];
    if (e.target.checked) {
      data.push(item.packageId);
      setSelectedId(data);
    } else {
      const updatedSelectedId = data.filter((row) => row !== item.packageId);
      setSelectedId(updatedSelectedId);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = packageData?.rows?.map((item) => item.packageId) || [];
      setSelectedId(allIds);
    } else {
      setSelectedId([]);
    }
  };

  return {
    promoDetail,
    packageData,
    handleEditPromotionBonusSubmit,
    selectedId,
    setSelectedId,
    handleSelectAll,
    handleAddGame,
    updateLoading,
    isInitialValues,
    loading,
  };
};

export default useEditPromoCode;
