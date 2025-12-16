
import * as Yup from "yup";







export const imageSchema = Yup.object().shape({
  images: Yup.array()
    .of(
      Yup.object().shape({
        imageCaption: Yup.string().required("Caption is required"),
        altText: Yup.string().required("Alt Text is required"),
        file: Yup.mixed().test(
          "fileOrUrl",
          "Image is required",
          function (value) {
            const { imageUrl } = this.parent;
            return !!value || !!imageUrl;
          }
        ),
      })
    )
    .min(1, "At least one image is required"),
});

export const addImageBlockSchema = Yup.object().shape({
  images: Yup.array().of(imageSchema),
});

export const gamePageValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .max(80, 'Title must be at most 80 characters')
    .test(
      'no-leading-trailing-or-multiple-spaces',
      'No white spaces are allowed in the Title',
      value => {
        if (typeof value !== 'string') return false;
        return value.trim() === value && !value.includes('  ');
      }
    ),
  metaTitle: Yup.string()
    .required('Meta Title is required')
    .max(80, 'Meta Title must be at most 80 characters')
    .test(
      'no-leading-trailing-or-multiple-spaces',
      'No white spaces are allowed in the Meta Title',
      value => {
        if (typeof value !== 'string') return false;
        return value.trim() === value && !value.includes('  ');
      }
    ),
  metaDescription: Yup.string()
    .required('Description is required')
    .max(150, 'Description must be at most 150 characters')
    .test(
      'no-leading-trailing-or-multiple-spaces',
      'No white spaces are allowed in the Description',
      value => {
        if (typeof value !== 'string') return false;
        return value.trim() === value && !value.includes('  ');
      }
    ),

  heading: Yup.string()
    .required('Heading is required')
    .max(180, 'Heading must be at most 180 characters')
    .test(
      'no-leading-trailing-or-multiple-spaces',
      'No white spaces are allowed in the Heading',
      value => {
        if (typeof value !== 'string') return false;
        return value.trim() === value && !value.includes('  ');
      }
    ),
  schema: Yup.string()
    .required('Schema is required')
    .test(
      'not-empty-after-trim',
      'Schema cannot be only white spaces',
      value => typeof value === 'string' && value.trim().length > 0
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
  isActive: Yup.boolean(),
  images: Yup.array()
    .of(
      Yup.object().shape({
        imageCaption: Yup.string()
          .required("Title is required")
          .test(
            "no-leading-trailing-spaces-caption",
            "Title must not have leading or trailing spaces",
            (value) => value === value?.trim()
          ),
        altText: Yup.string()
          .required("Description is required")
          .test(
            "no-leading-trailing-spaces-altText",
            "Description must not have leading or trailing spaces",
            (value) => value === value?.trim()
          ),
        imageUrl: Yup.string().url().nullable(),
        file: Yup.mixed()
          .nullable()
          .test("file-or-url", "Image is required", function (value) {
            const imageUrl = this.parent.imageUrl;
            if (imageUrl) return true;
            return value instanceof File;
          })
          .test(
            "fileFormat",
            "Only PNG, JPG, JPEG, and WEBP images are allowed",
            function (value) {
              // if no file uploaded, skip this (handled by required test)
              if (!value) return true;

              const supportedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
              return supportedFormats.includes(value.type);
            }
          ),

      })
    )
    .min(1, "At least one Image is required"),

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