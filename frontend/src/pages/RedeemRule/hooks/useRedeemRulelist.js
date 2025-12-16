import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../../components/Toast";
import { AdminRoutes } from "../../../routes"
import {
  errorHandler,
  useDeleteRedeemRulesMutation,
  useUpdateRedeemRuleMutation,
  useUploadRedeemCsv,
} from "../../../reactQuery/hooks/customMutationHook";
import { getRedeemRuleDetail } from "../../../utils/apiCalls";

const useRedeemRulelist = () => {
  const navigate = useNavigate();

  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [ruleId, setRuleId] = useState("");
  const queryClient = useQueryClient();
  const [orderBy, setOrderBy] = useState('ruleId')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)

  const {
    isLoading: loading,
    data: redeemRuleList,
    refetch: fetch,
  } = useQuery({
    queryKey: ['RedeemRuleList', limit, page, orderBy, sort],
    queryFn: ({ queryKey }) => {
      const params = {
        pageNo: queryKey[2],
        limit: queryKey[1],
        orderBy: queryKey[3],
        sort: queryKey[4]
      };
      return getRedeemRuleDetail(params);
    },
    select: (res) => res?.data?.redeemRules,
    refetchOnWindowFocus: false,
  });
  const totalPages = Math.ceil(redeemRuleList?.count / limit);


  //delete email templates

  const { mutate: deleteRule, isLoading: deleteLoading } =
  useDeleteRedeemRulesMutation({
      onSuccess: () => {
        toast("Rule Deleted Successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["RuleList"] });
        setDeleteModalShow(false);
        fetch();
        const updatedList = queryClient.getQueryData(['RedeemRuleList', limit, page]);
          // If current page is now empty and not the first page, go back one
          if (Array.isArray(updatedList?.data?.redeemRules?.rows) && updatedList?.data?.redeemRules?.rows.length === 1 && page > 1) {
    
            setPage((prev) => prev - 1);
          }
      },
    });
  const handleDeleteModal = (id) => {
    setRuleId(id);
    setDeleteModalShow(true);
  };

  const handleDeleteYes = () => {
    deleteRule({ ruleId: ruleId });
  };
 
  //send mail template useUpdateRedeemRuleMutation

//   const { mutate: sendMail, isLoading: sendMailLoading } = useSendTestMail({
//     onSuccess: () => {
//       toast("Email Sent Successfully ", "success");
//       queryClient.invalidateQueries({ queryKey: ["cmsList"] });
//     },
//     onError: (errors) => {
//       toast("Error in Sending Test Mails", "error");
//       errorHandler(errors);
//     },
//   });
  //implement csv upload
  const [importedFile, setImportedFile] = useState(null);
  const [importModalShow, setImportModalShow] = useState(false);
  const [importAction, setImportAction] = useState(false);

  const { mutate: uploadCSV, isLoading: uploadCSVLoading } = useUploadRedeemCsv({
    onSuccess: ({ data }) => {
      toast(data.message, "success");
      queryClient.invalidateQueries({
        queryKey: ["PlayersList"],
      });
      setImportModalShow(false);
      navigate(AdminRoutes.RedeemRulelisting)
    },
    onError: (error) => {
      errorHandler(error);
      setImportModalShow(false);
    },
  });

//   const handleCSVSumbit = () => {
//     let formData = new FormData();
//     formData.append("file", importedFile);

//     uploadCSV(formData);
//   };

  const { mutate: editRedeemRule, isLoading: editloading } =
      useUpdateRedeemRuleMutation({
        onSuccess: () => {
          toast("Rule updated Successfully", "success");
  
          navigate(AdminRoutes.RedeemRulelisting);
        },
        onError: (errors) => {
          toast(errors.description, "error");
          errorHandler(errors);
        },
      });

      const selected = (h) => orderBy === h.value && h.labelKey !== "Actions";

  return {
    loading, redeemRuleList,limit,page ,handleDeleteModal,handleDeleteYes,setPage,setLimit,totalPages,deleteModalShow,setDeleteModalShow,deleteLoading,
    importedFile,editRedeemRule,editloading,
    setImportedFile,
    uploadCSVLoading,
    importModalShow,
    setImportModalShow,
    uploadCSV,
    importAction,
    setImportAction,
    selected,
    orderBy,
    sort,
    setSort,
    setOrderBy,
    over,
    setOver
  };
};

export default useRedeemRulelist;
