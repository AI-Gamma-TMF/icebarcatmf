import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  errorHandler,
  useCreateProviderRateMatrixMutation,
} from "../../../reactQuery/hooks/customMutationHook/index.js";
import { toast } from "../../../components/Toast/index.jsx";
import { AdminRoutes } from "../../../routes.js";
import { useNavigate } from "react-router-dom";
import {
  getProviderRates,
} from "../../../utils/apiCalls.js";
import { useQueryClient } from "@tanstack/react-query";

const useCreateProviderRate = (providerId, jackpotStatus) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState([]);
  const [isInitialValues, setIsInitialValues] = useState(true);
  const queryClient = useQueryClient();

  const { data: matrixDetails, isLoading: loading } = useQuery({
    queryKey: ["matrixDetails", providerId],
    queryFn: ({ queryKey }) => {
      const params = { providerId: queryKey[1] };
      return getProviderRates(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    // enabled: !jackpotStatus,
    onSuccess: () => {
      setIsInitialValues(false);
    },
    onError: (error) => {
      errorHandler(error);
      navigate(AdminRoutes.DashboardCasinoProviders);
    },
  });

  const handleCreateSubmit = (formValues) => {
  console.log("formData create ::", formValues);

  const body = {
    aggregatorId: Number(formValues.aggregatorId),
    providerId: Number(formValues.providerId),
    rateEntries: formValues.rateEntries.map(entry => ({
      ggrMinimum: Number(entry.ggrMinimum),
      ggrMaximum: entry.ggrMaximum !== null ? Number(entry.ggrMaximum) : null,
      rate: Number(entry.rate)
    }))
  };

  createRateMatrix(body);
};

  const { mutate: createRateMatrix, isLoading: createLoading } = useCreateProviderRateMatrixMutation({
    onSuccess: (res) => {
      toast("Rate Matrix Created Successfully", "success");
      // queryClient.invalidateQueries(["matrixDetails"]);
      // navigate(AdminRoutes.DashboardCasinoProviders, {
      //   state: { openMatrixOnce: true }
      // });
      console.log(res,"11111111");


       if(res){
        navigate(`${AdminRoutes.EditProvidersRateMatrix.split(":").shift()}${providerId}`)
      }

    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  return {
    matrixDetails,
    loading,
    createLoading,
    isInitialValues,
    handleCreateSubmit,
  };
};

export default useCreateProviderRate;
