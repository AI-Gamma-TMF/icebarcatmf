import * as Yup from "yup"

export const jackpotSettingsSchema = () =>
  Yup.object().shape({
    targetSpinCount: Yup.number()
      .required("Target Spin Count is required.")
      .min(0, "Target Spin Count must be at least 0."),
    injectSpeedMoney: Yup.number()
      .required("Inject Speed Money is required.")
      .min(0, "Inject Speed Money must be at least 0."),
    pool: Yup.number()
      .required("Pool is required.")
      .min(0, "Pool must be at least 0."),
    profitWalet: Yup.number()
      .required("Profit Walet is required.")
      .min(0, "Profit Walet must be at least 0."),
  })

export const providerSchema = Yup.object().shape({
  ggrMinimum: Yup.number()
    .required('Min GGR is required')
    .min(0, 'Must be ≥ 0'),

  rate: Yup.number()
    .required('Rate is required')
    .min(1, 'Rate % must be at least 1.')
    .test(
      'max-2-decimals',
      'Rate can have up to 2 decimal places.',
      (value) => {
        if (value === undefined || value === null) return true; // skip if not entered yet
        return /^\d+(\.\d{1,2})?$/.test(value.toString());
      }
    ),


  ggrMaximum: Yup.mixed()
    .test('is-valid-ggrMax', 'Invalid Max GGR', function (value) {
      if (typeof value === 'string') value = value.trim();

      const isEmpty = value === '' || value === null || value?.toLowerCase?.() === 'infinite';

      // If empty or "infinite", allow it (especially for last entry)
      if (isEmpty) return true;

      // Otherwise, must be a number
      const parsed = Number(value);
      return !isNaN(parsed) && parsed >= 0;
    })
    .when('ggrMinimum', (ggrMinimum, schema) =>
      schema.test({
        name: 'greaterThanMin',
        exclusive: false,
        message: 'Max GGR must be greater than Min GGR',
        test: function (value) {
          const val = (typeof value === 'string' && value?.toLowerCase?.() === 'infinite') ? null : Number(value);
          if (val === null) return true;
          return val > ggrMinimum;
        },
      })
    )
});


export const createProviderRateMatrixSchema = () =>
  Yup.object().shape({
    ggrMinimum: Yup.number()
      .required("GGR Minimum is required")
      .typeError("GGR Minimum must be a number")
      .min(0, "Minimum cannot be negative")
      .integer("Decimals not allowed"),
    ggrMaximum: Yup.number()
      .nullable()
      .typeError("GGR Maximum must be a number")
      .when('ggrMinimum', (ggrMinimum, schema) =>
        schema.test(
          'is-greater-than-minimum',
          'GGR Maximum must be greater than or equal to GGR Minimum',
          function (value) {
            if (value === undefined || value === null || value === '') return true;
            if (ggrMinimum === undefined || ggrMinimum === null || ggrMinimum === '') return true;
            return value >= ggrMinimum;
          }
        )
      ),

    rate: Yup.number()
      .required("Rate is required")
      .typeError("Rate must be a number")
      .min(0, "Minimum is 0%")
      .max(100, "Maximum is 100%")
      .test(
        "decimal-places",
        "Rate can have at most 2 decimal places",
        (value) => /^\d+(\.\d{1,2})?$/.test(String(value))
      ),
  });


export const editProviderRateMatrixSchema = () =>
  Yup.object().shape({
    ggrMinimum: Yup.number()
      .required("GGR Minimum is required")
      .typeError("GGR Minimum must be a number")
      .min(0, "Minimum cannot be negative")
      .integer("Decimals not allowed"),
    ggrMaximum: Yup.number()
      .nullable()
      .required("GGR Minimum is required")
      .typeError("GGR Maximum must be a number")
      .integer("Only whole numbers are allowed")
      .when('ggrMinimum', (ggrMinimum, schema) =>
        schema.test(
          'is-greater-than-minimum',
          'GGR Maximum must be greater than or equal to GGR Minimum',
          function (value) {
            if (value === undefined || value === null || value === '') return true;
            if (ggrMinimum === undefined || ggrMinimum === null || ggrMinimum === '') return true;
            return value >= ggrMinimum;
          }
        )
      ),
    rate: Yup.number()
      .required("Rate is required")
      .typeError("Rate must be a number")
      .min(0, "Minimum is 0%")
      .max(100, "Maximum is 100%")
      .test(
        "decimal-places",
        "Rate can have at most 2 decimal places",
        (value) => /^\d+(\.\d{1,2})?$/.test(String(value))
      ),
  });
