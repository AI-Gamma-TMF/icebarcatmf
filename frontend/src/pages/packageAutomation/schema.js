import * as Yup from 'yup';

const packageSchema = (baseAmount) => Yup.object().shape({
  nonPurchasePackageId: Yup.number().nullable(),
  intervalDay: Yup.number().required("Interval day is required"),
  isActive: Yup.boolean(),
  discountedAmount: Yup.number()
    .when("isActive", {
      is: true,
      then: (schema) => schema.required("Discounted amount is required").moreThan(0, "Discounted amount must be greater than 0")
        .max(baseAmount, `Discount amount cannot exceed base amount : ${baseAmount}`),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
  bonusPercentage: Yup.number()
    .min(0, "Bonus percentage cannot be negative"),
  scCoin: Yup.number()
    .min(0, "SC cannot be negative"),
  gcCoin: Yup.number()
    .min(0, "GC cannot be negative"),
  scBonus: Yup.number()
    .min(0, "SC Bonus Coin cannot be negative"),
  gcBonus: Yup.number()
    .min(0, "GC Coin cannot be negative")
});

// Schema for the entire form
export const validationSchema = (baseAmounts) =>
  Yup.object().shape({
    NonPurchasePackages: Yup.array().of(
      Yup.lazy((_, _index) => packageSchema(baseAmounts))
    ),
  });
