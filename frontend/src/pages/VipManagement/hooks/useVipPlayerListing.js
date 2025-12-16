import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getVipLoyaltyTier, getVipManagedBy, getVipPlayerListing } from '../../../utils/apiCalls';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useUpdateUserVipStatus, useUpdateVipManager, useUpdateVipUserLoyaltyTier } from '../../../reactQuery/hooks/customMutationHook';
import { toast } from '../../../components/Toast';

const useVipPlayerListing = (activeTab, ratingMin, ratingMax, vipStatusSearch) => {
  const queryClient = useQueryClient();
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [orderBy, setOrderBy] = useState('userId');
  const [sort, setSort] = useState('desc');
  const [over, setOver] = useState(false);
  const [tierUpdateModal, setTierUpdateModal] = useState(false);
  const [vipStatusModal, setVipStatusModal] = useState(false);
  const [userTier, setUserTier] = useState('');
  const [userId, setUserId] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [vipStaus, setVipStatus] = useState('');
  const [vipStatusValue, setVipStatusValue] = useState('')
  const [manager, setManager] = useState('')
  const [ManagedByModal, setManagedByModal] = useState(false)
  const [managedBySearch, setManagedBySearch] = useState('');
const [importedFile, setImportedFile] = useState(null);
const [importModalShow, setImportModalShow] = useState(false);

  const {
    data: vipPlayerListing,
    isLoading,
    refetch: refetchPlayerList,
  } = useQuery({
    queryKey: ['vipPlayerListing', limit, page, orderBy, sort, debouncedSearch, ratingFilter, vipStaus, activeTab,managedBySearch],
    queryFn: ({ queryKey }) => {
      const params = { limit: queryKey[1], pageNo: queryKey[2], orderBy: queryKey[3], sort: queryKey[4] };
      if (queryKey[5]) params.unifiedSearch = queryKey[5];
      if (queryKey[6]) params.ratingSearch = queryKey[6];
      if(queryKey[9]) params.managedBySearch = queryKey[9]
      if (queryKey[8] === 'customerManagement' && queryKey[7]) {
        params.vipStatusSearch = queryKey[7];
      } else {
        if (vipStatusSearch) params.vipStatusSearch = vipStatusSearch;
      }
      if (ratingMin === 0 && ratingMax === 3) {
        (params.ratingMin = ratingMin), (params.ratingMax = ratingMax);
      }
      return getVipPlayerListing(params);
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,
  });

  const totalPages = Math.ceil(vipPlayerListing?.users?.count / limit);

  const { mutate: updateVipStatus, isLoading: isVipStatusUpdating } = useUpdateUserVipStatus({
    onSuccess: (res) => {
      toast(res?.data?.message, 'success');
      queryClient.invalidateQueries({
        queryKey: ['vipPlayerListing'],
      });
      setVipStatusModal(false)
    },
    onError: (err) => {
      const error = err?.response?.data?.errors?.[0];
      console.log(error);
      toast(error?.description, 'error');
      setVipStatusModal(false)
    },
  });

  const { mutate: updateLoyaltyTier, isLoading: isVipLoyaltyTierLoading } = useUpdateVipUserLoyaltyTier({
    onSuccess: (res) => {
      toast(res?.data?.message, 'success');
      queryClient.invalidateQueries({
        queryKey: ['vipLoyaltyTierUPdate'],
      });
      setTierUpdateModal(false);
      refetchPlayerList();
    },
    onError: (err) => {
      const error = err?.response?.data?.errors?.[0];
      console.log(error);
      toast(error?.description, 'error');
    },
  });

  const { data: vipLoyalTierData, isLoading: isVipLoyaltyTierDataLoading } = useQuery({
    queryKey: ['vipLoyalTierData'],
    queryFn: () => {
      return getVipLoyaltyTier();
    },
    select: (res) => res?.data,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {data: vipManagers, isLoading: isVipManagersLoading} = useQuery({
    queryKey:['vipManagers'],
    queryFn:()=>{
      return getVipManagedBy();
    },
    select: (res)=> res?.data?.adminDetails?.rows,
    refetchOnWindowFocus:false,
    retry:false,
  })

  const {mutate: updateVipManager, isLoading: isVipManagerUpdating} = useUpdateVipManager({
    onSuccess: (res) => {
      toast(res?.data?.message, 'success');
      queryClient.invalidateQueries({
        queryKey: ['vipUpdateManager'],
      });
      refetchPlayerList();
      setManagedByModal(false)
    },
    onError: (err) => {
      const error = err?.response?.data?.errors?.[0];
      console.log(error);
      toast(error?.description, 'error');
      setManagedByModal(false)
    },
  })

  const handleUpdateTier = (data) => {
    updateLoyaltyTier(data);
  };

  const handleUpdateVipStatus = () =>{
    const payload = {
        userId,
        vipStatus: vipStatusValue,
        comment: null,
      };
      updateVipStatus(payload);
  }

  const handleUpdateManager = () =>{
    const payload = {
      userId,
      managedByAdminId: manager
    }
    updateVipManager(payload)
  }

  const selected = (header) => orderBy === header?.value;

    const handleImportChange = (e) => {
          let file = e.target.files[0];
          setImportedFile(e.target.files[0]);
          if (file) {
            setImportModalShow(true);
          }
          e.target.value = null;
        };

  return {
    vipPlayerListing,
    isLoading,
    setLimit,
    setPage,
    page,
    setSearch,
    setOrderBy,
    orderBy,
    setSort,
    sort,
    totalPages,
    limit,
    updateVipStatus,
    isVipStatusUpdating,
    tierUpdateModal,
    setTierUpdateModal,
    updateLoyaltyTier,
    isVipLoyaltyTierLoading,
    vipLoyalTierData,
    isVipLoyaltyTierDataLoading,
    handleUpdateTier,
    userTier,
    setUserTier,
    userId,
    setUserId,
    search,
    ratingFilter,
    setRatingFilter,
    vipStaus,
    setVipStatus,
    selected,
    over,
    setOver,
    vipStatusModal, 
    setVipStatusModal,
    vipStatusValue,
    setVipStatusValue,
    handleUpdateVipStatus,
    vipManagers,
    updateVipManager,
    isVipManagersLoading,
    isVipManagerUpdating,
    manager, setManager,
    ManagedByModal, setManagedByModal,
    handleUpdateManager,
    managedBySearch, setManagedBySearch,
    handleImportChange,
    importedFile, setImportedFile,
    importModalShow, setImportModalShow,
    queryClient,
    refetchPlayerList,
  };
};

export default useVipPlayerListing;
