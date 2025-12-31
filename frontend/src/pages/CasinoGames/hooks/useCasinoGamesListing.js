import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';

import { toast } from '../../../components/Toast';
import {
  errorHandler,
  useHideGames,
  useUpdateStatusMutation,
  useUploadGamesMutation,
} from '../../../reactQuery/hooks/customMutationHook';
import { getAllCasinoGames, getAllCasinoSubCategories, getAllCasinoProviders } from '../../../utils/apiCalls';

const useCasinoGamesListing = () => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [casinoCategoryId, setCasinoCategoryId] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [providerId, setProviderId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryGameId, setCategoryGameId] = useState();
  const [active, setActive] = useState();
  const [show, setShow] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('');
  const [hideModalShow, setHideModalShow] = useState(false);
  const [gameData, setGameData] = useState();
  const [orderBy, setOrderBy] = useState('masterCasinoGameId');
  const [sort, setSort] = useState('desc');
  const [over, setOver] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [operator, setOperator] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [customerFacingFilter, setCustomerFacingFilter] = useState('');
  const [gameId, setGameId] = useState('');
  const [debouncedGameId] = useDebounce(gameId, 500);
 const [freeSpinstatus, setFreeSpinStatus] = useState()
  const [freeSpinStatusShow,setFreeSpinStatusShow] = useState(false)

  const [debouncedFilterValue] = useDebounce(filterValue, 500);
  const { t } = useTranslation('casinoGames');

  const queryClient = useQueryClient();

  const getProviderName = (id) => casinoProvidersData?.rows.find((val) => val.masterCasinoProviderId === id)?.name;

  const selected = (h) =>
    orderBy === h.value &&
    h.label !== 'Thumbnail' &&
    h.label !== 'Status' &&
    h.label !== 'Sub Category' &&
    h.label !== 'Category';

  const handleShow = (id, active,status) => {
    setCategoryId(id);
    setActive(!active);
    setShow(true);
    setFreeSpinStatus(status ? true : false )
  };

  const handleHideYes = () => {
    hideCasinoGame({ masterCasinoGameId: categoryGameId });
  };

  const handleHideModal = (id) => {
    setCategoryGameId(id);
    setHideModalShow(true);
  };

  const handleYes = () => {
    updateStatus({
      code: 'CATEGORY_GAME',
      masterCasinoGameId: categoryId,
      status: active,
      freeSpinAllowed:freeSpinstatus
    });
  };

  const handleClose = () => setShowModal(false);
  const handleUploadClose = () => setShowUploadModal(false);

  const handleShowModal = (type, data, id) => {
    setGameData(data);
    setCategoryGameId(id);
    setType(type);
    setShowModal(true);
  };

  const { data: casinoProvidersData } = useQuery({
    queryKey: ['providersList'],
    queryFn: () => {
      // const params = {pageNo: queryKey[2], limit: queryKey[1]};
      return getAllCasinoProviders();
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 'Infinity',
    select: (res) => res?.data?.casinoProvider,
  });

  const { data: subCategories } = useQuery({
    queryKey: ['subCategories'],
    queryFn: () => {
      // const params = {pageNo: queryKey[2], limit: queryKey[1]};
      return getAllCasinoSubCategories();
    },
    refetchOnWindowFocus: false,
    // refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 'Infinity',
    select: (res) => res?.data?.subCategory,
  });

  const { data: casinoGames, isLoading: loading, isFetching } = useQuery({
    queryKey: [
      'casinoGames',
      limit,
      page,
      orderBy,
      sort,
      statusFilter,
      casinoCategoryId,
      providerId,
      debouncedSearch,
      operator,
      filterBy,
      debouncedFilterValue,
      customerFacingFilter,
      debouncedGameId
    ],
    queryFn: ({ queryKey }) => {
      const params = { pageNo: queryKey[2], limit: queryKey[1] };
      if (queryKey[3]) params.orderBy = queryKey[3];
      if (queryKey[4]) params.sort = queryKey[4];
      if (queryKey[5]) params.status = statusFilter;
      if (queryKey[6]) params.masterGameSubCategoryId = casinoCategoryId;
      if (queryKey[7]) params.providerId = providerId;
      if (queryKey[8]) params.name = debouncedSearch;
      if (queryKey[9]) params.operator = queryKey[9];
      if (queryKey[10]) params.filterBy = queryKey[10];
      if (queryKey[11]) params.value = queryKey[11];
      if (queryKey[12]) params.activeOnSite = queryKey[12];
      if (queryKey[13]) params.masterCasinoGameId = queryKey[13];
      return getAllCasinoGames(params);
    },
    select: (res) => res?.data?.data,
    refetchOnWindowFocus: false,
    enabled: Boolean(!filterBy || (operator && debouncedFilterValue)),
    keepPreviousData: true,
    staleTime: 15000,
  });

  const totalPages = Math.ceil(casinoGames?.count / limit);

  const { mutate: hideCasinoGame, isLoading: hideLoading } = useHideGames({
    onSuccess: ({ data }) => {
      if (data.success) {
        if (data.message) toast(data.message, 'success');
        queryClient.invalidateQueries({ queryKey: ['casinoGames'] });
        const updatedList = queryClient.getQueryData([ 'casinoGames',
          limit,
          page,
          orderBy,
          sort,
          statusFilter,
          casinoCategoryId,
          providerId,
          debouncedSearch,
          operator,
          filterBy,
          debouncedFilterValue,
          customerFacingFilter,
          debouncedGameId]);
     
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.data?.rows) && updatedList?.data?.data?.rows.length === 1 && page > 1) {
  
          setPage((prev) => prev - 1);
        }
      }
      setHideModalShow(false);
    },
  });

  const { mutate: updateStatus, isLoading: updateloading } = useUpdateStatusMutation({
    onSuccess: ({ data }) => {
      if (data.success) {
        if (data.message) toast(data.message, 'success');
        queryClient.invalidateQueries({ queryKey: ['casinoGames'] });
        const updatedList = queryClient.getQueryData([ 'casinoGames',
          limit,
          page,
          orderBy,
          sort,
          statusFilter,
          casinoCategoryId,
          providerId,
          debouncedSearch,
          operator,
          filterBy,
          debouncedFilterValue,
          customerFacingFilter,
          debouncedGameId]);
     
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.data?.rows) && updatedList?.data?.data?.rows.length === 1 && page > 1) {
  
          setPage((prev) => prev - 1);
        }
      }
      setShow(false);
    },
    onError: (error) => {
      setShow(false);
      errorHandler(error);
    },
  });

  const { mutate: uploadGames, isLoading: uploadGamesLoading } = useUploadGamesMutation({
    onSuccess: ({ data }) => {
      if (data.success) {
        toast(t('uploadGames.gamesUploadSuccessToast'), 'success');
        queryClient.invalidateQueries({ queryKey: ['casinoGames'] });
      }
      setShowUploadModal(false);
    },
    onError: (error) => {
      setShowUploadModal(false);
      errorHandler(error);
    },
  });
     const { mutate: updateFreeSpinStatus,isLoading:updateFreeSpinloading } = useUpdateStatusMutation({onSuccess: ({data}) => {
      if(data.success) {
        if(data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['casinoGames'] })
        setFreeSpinStatusShow(false)
      }
    }, onError: (error) => {
      errorHandler(error)
    }})
      const handleFreeSpin = (id, status) => {
    setCategoryGameId(id)
    setFreeSpinStatus(!status)
    setFreeSpinStatusShow(true)
   
  }
   const handleFreeSpinYes = () => {
      updateFreeSpinStatus({
        code: 'FREE_SPIN_GAME',
        masterCasinoGameId: categoryGameId,
        status:freeSpinstatus
      })
    }

  return {
    limit,
    page,
    loading,
    isFetching,
    setLimit,
    setPage,
    totalPages,
    casinoGames,
    casinoCategoryId,
    setCasinoCategoryId,
    subCategories,
    casinoProvidersData,
    providerId,
    setProviderId,
    show,
    setShow,
    handleShow,
    handleYes,
    handleShowModal,
    showModal,
    type,
    handleClose,
    active,
    gameData,
    categoryGameId,
    setHideModalShow,
    hideModalShow,
    handleHideYes,
    handleHideModal,
    statusFilter,
    setStatusFilter,
    setOrderBy,
    setSort,
    setOver,
    selected,
    sort,
    over,
    getProviderName,
    navigate,
    handleUploadClose,
    showUploadModal,
    setShowUploadModal,
    uploadGamesLoading,
    uploadGames,
    search,
    setSearch,
    hideLoading,
    updateloading,
    operator,
    setOperator,
    filterBy,
    setFilterBy,
    filterValue,
    setFilterValue,
    customerFacingFilter,
    setCustomerFacingFilter,
    gameId,
    setGameId,setFreeSpinStatusShow,handleFreeSpinYes,freeSpinStatusShow,freeSpinstatus,updateFreeSpinloading,handleFreeSpin,
  };
};

export default useCasinoGamesListing;
