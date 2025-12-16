// import { useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { toast } from '../../components/Toast'
// import { useQuery, useQueryClient } from '@tanstack/react-query'
// import { getRestrictedCountries, getUnrestrictedCountries } from '../../utils/apiCalls'
// import { useAddRestrictedCountries, useDeleteRestrictedCountries } from '../../reactQuery/hooks/customMutationHook'
// import { useTranslation } from 'react-i18next'

// const useProviderCountries = (game) => {
//   const { itemId } = useParams()
//   const { t } = useTranslation(['casino'])
//   const queryClient = useQueryClient()

//   const [selectedTab, setSelectedTab] = useState('restricted-countries')
//   const [restrictedCountriesLimit, setRestrictedCountriesLimit] = useState(15)
//   const [restrictedCountriesPage, setRestrictedCountriesPage] = useState(1)

//   const [unRestrictedCountriesLimit, setUnRestrictedCountriesLimit] = useState(15)
//   const [unRestrictedCountriesPage, setUnRestrictedCountriesPage] = useState(1)

//   const [selectedCountries, setSelectedCountries] = useState({ count: 0, rows: [] })
//   const [removedCountries, setRemovedCountries] = useState({ count: 0, rows: [] })

//   const { isLoading: loadingRestrictedCountries, data: restrictedCountries } = useQuery({
//     queryKey: ['restrictedCountries', restrictedCountriesLimit, restrictedCountriesPage],
//     queryFn: ({ queryKey }) => {
//       const params = {pageNo: queryKey[2], limit: queryKey[1]};
//       params.type = game ? 'games' : 'providers'
//       params.itemId = itemId
//       return getRestrictedCountries(params)
//     },
//     refetchOnWindowFocus: false,
//     select: (res) => res?.data?.restrictedCountries
//   })

//   const { isLoading: loadingUnrestrictedCountries, data: unRestrictedCountries } = useQuery({
//     queryKey: ['unRestrictedCountries', unRestrictedCountriesLimit, unRestrictedCountriesPage],
//     queryFn: ({ queryKey }) => {
//       const params = {pageNo: queryKey[2], limit: queryKey[1]};
//       params.type = game ? 'games' : 'providers'
//       params.itemId = itemId
//       return getUnrestrictedCountries(params)
//     },
//     refetchOnWindowFocus: false,
//     select: (res) => res?.data?.unrestrictedCountries
//   })

//   const restrictedCountriesTotalPages = Math.ceil(restrictedCountries?.count / restrictedCountriesLimit)
//   const unRestrictedCountriesTotalPages = Math.ceil(unRestrictedCountries?.count / unRestrictedCountriesLimit)

//   const addCountries = (country) => {
//     const countryExists = ({ ...selectedCountries }
//       .rows
//       .findIndex(g => g.countryId === country.countryId))

//     if (countryExists === -1) {
//       setSelectedCountries({ count: selectedCountries.count + 1, rows: [...selectedCountries.rows, country] })
//     } else {
//       toast(t('restrictedCountries.alreadyAddedToast'), 'error')
//     }
//   }

//   const removeCountries = (countryId) => {
//     const updatedCountriesRows = [...selectedCountries.rows].filter(g => g.countryId !== countryId)
//     setSelectedCountries({ count: selectedCountries.count - 1, rows: updatedCountriesRows })
//   }

//   const { mutate: addRestrictedCountriesMutation, isLoading: addRestrictedLoading } = useAddRestrictedCountries({onSuccess: () => {
//     toast(t('restrictedCountries.updateSuccessToast'), 'success')
//     queryClient.invalidateQueries({ queryKey: ['restrictedCountries'] })
//     queryClient.invalidateQueries({ queryKey: ['unRestrictedCountries'] })
//     setSelectedCountries({ count: 0, rows: [] })
//   }})
//   const addRestrictedCountries = () => {
//     const countries = [...selectedCountries.rows].map(g => g.countryId)
//     addRestrictedCountriesMutation({ type: game ? 'games' : 'providers', countryIds: countries, itemId: parseInt(itemId) })
//   }

//   const addDeleteCountries = (country) => {
//     const countryExists = ({ ...removedCountries }
//       .rows
//       .findIndex(g => g.countryId === country.countryId))

//     if (countryExists === -1) {
//       setRemovedCountries({ count: removedCountries.count + 1, rows: [...removedCountries.rows, country] })
//     } else {
//       toast(t('restrictedCountries.alreadyAddedToast'), 'error')
//     }
//   }

//   const removeDeleteCountries = (countryId) => {
//     const updatedCountriesRows = [...removedCountries.rows].filter(g => g.countryId !== countryId)
//     setRemovedCountries({ count: removedCountries.count - 1, rows: updatedCountriesRows })
//   }

//   const { mutate: removeRestrictedCountriesMutation, isLoading: deleteRestrictedLoading } = useDeleteRestrictedCountries({onSuccess: () => {
//     toast(t('restrictedCountries.updateSuccessToast'), 'success')
//     queryClient.invalidateQueries({ queryKey: ['restrictedCountries'] })
//     queryClient.invalidateQueries({ queryKey: ['unRestrictedCountries'] })
//     removeCountries({ count: 0, rows: [] })
//   }})
//   const removeRestrictedCountries = () => {
//     const countries = [...removedCountries.rows].map(g => g.countryId)
//     removeRestrictedCountriesMutation({ type: game ? 'games' : 'providers', countryIds: countries, itemId: parseInt(itemId) })
//   }

//   return {
//     selectedTab,
//     setSelectedTab,
//     loading: loadingRestrictedCountries || loadingUnrestrictedCountries ,
//     addRestrictedLoading,deleteRestrictedLoading,
//     restrictedCountries,
//     restrictedCountriesLimit,
//     restrictedCountriesPage,
//     restrictedCountriesTotalPages,
//     setRestrictedCountriesLimit,
//     setRestrictedCountriesPage,
//     unRestrictedCountries,
//     unRestrictedCountriesLimit,
//     unRestrictedCountriesPage,
//     unRestrictedCountriesTotalPages,
//     setUnRestrictedCountriesLimit,
//     setUnRestrictedCountriesPage,
//     addCountries,
//     selectedCountries,
//     removeCountries,
//     addRestrictedCountries,
//     addDeleteCountries,
//     removedCountries,
//     removeDeleteCountries,
//     removeRestrictedCountries,
//     t
//   }
// }

// export default useProviderCountries

// not in use 
