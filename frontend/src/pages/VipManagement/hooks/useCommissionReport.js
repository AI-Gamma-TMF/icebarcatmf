import { useEffect, useState } from "react";
import {
  getVipManagersCommissionReport,
  getVipManagersList,
} from "../../../utils/apiCalls";
import { getItem } from "../../../utils/storageUtils";
import { useQuery } from "@tanstack/react-query";
import { convertTimeZone, convertToUtc } from "../../../utils/helper";

const useCommissionReport = () => {
  const timezone = getItem("timezone");
  const [managedBySearch, setManagedBySearch] = useState("all");
  const [dateError, setDateError] = useState("");
  const [startDate, setStartDate] = useState(
    convertTimeZone(new Date(), timezone)
  );
  const [endDate, setEndDate] = useState(convertTimeZone(new Date(), timezone));
  const [vipStatus, setVipStatus] = useState();

  useEffect(() => {
    setStartDate(convertTimeZone(new Date(), timezone));
    setEndDate(convertTimeZone(new Date(), timezone));
  }, [timezone]);

  const { data: vipManagersList, isLoadingManagers } = useQuery({
    queryKey: ["vipManagersListCommission"],
    queryFn: () => {
      const params = {};
      return getVipManagersList(params);
    },
    select: (res) => res?.data?.adminDetails?.rows,
    refetchOnWindowFocus: false,
    retry: false,
  });
  
  const { data: VipcommissionReport, isLoading } = useQuery({
    queryKey: [
      "VipcommissionReport",
      timezone,
      managedBySearch,
      vipStatus,
      convertToUtc(startDate),
      convertToUtc(endDate),
    ],
    queryFn: ({ queryKey }) => {
      const params = { timezone };
      if (queryKey[2]){
        if(queryKey[2] === 'all'){
          const managerArr = vipManagersList?.map((manager)=>manager?.adminUserId) || [];
          params.managerAdminId = JSON.stringify(managerArr);
        }
        else{
          params.managerAdminId = queryKey[2];
        }
      }
      if(queryKey[3]) params.vipStatusSearch = queryKey[3];
      if (queryKey[4]) params.startDate = queryKey[4];
      if (queryKey[5]) params.endDate = queryKey[5];
      return getVipManagersCommissionReport(params);
    },
    select: (res) => res?.data?.data,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !isLoadingManagers
  });

  
  return {
    VipcommissionReport,
    isLoading,
    vipManagersList,
    isLoadingManagers,
    managedBySearch,
    setManagedBySearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setVipStatus,
    dateError, setDateError
  };
};

export default useCommissionReport;
