import { useNavigate } from 'react-router-dom'
import { getLoginToken } from '../../utils/storageUtils'
import { AdminRoutes } from '../../routes'
import { useUserStore } from '../../store/store'
import { useQuery } from '@tanstack/react-query'
import { getAdminDetails } from '../../utils/apiCalls'
import { toast } from '../Toast'

const usePrivateRoute = () => {
  const {userDetails, permissions} = useUserStore((state) => state)
  const setUserDetails = useUserStore((state) => state.setUserDetails)
  const navigate = useNavigate()
  const {isInitialLoading: loading} = useQuery({
    queryKey: ['adminDetails'],
    queryFn: () => getAdminDetails({}),
    onSuccess: (res) => {
      setUserDetails(res?.data?.adminDetails)
    },
    onError: (error) => {
      if(error?.response?.data?.errors.length > 0) {
        const {errors} = error.response.data;
        errors.map((error) => {
          if(error?.description) toast(error?.description, 'error')
        })
      }
      navigate(AdminRoutes.AdminSignin)
    },
    refetchOnWindowFocus: false,
    enabled: (!!getLoginToken() && !userDetails),
  })

  return {
    userDetails,
    permissions,
    loading
  }
}

export default usePrivateRoute
