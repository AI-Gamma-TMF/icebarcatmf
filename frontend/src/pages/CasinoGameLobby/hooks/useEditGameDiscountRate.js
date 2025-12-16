import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { toast } from "../../../components/Toast/index.jsx";
import {
  errorHandler,
  useCreateGameRateDiscountMutation,
  useDeleteGameRateDiscountMutation,
  useUpdateGameRateDiscountMutation,
} from "../../../reactQuery/hooks/customMutationHook/index.js";
import {
  getGameRateDiscount,
} from "../../../utils/apiCalls.js";
import { convertToUtc } from "../../../utils/helper.js";


const useEditGameDiscountRate = (categoryGameId) => {
  const [selectedId, setSelectedId] = useState([]);
  const [isInitialValues, setIsInitialValues] = useState(true);
  const queryClient = useQueryClient();

  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('startMonthDate')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [id, setId] = useState()

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const { data: gameDiscountRate, isLoading: loading } = useQuery({
    queryKey: ["gameDiscountRate", categoryGameId, page, limit, convertToUtc(startDate), convertToUtc(endDate), orderBy, sort],
    queryFn: ({ queryKey }) => {
      const params = { masterCasinoGameId: queryKey[1] };
      if (queryKey[2]) params.pageNo = queryKey[2]
      if (queryKey[3]) params.limit = queryKey[3]
      if (queryKey[4]) params.startMonthDate = queryKey[4];
      if (queryKey[5]) params.endMonthDate = queryKey[5];
      if (queryKey[6]) params.orderBy = queryKey[6];
      if (queryKey[7]) params.sort = queryKey[7];
      return getGameRateDiscount(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    onSuccess: (_res) => {
      setIsInitialValues(false);
    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  // console.log("gameDiscountRate", categoryGameId, gameDiscountRate);


  const { mutate: updateGameDiscountRate, isLoading: updateLoading } =
    useUpdateGameRateDiscountMutation({
      onSuccess: () => {
        toast("Game Discount Rate Updated Successfully", "success");
        queryClient.invalidateQueries(["gameDiscountRate"]);
      },
      onError: (error) => {
        errorHandler(error);
      },
    });

  const handleEditProviderRateSubmit = (formValues) => {
    // console.log("formData edit ::", formValues);

    const body = {
      discountPercentage: Number(formValues.discountPercentage),
      gameMonthlyDiscountId: Number(formValues.gameMonthlyDiscountId),
      masterCasinoGameId: Number(categoryGameId),
      startMonthDate: convertToUtc(formValues.startDate),
      endMonthDate: convertToUtc(formValues.endDate),
    };
    updateGameDiscountRate(body);
  };

  const handleCreateSubmit = (formValues) => {
    // console.log("formData create ::", formValues);

    const body = {
      discountPercentage: Number(formValues.discountPercentage),
      masterCasinoGameId: Number(categoryGameId),
      startMonthDate: convertToUtc(formValues.startDate),
      endMonthDate: convertToUtc(formValues.endDate),
    };

    createDiscountRates(body);
  };

  const { mutate: createDiscountRates, isLoading: createLoading } = useCreateGameRateDiscountMutation({
    onSuccess: () => {
      toast("Discount Rate Created Successfully", "success");
      queryClient.invalidateQueries(["gameDiscountRate"]);
    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Actions'

  const totalPages = Math.ceil(gameDiscountRate?.gameMonthlyDiscountDetail?.count / limit)

  const handleDelete = (id) => {
    setId(id)
    setDeleteModalShow(true)
  }

  const handleDeleteYes = () => {
    deleteDiscountRate({
      gameMonthlyDiscountId: id,
    })
  }

  const { mutate: deleteDiscountRate, isLoading: deleteLoading } = useDeleteGameRateDiscountMutation({
    onSuccess: ({ data }) => {
      if (data.message) toast(data.message, 'success')
      queryClient.invalidateQueries({ queryKey: ['gameDiscountRate'] })

      const updatedList = queryClient.getQueryData([
        'gameDiscountRate',
        categoryGameId, page, limit, startDate, endDate, orderBy, sort
      ]);

      // If current page is now empty and not the first page, go back one
      if (Array.isArray(updatedList?.data?.gameMonthlyDiscountDetail?.rows) && updatedList?.data?.gameMonthlyDiscountDetail?.rows.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
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
    gameDiscountRate,
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
    handleDelete,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    deleteLoading,
    createLoading,
    startDate,
    setStartDate,
    endDate,
    setEndDate

  };
};

export default useEditGameDiscountRate;
