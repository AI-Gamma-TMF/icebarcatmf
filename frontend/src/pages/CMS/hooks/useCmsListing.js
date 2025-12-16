import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "../../../components/Toast";
import {
  errorHandler,
  useDeleteCms,
  useUpdateStatusMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { getAllCms } from "../../../utils/apiCalls";

const useCmsListing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["cms"]);
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [status, setStatus] = useState("");
  const [active, setActive] = useState("all");
  const [statusShow, setStatusShow] = useState(false);
  const [cms, setCms] = useState("");
  const [orderBy, setOrderBy] = useState("cmsPageId");
  const [sort, setSort] = useState("desc");
  const [over, setOver] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [cmsId, setCmsId] = useState("");
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isLoading: updateloading } =
    useUpdateStatusMutation({
      onSuccess: ({ data }) => {
        if (data.success) {
          if (data.message) toast(data.message, "success");
          queryClient.invalidateQueries({ queryKey: ["cmsList"] });
          queryClient.invalidateQueries({
            queryKey: ["cmsDetail", cms.cmsPageId],
          });
          const updatedList = queryClient.getQueryData([ "cmsList", limit, page, debouncedSearch, active, orderBy, sort]);
   
          // If current page is now empty and not the first page, go back one
          if (Array.isArray(updatedList?.data?.cmsPages?.rows) && updatedList?.data?.cmsPages?.rows.length === 1 && page > 1) {
    
            setPage((prev) => prev - 1);
          }
        }
      },
      onError: (error) => {
        errorHandler(error);
      },
    });

  const { isLoading: loading, data: cmsData } = useQuery({
    queryKey: ["cmsList", limit, page, debouncedSearch, active, orderBy, sort],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.search = queryKey[3];
      if (queryKey[4]) params.isActive = active;
      if (queryKey[5]) params.orderBy = orderBy;
      if (queryKey[6]) params.sort = sort;
      return getAllCms(params);
    },
    select: (res) => res?.data?.cmsPages,
    refetchOnWindowFocus: false,
  });
  const totalPages = Math.ceil(cmsData?.count / limit);

  const { mutate: deleteBonus, isLoading: deleteLoading } = useDeleteCms({
    onSuccess: () => {
      toast(t("deleteCmsSuccessToast"), "success");
      queryClient.invalidateQueries({ queryKey: ["cmsList"] });
      const updatedList = queryClient.getQueryData([ "cmsList", limit, page, debouncedSearch, active, orderBy, sort]);
   
      // If current page is now empty and not the first page, go back one
      if (Array.isArray(updatedList?.data?.cmsPages?.rows) && updatedList?.data?.cmsPages?.rows.length === 1 && page > 1) {

        setPage((prev) => prev - 1);
      }
      setDeleteModalShow(false);
    },
  });

  const selected = (h) => orderBy === h.value && h.labelKey !== "Action";

  const handleStatusShow = (cms, status) => {
    setCms(cms);
    setStatus(!status);
    setStatusShow(true);
  };

  const handleYes = () => {
    const data = {
      code: "CMS",
      cmsPageId: cms.cmsPageId,
      status: status,
    };
    updateStatus(data);
    setStatusShow(false);
  };

  const handleDeleteModal = (id) => {
    setCmsId(id);
    setDeleteModalShow(true);
  };

  const handleDeleteYes = () => {
    deleteBonus({ cmsPageId: +cmsId });
  };

  return {
    navigate,
    limit,
    page,
    search,
    setPage,
    setLimit,
    setSearch,
    cmsData,
    totalPages,
    loading,
    handleStatusShow,
    statusShow,
    setStatusShow,
    handleYes,
    status,
    active,
    setActive,
    t,
    over,
    setOver,
    selected,
    setOrderBy,
    sort,
    setSort,
    handleDeleteModal,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteYes,
    deleteLoading,
    updateloading,
  };
};

export default useCmsListing;
