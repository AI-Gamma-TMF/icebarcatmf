import * as Yup from 'yup';

export const createDomainBlockSchema = () =>
  Yup.object().shape({
    domainName: Yup.string()
      .required('Domain is required.')
      .matches(
        /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Domain must be a valid domain format (e.g., example.com).'
      )
      .max(50, 'Domain must not exceed 50 characters.'),
  });

export const editDomainBlockSchema = () =>
  Yup.object().shape({
    domainName: Yup.string()
      .required('Domain is required.')
      .matches(
        /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Domain must be a valid domain format (e.g., example.com).'
      )
      .max(50, 'Domain must not exceed 50 characters.'),   
  });