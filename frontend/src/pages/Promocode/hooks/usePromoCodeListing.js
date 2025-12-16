import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPromoCode } from '../../../utils/apiCalls'
import { toast } from '../../../components/Toast'
import { errorHandler, useDeletePromoCodeMutation, useReusePromocode, useUpdatePromoCodeMutation, useUploadPromoCodeCsv } from '../../../reactQuery/hooks/customMutationHook'
import { useTranslation } from 'react-i18next'
import { useDebounce } from 'use-debounce'
import { getDateDaysAgo } from '../../../utils/dateFormatter'
import { getItem } from '../../../utils/storageUtils'
import { convertToUtc } from '../../../utils/helper'

const usePromoCodeListing = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation('casino');
  const timeZone = getItem("timezone");
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [orderBy, setOrderBy] = useState('')
  const [sort, setSort] = useState('DESC')
  const [over, setOver] = useState(false)
  const [promocodeId, setPromocodeId] = useState()
  const [deletePromocode, setDeletePromocode] = useState()
  const [active, setActive] = useState()
  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 500)
  const [crmPromocode, setIsCrmPromo] = useState(false); 
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState(''); 
  const [maxUsersAvailed, setMaxUsersAvailed] = useState(''); 
  const [validTill, setValidTill] = useState(null); 
  const [validFrom, setValidFrom] = useState(null)
  const [debouncedDiscountPercentage] = useDebounce(discountPercentage, 500)
  const [debouncedMaxUsersAvailed] = useDebounce(maxUsersAvailed, 500)

  const [state, setState] = useState([
    {
      startDate: getDateDaysAgo(10),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const [reuseModalShow, setReuseModalShow] = useState(false);
  const [status, setStatus] = useState('all');
  const [isArchive, setIsArchive] = useState(false)

  const [selectedMaxUsersAvailed, setSelectedMaxUsersAvailed] = useState(0)
  const [selectedPerUserLimit, setSelectedPerUserLimit] = useState(0)

    //implement csv upload
    const [importedFile, setImportedFile] = useState(null);
    const [importModalShow, setImportModalShow] = useState(false);
    const [importAction, setImportAction] = useState(false);

    const [importedPromocodesData, setImportedPromocodesData] = useState([]);
    const [showImportedPromocodes, setShowImportedPromocodes] = useState(false);


    const handleCSVSumbit = () => {      
      const formData = new FormData();
      formData.append("file", importedFile);  
      uploadCSV(formData);
    };

  const { data: promoCodeList, isLoading: loading , refetch : refetchPromoCodeList } = useQuery({ 
    queryKey: ['promoCodeList', limit, page, orderBy, 
    sort, debouncedSearch, status, isArchive, crmPromocode, timeZone, debouncedDiscountPercentage, 
    debouncedMaxUsersAvailed, convertToUtc(validTill), convertToUtc(validFrom)],
    queryFn: ({ queryKey }) => {
      const params = {pageNo: queryKey[2], limit: queryKey[1], timezone: queryKey[9]};
      if (queryKey[3]) params.orderBy = queryKey[3]
      if (queryKey[4]) params.sort = queryKey[4]
      if (queryKey[5]) params.promocodeSearch = queryKey[5]
      if (queryKey[6]) params.status = queryKey[6]
      if (queryKey[7]) params.isArchive = queryKey[7]
      if (queryKey[8]) {params.crmPromocode = true }
      if (queryKey[10]) params.discountPercentage = queryKey[10]
      if (queryKey[11]) params.maxUsersAvailed = queryKey[11]
      if (queryKey[12]) params.validTill = queryKey[12]
      if (queryKey[13]) params.validFrom = queryKey[13]
      return getPromoCode(params)
    },
    select: (res) => res?.data,
    refetchOnWindowFocus: false
  })

  const { mutate: uploadCSV, isLoading: uploadCSVLoading } = useUploadPromoCodeCsv({
    onSuccess: ({ data }) => {
      setImportedPromocodesData(data)
      if(data?.data?.createdPromocodes.length > 0){
        refetchPromoCodeList()
      }      
      // toast(data.message, "success");
      queryClient.invalidateQueries({
        queryKey: ["PromoCodeList"],
      });
      setImportModalShow(false);
      setShowImportedPromocodes(true)
    },
    onError: (error) => {
      errorHandler(error);
      setImportModalShow(false);
    },
  });

  const selected = (h) =>
    orderBy === h.value &&
    h.labelKey !== 'Action'

  const totalPages = Math.ceil(promoCodeList?.promocodeDetail?.count / limit)

  const handleShow = (id, active) => {
    setPromocodeId(id)
    setActive(!active)
    setShow(true)
  }
  const handleDelete = (id)=>{
    setDeletePromocode(id)
    setDeleteModalShow(true)
  }
  const { mutate: updateStatus,isLoading:updateloading } = useUpdatePromoCodeMutation({ 
    onSuccess: ({ data }) => {
        if (data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['promoCodeList'] })
      setShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })

  const handleYes = () => {
    updateStatus({
      promocodeId: promocodeId,
      isActive: active
    })
  }
  const { mutate: deletePromoCode,isLoading:deleteLoading } = useDeletePromoCodeMutation({
    onSuccess: ({ data }) => {
        if (data.message) toast(data.message, 'success')
        queryClient.invalidateQueries({ queryKey: ['promoCodeList'] })
        const updatedList = queryClient.getQueryData(['promoCodeList', limit, page, orderBy, 
    sort, debouncedSearch, status, isArchive, crmPromocode, timeZone, debouncedDiscountPercentage, 
    debouncedMaxUsersAvailed, convertToUtc(validTill), convertToUtc(validFrom)]);
        // If current page is now empty and not the first page, go back one
        if (Array.isArray(updatedList?.data?.promocodeDetail?.rows) && updatedList?.data?.promocodeDetail?.rows.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }
        setDeleteModalShow(false)
    }, onError: (error) => {
      errorHandler(error)
    }
  })
  const handleDeleteYes = () => {
    deletePromoCode({
      promocode: deletePromocode,
    })
  }
  const handleClose = () => setShowModal(false)

  const { mutate: reusePromocode , isLoading: reuseLoading } = useReusePromocode({
    onSuccess: ({ data }) => {
      if (data.success) {
        if (data.message) {
          toast(data.message, "success")
          queryClient.invalidateQueries({ queryKey: ['promoCodeList'] })
        }
      
      }
      setReuseModalShow(false);
    },
    onError: (error) => {
      errorHandler(error)
      setReuseModalShow(false);
    },
  });

  const handleReusePromocodeYes = (data)=>{
    if(!promocodeId){
      toast("Promocode ID is missing", { type: "error" });
      return;
    }
    data.promocodeId = parseInt(promocodeId);
    reusePromocode(data);
  }

  const handleReuseModal = (id, maxUsersAvailed, perUserLimit)=>{
    setPromocodeId(id);
    setSelectedMaxUsersAvailed(maxUsersAvailed)
    setSelectedPerUserLimit(perUserLimit)
    setReuseModalShow(true);
  }

  return {
    t,
    limit,
    page,
    loading,
    promoCodeList,
    show,
    setLimit,
    setPage,
    setShow,
    totalPages,
    handleShow,
    handleYes,
    showModal,
    type,
    handleClose,
    selectedCategory,
    setSelectedCategory,
    active,
    navigate,
    handleDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
    setOrderBy,
    selected,
    sort,
    setSort,
    over,
    setOver,
    search,
    setSearch,
    selectedCurrency,
    setSelectedCurrency,
    state,
    setState,
    setType,
    handleDelete,
    deleteLoading,
    updateloading,
    crmPromocode, setIsCrmPromo,
    reuseModalShow, setReuseModalShow, handleReusePromocodeYes, handleReuseModal,
    reuseLoading,
    status,
     setStatus,
    isArchive, setIsArchive,
    selectedMaxUsersAvailed,
    selectedPerUserLimit,
   
    handleCSVSumbit,
    importedFile,
    setImportedFile,
    uploadCSVLoading,
    importModalShow,
    setImportModalShow,
    uploadCSV,
    importAction,
    setImportAction,
    showImportedPromocodes, setShowImportedPromocodes, importedPromocodesData,
    refetchPromoCodeList,

    discountPercentage,
    setDiscountPercentage,
    maxUsersAvailed,
    setMaxUsersAvailed,
    validTill,
    setValidTill,
    validFrom,
    setValidFrom
    }
}

export default usePromoCodeListing
