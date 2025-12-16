import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllTierListParams} from '../../../utils/apiCalls'

const useTierDetails = () => {
  const { tierId } = useParams()
  const navigate = useNavigate()

  const { data: tournamentData, isLoading: loading } = useQuery({
    queryKey: ['tierId', tierId ],
    queryFn: () => {
      return getAllTierListParams({tierId})
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false
  })


  return {
    tournamentData,
    loading,
    navigate
  }
}

export default useTierDetails