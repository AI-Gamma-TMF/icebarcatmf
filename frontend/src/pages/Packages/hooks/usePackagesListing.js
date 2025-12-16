import { useEffect, useState } from "react";
import { useDebounce } from 'use-debounce'
// import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useDidMountEffect from "../../../utils/useDidMountEffect";
import { useGetPackagesListingQuery } from "../../../reactQuery/hooks/customQueryHook";
import { useTranslation } from "react-i18next";
import { errorHandler, useDeletePackages, useReusePackages } from "../../../reactQuery/hooks/customMutationHook";
import { toast } from "../../../components/Toast";

const usePackagesListing = () => {
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
  const [isActive, setIsActive] = useState('all');
  const [isVisibleInStore, setIsVisibleInStore] = useState("");
  const { t } = useTranslation(["packages"]);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [reuseModalShow, setReuseModalShow] = useState(false);
  const [subPackageExists, setSubPackageExists] = useState(false);
  const [packageId, setPackageId] = useState("");
  const [packageIdFilter, setPackageIdFilter] = useState("");
  const [debouncedPackageId] = useDebounce(packageIdFilter, 500)
  const [packageType, setPackageType] = useState('all')
  const [isSpecialPackage, setIsSpecialPackage] = useState(false);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [overwriteFormValues, setOverwriteFormValues] = useState(null);
  const [existingPackageData, setExistingPackageData] = useState();

  // const queryClient = useQueryClient();

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
      search,
      isActive,
      packageId: debouncedPackageId,
      packageType
    },
    enabled,
  });

  const totalPages = Math.ceil(data?.count / limit);

  useEffect(() => {
    setEnabled(true);
  }, []);

  const handleShow = (id, active) => {
    setActive(!active);
    setShow(true);
  };

  const handleYes = () => {
    setShow(false);
  };
  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== "Role" &&
    h.labelKey !== "Status" &&
    h.labelKey !== "Action" &&
    h.labelKey !== "Group";

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender) {
        if (page === 1) {
          fetchData();
        } else {
          setPage(1);
        }
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    !isInitialRender && fetchData();
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchData();
  }, [limit, orderBy, sort]);

  const { mutate: deletePackage,isLoading:deleteLoading } = useDeletePackages({
    onSuccess: ({ data }) => {
      if (data.success) {
        if (data.message) {
          toast(data.message, "success")
          fetchData()
          const updatedList = queryClient.getQueryData(['GET_PACKAGES_LISTING', limit,
            page,
            orderBy,
            sort,
            search,
            isActive,
            debouncedPackageId,
            packageType]);
          // If current page is now empty and not the first page, go back one
          if (Array.isArray(updatedList?.data?.packageList?.rows) && updatedList?.data?.packageList?.rows.length === 1 && page > 1) {
            setPage((prev) => prev - 1);
          }
        }
        
      }
      setDeleteModalShow(false);
    },
    onError: (error) => {
      errorHandler(error)
      setDeleteModalShow(false);
    },
  });

  const handleDeleteYes = () => {
    if (!packageId) {
      toast("Package ID is missing", { type: "error" });
      return;
    }
    deletePackage({ packageId: packageId });
  };

  const { mutate: reusePackage , isLoading: reuseLoading } = useReusePackages({
    onSuccess: ({ data }) => {
      if (data.success) {
        if (data.message) {
          toast(data.message, "success")
          fetchData()
        }
       setReuseModalShow(false);
      }else {
        setExistingPackageData(data)
        setShowOverwriteModal(true)
      }
    }, 
    onError: (error) => {
      errorHandler(error)
      setReuseModalShow(false);
    },
  });

  const handleReusePackageYes = (data)=>{
    if(!packageId){
      toast("Package ID is missing", { type: "error" });
      return;
    }
    data.append("packageId", packageId);
    reusePackage(data);
  }

  const handleDeleteModal = (id) => {
    setPackageId(id);
    setDeleteModalShow(true);
  };

  const handleReuseModal = (id)=>{
    setPackageId(id);
    const selected = data?.rows?.find((pkg) => pkg.packageId === id);
    setIsSpecialPackage(selected?.isSpecialPackage || false);
    setReuseModalShow(true);
  }

  return {
    loading,
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
    show,
    setShow,
    over,
    setOver,
    data,
    totalPages,
    handleShow,
    handleYes,
    selected,
    active,
    handleDeleteYes,
    handleReusePackageYes,
    deleteModalShow,
    setDeleteModalShow,
    handleDeleteModal,
    reuseModalShow,
    setReuseModalShow,
    handleReuseModal,
    setHot,
    setIsActive,
    setIsVisibleInStore,
    hot,
    isActive,
    isVisibleInStore,
    fetchData,
    t,
    deleteLoading,
    reuseLoading,
    subPackageExists, setSubPackageExists,
    packageIdFilter,
    setPackageIdFilter,
    packageType,
    setPackageType,
    isSpecialPackage,
    showOverwriteModal,
    setShowOverwriteModal,
    overwriteFormValues,
    setOverwriteFormValues,
    existingPackageData,
    setExistingPackageData
    };
};

export default usePackagesListing;
