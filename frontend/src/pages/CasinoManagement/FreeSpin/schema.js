import * as Yup from "yup";

export const freeSpinSchema = () =>
  Yup.object().shape({
    providerId: Yup.number().required("Please select a Provider"),
    masterCasinoGameId: Yup.number().required("Please Select a Game Id"),

    title: Yup.string().trim().required("Title is required"),
     startDate: Yup.date()
      .nullable()
      .typeError("The value must be a valid date (MM/DD/YYYY)")
      .test(
        "start-before-end",
        "Start Date must be earlier than End Date",
        function (startDate) {
          const { endDate } = this.parent;
          if (startDate && endDate) {
            return new Date(startDate) <= new Date(endDate);
          }
          return true;
        }
      )
      .test(
        "required-if-endDate-present",
        "Start Date is required if End Date is provided",
        function (startDate) {
          const { endDate } = this.parent;
          return !!endDate ? !!startDate : true;
        }
      ),

    endDate: Yup.date()
      .nullable()
      .typeError("The value must be a valid date (MM/DD/YYYY)")
      .min(new Date(), "End Date cannot be earlier than today.")
      .test(
        "required-if-startDate-present",
        "End Date is required if Start Date is provided",
        function (endDate) {
          const { startDate } = this.parent;
          return !!startDate ? !!endDate : true;
        }
      ),

    coinType: Yup.string().required("Coin type ise required"),
    freeSpinAmount: Yup.number()
      .required("Free Spin Amount is required")
      .moreThan(0.09, "Free Spin Amount must be greater or equal to 0.1"),

    freeSpinRound: Yup.number()
      .required("Free Spin round is required")
      .moreThan(0, "Free Spin Round must be greater than 0"),

    freeSpinType: Yup.string().required("Please select a free spin type"),
    emailTemplateId: Yup.string().when("isNotifyUser", {
      is: true,
      then: (schema) => schema.required("Email Template is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    isNotifyUser: Yup.boolean(),
     subscriptionId: Yup.string().when("freeSpinType", {
      is: "subscriptionGrant",
      then: (schema) => schema.required("Subscription Type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

export const updatefreeSpinSchema = () =>
  Yup.object().shape({
    providerId: Yup.number().required("Please select a Provider"),
    masterCasinoGameId: Yup.number().required("Please Select a Game Id"),

    title: Yup.string().trim().required("Title is required"),
    startDate: Yup.date()
      .nullable()
      .when("freeSpinType", {
        is: (val) => val !== "attachedGrant",
        then: (schema) =>
          schema
            .typeError("The value must be a valid date (MM/DD/YYYY)")
            .test(
              "start-date-end",
              "Start Date must be earlier than End Date",
              function (startDate) {
                const { endDate } = this.parent;
                if (startDate && endDate) {
                  return new Date(startDate) <= new Date(endDate);
                }
                return true;
              }
            ),
        otherwise: (schema) => schema.notRequired(),
      }),

    endDate: Yup.date()
      .nullable()
      .when("freeSpinType", {
        is: (val) => val !== "attachedGrant",
        then: (schema) =>
          schema
            .typeError("The value must be a valid date (MM/DD/YYYY)")
            .min(new Date(), "End Date cannot be earlier than today."),
        otherwise: (schema) => schema.notRequired(),
      }),

    coinType: Yup.string().required("Coin type is required"),
    freeSpinAmount: Yup.number()
      .required("Free Spin Amount is required")
      .moreThan(0.09, "Free Spin Amount must be greater or equal to 0.1"),

    freeSpinRound: Yup.number()
      .required("Free Spin round is required")
      .moreThan(0, "Free Spin Round must be greater than 0"),

    freeSpinType: Yup.string().required("Please select a free spin type"),

    emailTemplateId: Yup.string().when("isNotifyUser", {
      is: true,
      then: (schema) => schema.required("Email Template is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    isNotifyUser: Yup.boolean(),
     subscriptionId: Yup.string().when("freeSpinType", {
      is: "subscriptionGrant",
      then: (schema) => schema.required("Subscription Type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
