import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getBonusDetail } from '../../../utils/apiCalls'

const useBonusDetails = () => {
  const { bonusId } = useParams()
  const navigate = useNavigate()

  const { isInitialLoading: loading, data: bonusByPageData } = useQuery({
    queryKey: ['bonusId', bonusId ],
    queryFn: () => getBonusDetail({bonusId}),
    select: (res) => res?.data?.bonus,
    refetchOnWindowFocus: false,
  })

  return {
    bonusByPageData,
    loading,
    navigate
  }
}

export default useBonusDetails
