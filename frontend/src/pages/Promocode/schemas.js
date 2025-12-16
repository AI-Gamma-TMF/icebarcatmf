import * as Yup from "yup";
// const today = new Date(Date.now());

export const createPromoSchema = () =>
  Yup.object().shape({
    promocode: Yup.string()
      .required("Promocode is required.")
      .matches(
        /^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,15}$/,
        "Promocode must be alphanumeric, between 4 and 15 characters long, and include at least one alphabetic character."
      )
      .min(4, "Promocode must be at least 4 characters long.")
      .max(15, "Promocode must be at most 15 characters long."),
    description: Yup.string()
      .min(4, "Description must be at least 4 characters long.")
      .max(100, "Description must be at most 100 characters long."),
    // isActive: Yup.boolean().required("Active status is required."),

    validFrom: Yup.date()
      .required("Start Date is required")
      .min(new Date(), "Start Date and Time cannot be in the past.")
      .typeError("Start Date must be a valid date"),

    validTill: Yup.date()
      .required("End Date is required")
      .min(
        Yup.ref("validFrom"),
        "End Date and Time must be greater than or equal to Start Date and Time"
      )
      .typeError("End Date must be a valid date"),


    // validFrom: Yup.date()
    //   .typeError("The value must be a date (MM-DD-YYYY)"),

    // validTill: Yup.date().when(["isValidUntil", "validFrom"], {
    //   is: (isValidUntil, validFrom) => isValidUntil && !!validFrom,
    //   then: (schema) =>
    //     schema
    //       .typeError("The value must be a date (MM-DD-YYYY)")
    //       .min(
    //         Yup.ref("validFrom"),
    //         "Valid Till cannot be earlier than Valid From."
    //       )
    //       .required("Valid Till field is required."),
    //   otherwise: (schema) => schema.notRequired(),
    // }),
    maxUsersAvailed: Yup.number()
      .min(0, "Max Users Availed must be at least 0."),
      // .required("Max Users Availed is required."),
    perUserLimit: Yup.number()
      // .required("Per user limit is required.")
      .min(0, "Per user limit must be at least 0."),
    isDiscountOnAmount: Yup.boolean().required(
      "Discount on Amount is required."
    ),
    //isDiscountOnAmount: Yup.boolean(),
    discountPercentage: Yup.number().when("isDiscountOnAmount", {
      is: true,
      then: () =>
        Yup.number()
          .required("Discount percentage is required.")
          .min(1, "Discount percentage must be at least 1.")
          .max(99, "Discount percentage must be less than 100."),
      otherwise: () =>
        Yup.number()
          .required("Bonus percentage is required.")
          .min(1, "Bonus percentage must be at least 1.")
          .max(100, "Bonus percentage must be at most 100."),
    }),
    // bonusPercentage :Yup.number().when('isDiscountOnAmount', {
    //   is: false,
    //   then: () => Yup.number()
    //   .required('Bonus percentage is required.')
    //     .min(1, 'Bonus percentage must be at least 1.')
    //     .max(100, 'Bonus percentage must be at most 100.'),
    //   // otherwise: () => Yup.number()
    //   // .required('Bonus percentage is required.')
    //   // .min(1, 'Bonus percentage must be at least 1.')
    //   // .max(99, 'Discount percentage must be less than 100.'),
    // }),
    promotionName: Yup.string().when("crmPromocode", {
      is: true,
      then: () => Yup.string().required("Promotion Name is required."),
    }),
  });

