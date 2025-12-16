import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce'
import { useState } from 'react';
import { getPromotionManagementDetails } from '../../utils/apiCalls';
import {
  errorHandler,
  useCreatePromotionManagementMutation,
  useDeletePromotionManagement,
  useUpdatePromotionManagementMutation,
  useUpdatePromotionManagementStatusMutation,

} from '../../reactQuery/hooks/customMutationHook';
import { toast } from '../../components/Toast';
import { useTranslation } from 'react-i18next';
import { serialize } from 'object-to-formdata';

const usePromotionManagement = () => {
  const [type, setType] = useState('');
  const { t } = useTranslation('casino');
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [pagePromotionThumbnailId, setPagePromotionThumbnailId] = useState('');
  const [status, setStatus] = useState('')
  const [statusShow, setStatusShow] = useState(false)
  const [orderBy, setOrderBy] = useState('promotionThumbnailId')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [sort, setSort] = useState('ASC')
  const [over, setOver] = useState(false)
  const [promotionThumbnailId, setPromotionThumbnailId] = useState('');
  const [debouncedPromotionThumbnail] = useDebounce(promotionThumbnailId, 500)
  const [pageRoute, setPageRoute] = useState('');
  const [promotionThumbnailStatus, setPromotionThumbnailStatus] = useState('');
  const [error, setError] = useState('')

  const { data: promotionList, isLoading: loading } = useQuery({
    queryKey: ['promotionList', limit, page, orderBy, sort, debouncedPromotionThumbnail, debouncedSearch, promotionThumbnailStatus],
    queryFn: ({ queryKey }) => {
      const params = {
        pageNo: queryKey[2],
        limit: queryKey[1],
      
        orderBy: queryKey[3],
        sort: queryKey[4]
      };
      if (queryKey[5]) params.promotionThumbnailId = queryKey[5]
      if (queryKey[6]) params.search = queryKey[6]
      if (queryKey[7]) params.isActive = queryKey[7]
      return getPromotionManagementDetails(params);
    },

    select: (res) => res?.data?.promotionThumbnail,
    refetchOnWindowFocus: false,
  });
  const resetFilters = () => {
   setPromotionThumbnailId('')
   setSearch('')
   setPromotionThumbnailStatus('')
};

  const selected = (h) =>
  orderBy === h.value &&
  h.labelKey !== 'Action'

  const totalPages = Math.ceil(promotionList?.count / limit)
  const handleCreateEdit = (type, data) => {
    setType(type);
    setData(data);
    setShow(true);
  };

  const { mutate: createPromtion, isLoading: createLoading } = useCreatePromotionManagementMutation({
      onSuccess: () => {
        toast('Promotion tumbnail created', 'success');
        queryClient.invalidateQueries({ queryKey: ['promotionList'] });
        setShow(false);
      },
      onError: (error) => {
        setShow(false);
        errorHandler(error);
      },
    });

  const { mutate: updatePromotion, isLoading: updateLoading } = useUpdatePromotionManagementMutation({
      onSuccess: () => {
        toast('Promotion tumbnail updated successfully.', 'success');
        queryClient.invalidateQueries({ queryKey: ['promotionList'] });
        setShow(false);
      },
      onError: (error) => {
        setShow(false);
        errorHandler(error);
      },
    });

  const createUpdate = (data) => {
    type === 'Create'
      ? createPromtion(
        serialize(data)
      )
      : updatePromotion(
        serialize(data)
      );
  };

  const { mutate: deletePromotionManagement,isLoading:deleteLoading } = useDeletePromotionManagement({
    onSuccess: () => {
      toast('Delete promotion.', 'success');
      queryClient.invalidateQueries({ queryKey: ['promotionList'] });
      const updatedList = queryClient.getQueryData(['promotionList', limit, page, orderBy, sort, debouncedPromotionThumbnail, debouncedSearch, promotionThumbnailStatus]);
  // If current page is now empty and not the first page, go back one
  if (Array.isArray(updatedList?.data?.promotionThumbnail?.rows) && updatedList?.data?.promotionThumbnail?.rows.length === 1 && page > 1) {
    setPage((prev) => prev - 1);
  }
      setDeleteModalShow(false);
    },
  });

  const handleDeleteModal = (id) => {
    setPagePromotionThumbnailId(id);
    setDeleteModalShow(true);
  };

  const handleDeleteYes = () => {
    deletePromotionManagement({ promotionThumbnailId:pagePromotionThumbnailId });
  };
//status 

const { mutate: updateStatus,isLoading:updateStatusloading } = useUpdatePromotionManagementStatusMutation({onSuccess: () => {
  toast(t('updateStatus'), 'success')
  queryClient.invalidateQueries({ queryKey: ['promotionList'] })
  const updatedList = queryClient.getQueryData(['promotionList', limit, page, orderBy, sort, debouncedPromotionThumbnail, debouncedSearch, promotionThumbnailStatus]);
  // If current page is now empty and not the first page, go back one
  if (Array.isArray(updatedList?.data?.promotionThumbnail?.rows) && updatedList?.data?.promotionThumbnail?.rows.length === 1 && page > 1) {
    setPage((prev) => prev - 1);
  }
  setStatusShow(false)
}, onError: (error) => {
  errorHandler(error)
}})
const handleYes = () => {
  const data = {
    promotionThumbnailId: pagePromotionThumbnailId,
    isActive: status
  }
 updateStatus(data)
}
const handleStatusShow = (id, currentStatus) => {
  setPagePromotionThumbnailId(id);
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
    promotionList,
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
    promotionThumbnailId,
    setPromotionThumbnailId,
    pageRoute,
    setPageRoute,
    promotionThumbnailStatus,
    setPromotionThumbnailStatus,
    pagePromotionThumbnailId,
    setPagePromotionThumbnailId,
    search,
    setSearch,
    resetFilters,
    error,
    setError
  };
};

export default usePromotionManagement;
