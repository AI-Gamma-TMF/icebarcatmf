import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCrmPromoCode } from "../../../utils/apiCalls";
import { toast } from "../../../components/Toast";
import {
  errorHandler,
  useDeletePromoCodeMutation,
  useUpdatePromoCodeMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import { getDateDaysAgo } from "../../../utils/dateFormatter";

const usePromoCodeListing = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation("casino");
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState("promocodeId");
  const [sort, setSort] = useState("DESC");
  const [over, setOver] = useState(false);
  const [promocodeId, setPromocodeId] = useState();
  const [deletePromocode, setDeletePromocode] = useState();
  const [active, setActive] = useState();
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [promoName, setpromoName] = useState("")
  const [debouncedPromoName] = useDebounce(promoName, 500)
  const [debouncedSearch] = useDebounce(search, 500);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(''); 
  const [maxUsersAvailed, setMaxUsersAvailed] = useState(''); 
  const [status, setStatus] = useState('all'); 
  const [debouncedDiscountPercentage] = useDebounce(discountPercentage, 500)
  const [debouncedMaxUsersAvailed] = useDebounce(maxUsersAvailed, 500)

  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(10),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const { data: promoCodeList, isLoading: loading } = useQuery({
    queryKey: [
      "promoCodeList",
      limit,
      page,
      orderBy,
      sort,
      debouncedSearch,
      selectedType,
      debouncedPromoName,
      debouncedDiscountPercentage,
      debouncedMaxUsersAvailed,
      status
    ],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.orderBy = queryKey[3];
      if (queryKey[4]) params.sort = queryKey[4];
      if (queryKey[5]) params.promocodeSearch = queryKey[5];
      if (queryKey[6]) params.promotionType = queryKey[6];
      if (queryKey[7]) params.name = queryKey[7];
      if (queryKey[8]) params.discountPercentage = queryKey[8]
      if (queryKey[9]) params.maxUsersAvailed = queryKey[9]
      if (queryKey[10]) params.status = queryKey[10]

      return getCrmPromoCode(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });

  const selected = (h) => orderBy === h.value && h.labelKey !== "Action";

  const totalPages = Math.ceil(promoCodeList?.promocodeDetail?.count / limit);

  const handleShow = (id, active) => {
    setPromocodeId(id);
    setActive(!active);
    setShow(true);
  };
  const handleDelete = (id) => {
    setDeletePromocode(id);
    setDeleteModalShow(true);
  };
  const { mutate: updateStatus, isLoading: updateloading } =
    useUpdatePromoCodeMutation({
      onSuccess: ({ data }) => {
        if (data.message) toast(data.message, "success");
        queryClient.invalidateQueries({ queryKey: ["promoCodeList"] });
        setShow(false);
      },
      onError: (error) => {
        errorHandler(error);
      },
    });

  const handleYes = () => {
    updateStatus({
      promocodeId: promocodeId,
      isActive: active,
    });
  };
  const { mutate: deletePromoCode, isLoading: deleteLoading } =
    useDeletePromoCodeMutation({
      onSuccess: ({ data }) => {
        if (data.message) toast(data.message, "success");
        queryClient.invalidateQueries({ queryKey: ["promoCodeList"] });
        const updatedList = queryClient.getQueryData([ "promoCodeList",
          limit,
          page,
          orderBy,
          sort,
          debouncedSearch,
          selectedType,
          debouncedPromoName,
          debouncedDiscountPercentage,
          debouncedMaxUsersAvailed,
          status]);
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.promocodeDetail?.rows) && updatedList?.data?.promocodeDetail?.rows.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
        setDeleteModalShow(false);
      },
      onError: (error) => {
        errorHandler(error);
      },
    });
  const handleDeleteYes = () => {
    deletePromoCode({
      promocode: deletePromocode,
    });
  };
  const handleClose = () => setShowModal(false);

  return {
    t,
    limit,
    page,
    loading,
    promoCodeList,
    show,
    setLimit,
    setPage,
    setShow,
    totalPages,
    handleShow,
    handleYes,
    showModal,
    type,
    handleClose,
    selectedCategory,
    setSelectedCategory,
    active,
    navigate,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    setOrderBy,
    selected,
    sort,
    setSort,
    over,
    setOver,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    selectedCurrency,
    setSelectedCurrency,
    state,
    setState,
    setType,
    handleDelete,
    deleteLoading,
    updateloading,
    selectedType,
    setSelectedType,
    promoName,
    setpromoName,
    discountPercentage,
    setDiscountPercentage,
    maxUsersAvailed,
    setMaxUsersAvailed,
    status,
    setStatus
  };
};

export default usePromoCodeListing;
