import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "../../../components/Toast";
import { AdminRoutes } from "../../../routes";
import {
  errorHandler,
  useCreateMaintenanceMode,
  useCreateRibbonMode,
  useDeleteMaintenanceMode,
  useDeleteRibbonMode,
  useEditMaintenanceMode,
  useUpdateStatusMaintenanceMode,
} from "../../../reactQuery/hooks/customMutationHook";
import { getMaintenanceMode, getRibbonData } from "../../../utils/apiCalls";
import { getItem } from "../../../utils/storageUtils";
import { timeZones } from "../../Dashboard/constants.js";
import { getFormattedTimeZoneOffset } from "../../../utils/helper.js";

const useMaintenanceModetlist = () => {
  const navigate = useNavigate();

  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [maintenanceId, setMaintenanceId] = useState();
  const[updateMaintenanceid, setUpdateMaintenanceid] = useState();
  const [active, setActive] = useState()
  const [show, setShow] = useState(false)

  const queryClient = useQueryClient();

  const timeZone = getItem ("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();

  const {
    isLoading: loading,
    data: MaintenanceModeList,
    refetch: fetch,
  } = useQuery({
    queryKey: ["MaintenanceMode", limit, page],
    queryFn: ({ queryKey }) => {
      const params = {
        pageNo: queryKey[2],
        limit: queryKey[1],
      };
      return getMaintenanceMode(params);
    },
    select: (res) => res?.data?.maintenanceModeDetails,
    refetchOnWindowFocus: false,
  });
  const totalPages = Math.ceil(MaintenanceModeList?.count / limit);
//get ribbon data 
const {
  isLoading: ribbonloading,
  data: ribbondata,
  refetch: ribbonfetch,
} = useQuery({
  queryKey: ["RibbonMode", limit, page],
  queryFn: ({ queryKey }) => {
    const params = {
      pageNo: queryKey[2],
      limit: queryKey[1],
    };
    return getRibbonData(params);
  },
  select: (res) => res?.data?.ribbonData,
  refetchOnWindowFocus: false,
  enabled:false
});
//   //create maintenance mode mode
  const { mutate: createMaintenanceMode, Loading: createloading } =
    useCreateMaintenanceMode({
      onSuccess: () => {
        toast("Maintenance Mode Created Successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["MaintenanceMode"] });
        navigate(AdminRoutes.MaintenanceMode);
      },
      onError: (errors) => {
        
        errorHandler(errors);
      },
    });
//create ribbon mode 
const { mutate: createRibbonMode, Loading: createRibbonloading } =
    useCreateRibbonMode({
      onSuccess: () => {
        toast("Ribbon Created Successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["MaintenanceMode"] });
       ribbonfetch()
      },
      onError: (errors) => {
        
        errorHandler(errors);
      },
    });
    //update maintenance mode
    const { mutate: updateMaintenanceMode, Loading: updateMaintenanceLoading } =
    useEditMaintenanceMode({
      onSuccess: () => {
        toast("Maintenance Mode Updated Successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["MaintenanceMode"] });
        navigate(AdminRoutes.MaintenanceMode);
      },
      onError: (errors) => {
        
        errorHandler(errors);
      },
    });
  //delete email templates

  const { mutate: deleteMaintenanceMode, isLoading: deleteLoading } =
    useDeleteMaintenanceMode({
      onSuccess: () => {
        toast("Maintenance Deleted Successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["MaintenanceMode"] });
        setDeleteModalShow(false);
        fetch();
      },
    });
  const handleDeleteModal = (id) => {
    setMaintenanceId(id);
    setDeleteModalShow(true);
  };

  const handleDeleteYes = () => {
    deleteMaintenanceMode({ maintenanceModeId: maintenanceId });
  };
  //delete ribbon mode 
  const { mutate: deleteRibbonMode, isLoading: deleteRibbonLoading } =
    useDeleteRibbonMode({
      onSuccess: () => {
        toast("Ribbon Deleted Successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["RibbonMode"] }); 
        ribbonfetch();
      },
    });
//update status of maintenance mode 
const handleShow = (id, active) => {
  setUpdateMaintenanceid(id)
  setActive(!active)
  setShow(true)
}

 const { mutate: updateStatus,isLoading:updateloading } = useUpdateStatusMaintenanceMode({
    onSuccess: ({ data }) => {
        if (data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['promotionList'] })

      setShow(false)
      fetch();
    }, onError: (error) => {
      errorHandler(error)
    }
  })
  const handleYes = () => {
    updateStatus({
      maintenanceModeId: updateMaintenanceid,
      isActive: active
    })
  }
  return {
    deleteRibbonMode,deleteRibbonLoading,createRibbonMode,createRibbonloading,ribbonfetch,ribbondata,ribbonloading,
    handleShow,handleYes,setShow,show,active,updateloading,
    MaintenanceModeList,
    loading,
    createMaintenanceMode,
    createloading,
    deleteMaintenanceMode,
    deleteLoading,
    timezoneOffset,
    limit,
    setLimit,
    page,
    setPage,
    setMaintenanceId,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    totalPages,updateMaintenanceMode,updateMaintenanceLoading
  };
};

export default useMaintenanceModetlist;
