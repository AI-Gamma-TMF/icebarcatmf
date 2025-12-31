import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { getFreeSpinDashboard, getFreeSpinList } from "../../../../utils/apiCalls.js";
import { getItem } from "../../../../utils/storageUtils.js";
import { timeZones } from "../../../Dashboard/constants.js";
import { getFormattedTimeZoneOffset } from "../../../../utils/helper.js";
import { useDebounce } from "use-debounce";
import { useCancelFreeSpin } from "../../../../reactQuery/hooks/customMutationHook/index.js";
import { toast } from "../../../../components/Toast/index.jsx";

const useFreeSpinListing = () => {
const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
const [providerSearch,setProviderSearch] = useState("")
const [searchId, setSearchId] = useState("");
const [searchRound, setSearchRound] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const [debouncedProvier] = useDebounce(providerSearch,500)
  const [debouncedSearch] = useDebounce (search, 500);
    const [debouncedSearchId] = useDebounce (searchId, 500);
      const [debouncedSearchRound] = useDebounce (searchRound, 500);
    const [debouncedStatusSearch] = useDebounce(statusSearch, 500);
  const [statusShow, setStatusShow] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [orderBy, setOrderBy] = useState('freeSpinId')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)

  const timeZone = getItem("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();

  const {
    isLoading: listLoading,
    isFetching,
    data: FreeSpingList,
    refetch: SpinRefetch,
  } = useQuery({
    queryKey: ["FreeSpin", limit, page,debouncedSearch,debouncedStatusSearch,debouncedSearchId,debouncedSearchRound, orderBy, sort,debouncedProvier],
    queryFn: ({ queryKey }) => {
      const params = {
        pageNo: queryKey[2],
        limit: queryKey[1],
      };
       if (queryKey[3]) params.titleSearch = queryKey[3]
      if (queryKey[4]) params.status = queryKey[4]
         if (queryKey[5]) params.freeSpinIdSearch = queryKey[5]
            if (queryKey[6]) params.roundSearch = queryKey[6]
      if(queryKey[7]) params.orderBy = queryKey[7]
      if(queryKey[8]) params.sort = queryKey[8]
      if(queryKey[9]) params.providerSearch = queryKey[9]
      return getFreeSpinList(params);
    },
    select: (res) => res?.data?.data,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    staleTime: 15000,
  });
  const totalPages = Math.ceil(FreeSpingList?.count / limit);
 const {
    isLoading: dashboardLoading,
    data: dashboardData,
    refetch: dashboardRefetch,
  } = useQuery({
    queryKey: ["FreeSpinDashboard"],
    queryFn: () => {
     
      return getFreeSpinDashboard();
    },
    select: (res) => res?.data?.data?.recordSummary,
    refetchOnWindowFocus: false,
    
  });
 
  const { mutate: cancelFreeSpin, isLoading: cancelLoading } =
  useCancelFreeSpin({
    onSuccess: ({ data }) => {
     
     
      if (data?.success) {
             
        toast(data?.message, "success");
        SpinRefetch();
         setStatusShow(false);
        const updatedList = QueryClient.getQueryData([ "FreeSpin", limit, page,debouncedSearch,debouncedStatusSearch,debouncedSearchId,debouncedSearchRound]);
     
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.data?.rows) && updatedList?.data?.data?.rows.length === 1 && page > 1) {
  
          setPage((prev) => prev - 1);
        }
       
      }
    },
    onError: (error) => {
      setStatusShow(false);
    },
  });
const handleOnSubmit = async () => {
  cancelFreeSpin({ freeSpinId: itemToUpdate });
};

const selected = (h) => orderBy === h.value && h.labelKey !== "Action";


  return {
    FreeSpingList,
    listLoading,
    isFetching,
    timezoneOffset,
    totalPages,
    page,
    limit,
    setPage,SpinRefetch,setLimit,search,
    setSearch,
    statusSearch,setStatusSearch,searchRound, setSearchRound,searchId, setSearchId,dashboardData,
    statusShow, setStatusShow,
    itemToUpdate, setItemToUpdate,
    handleOnSubmit,
    cancelLoading,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    over,
    setOver,
    selected,providerSearch,setProviderSearch
  };
};

export default useFreeSpinListing;
