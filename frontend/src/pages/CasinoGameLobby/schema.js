import * as Yup from "yup"

export const editProviderRateMatrixSchema = () =>
  Yup.object().shape({

    startDate: Yup.date()
      .nullable()
      .required("Start Date is required")
      .typeError("Invalid Start Date"),
    endDate: Yup.date()
      .nullable()
      .required("End Date is required")
      .typeError("Invalid End Date")
      .min(Yup.ref("startDate"), "End Date must be same or after Start Date"),

    discountPercentage: Yup.number()
      .required("Discount Percentage is required")
      .typeError("Discount Percentage must be a number")
      .min(1, "Minimum is 1%") 
      .max(100, "Maximum is 100%")
      .test(
        "decimal-places",
        "Discount Percentage can have at most 2 decimal places",
        (value) => /^\d+(\.\d{1,2})?$/.test(String(value))
      ),
  });



