import * as Yup from "yup";
// const yesterday = new Date(Date.now() - 86400000);

const positiveNumberOrZero = (value) => {
  if (value === null || value === undefined) return false;
  const num = parseFloat(value.replace(/,/g, ""));
  return num >= 0; // Allow 0 or any positive number
};

export const createPackageSchema = Yup.object()
  .shape({
    isLadderPackage: Yup.boolean(),
    packageName: Yup.string()
      .matches(
        /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
        "Package Name Invalid"
      )
      .when("isLadderPackage", {
        is: false,
        then: (schema) => schema.min(3, "Package name must be at least 3 characters")
          .max(15, "Package name must be at most 15 characters")
          .required("Package name is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    packageTag: Yup.string()
      .nullable()
      .notRequired()
      .matches(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, "Package Tag Invalid")
      .min(3, "Package Tag must be at least 3 characters")
      .max(15, "Package Tag must be at most 15 characters")
      .transform((value) => (value === "" ? null : value)),
    amount: Yup.number()
      .when("isLadderPackage", {
        is: false,
        then: (schema) => schema.typeError("Enter Positive number")
          .min(0, "Amount must be a positive number greater than 0")
          .max(1000000, "Maximum allowed amount is 10,00,000")
          .required("Amount Required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    gcCoin: Yup.string()
      // .matches(
      //   /^(?!-)(?!.*--)\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
      //   'Enter a valid number with up to two decimal places'
      // )
      .when("isLadderPackage", {
        is: false,
        then: (schema) => schema.required("GC Coin Required"),
        otherwise: (schema) => schema.notRequired(),
      })
      .test(
        "is-positive-or-zero",
        "Amount must be a non-negative number (0 or greater)",
        function (value) {
          const { isLadderPackage } = this.parent;
          if (!isLadderPackage && value) {
            positiveNumberOrZero(value);
          }
          return true;
        }
      ),

    scCoin: Yup.string()
      // .matches(
      //   /^(?!-)(?!.*--)\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
      //   'Enter a valid number with up to two decimal places'
      // )
      .when("isLadderPackage", {
        is: false,
        then: (schema) => schema.required("SC Coin Required"),
        otherwise: (schema) => schema.notRequired(),
      })
      .test(
        "is-positive-or-zero",
        "Amount must be a non-negative number (0 or greater)",
        function (value) {
          const { isLadderPackage } = this.parent;
          if (!isLadderPackage && value) {
            positiveNumberOrZero(value);
          }
          return true;
        }
      ),

    ladderPackageData: Yup.array()
      .when("isLadderPackage", {
        is: true,
        then: (schema) => schema.min(1, 'There must be atleast one package added.')
          .max(10, 'Maximum 10 packages are allowed to create at once.'),
        otherwise: (schema) => schema.notRequired(),
      }),


    image: Yup.mixed()
      .nullable()
      .test(
        "File Size",
        "File Size Should be Less Than 1MB",
        (value) => !value || (value && value.size <= 1024 * 1024)
      )
      .test(
        "FILE_FORMAT",
        "Uploaded file has unsupported format",
        (value) =>
          !value ||
          (value && ["image/png", "image/jpeg", "image/jpg"].includes(value.type))
      ).test(
        "image-or-imageUrl-Required",
        "Thumbnail Required",
        function (_value) {

          const { image, imageUrl } = this.parent;
          return !!(image || imageUrl);
        }
      ),

    imageUrl: Yup.string()
      .nullable()
      .test(
        "image-or-imageUrl-Required",
        "Thumbnail Required",
        function (_value) {

          const { image, imageUrl } = this.parent;
          return !!(image || imageUrl);
        }
      ),

    welcomePurchaseBonusApplicable: Yup.boolean().required(),
    welcomePurchaseBonusApplicableMinutes: Yup.number().when(
      "welcomePurchaseBonusApplicable",
      {
        is: true,
        then: (schema) =>
          schema
            .max(1440, "Cannot be more than 1440 minutes")
            .required("Minutes are required"),
        otherwise: (schema) => schema.notRequired(),
      }
    ),
    welcomePurchasePercentage: Yup.number()
      .typeError("Enter Positive number")
      .min(
        0,
        "Welcome Purchase Percentage must be a positive number greater than 0"
      )
      .required("Amount Required"),
    // packageType: Yup.string().required('Package Type is required'),

    isScheduledPackage: Yup.boolean(),
    isSpecialPackage: Yup.boolean(),
    isSubscriberOnly: Yup.boolean(),

    isValidUntil: Yup.boolean(),
    isValidFrom: Yup.boolean(),

    validFrom: Yup.date()
      .when(['isValidFrom'], {
        is: (isValidFrom) => isValidFrom,
        then: (schema) =>
          schema
            .min(new Date(), 'Date and Time cannot be earlier than today.')
            .typeError('The value must be a valid date (MM/DD/YYYY)')
            .required('This field is required'),
        otherwise: (schema) => schema.notRequired(),
      })
      .test(
        'valid-from-before-valid-till',
        'Valid From must be earlier than Valid Until',
        function (validFrom) {
          const { validTill } = this.parent;
          if (validFrom && validTill) {
            return new Date(validFrom) <= new Date(validTill);
          }
          return true;
        }
      ),

    validTill: Yup.date()
      .when(['isValidUntil'], {
        is: (isValidUntil) => isValidUntil,
        then: (schema) =>
          schema
            .min(new Date(), 'Date and Time cannot be earlier than today.')
            .typeError('The value must be a valid date (MM/DD/YYYY)')
            .required('This field is required'),
        otherwise: (schema) => schema.notRequired(),
      }),

    // .test(
    //   "valid-till-after-valid-from",
    //   "Valid Till must be later than Valid From",
    //   function (validTill) {
    //     const { validFrom } = this.parent;
    //     if (validFrom && validTill) {
    //       return new Date(validTill) >= new Date(validFrom);
    //     }
    //     return true;
    //   }
    // ),

    // validTill: Yup.date().when('isValidUntil', {
    //   is: true,
    //   then: () => Yup.date()
    //     .min(yesterday, 'Date cannot be earlier than today.')
    //     .typeError('The value must be a valid date (MM/DD/YYYY)')
    //     .required('This field is required'),
    //   otherwise: () => Yup.mixed().notRequired(),
    // }),
    firstPurchaseApplicable: Yup.boolean(),
    firstPurchaseScBonus: Yup.number().when("firstPurchaseApplicable", {
      is: true,
      then: (schema) =>
        schema.min(0, "Must be greater than 0").required("Required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    firstPurchaseGcBonus: Yup.number().when("firstPurchaseApplicable", {
      is: true,
      then: (schema) =>
        schema.min(0, "Must be greater than 0").required("Required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  });

export const updatePackageSchema = (packageData) => Yup.object().shape({
  packageName: Yup.string()
    .matches(
      /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/
      ,
      "Package Name Invalid"
    )
    .min(3, "Package name must be at least 3 characters")
    .max(50, "Package name must be at most 50 characters")
    .required("Package name is required"),
  packageTag: Yup.string()
  .nullable()
  .notRequired()
  .matches(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, "Package Tag Invalid")
  .min(3, "Package Tag must be at least 3 characters")
  .max(15, "Package Tag must be at most 15 characters")
  .transform((value) => (value === "" ? null : value)),
  amount: Yup.number()
    .typeError("Enter Positive number")
    .min(0, "Amount must be a positive number greater than 0")
    .max(1000000, "Maximum allowed amount is 10,00,000")
    .required("Amount Required"),
  welcomePurchaseBonusApplicable: Yup.boolean().required(),

welcomePurchaseBonusApplicableMinutes: Yup.mixed().when(
  "welcomePurchaseBonusApplicable",
  {
    is: true,
    then: () =>
      Yup.number()
        .typeError("Must be a number")
        .transform((value, originalValue) => {
          if (typeof originalValue === "string") {
            const trimmed = originalValue.trim();
            return trimmed === "" ? null : Number(trimmed);
          }
          return value;
        })
        .nullable()
        .required("Minutes are required")
        .max(1440, "Cannot be more than 1440 minutes"),
    otherwise: () => Yup.mixed().notRequired(),
  }
),

  welcomePurchasePercentage: Yup.number()
    .typeError("Enter Positive number")
    .min(
      0,
      "Welcome Purchase Percentage must be a positive number greater than 0"
    )
    .required("Amount Required"),
  gcCoin: Yup.string()
    .matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "Enter Positive number"
    )
    .matches(/^\+?(0|[1-9]\d*)$/, "Decimal values not allowed")
    .test(
      "is-positive-non-zero",
      "Amount must be a positive number greater than 0",
      positiveNumberOrZero
    )
    .required("GC Coin Required"),
  scCoin: Yup.string()
    .matches(
      /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
      "Enter Positive number"
    )
    .matches(/^\+?(0|[1-9]\d*)$/, "Decimal values not allowed")
    .test(
      "is-positive-non-zero",
      "Amount must be a positive number greater than 0",
      positiveNumberOrZero
    )
    .required("SC Coin Required"),

  isScheduledPackage: Yup.boolean(),
  isSpecialPackage: Yup.boolean(),
  isSubscriberOnly: Yup.boolean(),

  image: Yup.mixed()
    .nullable()
    .test(
      "File Size",
      "File Size Should be Less Than 1MB",
      (value) => !value || (value && value.size <= 1024 * 1024)
    )
    .test(
      "FILE_FORMAT",
      "Uploaded file has unsupported format",
      (value) =>
        !value ||
        (value && ["image/png", "image/jpeg", "image/jpg"].includes(value.type))
    ).test(
      "image-or-imageUrl-Required",
      "Thumbnail Required",
      function (_value) {

        const { image, imageUrl } = this.parent;
        return !!(image || imageUrl);
      }
    ),

  imageUrl: Yup.string()
    .nullable()
    .test(
      "image-or-imageUrl-Required",
      "Thumbnail Required",
      function (_value) {

        const { image, imageUrl } = this.parent;
        return !!(image || imageUrl);
      }
    ),
  // packageType: Yup.string().required('Package Type is required'),
  isValidUntil: Yup.boolean(),
  isValidFrom: Yup.boolean(),

  validFrom: (packageData?.freezeValidFrom && (packageData?.claimedCount > 0 || packageData?.isActive))
    ? Yup.date().nullable() // skip validation when frozen
    : Yup.date()
      .when(['isValidFrom'], {
        is: (isValidFrom) => isValidFrom,
        then: (schema) =>
          schema
            .min(new Date(), 'Date and Time cannot be earlier than today.')
            .typeError('The value must be a valid date (MM/DD/YYYY)')
            .required('This field is required'),
        otherwise: (schema) => schema.notRequired(),
      })
      .test(
        'valid-from-before-valid-till',
        'Valid From must be earlier than Valid Until',
        function (validFrom) {
          const { validTill, _isValidFrom } = this.parent;
          if (validFrom && validTill) {
            return new Date(validFrom) <= new Date(validTill);
          }
          return true;
        }
      ),

  validTill: (packageData?.freezeValidTill && (packageData?.claimedCount > 0 || packageData?.isActive))
    ? Yup.date().nullable() // skip validation when frozen
    : Yup.date()
      .when(['isValidUntil'], {
        is: (isValidUntil) => isValidUntil,
        then: (schema) =>
          schema
            .min(new Date(), 'Date and Time cannot be earlier than today.')
            .typeError('The value must be a valid date (MM/DD/YYYY)')
            .required('This field is required'),
        otherwise: (schema) => schema.notRequired(),
      }),

  firstPurchaseScBonus: Yup.number().when("firstPurchaseApplicable", {
    is: true,
    then: (schema) =>
      schema.min(0, "Must be greater than 0").required("Required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  firstPurchaseGcBonus: Yup.number().when("firstPurchaseApplicable", {
    is: true,
    then: (schema) =>
      schema.min(0, "Must be greater than 0").required("Required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});


export const reusePackageSchema = Yup.object().shape({
  isScheduledPackage: Yup.boolean(),
  validFrom: Yup.date()
    .nullable()
    .when('isScheduledPackage', {
      is: true,
      then: (schema) =>
        schema
          .min(new Date(), "Date and Time cannot be earlier than today.")
          .typeError("The value must be a valid date (MM/DD/YYYY)")
          .required("This field is required"),
      otherwise: (schema) => schema.notRequired(),
    })
    .test(
      'valid-from-before-valid-till',
      'Valid From must be earlier than Valid Until',
      function (validFrom) {
        const { validTill, isScheduledPackage } = this.parent;
        if (isScheduledPackage && validFrom && validTill) {
          return new Date(validFrom) <= new Date(validTill);
        }
        return true;
      }
    ),

  validTill: Yup.date()
    .nullable()
    .when('isScheduledPackage', {
      is: true,
      then: (schema) =>
        schema
          .min(new Date(), "Date and Time cannot be earlier than today.")
          .typeError("The value must be a valid date (MM/DD/YYYY)")
          .required("This field is required"),
      otherwise: (schema) => schema.notRequired(),
    })
    .test(
      'valid-till-after-valid-from',
      'Valid Till must be later than Valid From',
      function (validTill) {
        const { validFrom, isScheduledPackage } = this.parent;
        if (isScheduledPackage && validFrom && validTill) {
          return new Date(validTill) >= new Date(validFrom);
        }
        return true;
      }
    ),
});