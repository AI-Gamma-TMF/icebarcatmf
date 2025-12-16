import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getBlogDetail } from '../../../utils/apiCalls'

const useBlogDetails = () => {
  const { blogId } = useParams()
  const navigate = useNavigate()

  const { isInitialLoading: loading, data: blogByIdData } = useQuery({
    queryKey: ['blogDetail', blogId ],
    queryFn: () => getBlogDetail({blogPostId:blogId}),
    select: (res) => res?.data?.blogPostDetails?.rows[0],
    refetchOnWindowFocus: false,
  })




  return {
    blogByIdData,
    loading,
    navigate
  }
}

export default useBlogDetails
