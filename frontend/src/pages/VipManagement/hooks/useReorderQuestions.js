import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVipUserQuestions } from '../../../utils/apiCalls'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '../../../components/Toast'
import { useTranslation } from 'react-i18next'
import { AdminRoutes } from '../../../routes'
import { useReorderQuestionMutation } from '../../../reactQuery/hooks/customMutationHook'

const useReorderQuestion = () => {
  const navigate = useNavigate()
  const [state, setState] = useState({ rows: [], count: 0 })
  const queryClient = useQueryClient()
  const { t } = useTranslation(['packages'])

  const { isLoading: fetchLoading } = useQuery({
    queryKey: ['vipQuestionsList'],
    onSuccess: (data) => setState(data),
    queryFn: () => {
        // const params = { }

        return getVipUserQuestions()
    },
    select: (res) => res?.data?.questions,
    refetchOnWindowFocus: false,
   
})

  const reorder = (packages, startIndex, endIndex) => {
    const result = Array.from(packages)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const rows = reorder(
      state.rows,
      result.source.index,
      result.destination.index
    )
    setState({ rows, count: rows.length })
  }

  const { mutate: reorderQuestions, isLoading: updateLoading } = useReorderQuestionMutation({
    onSuccess: () => {
      toast("Question Reordered Successfully!", 'success')
      queryClient.invalidateQueries({ queryKey: ['vipQuestionsList'] }); // This will refetch the packages
      navigate(AdminRoutes.VipDashboardQuestionForm)
    },
    onError: (error) => {
      console.error("Reordering failed:", error);
    },
  })

  const handleSave = () => {
    const order = state.rows.map(list => list.questionnaireId);
    reorderQuestions({ order });
  }
 
  return {
    t,
    loading: fetchLoading || updateLoading,
    state,
    onDragEnd,
    handleSave,
    navigate
  }
}

export default useReorderQuestion
