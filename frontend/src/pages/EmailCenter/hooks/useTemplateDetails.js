import { useParams } from "react-router-dom";
import { getEmailCenter } from "../../../utils/apiCalls";
import { useQuery } from "@tanstack/react-query";

const useTemplateDetails = () => {
  // const navigate = useNavigate();

  // const [over, setOver] = useState(false);
  // const [deleteModalShow, setDeleteModalShow] = useState(false);
  // const [templateid, setTemplateID] = useState("");
  // const queryClient = useQueryClient();
  const { emailTemplateId } = useParams();

  //update
  const {
    isLoading: updateloading,
    data: editemailTemplatedata,
    refetch: editfetch,
  } = useQuery({
    queryKey: ["EditTemplateList", emailTemplateId],
    queryFn: () => getEmailCenter({ emailTemplateId }),
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    
  });
  const dynamickeys = editemailTemplatedata?.dynamicEmailValues;
  const templatelist = editemailTemplatedata?.templateList;

  return {
    updateloading,
    templatelist,
    dynamickeys,editfetch
  };
};

export default useTemplateDetails;
