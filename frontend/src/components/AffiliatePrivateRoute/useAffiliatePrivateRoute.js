import { useNavigate } from 'react-router-dom'
import { getLoginToken } from '../../utils/storageUtils'
import { AffiliateRoute } from '../../routes'
import { useUserStore } from '../../store/store'
import { useQuery } from '@tanstack/react-query'
import { getAffiliateDetails } from '../../utils/apiCalls'
import { toast } from '../Toast'

const useAffiliatePrivateRoute = () => {
  const {userDetails, permissions} = useUserStore((state) => state);

  const setUserDetails = useUserStore((state) => state.setUserDetails)
  const navigate = useNavigate()
  const affiliateUserId=localStorage.getItem("affiliateUserId")
  const {isInitialLoading: loading} = useQuery({
    queryKey: ['affiliateDetails'],
    queryFn: () => getAffiliateDetails({affiliateId: userDetails?.affiliateId? userDetails.affiliateId : parseInt(affiliateUserId)}),
    onSuccess: (res) => {
      setUserDetails(res?.data?.getAffiliateDetail)
    },
    onError: (error) => {
      if(error?.response?.data?.errors.length > 0) {
        const {errors} = error.response.data;
        errors.map((error) => {
          if(error?.description) toast(error?.description, 'error')
        })
      }
      navigate(AffiliateRoute.AffiliateSignIn)
    },
    enabled: (!!getLoginToken() && !userDetails),
  })

  return {
    userDetails,
    permissions,
    loading
  }
}

export default useAffiliatePrivateRoute
