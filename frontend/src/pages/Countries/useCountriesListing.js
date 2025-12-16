// import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { getCountries } from '../../utils/apiCalls'
// import { useQuery } from '@tanstack/react-query'
// import { useDebounce } from 'use-debounce'

// const useCountriesListing = () => {
//   const navigate = useNavigate()

//   const [limit, setLimit] = useState(15)
//   const [page, setPage] = useState(1)
//   const [name, setName] = useState('')
//   const [orderBy, setOrderBy] = useState('countryId')
//   const [sort, setSort] = useState('desc')
//   const [over, setOver] = useState(false)
//   const [search, setSearch] = useState('')
//   const [debouncedSearch] = useDebounce(search, 500)

//   const { data, isLoading: loading } = useQuery({
//     queryKey: ['countryList', limit, page, debouncedSearch, orderBy, sort],
//     queryFn: ({ queryKey }) => {
//       const params = {pageNo: queryKey[2], limit: queryKey[1]};
//       if (queryKey[3]) params.name = queryKey[3]
//       if (queryKey[4]) params.orderBy = queryKey[4]
//       if (queryKey[5]) params.sort = queryKey[5]
//       return getCountries(params)
//     },
//     select: (res) => res?.data?.countries,
//     refetchOnWindowFocus: false
//   })

//   const totalPages = Math.ceil(data?.count / limit)

//   const selected = (h) =>
//     orderBy === h.value &&  h.labelKey !== 'headers.action'


//   // useEffect(() => {
//   //   const delayDebounceFn = setTimeout(() => {
//   //     if (!isInitialRender) {
//   //       if (page === 1) {
//   //         dispatch(getCountriesStart({ limit, name, pageNo: page }))
//   //       } else {
//   //         setPage(1)
//   //       }
//   //     }
//   //   }, 1000)

//   //   return () => clearTimeout(delayDebounceFn)
//   // }, [name])

//   // useEffect(() => {
//   //   dispatch(getCountriesStart({ limit, name, pageNo: page }))
//   //   dispatch(resetRestrictedItemsStart())
//   // }, [limit, page])

//   return {
//     loading,
//     limit,
//     setLimit,
//     page,
//     setPage,
//     name,
//     setName,
//     totalPages,
//     navigate,
//     data,
//     selected,
//     setOrderBy,
//     sort,
//     setSort,
//     over,
//     setOver,
//     search,
//     setSearch
//   }
// }

// export default useCountriesListing

// not in use 