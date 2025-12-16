import React, { useState } from 'react';
import { Row, Col, Button,  Card, Form as BForm } from '@themesberg/react-bootstrap'
import { Formik, FieldArray, Form } from 'formik';
import useCreateQuestion from '../../hooks/useCreateQuestions';
import { fieldTypes, fieldTypeToQuestionType } from '../../constants';
import { QuestionSchema } from '../../schema/questionSchema';
import VipQuestionForm from './VipQuestionForm';
import { AdminRoutes } from '../../../../routes';

const VipCreateQuestions = () => {

	const { createQuestions, isLoading, navigate } = useCreateQuestion();
	const [newFieldType, setNewFieldType] = useState('')
	const questionType = fieldTypeToQuestionType[newFieldType];

	const handleAddField = (push) => {
		const defaultField = {
			question: '',
			type: newFieldType,
			questionType: questionType,
			required: false,
			options: [],
			optionsText: '',
			min: '',
			max: '',
		}
		push(defaultField)
	}
	const handleCancel = () => {
		navigate(AdminRoutes.VipDashboardQuestionForm)
	}


	const handleCreateQuestionSubmit = (formValues) => {
		const formattedQuestions = formValues.questions.map((question) => {
			let options = [];

			if (['select', 'radio', 'checkbox'].includes(question.type)) {
				options = (question.optionsText || '')
					.split(',')
					.map((opt) => opt.trim())
					.filter(Boolean)
					.map((val, index) => ({
						id: index + 1,
						text: val,
					}));
			}
			return {
				...question,
				options,
				optionsText: undefined,
			};
		});

		createQuestions({ questions: formattedQuestions })
	}

	return (

		<>
			<Row className='mb-3'>
				<h3>Create Questionnaire</h3>
			</Row>
			<Formik initialValues={{
				questions: []
			}}
				validationSchema={QuestionSchema}

				onSubmit={handleCreateQuestionSubmit}
			>
				{({ values, setFieldValue }) => (
					<Form >
						<Row className='mb-4'>
							<Col md={4}>
								<BForm.Select
									value={newFieldType}
									onChange={(e) => setNewFieldType(e.target.value)}
								>
									<option value='' hidden disabled>Select type of field</option>
									{fieldTypes.map((type) => (
										<option key={type.value} value={type.value}>
											{type.label}
										</option>
									))}
								</BForm.Select>
							</Col>
							<Col md='auto'>
								<FieldArray name="questions">
									{({ push }) => (
										<Button
											type="button"
											onClick={() => { handleAddField(push); }}
											disabled={!newFieldType}
										>
											Add Field
										</Button>
									)}
								</FieldArray>
							</Col>
						</Row>
						<FieldArray name='questions'>
							{({ remove }) => (
								<>
									{values?.questions?.map((field, index) =>

										<Card key={index} className='mb-4'>
											<Card.Body>
												<VipQuestionForm
													field={field}
													index={index + 1}
													onChange={(id, key, value) => {

														setFieldValue(`questions[${index}].${key}`, value)
													}
													}
													onDelete={() => remove(index)}
													mode='create'
												/>
											</Card.Body>
										</Card>

									)}
								</>
							)}
						</FieldArray>
						<div className="d-flex justify-content-between mt-3">
							<Button
								variant='warning'
								onClick={handleCancel}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isLoading || values?.questions?.length === 0}
								variant="primary"
							>
								{isLoading ? 'Saving...' : 'Save Questionnaire'}
							</Button>
						</div>

					</Form>
				)}
			</Formik>

			<Row className='ms-1 mt-3 fw-bold'>
				* Note : Select a field type from the dropdown and click &quot;Add Field&quot; to create multiple questions in the form.
			</Row>

		</>
	)
}

export default VipCreateQuestions;