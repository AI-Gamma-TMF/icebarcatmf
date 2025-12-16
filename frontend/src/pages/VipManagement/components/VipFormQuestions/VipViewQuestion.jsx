import React from 'react';
import { Row, Button } from '@themesberg/react-bootstrap'
import useEditQuestion from '../../hooks/useEditQuestions';
import Preloader from '../../../../components/Preloader';
import VipQuestionForm from './VipQuestionForm';
import { AdminRoutes } from '../../../../routes';

const VipViewQuestion = () => {

	const { vipQuestionData, loading, navigate } = useEditQuestion()

	const transformedData = vipQuestionData && {
		question: vipQuestionData?.question,
		questionnaireId: vipQuestionData?.questionnaireId,
		questionType: vipQuestionData?.questionType,
		options: vipQuestionData?.options,
		optionsText: Array.isArray(vipQuestionData?.options) ? vipQuestionData?.options?.map(opt => opt.text).join(',') : vipQuestionData?.options,
		required: vipQuestionData?.required,
		min: vipQuestionData?.moreDetails?.min,
		max: vipQuestionData?.moreDetails?.max,
		type: vipQuestionData?.moreDetails?.type,
		frontendQuestionType: vipQuestionData?.frontendQuestionType,
		isActive: vipQuestionData?.isActive
	}

	const handleCancel = () => {
		navigate(AdminRoutes.VipDashboardQuestionForm)
	}

	return (
		<>
			<Row className='mb-3'>
				<h3>View Question</h3>

			</Row>
			{
				loading ? <Preloader />
					: vipQuestionData && <VipQuestionForm
						field={transformedData}
						index={transformedData?.questionnaireId}
						mode='view' />
			}
			<div className='mt-3 '>
				<Button variant='warning' className='w-auto'
					onClick={handleCancel}>Cancel</Button>
			</div>

		</>
	)
}

export default VipViewQuestion;