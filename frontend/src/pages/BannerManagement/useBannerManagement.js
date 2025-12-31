import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce'
import { useState } from 'react';
import { getAllBanners } from '../../utils/apiCalls';
import {
  errorHandler,
  useCreateBannerMutation,
  useDeleteBanner,
  useUpdateBannerMutation,
  useUpdateBannerStatusMutation,

} from '../../reactQuery/hooks/customMutationHook';
import { toast } from '../../components/Toast';
import { useTranslation } from 'react-i18next';
import { serialize } from 'object-to-formdata';

const useBannerManagement = () => {
  const [type, setType] = useState('');
  const { t } = useTranslation('casino');
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [pageBannerId, setPageBannerId] = useState('');
  const [status, setStatus] = useState('')
  const [statusShow, setStatusShow] = useState(false)
  const [orderBy, setOrderBy] = useState('pageBannerId')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [bannerId, setBannerId] = useState('');
  const [debouncedBanner] = useDebounce(bannerId, 500)
  const [pageRoute, setPageRoute] = useState('');
  const [bannerStatus, setBannerStatus] = useState('true');
  const [error, setError] = useState('')

  const { data: bannersList, isLoading: loading } = useQuery({
    queryKey: ['bannersList', limit, page, orderBy, sort, debouncedBanner, debouncedSearch, bannerStatus],
    queryFn: ({ queryKey }) => {
      const params = {
        pageNo: queryKey[2],
        limit: queryKey[1],
      
        orderBy: queryKey[3],
        sort: queryKey[4]
      };
      if (queryKey[5]) params.pageBannerId = queryKey[5]
      if (queryKey[6]) params.search = queryKey[6]
      if (queryKey[7]) params.status = queryKey[7]
    
      return getAllBanners(params);
    },

    select: (res) => res?.data?.banners,
    refetchOnWindowFocus: false,
  });

  const resetFilters = () => {
    setSearch('')
    setBannerId('')
    setBannerStatus('true')
    setError('')
    setPageBannerId('')
};

  const selected = (h) =>
  orderBy === h.value &&
  h.labelKey !== 'Actions'

  const totalPages = Math.ceil(bannersList?.count / limit)
  const handleCreateEdit = (type, data) => {
    setType(type);
    setData(data);
    setShow(true);
  };

  const { mutate: createBanner, isLoading: createLoading } =
    useCreateBannerMutation({
      onSuccess: () => {
        toast(t('casinoBannerManagement.bannerCreateSuccess'), 'success');
        queryClient.invalidateQueries({ queryKey: ['bannersList'] });
        setShow(false);
      },
      onError: (error) => {
        setShow(false);
        errorHandler(error);
      },
    });

  const { mutate: updateBanner, isLoading: updateLoading } =
    useUpdateBannerMutation({
      onSuccess: () => {
        toast(t('casinoBannerManagement.bannerUpdateSuccess'), 'success');
        queryClient.invalidateQueries({ queryKey: ['bannersList'] });
        setShow(false);
      },
      onError: (error) => {
        setShow(false);
        errorHandler(error);
      },
    });

  const createUpdate = (data) => {
    type === 'Create'
      ? createBanner(
        serialize(data)
      )
      : updateBanner(
        serialize(data)
      );
  };

  const { mutate: deleteBanner,isLoading:deleteLoading } = useDeleteBanner({
    onSuccess: () => {
      toast(t('casinoBannerManagement.bannerDeleteSuccess'), 'success');
      queryClient.invalidateQueries({ queryKey: ['bannersList'] });
      const updatedList = queryClient.getQueryData([
        'bannersList',
        limit, page, orderBy, sort, debouncedBanner, debouncedSearch, bannerStatus
      ]);
  
      // If current page is now empty and not the first page, go back one
      if (Array.isArray(updatedList?.data?.banners?.rows) && updatedList?.data?.banners?.rows.length === 1 && page > 1) {

        setPage((prev) => prev - 1);
      }
      setDeleteModalShow(false);
    },
  });

  const handleDeleteModal = (id) => {
    setPageBannerId(id);
    setDeleteModalShow(true);
  };

  const handleDeleteYes = () => {
    deleteBanner({ pageBannerId });
  };
//status 

const { mutate: updateStatus,isLoading:updateStatusloading } = useUpdateBannerStatusMutation({onSuccess: () => {
  toast(t('updateStatus'), 'success')
  queryClient.invalidateQueries({ queryKey: ['bannersList'] })
  const updatedList = queryClient.getQueryData([
    'bannersList',
    limit, page, orderBy, sort, debouncedBanner, debouncedSearch, bannerStatus
  ]);

  // If current page is now empty and not the first page, go back one
  if (Array.isArray(updatedList?.data?.banners?.rows) && updatedList?.data?.banners?.rows.length === 1 && page > 1) {

    setPage((prev) => prev - 1);
  }
  setStatusShow(false)
}, onError: (error) => {
  errorHandler(error)
}})
const handleYes = () => {
  const data = {
    code: "BANNER",
    pageBannerId: pageBannerId,
    status: status
  }
 updateStatus(data)
}
const handleStatusShow = (id, currentStatus) => {
  setPageBannerId(id);
  setStatus(!currentStatus)
  setStatusShow(true)
}
  return {
    handleStatusShow,
    statusShow,
    setStatusShow,
    status,
    handleYes,
    updateStatusloading,
    t,
    loading,
    bannersList,
    submitLoading: createLoading || updateLoading,
    handleCreateEdit,
    type,
    data,
    setShow,
    show,
    createUpdate,
    handleDeleteModal,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    deleteLoading,
    page,
    setLimit,
    limit,
    setPage,
    totalPages,
    selected,
    sort,
    setSort,
    over,
    setOver,
    setOrderBy,
    orderBy,
    bannerId,
    setBannerId,
    pageRoute,
    setPageRoute,
    bannerStatus,
    setBannerStatus,
    pageBannerId,
    setPageBannerId,
    search,
    setSearch,
    resetFilters,
    error,
    setError
  };
};

export default useBannerManagement;
