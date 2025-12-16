import * as Yup from "yup";

export const notificationSettingsSchema = Yup.object().shape({

    MinWin: Yup.number()
    .min(0, "Min Win must be at least 0.")
    .integer("Min Win must be a whole number.")
    .required("Min Win is required."),
    SlotsMinBet: Yup.number()
    .min(0, "Min Win must be at least 0.")
    .integer("Min Win must be a whole number.")
    .required("Min Win is required."),
    TableMinBet: Yup.number()
    .min(0, "Min Win must be at least 0.")
    .integer("Min Win must be a whole number.")
    .required("Min Win is required."),
    PackageActivation: Yup.boolean(),
    TournamentActivation: Yup.boolean(),
    GiveawayActivation: Yup.boolean(),
    LoginActivation: Yup.number()
    .min(10, 'Login Activation must be at least 10.')
    .max(40, 'Login Activation must be at most 40.')
    .required('Login Activation is required.'),
    
  DepositActivation: Yup.number()
    .min(10, 'Deposit Activation must be at least 10.')
    .max(40, 'Deposit Activation must be at most 40.')
    .required('Deposit Activation is required.'),
    
  SignupActivation: Yup.number()
    .min(10, 'Signup Activation must be at least 10.')
    .max(40, 'Signup Activation must be at most 40.')
    .required('Signup Activation is required.'),
    
  ProviderBasedActivation: Yup.number()
    .min(10, 'Provider Based Activation must be at least 10.')
    .max(40, 'Provider Based Activation must be at most 40.')
    .required('Provider Based Activation is required.'),
});