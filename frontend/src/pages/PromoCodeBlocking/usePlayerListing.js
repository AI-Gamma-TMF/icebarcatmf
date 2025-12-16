import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { fetchPromocodeBlocked } from "../../utils/apiCalls";
import { useTranslation } from "react-i18next";
import {
  errorHandler,
  useUpdatePromocodeBlockedPlayersMutation,
  useUploadCsvPromocodeBlockedMutation,
} from "../../reactQuery/hooks/customMutationHook";
import { toast } from "../../components/Toast";
import { initialSet } from "./constants";

const usePlayerListing = () => {
  const { t } = useTranslation(["Promocode Restricted Players"]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [kycOptions, setKycOptions] = useState("");
  const [orderBy, setOrderBy] = useState("userId");
  const [sort, setSort] = useState("asc");
  const [over, setOver] = useState(false);
  const [playerId, setPlayerId] = useState(0);
  const [playerStatusDetail, setPlayerStatusDetail] = useState();
  const [playerDetail, setPlayerDetail] = useState();
  const [status, setStatus] = useState();
  const [statusShow, setStatusShow] = useState(false);
  const [multiSelectPlayers, setMultiSelectPlayers] = useState([]);
  const [actionType, setActionType] = useState("");
  // State for "Select All"
  const [selectAll, setSelectAll] = useState(false);
  const [promocodeStatus, setPromocodeStatus] = useState('all');

  // State for Import CSV
  const [importedFile, setImportedFile] = useState(null);
  const [importModalShow, setImportModalShow] = useState(false);
  const [importAction, setImportAction] = useState(false);

  const [globalSearch, setGlobalSearch] = useState(initialSet);

  const { isLoading: loading, data: res } = useQuery({
    queryKey: [
      "promocodeBlockedPlayersList",
      limit,
      page,
      debouncedSearch,
      orderBy,
      sort,
      globalSearch,
      promocodeStatus   ],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.search = queryKey[3];
      if (queryKey[4]) params.orderBy = orderBy;
      if (queryKey[5]) params.sort = sort;
      if(queryKey[7]) params.promocodeStatus = queryKey[7]
      // if (globalSearch.idSearch) params.idSearch = globalSearch.idSearch;
      // if (globalSearch.emailSearch)
      //   params.emailSearch = globalSearch.emailSearch;
      // if (globalSearch.firstNameSearch)
      //   params.firstNameSearch = globalSearch.firstNameSearch;
      // if (globalSearch.lastNameSearch)
      //   params.lastNameSearch = globalSearch.lastNameSearch;
      // if (globalSearch.userNameSearch)
      //   params.userNameSearch = globalSearch.userNameSearch;

      if(globalSearch.unifiedSearch)
        params.unifiedSearch = globalSearch.unifiedSearch

      return fetchPromocodeBlocked(params);
    },
  });
  const playersData = res?.data?.blockedUsersData;

  const totalPages = Math.ceil(res?.data?.blockedUsersData?.count / limit);

  const getCsvDownloadUrl = () =>
    `${
      process.env.REACT_APP_API_URL
    }/api/v1/blockUsers?csvDownload=true&limit=${limit}&pageNo=${page}&promocodeStatus=${promocodeStatus}&unifiedSearch=${
      globalSearch?.unifiedSearch || ""
    }`;

    
  const selected = (h) => orderBy === h.value && h.labelKey !== "Action";

  const { mutate: updateStatus, isLoading: updateloading } =
    useUpdatePromocodeBlockedPlayersMutation({
      onSuccess: ({ data }) => {
        toast(data.message, "success");
        queryClient.invalidateQueries({
          queryKey: ["promocodeBlockedPlayersList"],
        });
        const updatedList = queryClient.getQueryData([ "promocodeBlockedPlayersList",
          limit,
          page,
          debouncedSearch,
          orderBy,
          sort,
          globalSearch,
          promocodeStatus ]);
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.blockedUsersData?.rows) && updatedList?.data?.blockedUsersData?.rows.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
        setStatusShow(false);
      },
      onError: (error) => {
        errorHandler(error);
      },
    });

  const handleStatusShow = (id, status, detail, player) => {
    setPlayerId(id);
    setStatus(status);
    setStatusShow(true);
    setPlayerStatusDetail(detail);
    setPlayerDetail(player);

    if (id && status === true) {
      setActionType(false);
    } else if (id && status === false) {
      setActionType(true);
    } else if (id && (status === null || status === undefined)) {
      setActionType(true);
    } else if (multiSelectPlayers.length > 0 && status === false) {
      setActionType(true);
    } else if (multiSelectPlayers.length > 0 && status === true) {
      setActionType(false);
    } else {
      toast("No Player Selected", "error");
    }
  };

  const handleYes = (_data) => {
    const findUser = (id) =>
      playersData.rows.find((user) => user.userId === id);

    const handleSinglePlayer = () => {
      const user = findUser(playerId);

      if (user) {
        if (!user.isAvailPromocodeBlocked && !actionType) {
          toast("Player already unblocked", "error");
        } else if (user.isAvailPromocodeBlocked && actionType) {
          toast("Player already blocked", "error");
        } else {
          updateStatus({
            userIds: [playerId],
            blockUser: actionType,
          });
        }
      } else {
        updateStatus({
          userIds: [playerId],
          blockUser: actionType,
        });
      }
    };

    const handleMultiplePlayers = () => {
      const getFilteredUsers = (shouldBeBlocked) =>
        multiSelectPlayers.filter((id) => {
          const user = findUser(id);
          return shouldBeBlocked
            ? !user?.isAvailPromocodeBlocked
            : user?.isAvailPromocodeBlocked;
        });

      if (selectAll && actionType) {
        const blockUsers = getFilteredUsers(true);
        if (blockUsers.length > 0) {
          updateStatus({ userIds: blockUsers, blockUser: actionType });
        } else {
          toast("Players already blocked", "error");
          setStatusShow(false);
        }
      } else if (selectAll && !actionType) {
        const unblockUsers = getFilteredUsers(false);
        if (unblockUsers.length > 0) {
          updateStatus({ userIds: unblockUsers, blockUser: actionType });
        } else {
          toast("Players already unblocked", "error");
          setStatusShow(false);
        }
      } else {
        const blockUsers = getFilteredUsers(!actionType);

        if (blockUsers.length > 0) {
          const message =
            blockUsers.length === 1
              ? `Player already ${actionType ? "blocked" : "unblocked"}`
              : `Players already ${actionType ? "blocked" : "unblocked"}`;

          toast(message, "error");
          setStatusShow(false);
        } else {
          updateStatus({ userIds: multiSelectPlayers, blockUser: actionType });
        }
      }
      setMultiSelectPlayers([]);
      setSelectAll(false);
    };

    if (playerId) {
      handleSinglePlayer();
    } else if (multiSelectPlayers.length > 0) {
      handleMultiplePlayers();
    } else {
      toast("No Player Selected", "error");
    }
  };

  // Import CSV
  const { mutate: uploadCSV, isLoading: uploadCSVLoading } =
    useUploadCsvPromocodeBlockedMutation({
      onSuccess: ({ data }) => {
        toast(data.message, "success");
        queryClient.invalidateQueries({
          queryKey: ["promocodeBlockedPlayersList"],
        });
        setImportModalShow(false);
      },
      onError: (error) => {
        errorHandler(error);
        setImportModalShow(false);
      },
    });

  const handleCSVSumbit = () => {
    const formData = new FormData();
    formData.append("file", importedFile);
    formData.append('blockUsers', importAction);
    uploadCSV(formData);
  };

  return {
    t,
    orderBy,
    selected,
    limit,
    setLimit,
    page,
    setPage,
    search,
    setSearch,
    playersData,
    totalPages,
    navigate,
    loading,
    kycOptions,
    setKycOptions,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver,
    handleStatusShow,
    playerStatusDetail,
    setStatusShow,
    statusShow,
    handleYes,
    status,
    globalSearch,
    setGlobalSearch,
    getCsvDownloadUrl,
    playerId,
    playerDetail,
    updateloading,
    multiSelectPlayers,
    setMultiSelectPlayers,
    selectAll,
    setSelectAll,
    importedFile,
    setImportedFile,
    uploadCSVLoading,
    importModalShow,
    setImportModalShow,
    importAction,
    setImportAction,
    handleCSVSumbit,
    promocodeStatus,
    setPromocodeStatus
  };
};

export default usePlayerListing;