export const editPromoSchema = (maxUsersAvailedCount) =>
  Yup.object().shape({
    promocode: Yup.string()
      .required("Promocode is required.")
      .matches(
        /^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,15}$/,
        "Promocode must be alphanumeric, between 4 and 15 characters long, and include at least one alphabetic character."
      )
      .min(4, "Promocode must be at least 4 characters long.")
      .max(15, "Promocode must be at most 15 characters long."),
    description: Yup.string()
      .min(4, "Description must be at least 4 characters long.")
      .max(100, "Description must be at most 100 characters long."),
    // isActive: Yup.boolean().required("Active status is required."),
    // validFrom: Yup.date()
    //   .typeError("The value must be a date (MM-DD-YYYY)"),

    // validTill: Yup.date().when(["isValidUntil", "validFrom"], {
    //   is: (isValidUntil, validFrom) => isValidUntil && !!validFrom,
    //   then: (schema) =>
    //     schema
    //       .typeError("The value must be a date (MM-DD-YYYY)")
    //       .min(
    //         Yup.ref("validFrom"),
    //         "Valid Till cannot be earlier than Valid From."
    //       )
    //       .required("Valid Till field is required."),
    //   otherwise: (schema) => schema.notRequired(),
    // }),
    validFrom: Yup.date()
      .required("Start Date is required")
      // .min(new Date(), "Start Date and Time cannot be in the past.")
      .typeError("Start Date must be a valid date"),

    validTill: Yup.date()
      .required("End Date is required")
      .min(
        Yup.ref("validFrom"),
        "End Date and Time must be greater than or equal to Start Date and Time"
      )
      .typeError("End Date must be a valid date"),
    maxUsersAvailed: Yup.number()
      .min(0, "Max Users Availed must be at least 0.")
      // .required("Max Users Availed is required.")
      .test(
        "maxUsersAvailed-greater-than-maxUsersAvailedCount",
        `Max Users Availed must be greater than ${maxUsersAvailedCount}.`,
        function (value) {
          return value === 0 ? true : value >= maxUsersAvailedCount;
        }
      ),
    perUserLimit: Yup.number()
      // .required("Per user limit is required.")
      .min(0, "Per user limit must be at least 0."),
    isDiscountOnAmount: Yup.boolean().required(
      "Discount on Amount is required."
    ),
    //isDiscountOnAmount: Yup.boolean(),
    discountPercentage: Yup.number().when("isDiscountOnAmount", {
      is: true,
      then: () =>
        Yup.number()
          .required("Discount percentage is required.")
          .min(1, "Discount percentage must be at least 1.")
          .max(99, "Discount percentage must be less than 100."),
      otherwise: () =>
        Yup.number()
          .required("Bonus percentage is required.")
          .min(1, "Bonus percentage must be at least 1.")
          .max(100, "Bonus percentage must be at most 100."),
    }),
    // bonusPercentage: Yup.number().when('isDiscountOnAmount', {
    //   is: false,
    //   // then: () => Yup.number()
    //   //   .required('Discount percentage is required.')
    //   //   .min(1, 'Discount percentage must be at least 1.')
    //   //   .max(99, 'Discount percentage must be less than 100.'),
    //   then: () => Yup.number()
    //     .required('Bonus percentage is required.')
    //     .min(1, 'Bonus percentage must be at least 1.')
    //     .max(100, 'Bonus percentage must be at most 100.'),
    // }),
  });

export const reusePromocodeSchema = Yup.object().shape({
  // isValidUntil: Yup.boolean(),
  validFrom: Yup.date()
      .required("Start Date is required")
      .min(new Date(), "Start Date and Time cannot be in the past.")
      .typeError("Start Date must be a valid date"),

    validTill: Yup.date()
      .required("End Date is required")
      .min(
        Yup.ref("validFrom"),
        "End Date and Time must be greater than or equal to Start Date and Time"
      )
      .typeError("End Date must be a valid date"),

  // validTill: Yup.date()
  //   .when("isValidUntil", {
  //     is: true,
  //     then: (schema) =>
  //       schema
  //         .min(new Date(), "Date and Time cannot be earlier than today.")
  //         .typeError("The value must be a valid date (MM/DD/YYYY)")
  //         .required("This field is required"),
  //     otherwise: (schema) => schema.notRequired(),
  //   }),
  maxUsersAvailed: Yup.number()
    .min(0, "Max Users Availed must be at least 0.")
    .integer("Max Users Availed must be a whole number.")
    .required("Max Users Availed is required."),
  perUserLimit: Yup.number()
    .required("Per user limit is required.")
    .integer("Max Users Availed must be a whole number.")
    .min(0, "Per user limit must be at least 0."),
});
