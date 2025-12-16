import React from 'react';
import { Row, Button } from '@themesberg/react-bootstrap'
import { Formik, Form } from 'formik'
import useEditQuestion from '../../hooks/useEditQuestions';
import { updateQuestionSchema } from '../../schema/questionSchema';
import Preloader from '../../../../components/Preloader';
import VipQuestionForm from './VipQuestionForm';
import { AdminRoutes } from '../../../../routes';
const VipEditQuestion = () => {

	const { vipQuestionData, loading, handleOnSaveEdit, navigate } = useEditQuestion();

	const handleEditPackageSubmit = (formValues) => {
		const formattedQuestions = {
			...formValues,
			options: ['select', 'radio', 'checkbox'].includes(formValues?.type) ? (formValues?.optionsText || '').split(',').map((opt)=>opt.trim()).filter(Boolean).map((text, index) => ({
				id: index + 1,
				text: text
			})) : [],
			optionsText: undefined

		}
		handleOnSaveEdit(formattedQuestions)
	}

	const handleCancel = () => {
		navigate(AdminRoutes.VipDashboardQuestionForm)
	}


	return (
		<>
			<Row className='mb-3'>
				<h3>Edit Question</h3>
			</Row>
			{
				loading ?
					<Preloader /> :
					vipQuestionData && <Formik initialValues={
						{
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
						
					}
						validationSchema={updateQuestionSchema}
						onSubmit={handleEditPackageSubmit}
						enableReinitialize
					>
						{({ values, setFieldValue }) => (
							<Form>
								<VipQuestionForm
									field={values}
									index={values?.questionnaireId}
									onChange={(id, key, value) => {

										setFieldValue(key, value)
									}
									}
									mode='edit'
								/>
								<div className="d-flex justify-content-between mt-3">
									<Button variant='warning' className='w-auto'
										onClick={handleCancel}>Cancel</Button>
									<Button type="submit" variant="primary">
										Save
									</Button>
								</div>

							</Form>

						)}

					</Formik>
			}
		</>
	)
}

export default VipEditQuestion;