import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  errorHandler,
  useCreateProviderRateMatrixMutation,
  useDeleteProviderRateMatrixMutation,
  useUpdateProviderRateMatrixMutation,
} from "../../../reactQuery/hooks/customMutationHook/index.js";
import { toast } from "../../../components/Toast/index.jsx";
import { AdminRoutes } from "../../../routes.js";
import { useNavigate } from "react-router-dom";
import {
  getProviderRates,
} from "../../../utils/apiCalls.js";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

const useEditProviderRate = (providerId, jackpotStatus) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState([]);
  const [isInitialValues, setIsInitialValues] = useState(true);
  const queryClient = useQueryClient();

  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('rateId')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [rateId, setRateId] = useState()
  const [status, setStatus] = useState('all')


  const { data: matrixDetails, isLoading: loading } = useQuery({
    queryKey: ["matrixDetails", providerId, page, limit, orderBy, sort],
    queryFn: ({ queryKey }) => {
      const params = { providerId: queryKey[1] };
      if (queryKey[4]) params.orderBy = queryKey[4]
      if (queryKey[5]) params.sort = queryKey[5]
      // if (queryKey[5]) params.providerId = queryKey[5]
      return getProviderRates(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    // enabled: !jackpotStatus,
    onSuccess: (res) => {
      setIsInitialValues(false);
      if (res?.providerRateDetail?.count === 0) {
        navigate(`${AdminRoutes.CreateProvidersRateMatrix.split(":").shift()}${providerId}`)
      }
    },
    onError: (error) => {
      errorHandler(error);
      navigate(AdminRoutes.DashboardCasinoProviders);
    },
  });

  const { mutate: updateRateMatrix, isLoading: updateLoading } =
    useUpdateProviderRateMatrixMutation({
      onSuccess: () => {
        toast("Provider Rate Matrix Updated Successfully", "success");
        queryClient.invalidateQueries(["matrixDetails"]);
      },
      onError: (error) => {
        errorHandler(error);
      },
    });

  const handleEditProviderRateSubmit = (formValues) => {
    console.log("formData edit ::", formValues);

    const body = {
      aggregatorId: Number(formValues.aggregatorId),
      providerId: Number(formValues.providerId),
      rateEntries: formValues.rateEntries.map(entry => ({
        ggrMinimum: Number(entry.ggrMinimum),
        ggrMaximum: entry.ggrMaximum !== null ? Number(entry.ggrMaximum) : null,
        rate: Number(entry.rate)
      }))
    };
    updateRateMatrix(body);
  };

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
    onSuccess: () => {
      toast("Rate Matrix Created Successfully", "success");
      queryClient.invalidateQueries(["matrixDetails"]);

      // navigate(AdminRoutes.DashboardCasinoProviders, {
      //   state: { openMatrixOnce: true }
      // });
    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Actions'

  const totalPages = Math.ceil(matrixDetails?.providerRateDetail?.count / limit)

  const handleDelete = (id) => {
    
    setRateId(id)
    setDeleteModalShow(true)
  }

  const handleDeleteYes = () => {
    deleteProviderRate({
      providerId: rateId,
    })
  }

  const { mutate: deleteProviderRate, isLoading: deleteLoading } = useDeleteProviderRateMatrixMutation({
    onSuccess: ({ data }) => {
      if (data.message) toast(data.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['matrixDetails'] })
      // queryClient.invalidateQueries({ queryKey: ['currentJackpot'] })
      setDeleteModalShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })


  return {
    handleEditProviderRateSubmit,
    handleCreateSubmit,
    selectedId,
    setSelectedId,
    matrixDetails,
    isInitialValues,
    setIsInitialValues,
    updateLoading,
    loading,
    setOrderBy,
    selected,
    over,
    setOver,
    sort,
    setSort,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    // loadinggg,
    handleDelete,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    deleteLoading,
  };
};

export default useEditProviderRate;
