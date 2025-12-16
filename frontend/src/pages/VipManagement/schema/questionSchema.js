import * as Yup from 'yup';

export const QuestionSchema = Yup.object().shape({
	questions: Yup.array().of(
		Yup.object().shape({
			question: Yup.string().required('Please enter the question')
				.test('no-only-spaces', 'Question cannot be empty or just spaces', (value) => {
					return typeof value === 'string' && value.trim().length > 0;
				})
				.max(180, 'Question cannot be more than 180 characters'),

			min: Yup.number()
				.nullable()
				.min(0, 'Minimum must be at least 0'),
			max: Yup.number()
				.nullable()
				.min(0, 'Maximum must be at least 0')
				.when(['min'], ([minValue], schema) => {
					return minValue != null
						? schema.min(minValue, 'Maximum must be greater than or equal to minimum')
						: schema;
				}),
			optionsText: Yup.string().when('type', ([type], schema) => {
				if (['select', 'radio', 'checkbox'].includes(type)) {
					return schema
						.required('Options are required')
						.test('min-two-options', 'At least two valid options are required', (value) => {
							const options = (value || '')
								.split(',')
								.map(opt => opt.trim())
								.filter(Boolean);
							return options.length >= 2;
						});
				}

				return schema.notRequired();
			}),
		})
	).min(1, 'At least one question is required'),
});

export const updateQuestionSchema = Yup.object().shape({
	question: Yup.string().required('Please enter the question')
		.test('no-only-spaces', 'Question cannot be empty or just spaces', (value) => {
			return typeof value === 'string' && value.trim().length > 0;
		})
		.max(180, 'Question cannot be more than 180 characters'),
	min: Yup.number()
		.nullable()
		.min(0, 'Minimum must be at least 0'),
	max: Yup.number()
		.nullable()
		.min(0, 'Maximum must be at least 0')
		.when(['min'], ([minValue], schema) => {
			return minValue != null
				? schema.min(minValue, 'Maximum must be greater than or equal to minimum')
				: schema;
		}),
	optionsText: Yup.string().when('type', ([type], schema) => {
		if (['select', 'radio', 'checkbox'].includes(type)) {
			return schema
				.required('Options are required')
				.test('min-two-options', 'At least two valid options are required', (value) => {
					const options = (value || '')
						.split(',')
						.map(opt => opt.trim())
						.filter(Boolean);
					return options.length >= 2;
				});
		}

		return schema.notRequired();
	}),
})