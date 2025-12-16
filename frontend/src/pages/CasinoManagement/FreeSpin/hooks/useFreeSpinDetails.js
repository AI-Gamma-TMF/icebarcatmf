import { useParams } from "react-router-dom";
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from 'use-debounce'
import {
  getFreeSpinList,
  getFreeSpinUser,
  getViewFreeSpin,
} from "../../../../utils/apiCalls";
const useFreeSpinDetails = ({ isEdit, isView }) => {
  // const navigate = useNavigate();
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);
    const [debouncedStatusSearch] = useDebounce(statusSearch, 500);
  const { freeSpinId } = useParams();

  //update
  const {
    isLoading: updateloading,
    data: editdata,
    refetch: editfetch,
  } = useQuery({
    queryKey: ["FreeSpin", freeSpinId],
    queryFn: () => getFreeSpinList({ freeSpinId }),
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    enabled: isEdit,
  });

  const {
    isLoading: viewLoading,
    data: viewData,
    refetch: viewRefetch,
  } = useQuery({
    queryKey: ["ViewFreeSpin", limit, page, freeSpinId],

    // queryFn: () => getViewFreeSpin({ freeSpinId }),
    queryFn: () => {
      // const params = {};
      return getViewFreeSpin(freeSpinId);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    enabled: isView,
  });
  const {
    isLoading: userLoading,
    data: userData,
    refetch: userRefetch,
  } = useQuery({
    queryKey: ["UserFreeSpin", limit, page, debouncedSearch,debouncedStatusSearch, freeSpinId],

    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.search = queryKey[3]
      if (queryKey[4]) params.statusSearch = queryKey[4]
      return getFreeSpinUser(params, { freeSpinId });
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    enabled: isView,
  });

  const totalPages = Math.ceil(userData?.count/ limit);

  return {
    updateloading,
    editdata,
    editfetch,
    viewData,
    viewLoading,
    viewRefetch,
    userData,
    userLoading,
    userRefetch,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    search,
    setSearch,
    statusSearch,setStatusSearch
  };
};

export default useFreeSpinDetails;
