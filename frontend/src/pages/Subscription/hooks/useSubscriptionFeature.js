import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSubscriptionFeature } from "../../../utils/apiCalls";
import { useState } from "react";
import { toast } from "../../../components/Toast";
import {
  errorHandler,
  useUpdateStatusSubscriptionFeature,
  useUpdateSubscriptionFeature,
} from "../../../reactQuery/hooks/customMutationHook";
import { useNavigate } from "react-router-dom";

const useSubscriptionFeature = (id) => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [show, setShow] = useState(false);
  const [subscriptionFeatureId, setSubscriptionFeatureId] = useState("");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [mode, setMode] = useState("");
  const [sort, setSort] = useState('DESC')
  const [orderBy, setOrderBy] = useState('subscriptionFeatureId')

  const queryClient = useQueryClient();
  const { data: subscriptionFeatureData, isLoading } = useQuery({
    queryKey: ["subscriptionFeatureData", id, sort, orderBy],
    queryFn: ({ queryKey }) => {
      const params = {};
      if (queryKey[1]) params.subscriptionFeatureId = queryKey[1];
      if (queryKey[2]) params.sort = queryKey[2];
      if (queryKey[3]) params.orderBy = queryKey[3];

      return getSubscriptionFeature(params);
    },
    select: (res) => res?.data?.data,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { mutate: updateStatus, isLoading: updateLoading } =
    useUpdateStatusSubscriptionFeature({
      onSuccess: ({ data }) => {
        if (data?.message) {
          toast(data?.message, "success");
        }
        queryClient.invalidateQueries({ queryKey: "subscriptionFeatureData" });
        setShow(false);
      },
      onError: (error) => errorHandler(error),
    });

  const { mutate: updateFeature, isLoading: updateFeatureLoading } =
    useUpdateSubscriptionFeature({
      onSuccess: ({ data }) => {
        if (data?.message) {
          toast(data?.message, "success");
        }
        setShowSubscriptionModal(false);
        setSubscriptionFeatureId("");
        queryClient.invalidateQueries({ queryKey: ['subscriptionFeatureData'] });
      },

      onError: (error) => errorHandler(error),
    });

  const handleShow = (id, active) => {
    setSubscriptionFeatureId(id);
    setActive(!active);
    setShow(true);
  };
  const handleYes = () => {
    updateStatus({
      subscriptionFeatureId,
      isActive: active,
    });
  };

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Action'

  return {
    subscriptionFeatureData,
    isLoading,
    handleShow,
    show,
    setShow,
    subscriptionFeatureId,
    setSubscriptionFeatureId,
    handleYes,
    updateLoading,
    active,
    sort,
    setSort,
    selected,
    setOrderBy,
    orderBy,
    navigate,
    showSubscriptionModal,
    setShowSubscriptionModal,
    mode,
    setMode,
    updateFeature,
    updateFeatureLoading
  };
};

export default useSubscriptionFeature;
