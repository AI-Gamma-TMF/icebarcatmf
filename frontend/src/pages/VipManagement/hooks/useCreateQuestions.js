import { useNavigate } from 'react-router-dom'
import { toast } from '../../../components/Toast';
import { useCreateQuestionMutation } from '../../../reactQuery/hooks/customMutationHook';
import { AdminRoutes } from '../../../routes';

const useCreateQuestion = () => {
	const navigate = useNavigate()
	const onSuccess = (res) => {
		if (res?.data?.success) {
			toast(res?.data?.message, 'success');
			navigate(AdminRoutes.VipDashboardQuestionForm)
		}
		else {
			toast(res?.data?.message, 'error')
		}
	}
	const onError = (error) => {
		toast(error?.response?.data.errors[0].description, 'error');
	}

	const { mutate: createQuestions, isLoading } = useCreateQuestionMutation({
		onSuccess, onError
	})

	return { createQuestions, isLoading, navigate }
}

export default useCreateQuestion;