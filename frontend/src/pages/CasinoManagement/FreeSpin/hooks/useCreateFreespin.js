import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFreeSpinBetLimit,
  getFreeSpinEmailTemplate,
  getFreeSpinGames,
  getFreeSpinProvider,
  getFreeSpinUsers,
  getSubscriptionList,
} from "../../../../utils/apiCalls";
import {
  errorHandler,
  useCreateFreeSpinGrantMutation,
  useDeleteUserFreeSpinMutation,
  useUpdateFreeSpinGrantMutation,
  useUploadCsvFreeSpinMutation,
} from "../../../../reactQuery/hooks/customMutationHook";
import { toast } from "../../../../components/Toast";
import { useState } from "react";
import useFreeSpinListing from "./useFreeSpinListing";
import { AdminRoutes } from "../../../../routes";

const useCreateFreeSpin = ({ providerId, gameId, coinType,freeSpinType } = {}) => {
 
  const [importedFile, setImportedFile] = useState(null);
  const [importModalShow, setImportModalShow] = useState(false);
  const [showUserData, setShowUserData] = useState(false);
  const [viewCategory, setViewCategory] = useState("");
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { SpinRefetch } = useFreeSpinListing();

  const { data: freeSpinProviderList } = useQuery({
    queryKey: ["freeSpinProviderList"],
    queryFn: () => {
      return getFreeSpinProvider();
    },
    select: (res) => res?.data?.data,
    // refetchOnWindowFocus:false
  });

  const { data: betLimitList } = useQuery({
    queryKey: ["freeSpinBetLimitList", providerId, gameId, coinType],
    queryFn: ({queryKey}) => {
      const params = {
        masterCasinoProviderId: queryKey[1],
        masterCasinoGameId: queryKey[2],
        coinType: queryKey[3],
      };

      return getFreeSpinBetLimit(params);
    },
    select: (res) => res?.data?.totalBetAmountList,
   // refetchOnWindowFocus: false,
    enabled: !!providerId && !!gameId && !!coinType, 
  });

  const { data: freeSpinTemplateList, refetch: refetchFreeSpinTemplateList } = useQuery({
    queryKey: ["freeSpinTemplateList"],
    queryFn: ({ queryKey }) => {
      return getFreeSpinEmailTemplate({ templateType: "freeSpin" });
    },
    select: (res) => res?.data?.templateList,
    refetchOnWindowFocus: false,
    enabled:false
  });
    const { data: subscriptionList, refetch: refetchSubscriptionList } = useQuery({
    queryKey: ["subscriptionList"],
    queryFn: ({ queryKey }) => {
      return getSubscriptionList();
    },
    select: (res) => res?.data?.data?.rows,
    refetchOnWindowFocus: false,
   enabled: false 
  });
   
    


const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  refetch
} = useInfiniteQuery(
 
  ['freeSpinGameList', providerId],
  ({ pageParam = 1 }) =>
    getFreeSpinGames({
      masterCasinoProviderId: providerId,
      pageNo: pageParam,
      limit: 200
    }),
  {
    enabled: !!providerId,
    getNextPageParam: (lastPage, pages) => {
      const fetched = lastPage?.data?.data?.freeSpinGames?.length || 0
      return fetched === 10 ? pages.length + 1 : undefined
    },
    select: (data) => ({
      pages: data.pages.map((page) => page.data.data.freeSpinGames).flat()
    }),
    refetchOnWindowFocus: false
  }
)

const gameOptions =
  data?.pages?.map((game) => ({
    value: game.masterCasinoGameId,
    label: game.name
  })) || []
  
const handleScrollToBottom = () => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage()
  }
}


  const {
    data: freeSpinUsersList,
    isLoading: isFreeSpinUsersLoading,
    refetch: refetchFreeSpinUsersList,
  } = useQuery({
    queryKey: ["FreeSpinAppliedPlayerList"],
    queryFn: ({ queryKey }) => {
      return getFreeSpinUsers();
    },
    select: (res) => res?.data?.data,

    retry: false,
    enabled: false,
    cacheTime: 0,
  });

  const { mutate: uploadFreeSpinUserCSV, isLoading: uploadCSVLoading } =
    useUploadCsvFreeSpinMutation({
      onSuccess: ({ data }) => {
        toast(data.message, "success");
        refetchFreeSpinUsersList();
        setImportModalShow(false);
      },
      onError: (error) => {
        errorHandler(error);
        setImportModalShow(false);
      },
    });

  const { mutate: deleteFreeSpinUSers, isLoading: deleteUserLoading } =
    useDeleteUserFreeSpinMutation({
      onSuccess: ({ data }) => {
        if (data?.status) {
          toast(data?.message, "success");
          refetchFreeSpinUsersList();
        }
        setDeleteModalShow(false);
      },
      onError: (error) => {
        errorHandler(error);
        setDeleteModalShow(false);
      },
    });

  const handleImportChange = (e) => {
    const file = e.target.files[0];
    setImportedFile(e.target.files[0]);
    if (file) {
      setImportModalShow(true);
    }
    e.target.value = null;
  };

  const handleCSVSumbit = () => {
    let formData = new FormData();
    formData.append("file", importedFile);
    uploadFreeSpinUserCSV(formData);
    setImportModalShow(false);
  };

  const handleDeleteModal = (status) => {
    setViewCategory(status);
    setDeleteModalShow(true);
  };

  const handleDeleteYes = () => {
    if (!viewCategory) {
      toast("User Category is missing", { type: "error" });
      return;
    }
    deleteFreeSpinUSers({ deleteCategory: viewCategory });
  };
 const { mutate: createFreeSpinGrant, isLoading: createLoading } =
    useCreateFreeSpinGrantMutation({
      onSuccess: () => {
        toast("Free Spin Created Successfully", "success");

        navigate(AdminRoutes.GameFreeSpin);
        SpinRefetch();
      },
      onError: (errors) => {
        errorHandler(errors);
      },
    });

  const { mutate: updateFreeSpinGrant, isLoading: updateLoading } =
    useUpdateFreeSpinGrantMutation({
      onSuccess: () => {
        toast("Free Spin Updated Successfully", "success");
        
        navigate(AdminRoutes.GameFreeSpin);
        SpinRefetch();
      },
      onError: (errors) => {
        errorHandler(errors);
      },
    });

  return {
    freeSpinTemplateList,
    freeSpinProviderList,
    createFreeSpinGrant,createLoading,updateFreeSpinGrant,updateLoading,
    uploadFreeSpinUserCSV,
    uploadCSVLoading,
    handleCSVSumbit,
    handleImportChange,
    importModalShow,
    setImportModalShow,
    importedFile,
    showUserData,
    setShowUserData,
    viewCategory,
    setViewCategory,
    handleDeleteModal,
    setDeleteModalShow,
    deleteModalShow,
    handleDeleteYes,
    deleteUserLoading,
    freeSpinUsersList,
    isFreeSpinUsersLoading,
    navigate,
    refetchFreeSpinUsersList,betLimitList,gameOptions,handleScrollToBottom,isFetchingNextPage,refetchFreeSpinTemplateList, subscriptionList,refetchSubscriptionList
  };
};

export default useCreateFreeSpin;
