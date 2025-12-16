import { useNavigate, useParams } from "react-router-dom";
// import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "../../../components/Toast";
import { AdminRoutes } from "../../../routes";
import { errorHandler, useCreateEmailCenter, useUpdateEmailCenter } from "../../../reactQuery/hooks/customMutationHook";

const useCreateTemplate = () => {
  const navigate = useNavigate();
  const { emailTemplateId } = useParams();
  // const [limit, setLimit] = useState(15);
  // const [page, setPage] = useState(1);
  // const [search, setSearch] = useState("");
  // const [debouncedSearch] = useDebounce(search, 500);
  // const [status, setStatus] = useState("");
  // const [active, setActive] = useState("all");
  // const [statusShow, setStatusShow] = useState(false);
  // const [cms, setCms] = useState("");
  // const [orderBy, setOrderBy] = useState("cmsPageId");
  // const [sort, setSort] = useState("desc");
  // const [over, setOver] = useState(false);
  // const [deleteModalShow, setDeleteModalShow] = useState(false);
  // const [cmsId, setCmsId] = useState("");
  const queryClient = useQueryClient();


  const { mutate: createTemplate, isLoading: createloading } =
    useCreateEmailCenter({
      onSuccess: () => {
        toast("Template Created Successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["cmsList"] });
        navigate(AdminRoutes.EmailCenter);
      },
      onError: (errors) => {
    
          toast(errors.description, "error");
          errorHandler(errors);
      },
    });
    const { mutate: editTemplate, isLoading: editloading } =
    useUpdateEmailCenter({
      onSuccess: () => {
        toast("Template Created Successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["templatelist"] });
        queryClient.invalidateQueries({ queryKey: ["templateDetails", emailTemplateId] });
        navigate(AdminRoutes.EmailCenter);
      },
      onError: (errors) => {
    
          toast(errors.description, "error");
          errorHandler(errors);
      },
    });

    
  return {
   createTemplate,createloading,editTemplate,editloading
  };
};

export default useCreateTemplate;
