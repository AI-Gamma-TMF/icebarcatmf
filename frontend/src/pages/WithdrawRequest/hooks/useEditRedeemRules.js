import { useQuery } from '@tanstack/react-query'
import { getRedeemRuleDetail } from '../../../utils/apiCalls.js'
import { errorHandler, useUpdateRedeemRulesMutation } from '../../../reactQuery/hooks/customMutationHook/index.js'
import { toast } from '../../../components/Toast/index.jsx'
import { AdminRoutes } from '../../../routes.js'
import { useNavigate } from "react-router-dom";

const useEditRedeemRules = (ruleId) => {
  const navigate = useNavigate();

  const { data: redeemRuleDetail } = useQuery({
    queryKey: ['redeemRuleDetail', ruleId],
    queryFn: ({ queryKey }) => {
      const params = { ruleId: queryKey[1] };
      return getRedeemRuleDetail(params)
    },
    select: (res) => res?.data?.redeemRules?.rows[0],
    refetchOnWindowFocus: false
  })

  const { mutate: updateRedeemRules, isLoading: updateLoading } = useUpdateRedeemRulesMutation({
    onSuccess: () => {
      toast("Redeem Rules Updated Successfully", "success");
      navigate(AdminRoutes.RedeemReqRuleConfig)
    },
    onError: (error) => {
      errorHandler(error);
    },
  });

  const handleEditPromotionBonusSubmit = (formValues) => {
    const body = {
      ruleName: formValues.ruleName,
      ruleDescription: formValues.ruleDescription,
      isActive: formValues.isActive,
      comparisionOperator: formValues.comparisionOperator,
      value: formValues.value,
      conditionalOperator: formValues.conditionalOperator,
      ruleId: Number(ruleId)
    };
    updateRedeemRules(body);
  };

  return {
    redeemRuleDetail, handleEditPromotionBonusSubmit, updateLoading
  }
}

export default useEditRedeemRules
