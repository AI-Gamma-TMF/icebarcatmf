import { useQuery } from '@tanstack/react-query'
import {
  getPackagesListingRequest,
  getUserDocumentsRequest,
  getStateListing,
  getCityListing,
  getPlayerResponsible,
  getPlayerBankRequest,
  getPlayerCasinoRequest,
  getAuditLogs,
  generate2FA,
  getGamesIdsRequest,
  getPackageUserFilter,
  getUserBanReasonRequest,
  // getAllowedStateListing,
  getUserBanStatusRequest,
  getGamesPayment,
  getPackagesEditData,
} from '../../../utils/apiCalls'
import {
  GET_PACKAGES_LISTING,
  GET_USER_DOCUMENT,
  GET_STATE_LISTING,
  GET_CITY_LISTING,
  GET_PLAYER_RESPONSIBLE,
  GET_PLAYER_BANK_DETAILS,
  GET_PLAYER_CASINO_DETAILS,
  GET_PLAYER_ACTIVITY_DETAILS,
  GET_2FA_ACTIVITY_DETAILS,
  GET_GAMES_IDS_LISTING,
  // GET_ALLOWED_STATE_LISTING
} from '../../queryKeys'

// get User Documents custom query hook
const getUserDocument = (params) => {
  return getUserDocumentsRequest(params)
}

export const useGetUserDocumentsQuery = ({ userId ,enabled}) => {
  return useQuery({
    queryKey: [GET_USER_DOCUMENT, userId],
    queryFn: () => {
      return getUserDocument({ userId })
    },
    enabled,
    refetchOnWindowFocus: false,
  })
}

// get Packages Listing custom query hook
const getPackagesListing = (params) => {
  return getPackagesListingRequest(params)
}

export const useGetUserBanReasonQuery = ({ params, enabled, successToggler, errorToggler }) => {
  return useQuery({
    queryKey: [GET_PACKAGES_LISTING, ...Object.values(params)],
    queryFn: () => {
      return getUserBanReasonRequest(params)
    },
    enabled,
    select: (data) => data?.data || {},
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      successToggler && successToggler(data)
    },
    onError: (error) => {
      errorToggler && errorToggler(error)
    }
  })
}

export const useGetUserBanStatusQuery = ({ params, enabled, successToggler, errorToggler }) => {
  return useQuery({
    queryKey: [GET_PACKAGES_LISTING, ...Object.values(params)],
    queryFn: () => {
      return getUserBanStatusRequest(params)
    },
    enabled,
    select: (data) => data?.data?.data || {},
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      successToggler && successToggler(data)
    },
    onError: (error) => {
      errorToggler && errorToggler(error)
    }
  })
}

export const useGetUserBanReasonDescriptionQuery = ({ params, enabled, successToggler, errorToggler }) => {
  return useQuery({
    queryKey: [GET_PACKAGES_LISTING, ...Object.values(params)],
    queryFn: () => {
      return getUserBanReasonRequest(params)
    },
    enabled,
    select: (data) => data?.data || {},
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      successToggler && successToggler(data)
    },
    onError: (error) => {
      errorToggler && errorToggler(error)
    }    
  })
}

export const useGetPackagesListingQuery = ({ params, enabled, getSinglePackageSuccessToggler }) => {
  return useQuery({
    queryKey: [GET_PACKAGES_LISTING, ...Object.values(params)],
    queryFn: () => {
      return getPackagesListing(params)
    },
    enabled: enabled,
    select: (data) => data?.data?.packageList || {},
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      getSinglePackageSuccessToggler && getSinglePackageSuccessToggler(data?.rows?.[0] || {});
    }
  })
}
export const useGetPackagesSingleDataQuery = ({ params, enabled, getSinglePackageSuccessToggler }) => {
  return useQuery({
    queryKey: [GET_PACKAGES_LISTING, ...Object.values(params)],
    queryFn: () => {
      return getPackagesEditData(params)
    },
    enabled: enabled,
    select: (data) => data?.data?.packageList || {},
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      getSinglePackageSuccessToggler && getSinglePackageSuccessToggler(data || {});
    }
  })
}

export const useGetPackageUserFilterQuery = ({ params, enabled, getSinglePackageSuccessToggler, type, operator, value }) => {
  return useQuery({
    queryKey: [GET_PACKAGES_LISTING, ...Object.values(params), type, operator, value],
    queryFn: () => {
      return getPackageUserFilter(params)
    },
    enabled,
    select: (data) => data?.data || {},
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      getSinglePackageSuccessToggler && getSinglePackageSuccessToggler(data?.rows?.[0] || {});
    }
  })
}



