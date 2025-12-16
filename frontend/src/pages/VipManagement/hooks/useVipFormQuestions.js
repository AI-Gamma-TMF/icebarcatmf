import { useState } from 'react';
import { useDebounce } from 'use-debounce'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getVipUserQuestions } from '../../../utils/apiCalls';
import { toast } from '../../../components/Toast';
import { errorHandler, useDeleteVipQuestion, useUpdateVipQuestionStatusMutation } from '../../../reactQuery/hooks/customMutationHook';

const useVipFormQuestions = () => {

	const [limit, setLimit] = useState(15)
	const [page, setPage] = useState(1)
	const [sort, setSort] = useState('asc')
	const [orderBy, setOrderBy] = useState('orderId')
	const [over, setOver] = useState(false);
	const [questionnaireId, setQuestionnaireId] = useState('');
	const [deleteModalShow, setDeleteModalShow] = useState(false);
	const [status, setStatus] = useState(false);
	const [statusShow, setStatusShow] = useState(false);
	const queryClient = useQueryClient()
	const [isActive, setIsActive] = useState('all');
	const [search, setSearch] = useState('')
	const [debouncedSearch] = useDebounce(search, 500);

	const selected = (h) => orderBy === h.value && h.labelKey !== "Action"

	const { data: vipQuestionsList, isLoading, refetch: fetchQuestions } = useQuery({
		queryKey: ['vipQuestionsList', limit, page, sort, orderBy, isActive, debouncedSearch],
		queryFn: ({ queryKey }) => {
			const params = { limit: queryKey[1], pageNo: queryKey[2], sort: queryKey[3], orderBy: queryKey[4], isActive: queryKey[5] }
			if (queryKey[6]) params.search = queryKey[6]
			return getVipUserQuestions(params)
		},
		select: (res) => res?.data,
		refetchOnWindowFocus: false,
		retry: false,
	})

	const { mutate: deleteQuestion, isLoading: deleteQuestionLoading } = useDeleteVipQuestion({
		onSuccess: ({ data }) => {
			if (data.success) {
				if (data.message) {
					toast(data.message, 'success')
					fetchQuestions()
				
					const updatedList = queryClient.getQueryData([ 'vipQuestionsList', limit, page, sort, orderBy, isActive, debouncedSearch]);
				
					// If current page is now empty and not the first page, go back one
					if (Array.isArray(updatedList?.data?.questions?.rows) && updatedList?.data?.questions?.rows.length === 1 && page > 1) {
					setPage((prev) => prev - 1);
					}
				}
			}
			setDeleteModalShow(false)
		},
		onError: (error) => {
			console.log(error)
			errorHandler(error)
			setDeleteModalShow(false)
		}
	})

	const { mutate: updateVipQuestionStatus, isLoading: updateLoading } = useUpdateVipQuestionStatusMutation({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['vipQuestionsList'] })
			setStatusShow(false)
			fetchQuestions()
			const updatedList = queryClient.getQueryData([ 'vipQuestionsList', limit, page, sort, orderBy, isActive, debouncedSearch]);
				
			// If current page is now empty and not the first page, go back one
			if (Array.isArray(updatedList?.data?.questions?.rows) && updatedList?.data?.questions?.rows.length === 1 && page > 1) {
				setPage((prev) => prev - 1);
			}
		},
		onError: (error) => {
			errorHandler(error)
			setStatusShow(false);
		}
	})

	const handleDeleteModal = (id) => {
		setQuestionnaireId(id);
		setDeleteModalShow(true);
	}

	const handleDeleteYes = () => {
		if (!questionnaireId) {
			toast('Question ID is missing', 'error')
			return;
		}
		deleteQuestion({ questionnaireId })
	}

	const handleStatusShow = (questionId, status) => {
		setQuestionnaireId(questionId)
		setStatus(!status)
		setStatusShow(true)
	}
	const handleYes = () => {
		const data = {
			questionnaireId: questionnaireId,
			isActive: status
		}
		updateVipQuestionStatus(data);
	}
	const totalPages = Math.ceil(vipQuestionsList?.questions?.count / limit)

	return {
		limit, setLimit, page, setPage, sort, setSort, orderBy, setOrderBy, selected, over, setOver, vipQuestionsList, isLoading, totalPages,
		handleStatusShow, statusShow, setStatusShow, handleYes, status,
		handleDeleteModal, deleteModalShow, setDeleteModalShow, handleDeleteYes, deleteQuestionLoading, updateLoading, setIsActive,
		search, setSearch
	}
}

export default useVipFormQuestions;