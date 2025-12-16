import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {  getEmailCenter, getEmailDyanamickey } from "../../../utils/apiCalls";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "../../../components/Toast";
import { AdminRoutes } from "../../../routes";
import {
  errorHandler,
  useDeleteEmailCenter,
  useSendTestMail,
  useUploadCsv,
} from "../../../reactQuery/hooks/customMutationHook";

const useTemplateListing = ({isListingPage,isCreatePage}) => {
  const navigate = useNavigate();

  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  // const [search, setSearch] = useState("");
  // const [debouncedSearch] = useDebounce(search, 500);
  // const [status, setStatus] = useState("");
  // const [active, setActive] = useState("all");
  // const [statusShow, setStatusShow] = useState(false);
  // const [cms, setCms] = useState("");
  // const [orderBy, setOrderBy] = useState("cmsPageId");
  // const [sort, setSort] = useState("desc");
  // const [over, setOver] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [templateid, setTemplateID] = useState("");
  const queryClient = useQueryClient();
  const { emailTemplateId } = useParams();
  const [templateType, setTemplateType] = useState(null);
  const {
    isLoading: loading,
    data: emailTemplatedata,
    refetch: fetch,
  } = useQuery({
    queryKey: ["templateList", limit, page],
    queryFn: ({ queryKey }) => {
      const params = {
        pageNo: queryKey[2],
        limit: queryKey[1],
        emailTemplateId,
      };
      return getEmailCenter(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    enabled:isListingPage
  });
  const dynamickeys = emailTemplatedata?.dynamicEmailValues;
  const templatelist = emailTemplatedata?.templateList;
  const totalPages = Math.ceil(templatelist?.count / limit);

  const {
    isLoading: keyLoading,
    data: keyData,
    refetch: KeyFetch,
  } = useQuery({
    queryKey: ["DyanmicKeyList",templateType ],
    queryFn: ({ queryKey }) => {
       const params = {
      
      };
        if (queryKey[1]) params.templateType = "freeSpin"
      return getEmailDyanamickey(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    enabled:isCreatePage
  });
  //delete email templates
  const { mutate: deletetemplate, isLoading: deleteLoading } =
    useDeleteEmailCenter({
      onSuccess: () => {
        toast("Tempalate Deleted Successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["templateList"] });
        const updatedList = queryClient.getQueryData([ "templateList", limit, page]);
   
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.templateList?.rows) && updatedList?.data?.templateList?.rows.length === 1 && page > 1) {
  
          setPage((prev) => prev - 1);
        }
        setDeleteModalShow(false);
        fetch();
      },
    });
  const handleDeleteModal = (id) => {
    setTemplateID(id);
    setDeleteModalShow(true);
  };

  const handleDeleteYes = () => {
    deletetemplate({ emailTemplateId: templateid });
  };

  //send mail template

  const { mutate: sendMail, isLoading: sendMailLoading } = useSendTestMail({
    onSuccess: () => {
      toast("Email Sent Successfully ", "success");
      queryClient.invalidateQueries({ queryKey: ["cmsList"] });
    },
    onError: (errors) => {
      toast("Error in Sending Test Mails", "error");
      errorHandler(errors);
    },
  });
  //implement csv upload
  const [importedFile, setImportedFile] = useState(null);
  const [importModalShow, setImportModalShow] = useState(false);
  const [importAction, setImportAction] = useState(false);

  const { mutate: uploadCSV, isLoading: uploadCSVLoading } = useUploadCsv({
    onSuccess: ({ data }) => {
      toast(data.message, "success");
      queryClient.invalidateQueries({
        queryKey: ["PlayersList"],
      });
      setImportModalShow(false);
      navigate(AdminRoutes.EmailCenter)
    },
    onError: (error) => {
      errorHandler(error);
      setImportModalShow(false);
    },
  });

  const handleCSVSumbit = () => {
    const formData = new FormData();
    formData.append("file", importedFile);

    uploadCSV(formData);
  };

  
  return {
    sendMail,
    setPage,
    setLimit,
    sendMailLoading,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    deleteLoading,
    handleDeleteModal,
   
    templatelist,
    totalPages,
    dynamickeys,
    loading,
    limit,
    page,
    importedFile,
    setImportedFile,
    uploadCSVLoading,
    importModalShow,
    setImportModalShow,
    handleCSVSumbit,
    importAction,
    setImportAction,
    uploadCSV,keyData,KeyFetch,keyLoading,templateType, setTemplateType
  };
};

export default useTemplateListing;
