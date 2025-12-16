import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRedeemWithdrawRequest } from "../../../utils/apiCalls";
import { useDebounce } from "use-debounce";

const useRedeemRequestDetails = (ruleId) => {
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [debouncedStatus] = useDebounce(statusSearch, 500);

  const {
    data: requestData,
    isLoading: loading,
    refetch: fetch,
  } = useQuery({
    queryKey: [
      "RuleList",
      limit,
      page,
      debouncedSearch,
      debouncedStatus,
      ruleId,
    ],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.email = queryKey[3];
      if (queryKey[4]) params.status = queryKey[4];
      if (queryKey[5]) params.ruleId = ruleId;

      return getRedeemWithdrawRequest(params);
    },
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.withdrawUserDetails,
  });

  const totalPages = Math.ceil(requestData?.count / limit);

  return {
    setLimit,
    setPage,
    totalPages,
    limit,
    page,
    loading,
    search,
    setSearch,
    fetch,
    statusSearch,
    setStatusSearch, requestData
  };
};

export default useRedeemRequestDetails;
