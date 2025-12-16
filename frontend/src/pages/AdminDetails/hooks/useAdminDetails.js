import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getAdminDetails } from '../../../utils/apiCalls'

const useAdminDetails = () => {
  const [selectedTab, setSelectedTab] = useState('overview')
  const { adminId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { isLoading: loading, data: adminDetails } = useQuery({
    queryKey: ['staffDetail', adminId],
    queryFn: () => getAdminDetails({adminUserId: adminId}),
    select: (res) => res?.data?.adminDetails,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false
  })

  useEffect(() => {
    if (location?.state?.isTreeView) {
      setSelectedTab('usersTree')
    } else {
      setSelectedTab('overview')
    }
  }, [adminId])

  return {
    setSelectedTab,
    selectedTab,
    adminDetails,
    adminId,
    navigate,
    loading
  }
}

export default useAdminDetails
