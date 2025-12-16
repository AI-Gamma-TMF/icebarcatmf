import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { getPackageDetails, getPromoCodeHistory } from '../../../utils/apiCalls.js'
import { useParams } from "react-router-dom";
import useCheckPermission from '../../../utils/checkPermission.js'
import { getItem } from '../../../utils/storageUtils.js';

const useViewPromoCode = () => {
  const [limit, setLimit] = useState(15)
  const [packageLimit, setPackageLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [packagePage, setPackagePage] = useState(1)
  const [orderBy, _setOrderBy] = useState('')
  const [sort, _setSort] = useState('DESC')
  const { isHidden } = useCheckPermission();
  const { promocodeId } = useParams();
  const [userId,setUserId] = useState()
  const [transactionId,setTransactionId] = useState('')
  const [email,setEmail] = useState('')
  const [packageId, setPackageId] = useState('')
  const [debouncedPckageId] = useDebounce(packageId, 500);
  const [isFirstDeposit,setIsFirstDeposit] = useState(false)


  const [packageIdSearch, setPackageIdSearch] = useState('')
  const [debouncedPckageIdSearch] = useDebounce(packageIdSearch, 500);
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState('all')
  // const [packageId, setPackageId] = useState('')
  // const [debouncedPckageId] = useDebounce(packageId, 500);
  const [amount, setAmount] = useState('')
  const [gcCoin, setGcCoin] = useState('')
  const [scCoin, setScCoin] = useState('')
  const [debouncedGCAmount] = useDebounce(gcCoin, 500)
  const [debouncedSCAmount] = useDebounce(scCoin, 500)
  const [debouncedAmount] = useDebounce(amount, 500)

  const timeZone = getItem("timezone");

  const [isActive, setIsActive] = useState('all')

  const { data: promocodeHistory, isLoading: promoHistoryLoading } = useQuery({
    queryKey: ['promocodeHistory', limit, page, orderBy, sort, promocodeId,userId,transactionId,email,isFirstDeposit, debouncedPckageIdSearch, debouncedSearch, statusFilter ],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1], promocodeId: queryKey[5], packageId: queryKey[10],
        unifiedSearch: queryKey[11], isActive: queryKey[12] };
      if (queryKey[3]) params.limit = queryKey[3]
      if (queryKey[3]) params.page = queryKey[3]
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if (queryKey[5]) params.promocodeId = queryKey[5]
      if (queryKey[6]) params.userId = queryKey[6]
      if (queryKey[7]) params.transactionId = queryKey[7]
      if (queryKey[8]) params.email = queryKey[8]
      if (queryKey[10]) params.packageId = queryKey[10]
      if (queryKey[9]) params.isFirstDeposit = queryKey[9]
      if (queryKey[11]) params.unifiedSearch = queryKey[11]
      if (queryKey[12]) params.isActive = queryKey[12]

      return getPromoCodeHistory(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });  

  const getCsvDownloadUrl = () => {
    const url = `${process.env.REACT_APP_API_URL}/api/v1/promocode/applied-history?promocodeId=${promocodeId}&orderBy=orderId&sort=ASC&csvDownload=true&timezone=${timeZone}&packageId=${debouncedPckageIdSearch}&unifiedSearch=${debouncedSearch}&isActive=${statusFilter}`;
    return url;
};

  const { data: packageDetails, isLoading: packageLoading } = useQuery({
    queryKey: ['packageDetails', packageLimit, packagePage, orderBy, sort, promocodeId, debouncedPckageId, debouncedSCAmount, debouncedGCAmount, debouncedAmount, isActive],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1], promocodeId: queryKey[5] };
      if (queryKey[3]) params.limit = queryKey[3]
      if (queryKey[3]) params.page = queryKey[3]
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if (queryKey[5]) params.promocodeId = queryKey[5]
      if (queryKey[6]) params.packageId = queryKey[6]
      if (queryKey[7]) params.scCoin = queryKey[7]
      if (queryKey[8]) params.gcCoin = queryKey[8]
      if (queryKey[9]) params.amount = queryKey[9]
      if (queryKey[10]) params.isActive = queryKey[10]

      return getPackageDetails(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
  });

  const totalPages = Math.ceil(promocodeHistory?.appliedDetails?.count / limit);
  const totalPagesPackages = Math.ceil(packageDetails?.count / packageLimit);

  return {
    promocodeHistory,
    totalPages,
    totalPagesPackages,
    packageDetails,
    packageLoading,
    packagePage,
    setPackagePage,
    packageLimit,
    setPackageLimit,
    promoHistoryLoading,
    isHidden,
    page,
    setPage,
    limit,
    setLimit,
    userId,
    setUserId,
    transactionId,
    setTransactionId,
    email,
    setEmail,
    packageId,
    setPackageId,
    isFirstDeposit,
    setIsFirstDeposit,
    packageIdSearch,
    setPackageIdSearch,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    amount,
    setAmount,
    scCoin,
    setScCoin,
    gcCoin,
    setGcCoin,
    isActive,
    setIsActive,
    getCsvDownloadUrl
  }
}

export default useViewPromoCode