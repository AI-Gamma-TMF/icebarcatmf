import { useEffect, useState } from "react";
// import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useDidMountEffect from "../../../utils/useDidMountEffect";
import { useGetPackagesListingQuery } from "../../../reactQuery/hooks/customQueryHook";
// import { useTranslation } from "react-i18next";
import { errorHandler, useRestorePackageMutation } from "../../../reactQuery/hooks/customMutationHook";
import { toast } from "../../../components/Toast";
import { useDebounce } from 'use-debounce'
const useUnarchive=()=> {

    const navigate = useNavigate();
    const [limit, setLimit] = useState(15);
    const [page, setPage] = useState(1);
    const [orderBy, setOrderBy] = useState("orderId");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("asc");
    const [over, setOver] = useState(false);
    const [active, setActive] = useState();
    const [enabled, setEnabled] = useState(false);
    const [show, setShow] = useState(false);
    const [hot, setHot] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isVisibleInStore, _setIsVisibleInStore] = useState("");
    // const { t } = useTranslation(["packages"]);
    // const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [packageId, setPackageId] = useState("");
    // const queryClient = useQueryClient();
    const [packageName, setPackageName] = useState('')
   
    const[debouncedPackageName]=useDebounce(packageName,500)
  


    const isInitialRender = useDidMountEffect();
  const {
    data,
    refetch: fetchData,
    isLoading: loading,
  } = useGetPackagesListingQuery({
    params: {
      limit,
      pageNo: page,
      orderBy,
      sort,
      hot,
      search:debouncedPackageName.trim(),
      isVisibleInStore,
      isArchive:true,
    },
    enabled,
  });

  const totalPages = Math.ceil(data?.count / limit);

  useEffect(() => {
    setEnabled(true);
  }, []);
  useEffect(() => {
    !isInitialRender && fetchData();
  }, [page]);
  useEffect(() => {
    setPage(1);
    fetchData();
  }, [limit, orderBy, sort]);
  const handleShow = (id, active) => {
    setActive(!active);
    setShow(true);
  };
  const { mutate: restorePackage,isLoading:restoreLoading } = useRestorePackageMutation({
    onSuccess: ({ data }) => {
      if (data.success) {
        if (data.message) {
          toast(data.message, "success")
          fetchData()
        }
        
      }
      setShow(false);
    },
    onError: (error) => {
      errorHandler(error)
      setShow(false);
    },
  });
  const handleYes = () => {
   
    if (!packageId) {
        toast("Package ID is missing", { type: "error" });
        return;
      }
      restorePackage({ packageId: packageId });
  };
  const handleRestoreModal = (id) => {
    setPackageId(id);
    setShow(true);
  };
  return {
    packageName, setPackageName,
    navigate,
    limit,
    setLimit,
    page,
    setPage,
    setOrderBy,
    sort,
    setSort,
    search,
    setSearch,
    over,
    setOver,
    data,
    totalPages,
    handleShow,
    
    active,
   loading,
    
    setHot,
    setIsActive,
    
    
    isActive,
    
    fetchData,

    handleYes,
    show,
    setShow,
    handleRestoreModal,
    restoreLoading

  }
}

export default  useUnarchive
