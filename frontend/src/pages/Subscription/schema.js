import * as Yup from 'yup'

export const subscriptionFeatureSchema = () => Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(
      /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
      " Invalid Subscription Feature Name"
    )
    .required('Feature name is required')
    .max(100, 'Feature name must be under 100 characters'),

  description: Yup.string()
    .trim()
    .matches(
      /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/,
      "Invalid Feature Description"
    )
    .required('Feature description is required')
    .max(250, 'Description must be under 250 characters'),

  isActive: Yup.boolean().required('Active status is required'),
});

export const subscriptionSchema = Yup.object().shape({
  name: Yup.string().max(15, "Subscription name should not be more than 15 characters")
    .required("Subscription name is required")
    .matches(/^(?!\s*$).+/, "Subscription name cannot be empty or just spaces"),
  description: Yup.string()
    .min(1, "Description must be at least 1 character")
    .max(50, "Description should not be more than 50 characters")
    .matches(/^(?!\s*$).+/, "Description cannot be empty or just spaces")
    .required("Description is required"),
  monthlyAmount: Yup.number()
    .typeError("Monthly Amount must be a number")
    .moreThan(0, "Monthly Amount must be more than 0")
    .min(1, "Monthly Amount must not be less than 1")
    // .integer("Duration must be a whole number")
    .required("Monthly Amount is required")
    .test(
      "monthly-vs-yearly",
      "Monthly Amount cannot be greater than Yearly Amount",
      function (value) {
        const { yearlyAmount } = this.parent;
        if (!value || !yearlyAmount) return true;
        return value <= yearlyAmount;
      }
    ),
  yearlyAmount: Yup.number()
    .typeError("Yearly Amount must be a number")
    .moreThan(0, "Yearly Amount must be more than 0")
    .min(1, "Yearly Amount must not be less than 1")
    // .integer("Duration must be a whole number")
    .required("Yearly Amount is required"),
  weeklyPurchaseCount: Yup.number()
    .typeError("Weekly Purchase Count must be a number")
    .integer("Weekly Purchase Count must be a whole number"),
  scCoin: Yup.number()
    .typeError("Bonus SC must be a number")
    .integer("Bonus SC must be a whole number"),
  gcCoin: Yup.number()
    .typeError("Bonus GC must be a number")
    .integer("Bonus GC must be a whole number"),
  platform: Yup.string().required("Platform is required"),
  isActive: Yup.boolean().required(),
  specialPlan: Yup.boolean().required(),
  thumbnail: Yup.mixed()
    .nullable()
    .test("fileSize", "File size must be less than 5MB", (value) => {
      if (!value || typeof value === "string") return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only JPG, PNG, JPEG, WEBP formats are supported", (value) => {
      if (!value || typeof value === "string") return true;
      return ["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(value.type);
    })
    .test("fileDimensions", "Image dimensions must be exactly 64x64 pixels", (value) => {
      if (!value || typeof value === "string") return true;
      return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(value);
        img.onload = () => {
          resolve(img.width === 64 && img.height === 64);
        };
        img.onerror = () => resolve(false);
      });
    })
    .required("Thumbnail is required"),
  features: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    )
    .min(1, "At least one feature must be selected")
    .required("Features are required"),
});

export default subscriptionSchema;
