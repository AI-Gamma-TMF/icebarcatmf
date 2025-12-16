
import React from 'react';
import { Button, Form as BForm, Row, Col } from '@themesberg/react-bootstrap';
import { ErrorMessage } from 'formik';
import { capitalizeFirstLetter } from '../../../../utils/helper';

const VipQuestionForm = ({ field, index, onChange, onDelete, mode = 'edit' }) => {
	const isEditable = mode === 'edit' || mode === 'create';
	const handleChange = (key, value) => {
		if (isEditable && onChange) {
			onChange(field.id, key, value);
		}
	};

	return (
		<>
			<Row className='align-items-center'>
				<Col><h5>Question {index}  <small className="text-muted">
					({capitalizeFirstLetter(field?.type)})
				</small></h5></Col>
				{isEditable && onDelete && (<Col xs="auto">
					<Button variant="outline-danger" size="sm" onClick={onDelete}>
						Remove
					</Button>
				</Col>)}
			</Row>
			<BForm.Group className='mt-3'>
				<BForm.Label>Question</BForm.Label>
				<BForm.Control className="form-control text-dark fw-bold"
					type='text'
					placeholder='Enter question'
					value={field.question || ''}
					onChange={(e) => handleChange('question', e.target.value)}
					disabled={mode === 'view'}
				>

				</BForm.Control>

			</BForm.Group>
			{isEditable && (<ErrorMessage
				name={mode === 'edit' ? 'question' : `questions[${index - 1}].question`}
				component="div"
				className="text-danger"
			/>)}

			{['select', 'radio', 'checkbox'].includes(field.type) && (
				<BForm.Group className="mt-3">
					<BForm.Label>Options (comma separated)</BForm.Label>
					<BForm.Control
						type="text"
						className="form-control text-dark fw-bold"
						value={field.optionsText || ''}
						placeholder={'Enter options in comma separated (Option 1, Option 2)'}
						onChange={(e) =>
							handleChange('optionsText', e.target.value)
						}
						disabled={mode === 'view'}
					/>
				</BForm.Group>


			)}
			{isEditable && (<ErrorMessage
				name={mode === 'edit' ? 'optionsText' : `questions[${index - 1}].optionsText`}
				component="div"
				className="text-danger"
			/>)}
			<Row className='d-flex align-items-center mt-3'>

				{
					['number'].includes(field.type) && (
						<>
							<Col>
								<BForm.Group >
									<BForm.Label>Minimum Value</BForm.Label>
									<BForm.Control
										type="number"
										value={field.min}
										onChange={(e) => {

											handleChange('min', e.target.value)

										}}
										onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
										disabled={mode === 'view'}
									/>
									{isEditable && (<ErrorMessage
										name={mode === 'edit' ? 'min' : `questions[${index - 1}].min`}
										component="div"
										className="text-danger"
									/>)}
								</BForm.Group>
							</Col>

							<Col>
								<BForm.Group>
									<BForm.Label>Maximum Value</BForm.Label>
									<BForm.Control
										type="number"
										value={field.max}
										onChange={(e) => {

											handleChange('max', e.target.value)

										}}
										onKeyDown={(evt) => ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault()}
										disabled={mode === 'view'}
									/>

								</BForm.Group>
								{isEditable && (<ErrorMessage
									name={mode === 'edit' ? 'max' : `questions[${index - 1}].max`}
									component="div"
									className="text-danger"
								/>)}
							</Col>
						</>
					)
				}
				<Col className='mt-4'>
					<BForm.Group >

						<BForm.Check
							type="checkbox"
							label="Check the box to make this question mandatory for users"
							checked={field.required}
							onChange={(e) => handleChange('required', e.target.checked)}
							disabled={mode === 'view'}
						/>
					</BForm.Group>
				</Col>
			</Row>

		</>
	)
}

export default VipQuestionForm;