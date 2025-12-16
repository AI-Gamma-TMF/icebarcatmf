import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getVipUserQuestions } from "../../../utils/apiCalls";
import {
  errorHandler,
  useUpdateVipQuestionMutation,
} from "../../../reactQuery/hooks/customMutationHook";
import { AdminRoutes } from "../../../routes";
import { toast } from "../../../components/Toast";

const useEditQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: vipQuestionData, isLoading: loading } = useQuery({
    queryKey: ["questionId", questionId],
    queryFn: () => {
      const params = { questionnaireId: questionId };
      return getVipUserQuestions(params);
    },
    select: (res) => res?.data?.questions?.rows?.[0],
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { mutate: updateVipQuestion } =
    useUpdateVipQuestionMutation({
      onSuccess: (res) => {
		console.log(res);
        if (res?.data?.success) {
		console.log(res?.data?.message)
          toast(res?.data?.message, "success");
          queryClient.invalidateQueries({ queryKey: ["vipQuestionsList"] });
          navigate(AdminRoutes.VipDashboardQuestionForm);
        } else {
          toast(res?.data?.message, "error");
        }
      },
      onError: (error) => {
        errorHandler(error);
      },
    });

  const handleOnSaveEdit = (field) => {
    updateVipQuestion(field);
  };

  return { vipQuestionData, loading, navigate, handleOnSaveEdit };
};

export default useEditQuestion;
