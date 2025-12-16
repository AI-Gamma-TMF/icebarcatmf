import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "../../../components/Toast";
import {
  useUpdatePackageMutation,
  useDeleteFtpBonus, useUpdateFtpStatusMutation, useUpdateFtpBonusMutation, useCreateFtpBonusMutation,
  errorHandler
} from "../../../reactQuery/hooks/customMutationHook";
import { useGetPackagesSingleDataQuery } from "../../../reactQuery/hooks/customQueryHook";
const createOption = (label, isNew) => ({
  label: label,
  value: label,
  newOptions: isNew,
});
const useEditPackage = (onSuccess, onError) => {
  const [PackageId, setPackageId] = useState();
  const [packageFirstPurchaseId, setPackageFirstPurchaseId] = useState("");

  const [typeValue, setTypeValue] = useState(null);
  const [typeOptions, setTypesOptions] = useState(null);
  const [isSelectLoading, setIsSetLoading] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const { packageId } = useParams();
  const getSinglePackageSuccessToggler = (data) => {
    const newOption = createOption(data.packageType, true);
    setTypeValue(newOption);
  };

  const { data, refetch: fetchData } = useGetPackagesSingleDataQuery({
    params: {
      packageId,
      csvDownload: 'false'
    },
    enabled: !!packageId,
    getSinglePackageSuccessToggler,
  });

  useEffect(() => {
    if (packageId) {
      fetchData();
    }
  }, [packageId]);

  const handleCreateOption = (inputValue) => {
    setIsSetLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue, true);
      setIsSetLoading(false);
      setTypesOptions((prev) => [...prev, newOption]);
      setTypeValue(newOption);
    }, 1000);
  };

  const { mutate: updatePackage, isLoading: loading } =
    useUpdatePackageMutation({ onSuccess, onError });
  

  const editPackage = (body) => updatePackage(body);

  const { mutate: deleteftpBonuses, isFetching: deleteftploading, isRefetching: deleterefecting } =
    useDeleteFtpBonus({
      onSuccess: ({ data }) => {
        if (data.success) {
          if (data.message) {
            toast(data.message, "success");
            fetchData();
          }
        }
        setDeleteModalShow(false);
      },
      onError: (error) => {
        errorHandler(error);
        setDeleteModalShow(false);
      },
    });
  const handleDeleteYes = () => {
    if (!PackageId || !packageFirstPurchaseId) {
      toast("Package ID  or Package First Purchase Is is missing", {
        type: "error",
      });
      return;
    }
    deleteftpBonuses({
      packageId: PackageId,
      packageFirstPurchaseId: packageFirstPurchaseId,
    });
  };
  const handleDeleteModal = (id, ftpBonusId) => {
    setPackageId(id);
    setPackageFirstPurchaseId(ftpBonusId);
    setDeleteModalShow(true);
  };

  const [active, setActive] = useState("");
  const [show, setShow] = useState(false);

  const { mutate: updateStatus, isLoading: statusFtploading } =
    useUpdateFtpStatusMutation({
      onSuccess: ({ data }) => {
        if (data.message) {
          toast(data.message, "success");
          fetchData();
        }
        // queryClient.invalidateQueries({ queryKey: ['ftpBonusesStatus'] })
        setShow(false);
      },
      onError: (error) => {
        setShow(false);
        errorHandler(error);
      },
    });
  const { mutate: updateBonusMutation, isRefetching: updataFtpbonusloading } =
    useUpdateFtpBonusMutation({
      onSuccess: ({ data }) => {
        if (data.message) {
          toast(data.message, "success");
          fetchData();
        }
        //queryClient.invalidateQueries({ queryKey: ['ftpBonusesUpdate'] })

        setShow(false);
      },
      onError: (error) => {
        setShow(false);
        errorHandler(error);
      },
    });
  const updateBonus = (data) => {
    updateBonusMutation(data);
  };

  const handleShow = (id, ftpId, active) => {
    setPackageId(id);
    setPackageFirstPurchaseId(ftpId);
    setActive(!active);
    setShow(true);
  };
  const handleYes = () => {
    updateStatus({
      packageId: Number(packageId),
      packageFirstPurchaseId: packageFirstPurchaseId,
      isActive: active,
    });
  };

  //
  const { mutate: createFtpBonus, isLoading: createFtpBonusloading } =
    useCreateFtpBonusMutation({
      onSuccess: ({ data }) => {
        if (data.message) {
          toast(data.message, "success");
          fetchData();
        }
        //queryClient.invalidateQueries({ queryKey: ['ftpBonusesCreate'] })

        setShow(false);
      },
      onError: (error) => {
        setShow(false);
        errorHandler(error);
      },
    });
  const createftpBonus = (data) => {
    createFtpBonus(data);
  };
  return {
    handleShow,
    handleYes,
    show,
    setShow,
    active,
    packageData: data,
    editPackage,
    loading,
    packageId,
    typeOptions,
    setTypesOptions,
    typeValue,
    setTypeValue,
    isSelectLoading,
    handleCreateOption,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    updateBonus,
    createftpBonus,
    createFtpBonusloading,
    deleteftploading,
    statusFtploading,
    updataFtpbonusloading, deleterefecting
  };
};

export default useEditPackage;