export const useGetGamesIdsQuery = ({ params, enabled, successToggler }) => {
  return useQuery({
    queryKey: [GET_GAMES_IDS_LISTING],
    queryFn: () => {
      return getGamesIdsRequest(params)
    },
    enabled,
    select: (data) => {
      const gamesData = data?.data?.games || {}
          return gamesData },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      successToggler(data);
    }
  })
}

export const useGetGamesPaymentQuery = ({ params, enabled, successToggler }) => {
  return useQuery({
    queryKey: [GET_GAMES_IDS_LISTING],
    queryFn: () => {
      return getGamesPayment(params)
    },
    enabled,
    select: (data) => {
      const gamesData = data?.data?.games || {}
          return gamesData },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      successToggler(data);
    }
  })
}

export const useGetStateListQuery = ({ params, successToggler, errorToggler, enabled }) => {
  return useQuery({
    queryKey: [GET_STATE_LISTING],
    queryFn: () => {
      return getStateListing(params)
    },
    enabled,
    select: (data) => {
      return data?.data?.data || {}
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      successToggler && successToggler(data)
    },
    onError: (error) => {
      errorToggler && errorToggler(error)
    }
  })
}

export const useGetCityListQuery = ({ params, successToggler, errorToggler, enabled }) => {
  return useQuery({
    queryKey: [GET_CITY_LISTING, params.stateId],
    queryFn: () => {
      return getCityListing(params)
    },
    enabled,
    select: (data) => {
      return data?.data?.data || {}
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      successToggler && successToggler(data)
    },
    onError: (error) => {
      errorToggler && errorToggler(error)
    }
  })
}

export const useGetPlayerResponsibleQuery = ({ params, successToggler, errorToggler, enabled }) => {
  return useQuery({
    queryKey: [GET_PLAYER_RESPONSIBLE, params.userId],
    queryFn: () => {
      return getPlayerResponsible(params)
    },
    enabled,
    select: (data) => {
      return data?.data || {}
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      successToggler && successToggler(data)
    },
    onError: (error) => {
      console.log('error', error)
      errorToggler && errorToggler(error)
    }
  })
}

export const useGetPlayerBankQuery = ({ params, successToggler }) => {
  return useQuery({
    queryKey: [GET_PLAYER_BANK_DETAILS],
    queryFn: () => {
      return getPlayerBankRequest(params)
    },
    select: (data) => {
      return data?.data?.bankDetails || {}
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      successToggler && successToggler(data)
    }
  })
}

export const useGetPlayerCasinoQuery = ({ params, successToggler }) => {
  return useQuery({
    queryKey: [GET_PLAYER_CASINO_DETAILS],
    queryFn: () => {
      return getPlayerCasinoRequest(params)
    },
    select: (data) => {
      return data?.data?.userCasinoDetail || {}
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      successToggler && successToggler(data)
    }
  })
}

export const usePlayerActivityQuery = ({ params, enabled, successToggler }) => {
  return useQuery({
    queryKey: [GET_PLAYER_ACTIVITY_DETAILS, params.limit, params.pageNo],
    queryFn: () => {
      return getAuditLogs(params)
    },
    enabled,
    select: (data) => {
      return data?.data?.activityLogs || []
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      successToggler && successToggler(data)
    }
  })
}

export const useGenerate2FAQuery = ({ params, enabled, successToggler }) => {
  return useQuery({
    queryKey: [GET_2FA_ACTIVITY_DETAILS],
    queryFn: () => {
      return generate2FA(params)
    },
    enabled: !!enabled,
    select: (data) => {
      return data?.data?.result || []
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      successToggler && successToggler(data)
    }
  })
}

// export const useGetAllowedStateListQuery = ({ params, successToggler, errorToggler, enabled }) => {
//   return useQuery({
//     queryKey: [GET_ALLOWED_STATE_LISTING],
//     queryFn: () => {
//       return getAllowedStateListing(params)
//     },
//     enabled,
//     select: (data) => {
//       return data?.data?.data || {}
//     },
//     refetchOnMount: true,
//     refetchOnWindowFocus: false,
//     onSuccess: (data) => {
//       successToggler && successToggler(data)
//     },
//     onError: (error) => {
//       errorToggler && errorToggler(error)
//     }
//   });
// };