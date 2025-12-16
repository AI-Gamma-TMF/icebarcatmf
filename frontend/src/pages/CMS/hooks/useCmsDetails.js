import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getCmsDetail } from '../../../utils/apiCalls'

const useCmsDetails = () => {
  const { cmsPageId } = useParams()
  const navigate = useNavigate()

  const { isInitialLoading: loading, data: cmsByPageIdData } = useQuery({
    queryKey: ['cmsDetail', cmsPageId ],
    queryFn: () => getCmsDetail({cmsPageId}),
    select: (res) => res?.data?.cmsDetails,
    refetchOnWindowFocus: false,
  })

  return {
    cmsByPageIdData,
    loading,
    navigate
  }
}

export default useCmsDetails
