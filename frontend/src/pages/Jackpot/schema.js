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


export const creatJackpotSchema = () =>
  Yup.object().shape({
    jackpotName: Yup.string()
      .required("Jackpot Name is required")
      .max(100, "Jackpot Name must be at most 100 characters")
      .matches(
        /^(?! )[A-Za-z0-9!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>/?]+(?: [A-Za-z0-9!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>/?]+)*$/,
        "No leading, trailing, or consecutive spaces allowed"
      ),

    maxTicketSize: Yup.number()
      .required("Max Ticket Size is required")
      .typeError("Max Ticket Size must be a number")
      .positive("Max Ticket Size must be greater than 0"),

    seedAmount: Yup.number()
      .required("Seed Amount is required")
      .typeError("Seed Amount must be a number")
      .positive("Seed Amount must be greater than 0"),

    entryAmount: Yup.number()
      .required("Entry Amount is required")
      .typeError("Entry Amount must be a number")
      .positive("Entry Amount must be greater than 0"),

    adminShare: Yup.number()
      .required("Admin Share is required")
      .typeError("Admin Share must be a number")
      .min(0, "Admin Share must be at least 0%")
      .max(100, "Admin Share cannot exceed 100%")
      .test(
        "decimal-places",
        "Admin Share can have at most 2 decimal places",
        (value) => /^\d+(\.\d{1,2})?$/.test(String(value))
      ),

    poolShare: Yup.number()
      .required("Pool Share is required")
      .typeError("Pool Share must be a number")
      .min(0, "Pool Share must be at least 0%")
      .max(100, "Pool Share cannot exceed 100%")
      .test(
        "decimal-places",
        "Pool Share can have at most 2 decimal places",
        (value) => /^\d+(\.\d{1,2})?$/.test(String(value))
      ),

  });

export const editJackpotSchema = () =>
  Yup.object().shape({
    jackpotName: Yup.string()
      .required("Jackpot Name is required")
      .max(100, "Jackpot Name must be at most 100 characters")
      .matches(
        /^(?! )[A-Za-z0-9!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>/?]+(?: [A-Za-z0-9!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>/?]+)*$/,
        "No leading, trailing, or consecutive spaces allowed"
      ),

    maxTicketSize: Yup.number()
      .required("Max Ticket Size is required")
      .typeError("Max Ticket Size must be a number")
      .positive("Max Ticket Size must be greater than 0"),

    seedAmount: Yup.number()
      .required("Seed Amount is required")
      .typeError("Seed Amount must be a number")
      .positive("Seed Amount must be greater than 0"),

    entryAmount: Yup.number()
      .required("Entry Amount is required")
      .typeError("Entry Amount must be a number")
      .positive("Entry Amount must be greater than 0"),

    adminShare: Yup.number()
      .required("Admin Share is required")
      .typeError("Admin Share must be a number")
      .min(0, "Admin Share must be at least 0%")
      .max(100, "Admin Share cannot exceed 100%")
      .test(
        "decimal-places",
        "Admin Share can have at most 2 decimal places",
        (value) => /^\d+(\.\d{1,2})?$/.test(String(value))
      ),

    poolShare: Yup.number()
      .required("Pool Share is required")
      .typeError("Pool Share must be a number")
      .min(0, "Pool Share must be at least 0%")
      .max(100, "Pool Share cannot exceed 100%")
      .test(
        "decimal-places",
        "Pool Share can have at most 2 decimal places",
        (value) => /^\d+(\.\d{1,2})?$/.test(String(value))
      ),

  });
