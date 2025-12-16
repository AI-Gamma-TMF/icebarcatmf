import { useState, useEffect } from "react";
import { useParams , useNavigate } from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";
import { toast } from "../../../components/Toast";
import { useTranslation } from "react-i18next";
import { AdminRoutes } from "../../../routes";
import { useReorderFtpBonusMutation } from "../../../reactQuery/hooks/customMutationHook";
import { useGetPackagesListingQuery } from "../../../reactQuery/hooks/customQueryHook";
const createOption = (label, isNew) => ({
  label: label,
  // value: label.toLowerCase().replace(/\W/g, ''),
  value: label,
  newOptions: isNew,
});
const useReorderFtpBonus = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({ rows: [], count: 0 });
  // const queryClient = useQueryClient();
  const { t } = useTranslation(["packages"]);

  const [enabled, _setEnabled] = useState(false);
  // const [typeValue, setTypeValue] = useState(null);

  const { packageId, firstPurchaseApplicable } = useParams();
 
  const getSinglePackageSuccessToggler= (data) => {
    const _newOption = createOption(data.packageType, true);
    // setTypeValue(newOption);
  };
  const { data, refetch: fetchData } = useGetPackagesListingQuery({
    params: {
      packageId,
      orderBy: "packageId",
      sort: firstPurchaseApplicable === "true" ? "asc" : "desc",
      firstPurchaseApplicable,
    },
    enabled,
    getSinglePackageSuccessToggler,
  });
  useEffect(() => {
   
    if (data) {
     
      setState({
        rows: data?.rows[0]?.packageFirstPurchase
        , 
        count: data.count || 0,    
      });
    }
  }, [data]);
   
  useEffect(() => {
    fetchData();
   
  }, [packageId, firstPurchaseApplicable]);

    const reorder = (packages, startIndex, endIndex) => {
      const result = Array.from(packages)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)

      return result
    }

    const onDragEnd = (result) => {
      if (!result.destination) {
        return
      }

      if (result.destination.index === result.source.index) {
        return
      }

      const rows = reorder(
        state?.rows,
        result.source.index,
        result.destination.index
      )
      setState({ rows, count: rows.length })
    }

  const { mutate: reorderFtpBonus, isLoading: updateLoading } =
    useReorderFtpBonusMutation({
      onSuccess: () => {
        toast(t("reorderedToast"), "success");
        navigate(
            `${AdminRoutes.EditPackageDetails.split(':')[0]}${data?.rows[0]?.packageId}`
           )}
      
    });

    const handleSave = () => {
      const row = []
      state?.rows?.map((list) => row.push(list.packageFirstPurchaseId))
      reorderFtpBonus({packageId:data?.rows[0]?.packageId,order: row})
    }

  return {
    data,

    loading: updateLoading,
    state,
    onDragEnd,
    handleSave,
    navigate
  };
};

export default useReorderFtpBonus;
