import { useState } from 'react'
import { toast } from '../../../components/Toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import useCheckPermission from '../../../utils/checkPermission'
import { getScratchCardDetails } from '../../../utils/apiCalls'
import { errorHandler, useDeleteScratchCard, useReuseScratchCardMutation, useUpdateScratchCardMutation } from '../../../reactQuery/hooks/customMutationHook'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { serialize } from 'object-to-formdata'

const useScratchCard = () => {
    const { isHidden } = useCheckPermission()
    const navigate = useNavigate()
    const [over, setOver] = useState(false)
    const [limit, setLimit] = useState(15);
    const [page, setPage] = useState(1);
    const [orderBy, setOrderBy] = useState('scratchCardId')
    const [editRowId, setEditRowId] = useState(null)
    const [editParentRowId, setEditParentRowId] = useState(null)
    const [sort, setSort] = useState('DESC')
    const [editValues, setEditValues] = useState({})
    const [editParentValues, setEditParentValues] = useState({})
    const [editErrors, setEditErrors] = useState({});
    const [deleteScratchCardData, setDeleteScratchCardData] = useState({});
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [scratchcardId, setScratchcardId] = useState('');
    const [reuseScratchcardId, setReuseScratchcardId] = useState('');
    const [debouncedScratchCard] = useDebounce(scratchcardId, 500)
    const [name, setName] = useState('')
    const [status, setStatus] = useState('true');
    // const [refetchView, setRefetchView] = useState(false);
    const [reward, setReward] = useState('');
    const [search, setSearch] = useState('')
    const [values, setFieldValue] = useState({})
    const [childData, setChildData] = useState({})
    const [reuseModalShow, setReuseModalShow] = useState(false);
    const [debouncedSearch] = useDebounce(search, 500)
    const [error, setError] = useState('')
    const location = useLocation();
    const { pathname } = location;
    const parentData = location.search;
    const isUnarchive = pathname.includes('unarchive-scratch-card');
    const { scratchCardId } = useParams();
    const queryClient = useQueryClient()
    const { data: scratchCardList, isLoading: loading, refetch } = useQuery({
        queryKey: ['scratchCardList', limit, page, debouncedScratchCard, debouncedSearch, isUnarchive,orderBy,sort],
        queryFn: ({ queryKey }) => {
            const [_, limit, page, scratchCardId, name, isUnarchiveFlag,orderBy,sort] = queryKey;
            const params = { pageNo: page, limit };
            if (scratchCardId) params.scratchCardId = scratchCardId;
            if (name) params.name = name;
            if (isUnarchiveFlag) params.isArchive = true;
            if (orderBy) params.orderBy = orderBy
            if (sort) params.sort = sort // only if true
            return getScratchCardDetails(params);
        },
        select: (res) => res?.data,
        refetchOnWindowFocus: false,
    });
    const { data: scratchCardViewList, isLoading: loadingView, refetch: refetchView } = useQuery({
        queryKey: ['scratchCardList', scratchCardId],
        queryFn: () => {
            if (!scratchCardId) return Promise.reject('Missing scratchCardId');

            const payload = { scratchCardId };
            if (parentData) {
                payload.isArchive = true;
            }

            return getScratchCardDetails(payload);
        },
        enabled: !!scratchCardId,
        select: (res) => res?.data,
        refetchOnWindowFocus: false,
    });
    const totalPages = Math.ceil(scratchCardList?.count / limit);
    const { mutate: updateScratch, isLoading: createLoading } = useUpdateScratchCardMutation({
        onSuccess: (data) => {
            if (data?.data?.success) {
                toast(data?.data?.message, "success");
            }
            else {
                toast(data?.data?.message, "error");
            }
            setEditRowId(null)
            setEditParentRowId(null)
            setDeleteModalShow(false);
            refetch()
            refetchView()
        },
        onError: (error) => {
            errorHandler(error);
        },
    });
    const resetFilters = () => {
        setSearch('')
        setScratchcardId('')
        setReward('')
        setError('')
    };
    const handleEditClick = (row) => {
        setEditRowId(row.id)
        setEditValues({
            minReward: row.minReward,
            maxReward: row.maxReward,
            percentage: row.percentage,
            isActive: row.isActive,
            playerLimit: row.playerLimit,
            message: row.message,
            imageUrl: row.imageUrl,
        })
    }
    const handleEditParentClick = (row) => {
        setEditParentRowId(row.scratchCardId)
        setEditParentValues({
            scratchCardName: row.scratchCardName,
            isActive: row.isActive,
        })
    }
    const handleChange = (e, field) => {
        let filedData
        if (field === 'isActive') {
            filedData = e.target.checked
        }
        else if (field === 'imageUrl') {
            filedData = e
        }
        else {
            filedData = e.target.value
        }
        setEditValues({
            ...editValues,
            [field]: filedData
        })
    }
    const handleInputMinReward = (e) => {
        handleChange(e, "minReward");
    };
    const handleInputMaxReward = (e) => {
        handleChange(e, "maxReward");
    };
    // const handleInputpercentage = (e) => {
    //     handleChange(e, "percentage");
    // };
    const validateTotalPercentage = (newPercentage, editingIndex) => {
        let total = 0;

        scratchCardViewList?.data[0].scratchCardConfigs.forEach((row, index) => {
            if (index === editingIndex) {
                // Use the new edited value for this row
                total += Number(newPercentage || 0);
            } else {
                total += Number(row.percentage || 0);
            }
        });

        return total <= 100;
    };
    const handleInputpercentage = (e) => {
        const { value } = e.target;

        setEditValues((prev) => ({
            ...prev,
            percentage: value,
        }));

        const isValid = validateTotalPercentage(value, scratchCardViewList?.data[0].scratchCardConfigs.findIndex(r => r.id === editRowId));

        if (!isValid) {
            setEditErrors((prev) => ({
                ...prev,
                percentage: 'Total percentage of all rows should not exceed 100',
            }));
        } else {
            setEditErrors((prev) => ({
                ...prev,
                percentage: '',
            }));
        }
    };
    const handleInputPlayerLimit = (e) => {
        handleChange(e, "playerLimit");
    };
    const handleChangeIsActive = (e) => {
        handleChange(e, "isActive");
    }
    const handleChangeParentIsActive = (e) => {
        //handleChange(e, "isActive");
        setEditParentValues({
            ...editParentValues,
            isActive: e.target.checked,
        });
    }
    const handleChangeParentMessage = (e) => {
        setEditParentValues({
            ...editParentValues,
            message: e.target.value,
        });
    }
    const handleMessage = (e) => {
        handleChange(e, "message");
    }
    //  const handleImage = (e) => {
    //     handleChange(e, "image");
    // }
    const handleImage = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        handleChange(file, "imageUrl");
        // do something with the file
        console.log("Selected file:", file);
    };
    const handleScratchcardName = (e) => {
        const rawValue = e.target.value;
        const trimmedValue = rawValue.trim();

        // Allow empty value (for clearing input)
        if (trimmedValue === "") {
            setEditParentValues({
                ...editParentValues,
                scratchCardName: "",
            });
            return;
        }

        // Allow only if it contains at least one letter or number
        const hasAlphaNumeric = /[a-zA-Z0-9]/.test(trimmedValue);

        if (hasAlphaNumeric) {
            setEditParentValues({
                ...editParentValues,
                scratchCardName: trimmedValue,
            });
        }
    };

    const handleParentSubmit = (parentUpdateValue) => {
        const body = {
            scratchCardId: parentUpdateValue.scratchCardId,
            scratchCardName: parentUpdateValue.scratchCardName,
            isActive: parentUpdateValue.isActive,
            message: parentUpdateValue.message
        };
        updateScratch(serialize(body));
    }


