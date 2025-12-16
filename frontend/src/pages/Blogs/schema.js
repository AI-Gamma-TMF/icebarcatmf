import * as Yup from 'yup';

// export const createBlogSchema = () =>
//   Yup.object().shape({
//     metaTitle: Yup.string().min(60).max(70).required('Title is Required.'),
//     metaDescription: Yup.string().min(150).max(160).required('Description is Required.'),
//     slug: Yup.string().matches(/^[a-z]+(-[a-z]+)+$/, 'Url must contain Only lowercase letters and hyphens ').required('URL is Required.'),
//     postHeading: Yup.string().max(60).required('Blog heading is Required.'),
//     bannerImageUrl: Yup.string().required('Blog Image is Required.'),
//     bannerImageAlt: Yup.string().required('Alt content is Required.'),
//     contentBody: Yup.string().required('Description is Required.'),
//     seoKeywords: Yup.string().required('Seo keywords is Required.'),
//   });

// export const createBlogSchema = (t) =>
//   Yup.object().shape({
//     metaTitle: Yup.string().min(60).max(70).required('Title is Required.'),
//     metaDescription: Yup.string().min(150).max(160).required('Description is Required.'),
//     slug: Yup.string().matches(/^[a-z]+(-[a-z]+)+$/, 'Url must contain Only lowercase letters and hyphens ').required('URL is Required.'),
//     postHeading: Yup.string().max(60).required('Blog heading is Required.'),
//     bannerImageUrl: Yup.string().required('Blog Image is Required.'),
//     bannerImageAlt: Yup.string().required('Alt content is Required.'),
//     contentBody: Yup.string().required('Description is Required.'),
//     seoKeywords: Yup.string().required('Seo keywords is Required.'),
//   });

export const blogValidationSchema = Yup.object().shape({
  metaTitle: Yup.string()
    .required('Title is required')
    .max(80, 'MetaTitle must be at most 80 characters')
    .test(
      'no-leading-trailing-or-multiple-spaces',
      'No white spaces are allowed in the Title',
      value => {
        if (typeof value !== 'string') return false;
        return value.trim() === value && !value.includes('  ');
      }
    ),

  metaDescription: Yup.string()
    .required('Description is required')
    .max(180, 'Description must be at most 180 characters')
    .test(
      'no-leading-trailing-or-multiple-spaces',
      'No white spaces are allowed in the Description',
      value => {
        if (typeof value !== 'string') return false;
        return value.trim() === value && !value.includes('  ');
      }
    ),
  slug: Yup.string()
    .required('URL is required')
    .matches(
      /^[a-z]+(-[a-z]+)*$/,
      'Use lowercase words separated by a single hyphen; no spaces or extra hyphens.'
    )
    .test(
      'no-leading-trailing-or-multiple-spaces',
      'No leading, trailing, or multiple spaces allowed in the slug',
      value => {
        if (typeof value !== 'string') return false;
        return value.trim() === value && !value.includes(' ');
      }
    ),
  schema: Yup.string()
    .required('Schema is required')
    .test(
      'not-empty-after-trim',
      'Schema cannot be only white spaces',
      value => typeof value === 'string' && value.trim().length > 0
    ),

  postHeading: Yup.string()
    .required('Post Heading is required')
    .test(
      'no-leading-trailing-or-multiple-spaces',
      'No white spaces are allowed in the Heading',
      value => {
        if (typeof value !== 'string') return false;
        return value.trim() === value && !value.includes('  ');
      }
    ),
  bannerImageUrl: Yup.mixed()
    .required('Banner Image is required'),

  bannerImageAlt: Yup.string()
    .required('Banner Image Alt Text is required')
    .test(
      'no-leading-trailing-or-multiple-spaces',
      'No white spaces are allowed in the Alt text',
      value => {
        if (typeof value !== 'string') return false;
        return value.trim() === value && !value.includes('  ');
      }
    ),

  // contentBody: Yup.string()
  //   .required('HTML code is required')
  //   .test(
  //     'is-valid-html',
  //     'HTML code must include valid tags',
  //     value => {
  //       if (!value) return false;
  //       // Simple regex to check for basic HTML tags
  //       return /<\/?[a-z][\s\S]*>/i.test(value);
  //     }
  //   ),

  isActive: Yup.boolean(),

  isPopularBlog: Yup.boolean(),
});


export const addFaqSchema = Yup.object({
  faqs: Yup.array().of(
    Yup.object({
      question: Yup.string()
        .trim('No leading or trailing whitespace allowed')
        .strict(true)
        .required('Question is required')
        .max(150, 'Question must be at most 150 characters')
        .test(
          'no-empty-space',
          'Question cannot be only whitespace',
          value => value && value.trim().length > 0
        ),
      answer: Yup.string()
        .trim('No leading or trailing whitespace allowed')
        .strict(true)
        .required('Answer is required')
        .max(500, 'Answer must be at most 500 characters')
        .test(
          'no-empty-space',
          'Answer cannot be only whitespace',
          value => value && value.trim().length > 0
        )
    })
  )
});