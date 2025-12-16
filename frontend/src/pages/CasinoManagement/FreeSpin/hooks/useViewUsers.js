import { useState } from "react";
import { getFreeSpinUserPreview } from "../../../../utils/apiCalls";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const useViewUsers = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const {viewCategory} = useParams()

  console.log(viewCategory)

  const { data: userData, isLoading } = useQuery({
    queryKey: ["FreeSpinUsersCategory", viewCategory],
    queryFn: () => getFreeSpinUserPreview({ viewCategory }),
    select: (res) => res?.data?.data,
  });

  const totalPages = Math.ceil(userData?.count / limit);

  return {
    page,
    setPage,
    limit,
    setLimit,
    userData,
    isLoading,
    totalPages,
    viewCategory
  };
};

export default useViewUsers;