const validateRow = (values, rowIndex, allRows) => {
    const errors = {};

    const isValidDecimal = (value) =>
        /^(\d{1,10})(\.\d{1,2})?$/.test(value?.toString());

    const isValidInteger = (value) =>
        /^\d{1,10}$/.test(value?.toString());

    const currentMin = Number(values.minReward);
    const currentMax = Number(values.maxReward);
    const playerLimit = values.playerLimit;
    const percentage = values.percentage;

    // Rule 1: Min < Max
    if (currentMin >= currentMax) {
        errors.minReward = 'Min Reward must be less than Max Reward';
    }

    // Rule 2: Min/Max must be valid numbers with max 10 digits
    if (!isValidDecimal(values.minReward)) {
        errors.minReward = 'Min Reward must be a valid number (up to 10 digits, 2 decimals)';
    }

    if (!isValidDecimal(values.maxReward)) {
        errors.maxReward = 'Max Reward must be a valid number (up to 10 digits, 2 decimals)';
    }

    // Rule 3: playerLimit should be an integer and not exceed 10 digits
    if (playerLimit && !isValidInteger(playerLimit)) {
        errors.playerLimit = 'Player Limit must be a valid whole number (up to 10 digits)';
    }

    // Rule 4: percentage should be between 1 and 100
    if (percentage && (+percentage < 1 || +percentage > 100)) {
        errors.percentage = 'Percentage must be between 1 and 100';
    }

    // Rule 5: Previous max + 0.01 === current min
    if (rowIndex > 0) {
        const prevRow = allRows[rowIndex - 1];
        const prevMax = Number(prevRow?.maxReward);
        const expectedMin = +(prevMax + 0.01).toFixed(2);
        if (currentMin !== expectedMin) {
            errors.minReward = `Min Reward must be exactly ${expectedMin}`;
        }
    }

    // Rule 6: Current max + 0.01 === next min
    if (rowIndex < allRows.length - 1) {
        const nextRow = allRows[rowIndex + 1];
        const nextMin = Number(nextRow?.minReward);
        const expectedMax = +(nextMin - 0.01).toFixed(2);
        if (currentMax !== expectedMax) {
            errors.maxReward = `Max Reward must be exactly ${expectedMax}`;
        }
    }

    return errors;
};



    const { mutate: reuseScratchcard, isLoading: reuseLoading } = useReuseScratchCardMutation({
        onSuccess: ({ data }) => {
            if (data.success) {
                if (data.message) {
                    toast(data.message, "success")
                    refetch()
                }
                setReuseModalShow(false);
            }
            else{
                toast(data.message, "error")
            }
        },
        onError: (error) => {
            errorHandler(error)
            setReuseModalShow(false);
        },
    });

    const handleReuseScratchcardYes = () => {
        if (!reuseScratchcardId) {
            toast("Scratch card ID is missing", { type: "error" });
            return;
        }
        reuseScratchcard(reuseScratchcardId);
    }
    const handleReuseModal = (id) => {
        setReuseScratchcardId(id);
        setReuseModalShow(true);
    }
    const handleSubmit = (updateValues, rowIndex) => {
        const errors = validateRow(updateValues, rowIndex, scratchCardViewList?.data[0]?.scratchCardConfigs);

        if (Object.keys(errors).length > 0) {
            setEditErrors(errors);
            return;
        }

        //clear errors and proceed
        setEditErrors({});
        handleFinalSubmit(updateValues);
    };


    const handleFinalSubmit = (updateValues) => {
        const body = {
            configId: updateValues.id,
            scratchCardId: updateValues.scratchCardId,
            minReward: Number(updateValues.minReward),
            maxReward: updateValues.maxReward,
            rewardType: updateValues.rewardType,
            percentage: updateValues.percentage,
            playerLimit: updateValues.playerLimit,
            isActive: updateValues.isActive,
            message: updateValues.message,
            image: updateValues.imageUrl,
        };
        updateScratch(serialize(body));
    };
    const { mutate: deleteScratchCard, isLoading: deleteLoading } = useDeleteScratchCard({
        onSuccess: (data) => {
            if (data?.data?.status) { toast(data?.data?.message, 'success') }
            else { toast(data?.data?.message, 'error') }
            refetch()
            queryClient.invalidateQueries({ queryKey: ['scratchCardDelete'] });
             const updatedList = queryClient.getQueryData(['scratchCardList', limit, page, debouncedScratchCard, debouncedSearch, isUnarchive,orderBy,sort]);
                 
                    // If current page is now empty and not the first page, go back one
                    if (Array.isArray(updatedList?.data?.data) && updatedList?.data?.data?.length === 1 && page > 1) {
              
                      setPage((prev) => prev - 1);
                    }

        },
    });

    const handleDeleteYes = () => {
        setDeleteModalShow(false);
        deleteScratchCard(deleteScratchCardData);
    };
    const handleDeleteModal = (data) => {
        setDeleteScratchCardData(data);
        setDeleteModalShow(true);
    }

    const selected = (h) =>
        orderBy === h.value &&
        h.labelKey !== 'Action'

    return {
        selected,
        handleDeleteModal,
        handleDeleteYes,
        handleSubmit,
        handleParentSubmit,
        handleEditClick,
        handleScratchcardName, refetchView, scratchCardId, scratchCardViewList, parentData,
        handleEditParentClick, values, setFieldValue, setChildData, handleChangeParentIsActive,
        handleInputMinReward, limit, handleReuseModal, isUnarchive, handleMessage, handleImage, handleChangeParentMessage,
        handleChangeIsActive, error, setError, resetFilters, reward, setReward, handleReuseScratchcardYes,
        handleInputMaxReward, name, setName, status, setStatus, search, setSearch, debouncedSearch,
        handleInputpercentage, scratchcardId, setScratchcardId, debouncedScratchCard, setEditErrors,
        handleInputPlayerLimit, setDeleteModalShow, editValues, setEditRowId, editParentValues, page,orderBy,
        deleteModalShow, editErrors, sort, setSort, editParentRowId, editRowId, setPage, scratchCardList,
        setOrderBy, over, setOver, setLimit, navigate, isHidden, loading, setEditParentRowId, totalPages,
        setReuseModalShow, reuseModalShow, reuseLoading
    }
}

export default useScratchCard;
