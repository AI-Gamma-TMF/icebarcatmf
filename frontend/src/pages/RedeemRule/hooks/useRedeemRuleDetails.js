import { useParams } from "react-router-dom";
import { getRedeemRuleDetail } from "../../../utils/apiCalls";
import { useQuery } from "@tanstack/react-query";

const useRedeemRuleDetail = () => {
  // const navigate = useNavigate();

  // const [over, setOver] = useState(false);
  // const [deleteModalShow, setDeleteModalShow] = useState(false);
  // const [templateid, setTemplateID] = useState("");
  // const queryClient = useQueryClient();
  const { ruleId } = useParams();

  //update
  const {
    isLoading: updateloading,
    data: editRedeemRuleData,
    refetch: editfetch,
  } = useQuery({
    queryKey: ["EditTemplateList", ruleId],
    queryFn: () => getRedeemRuleDetail({ ruleId }),
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    
  });
  const ediRuleData = editRedeemRuleData?.redeemRules?.rows[0]

  return {
   updateloading,ediRuleData,editfetch
  };
};

export default useRedeemRuleDetail;
