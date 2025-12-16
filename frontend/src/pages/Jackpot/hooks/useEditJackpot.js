import { useQuery , useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  errorHandler,
  useRngGenerateJackpotMutation,
  useUpdateJackpotMutation,
} from "../../../reactQuery/hooks/customMutationHook/index.js";
import { toast } from "../../../components/Toast/index.jsx";
import { AdminRoutes } from "../../../routes.js";
import { useNavigate } from "react-router-dom";
import {
  getJackpotDetails,
} from "../../../utils/apiCalls.js";

const useEditJackpot = (jackpotId, jackpotStatus) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState([]);
  const [isInitialValues, setIsInitialValues] = useState(true);
  const queryClient = useQueryClient();
  const [rngValues, setRngValues] = useState({});

  const { data: jackpotDetails, isLoading: loading } = useQuery({
    queryKey: ["jackpotDetail", jackpotId],
    queryFn: ({ queryKey }) => {
      const params = { jackpotId: queryKey[1] };
      return getJackpotDetails(params);
    },
    select: (res) => res?.data?.data,
    refetchOnWindowFocus: false,
    enabled: !jackpotStatus,
    onSuccess: () => {
      setIsInitialValues(false);
    },
    onError: (error) => {
      errorHandler(error);
      navigate(AdminRoutes.Jackpot);
    },
  });

  const { mutate: updateJackpot, isLoading: updateLoading } =
    useUpdateJackpotMutation({
      onSuccess: () => {
        toast("Jackpot Updated Successfully", "success");
        queryClient.invalidateQueries(["currentJackpot"]);
        // queryClient.invalidateQueries(['jackpotList']);
        navigate(AdminRoutes.Jackpot);
      },
      onError: (error) => {
        errorHandler(error);
      },
    });

  const {mutate : rngGenerate , isLoading : rngLoading} = useRngGenerateJackpotMutation({
    onSuccess:(data)=>{
      setRngValues(data?.data);
    },
    onError: (error)=>{
      errorHandler(error)
    }
  })

  const handleEditJackpotSubmit = (formValues) => {
    const body = {
      jackpotId: Number(jackpotId),
      jackpotName: formValues.jackpotName,
      maxTicketSize: formValues.maxTicketSize,
      seedAmount: formValues.seedAmount,
      entryAmount: formValues.entryAmount,
      adminShare: formValues.adminShare,
      poolShare: formValues.poolShare,
      winningTicket: formValues.winningTicket,
    };
    updateJackpot(body);
  };

  const handleGenerateRNG = (formValues) => {
    const body = {
      maxTicketSize: formValues.maxTicketSize,
      seedAmount: formValues.seedAmount,
      entryAmount: formValues.entryAmount,
      adminShare: formValues.adminShare,
      poolShare: formValues.poolShare,
    };
    rngGenerate(body);
  };

  return {
    handleEditJackpotSubmit,
    selectedId,
    setSelectedId,
    jackpotDetails,
    isInitialValues,
    updateLoading,
    loading,
    handleGenerateRNG,
    rngValues,
    rngLoading,
  };
};

export default useEditJackpot;
