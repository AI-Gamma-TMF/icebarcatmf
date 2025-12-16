import { useParams } from "react-router-dom";
import {  getMaintenanceMode } from "../../../utils/apiCalls";
import { useQuery } from "@tanstack/react-query";

const useMaintenanceDetail = () => {
  // const navigate = useNavigate();

  // const [over, setOver] = useState(false);
  
  const { maintenanceModeId } = useParams();

  //update
  const {
    
    isLoading: updateloading,
    data:editdata,
    refetch: editfetch,
  } = useQuery({
    queryKey: ["MaintenanceMode", maintenanceModeId],
    queryFn: () => getMaintenanceMode({ maintenanceModeId }),
    select: (res) => res?.data
    ,
    refetchOnWindowFocus: false,
    
  });
 
 const data = editdata?.maintenanceModeDetails?.rows[0]
 
  return {
   updateloading,data,editfetch
  };
};

export default useMaintenanceDetail;

