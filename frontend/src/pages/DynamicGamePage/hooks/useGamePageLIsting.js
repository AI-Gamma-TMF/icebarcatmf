import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { toast } from "../../../components/Toast";
import {
  errorHandler,
  useAddGameFaqMutation,
  useDeleteGameCard,
  useDeleteGameFaq,
  useDeleteGamePage,
  useUpdateGamePageStatusMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { getGamePageDetail } from "../../../utils/apiCalls";

const useGamePageListing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["blogs"]);
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [status, setStatus] = useState("");
  const [active, setActive] = useState("all");
  const [statusShow, setStatusShow] = useState(false);
  const [gamePage, setGamePage] = useState("");
  const [orderBy, setOrderBy] = useState("gamePageId");
  const [sort, setSort] = useState("desc");
  const [over, setOver] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [faQModalShow, setFaQModalShow] = useState(false);
  const [gamePageId, setGamePageId] = useState("");
  const [faqId, setFaqId] = useState("");
  const [gamePageCardId, setGamePageCardId] = useState("");
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isLoading: updateloading } =
    useUpdateGamePageStatusMutation({
      onSuccess: ({ data }) => {
        if (data.success) {
          if (data.message) toast(data.message, "success");
          queryClient.invalidateQueries({ queryKey: ["gamePageList"] });
          queryClient.invalidateQueries({
            queryKey: ["gamePageDetail", gamePage.blogPostId],
          });
          gamePageRefetch();
          const updatedList = queryClient.getQueryData([ "gamePageList", limit, page, debouncedSearch, active, orderBy, sort]);
          // If current page is now empty and not the first page, go back one
          if (Array.isArray(updatedList?.data?.GamePageDetails?.rows) && updatedList?.data?.GamePageDetails?.rows.length === 1 && page > 1) {
    
            setPage((prev) => prev - 1);
          }
        }
      },
      onError: (error) => {
        errorHandler(error);
      },
    });



  const { isLoading: loading, refetch: gamePageRefetch, data: gamePageData } = useQuery({
    queryKey: ["gamePageList", limit, page, debouncedSearch, active, orderBy, sort],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.search = queryKey[3];
      if (queryKey[4]) params.isActive = active;
      if (queryKey[5]) params.orderBy = orderBy;
      if (queryKey[6]) params.sort = sort;
      return getGamePageDetail(params);
    },
    select: (res) => res?.data?.GamePageDetails,
    refetchOnWindowFocus: false,
  });
  const totalPages = Math.ceil(gamePageData?.count / limit);


  const { mutate: deleteGamePage } = useDeleteGamePage({
    onSuccess: () => {
      toast(t("Game Page Deleted Successfuly"), "success");
      queryClient.invalidateQueries({ queryKey: ["gamePageList"] });
      const updatedList = queryClient.getQueryData([ "gamePageList", limit, page, debouncedSearch, active, orderBy, sort]);
      // If current page is now empty and not the first page, go back one
      if (Array.isArray(updatedList?.data?.GamePageDetails?.rows) && updatedList?.data?.GamePageDetails?.rows.length === 1 && page > 1) {

        setPage((prev) => prev - 1);
      }
      setDeleteModalShow(false);
    },
  });

  const { mutate: deleteFaq, isLoading: deleteFaqLoading } = useDeleteGameFaq({
    onSuccess: () => {
      toast(t("Faq Deleted Successfully"), "success");
      queryClient.invalidateQueries({ queryKey: ["gamePageId", gamePageId] });
      setDeleteModalShow(false);
    },
  });

  const { mutate: deleteGameCard, isLoading: deleteGameCardLoading } = useDeleteGameCard({
    onSuccess: () => {
      toast(t("Game Card Deleted Successfully"), "success");
      //refetchGameData();
      // queryClient.invalidateQueries({ queryKey: ["gamePageDetail",gamePageId] });
      setDeleteModalShow(false);
    },
  });


  // const {
  //   isLoading: isFaqLoading,
  //   refetch: faqRefetch,
  //   data: faqData,
  // } = useQuery({
  //   queryKey: ['faq', blogPostId],
  //   queryFn: ({ queryKey }) => getBlogFaq(queryKey[1]),
  //   select: (res) => res?.data?.blogPostDetails,
  //   enabled: !!blogPostId, // avoid querying until blogPostId is set
  //   refetchOnWindowFocus: false,
  // });




  const { mutate: addGameFaq, isLoading: isAddFaqLoading } = useAddGameFaqMutation({
    onSuccess: () => {
      toast(t("Faq Added Successfully"), "success");
      queryClient.invalidateQueries({ queryKey: ["gamePageList"] });
      setFaQModalShow(false);
    },
  });




  const selected = (h) => orderBy === h.value && h.labelKey !== "Actions";

  const handleStatusShow = (gamePage, status) => {
    setGamePage(gamePage);
    setStatus(!status);
    setStatusShow(true);
  };

  const handleYes = () => {
    const data = {
      gamePageId: gamePage?.gamePageId,
      isActive: status,
    };
    updateStatus(data);
    setStatusShow(false);
  };

  const handleDeleteModal = (id) => {
    setGamePageId(id);
    setDeleteModalShow(true);
  };


  const handleFaqDeleteModal = (faqId, gamePageId) => {
    setGamePageId(gamePageId)
    setFaqId(faqId);
    setDeleteModalShow(true);
  };

  const handleGameCardDelete = (gamePageCardId, gamePageId) => {
    setGamePageId(gamePageId)
    setGamePageCardId(gamePageCardId);
    setDeleteModalShow(true);
  };

  const handleFaQModal = (id) => {
    setGamePageId(id);
    setFaQModalShow(true);
  };


  const handleFaqDeleteYes = () => {
    console.log(gamePageId, faqId);
    deleteFaq({ gamePageId: +gamePageId, gamePageFaqId: +faqId })
  };

  const handleGameCardDeleteYes = () => {

    deleteGameCard({ gamePageCardId: +gamePageCardId })

  };


  const handleDeleteYes = () => {
    // deleteGameCard({ gamePageId: +gamePageId });
    deleteGamePage({ gamePageId: +gamePageId });

  };

  const handleAddFaq = (data) => {
    const payload = {
      gamePageId: gamePageId,
      faqs: data?.faqs
    }
    console.log(payload);
    addGameFaq(payload);
  };

  return {
    navigate,
    limit,
    page,
    search,
    setPage,
    setLimit,
    setSearch,
    setGamePageId,
    setGamePageCardId,
    gamePageId,
    gamePageData,
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
    deleteFaqLoading,
    updateloading,
    handleFaQModal,
    faQModalShow,
    setFaQModalShow,
    handleAddFaq,
    isAddFaqLoading,
    handleFaqDeleteModal,
    handleFaqDeleteYes,
    handleGameCardDelete,
    handleGameCardDeleteYes,
    deleteGameCardLoading,
    gamePageCardId
  };
};

export default useGamePageListing;
