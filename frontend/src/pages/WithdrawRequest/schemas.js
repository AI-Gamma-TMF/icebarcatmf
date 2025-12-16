import * as Yup from 'yup';

export const createRulesSchema = () =>
  Yup.object().shape({
    ruleName: Yup.string()
      .required('Rule name is required.')
      .min(3, 'Rule name must be at least 3 characters long.')
      .max(50, 'Rule name must be at most 50 characters long.'),
    ruleDescription: Yup.string()
      .required('Description is required.')
      .min(3, 'Rule Description must be at least 3 characters long.')
      .max(255, 'Rule description must be at most 255 characters long.')
      .matches(/^(?!\s*$).+$/, 'Description cannot be only empty spaces'),
    isActive: Yup.boolean().required('Active status is required.'),
    comparisionOperator: Yup.string()
      .required('Comparison operator is required.')
      .oneOf(['=', '!=', '>', '<', '>=', '<='], 'Invalid comparison operator.'),
    value: Yup.number()
      .required('Value is required.')
      .min(1, 'Rule Value must be greater than 0'),
    conditionalOperator: Yup.string()
      .required('Conditional operator is required.')
      .oneOf(['AND', 'OR'], 'Invalid conditional operator.')
  });

export const editRulesSchema = () =>
  Yup.object().shape({
    ruleName: Yup.string()
      .required('Rule name is required.')
      .min(3, 'Rule name must be at least 3 characters long.')
      .max(50, 'Rule name must be at most 50 characters long.'),
    ruleDescription: Yup.string()
      .required('Description is required.')
      .min(3, 'Rule Description must be at least 3 characters long.')
      .max(255, 'Rule description must be at most 255 characters long.')
      .matches(/^(?!\s*$).+$/, 'Description cannot be only empty spaces'),
    isActive: Yup.boolean().required('Active status is required.'),
    comparisionOperator: Yup.string()
      .required('Comparison operator is required.')
      .oneOf(['=', '!=', '>', '<', '>=', '<='], 'Invalid comparison operator.'),
    value: Yup.number()
      .required('Value is required.')
      .min(1, 'Rule Value must be greater than 0'),
    conditionalOperator: Yup.string()
      .required('Conditional operator is required.')
      .oneOf(['AND', 'OR'], 'Invalid conditional operator.')
  });
