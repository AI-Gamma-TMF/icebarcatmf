import { StatusCodes } from 'http-status-codes'
export const ERRORS = {
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not found',
  METHOD_NOT_ALLOWED: 'methodNotAllowed',
  BAD_DATA: 'badData',
  BAD_REQUEST: 'badRequest',
  INTERNAL: 'internal',
  SERVER_ERROR: 'serverError',
  SERVER_UNAVAILABLE: 'serverUnavailable',
  SERVICE_FAILED: 'Not ready',
  CACHE_FAILED: 'Redis Connection: Failed to connect',
  Empty: 'Empty errors array passed'
}

export const APP_ERROR_CODES = {
  EMAIL_NOT_REGISTERED: 'This email is not registered',
  INCORRECT_PASSWORD: 'This password is incorrect',
  ADMIN_NOT_FOUND: 'Admin not found',
  AFFILIATE_NOT_FOUND: 'Affiliate not found',
  INVALID_TOKEN: 'Access token is invalid',
  INACTIVE_ADMIN: 'Admin does not exists.'
}

export const ERROR_MSG = {
  SERVER_ERROR: 'Something went wrong',
  EXISTS: 'already exists',
  NOT_FOUND: 'not found',
  NOT_EXISTS: 'does not exists',
  ID_REQUIRED: 'ID required',
  EMAIL_INVALID: 'Email not valid',
  BANNER_KEY_REQUIRED: 'ID_REQUIRED required',
  SUPPORT_EMAIL_REQUIRED: 'support_email required',
  SITE_NAME_REQUIRED: 'site_name required',
  ORIGIN_REQUIRED: 'origin required',
  KEY_VALUE_REQUIRED: 'value required',
  EMAIL_EXIST: 'Email Address already exist',
  TOGGLE_CASE_ERROR: 'Case value invalid',
  NOT_ALLOWED: 'Action not allowed',
  FAILED: 'failed',
  BALANCE_ERROR: 'Insufficient balance',
  CURRENCY_NOT_SUBSET: 'Currency should be as per allowed configuration',
  WITHDRAW_STATUS_ERR: 'Status already updated',
  WITHDRAW_STATUS_ERR_2: 'Status already pending',
  CURRENCY_REQUIRED: 'Currency code is required',
  CREATE_ERROR: 'Cannot create admin user',
  CREATE_ADMIN_ERROR: 'Cannot create Admin user',
  USERNAME_EXIST: 'Username already exists',
  PERMISSION_DENIED: ' permission denied',
  TRANSACTION_DENIED: 'Receiver not in hierarchy, transaction denied',
  ADMIN_TO_USER: 'Receiver user not in hierarchy, transaction denied',
  ADMIN_TO_ADMIN: 'Receiver admin not in hierarchy, transaction denied',
  DAILY_LIMIT_NOT_FOUND: 'Set daily limit first to create site',
  DAILY_LIMIT_NOT_FOUND_SITE: 'Daily limit not set by admin',
  MAX_DAILY_LIMIT: 'Max daily limit for this currency is ',
  ORDER_ERROR: 'Send order for all sub categories.',
  SENDGRID_ERROR: 'Unable to send email.',
  REASON_REQUIRED: 'Reason is required to mark user in-active.',
  ELASTIC_CONNECTION: 'Unable to fetch data from elastic',
  CUSTOM_DATES_REQUIRED: 'Custom date options required dates',
  WAGERING_TYPE: 'Invalid wagering type selected.',
  LOYALTY_LEVEL_NOT_FOUND: 'Loyalty level settings not found',
  BONUS_ISSUE: 'Bonus cannot be issued.',
  BONUS_DELETE: 'Bonus cannot be deleted, issuer is different.',
  BONUS_PENDING: 'Bonus cannot be deleted, already activated by user.',
  BONUS_AVAIL: 'Bonus cannot be activated, try again later',
  EXTERNAL_API_ERROR: 'External api response error',
  SPINS_QUANTITY: 'Spins quantity must be less than 100',
  SPINS_VALIDITY: 'Days to clear should be less than 30',
  DELETE_PRIMARY_EMAIL: 'Cannot delete primary Email',
  SENDGRID_CREDENTIALS: 'Sendgrid credentials not found',
  PRIMARY_TEMPLATE_ERROR: 'Select other primary template',
  EMPTY_GALLERY: 'Image gallery empty',
  CREDENTIALS_NOT_FOUND: 'Send Grid credentials not found',
  LANGUAGE_NOT_SUBSET: 'Language should be as per allowed configuration',
  REMOVE_MONEY: 'Remove money amount is more than wallet balance',
  ELASTIC_DOWN: 'Elastic cluster is down !!',
  TRANSACTION_NOT_FOUND: 'Transaction details Not Found',
  EMMITTER_ERROR: 'Error in Emitter while emitting on User Wallet Balance',
  EMITTER_ERROR: 'Something went wrong in socket emitting.',
  NO_ACTIVE_USER: 'No active user exist'
}

export const RequestInputValidationErrorType = {
  name: 'RequestInputValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please check the request data',
  errorCode: 3001
}

export const ResponseValidationErrorType = {
  name: 'ResponseInputValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: false,
  description:
    'Response validation failed please refer json schema of response',
  errorCode: 3002
}

export const SocketRequestInputValidationErrorType = {
  name: 'SocketRequestInputValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please check the request data',
  errorCode: 3003
}

export const SocketResponseValidationErrorType = {
  name: 'SocketResponseValidationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: false,
  description:
    'Response validation of socket failed please refer json schema of response',
  errorCode: 3004
}

export const InternalServerErrorType = {
  name: 'InternalServerError',
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  isOperational: true,
  description: 'Internal Server Error',
  errorCode: 3005
}

export const InvalidSocketArgumentErrorType = {
  name: 'InvalidSocketArgumentError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description:
    'Please provide, proper arguments eventName, [payloadObject], and [callback]',
  errorCode: 3006
}

export const LoginErrorType = {
  name: 'AdminInActive',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: '',
  errorCode: 3007
}
export const UnAuthorizeUserErrorType = {
  name: 'UnAuthorize',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Unauthorized ',
  errorCode: 3008
}
export const AdminInActiveErrorType = {
  name: 'AdminInActive',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Admin Inactive',
  errorCode: 3009
}

export const AdminNotFoundErrorType = {
  name: 'AdminNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Admin not found',
  errorCode: 3010
}
export const WithdrawRequestNotFoundErrorType = {
  name: 'WithdrawRequestNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Withdrawal request not found.',
  errorCode: 3011
}
export const UserNotExistsErrorType = {
  name: 'UserNotExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User does not exists',
  errorCode: 3012
}
export const UserDocumentsNotFoundErrorType = {
  name: 'UserDocumentsNotFoundErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Documents Not Found',
  errorCode: 3013
}
export const DailyLimitErrorType = {
  name: 'DailyLimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Daily limit should be less than weekly and monthly limit',
  errorCode: 3014
}

export const WeeklyLimitErrorType = {
  name: 'WeeklyLimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description:
    'Weekly limit should be greater than daily limit and less than monthly limit',
  errorCode: 3015
}

export const MonthlyLimitErrorType = {
  name: 'MonthlyLimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description:
    'Monthly limit should be greater than daily limit and weekly limit',
  errorCode: 3016
}

export const LimitErrorType = {
  name: 'LimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Limit not found in the user',
  errorCode: 3017
}

export const SessionTimeLimitErrorType = {
  name: 'SessionTimeLimit',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Session Time can be set between 1 to 24',
  errorCode: 3018
}

export const RemoveMoneyErrorType = {
  name: 'RemoveMoneyError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Remove money amount is more than wallet balance',
  errorCode: 3019
}

export const TransactionHandlerErrorType = {
  name: 'TransactionHandlerError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Transaction handler error ',
  errorCode: 3020
}

export const ActionNotAllowedErrorType = {
  name: 'ActionNotAllowed',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Action not allowed',
  errorCode: 3021
}

export const GroupNotFoundErrorType = {
  name: 'GroupNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Group Not found',
  errorCode: 3022
}

export const UserAlreadyExistErrorType = {
  name: 'UserAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User already exists',
  errorCode: 3023
}
export const IdRequiredErrorType = {
  name: 'IdRequired',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Id required',
  errorCode: 3024
}

export const CannotCreateAdminErrorType = {
  name: 'CannotCreateAdmin',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot Create Admin User',
  errorCode: 3025
}
export const PermissionDeniedErrorType = {
  name: 'PermissionDenied',
  statusCode: StatusCodes.NOT_ACCEPTABLE,
  isOperational: true,
  description: 'Permission Denied',
  errorCode: 3026
}

export const RoleNotFoundErrorType = {
  name: 'RoleNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Role Not found',
  errorCode: 3027
}
export const UserNameExistsErrorType = {
  name: 'UserNameExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Username already exists',
  errorCode: 3028
}

export const NotFoundErrorType = {
  name: 'NotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Record Not found',
  errorCode: 3029
}
export const PackageAlreadyExistErrorType = {
  name: 'PackageAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Package already exists',
  errorCode: 3030
}
export const AmountInvalidErrorType = {
  name: 'AmountInvalid',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Amount require decimal or float ',
  errorCode: 3031
}
export const CmsExistsErrorType = {
  name: 'CmsAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cms with this slug already exists',
  errorCode: 3032
}
export const CmsNotFoundErrorType = {
  name: 'CmsNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cms not found',
  errorCode: 3033
}
export const InvalidIdErrorType = {
  name: 'InvalidId',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Id must be a number',
  errorCode: 3034
}
export const InvalidCoinAmountErrorType = {
  name: 'InvalidCoinAmount',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Coin amount should be valid',
  errorCode: 3035
}
export const InvalidAmountErrorType = {
  name: 'InvalidAmount',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Amount',
  errorCode: 3036
}
export const FileSizeTooLargeErrorType = {
  name: 'FileSizeTooLargeErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'File size too large',
  errorCode: 3037
}
export const FileTypeNotSupportedErrorType = {
  name: 'FileTypeNotSupportedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'File type not supported',
  errorCode: 3038
}
export const ImageUrlNotFoundErrorType = {
  name: 'ImageUrlNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Image url not found',
  errorCode: 3039
}
export const FileNotFoundErrorType = {
  name: 'FileNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'File is required',
  errorCode: 3040
}
export const FailedToDeleteImageErrorType = {
  name: 'FailedToDeleteImage',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Unable to delete image from gallery',
  errorCode: 3041
}
export const BonusNameExistErrorType = {
  name: 'BonusNameExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Bonus Name Exist',
  errorCode: 3042
}
export const DateErrorType = {
  name: 'DateError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Date',
  errorCode: 3043
}
export const AmountErrorType = {
  name: 'AmountError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Must be valid amount',
  errorCode: 3044
}
export const InvalidNumberOfUserErrorType = {
  name: 'InvalidNumberOfUser',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Number Of User',
  errorCode: 3045
}
export const BonusNotExistErrorType = {
  name: 'BonusNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Bonus Not Exist',
  errorCode: 3045
}

export const ToggleCaseInvalidErrorType = {
  name: 'ToggleCaseInvalid',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Toggle case value is invalid',
  errorCode: 3042
}
export const CaseInvalidErrorType = {
  name: 'CodeInvalid',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Code is invalid',
  errorCode: 3043
}
export const StatusInvalidErrorType = {
  name: 'StatusInvalid',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Status is invalid',
  errorCode: 3044
}
export const EmailTemplateNotFoundErrorType = {
  name: 'EmailTemplateNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Email template not found',
  errorCode: 3045
}
export const EmailTemplateCategoryNotFoundErrorType = {
  name: 'EmailTemplateCategoryNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Email template Category not found',
  errorCode: 3045
}
export const PrimaryEmailErrorType = {
  name: 'PrimaryEmail',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot delete primary email',
  errorCode: 3046
}

export const CredentialsNotFoundErrorType = {
  name: 'CredentialsNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Credentials Not found',
  errorCode: 3047
}
export const InvalidPasswordErrorType = {
  name: 'InvalidPasswordErrorType',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Invalid old password',
  errorCode: 3048
}
export const InvalidNewPasswordErrorType = {
  name: 'InvalidNewPasswordErrorType',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Old and new password are same, Please use other new password',
  errorCode: 3049
}
export const CasinoProviderExistsErrorType = {
  name: 'CasinoProviderAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Casino provider already exists',
  errorCode: 3050
}
export const AggregatorNotFoundErrorType = {
  name: 'AggregatorNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Aggregator Not found',
  errorCode: 3051
}
export const CasinoProviderNotFoundErrorType = {
  name: 'CasinoProviderNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Casino provider Not found',
  errorCode: 3052
}
export const BannerNotFoundErrorType = {
  name: 'BannerNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Banner not found',
  errorCode: 3053
}
export const InvalidFileErrorType = {
  name: 'InvalidFile',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid File.',
  errorCode: 3154
}
export const GameCategoryNotExistsErrorType = {
  name: 'GameCategoryNotExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Casino Category not exists',
  errorCode: 3055
}

export const GameSubCategoryNotExistsErrorType = {
  name: 'GameSubCategoryNotExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Casino Sub Category not exists',
  errorCode: 3056
}

export const OrderInvalidErrorType = {
  name: 'OrderInvalidErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Order array invalid',
  errorCode: 3057
}

export const NameExistsErrorType = {
  name: 'NameExistsErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Name Exist',
  errorCode: 3058
}
export const CasinoGameNotExistsErrorType = {
  name: 'CasinoGameNotExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Casino Game not Exists',
  errorCode: 3059
}
export const GameSubCategoryNotFoundErrorType = {
  name: 'GameSubCategoryNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Game Sub Category not found',
  errorCode: 3060
}
export const CategoryGameNotFoundErrorType = {
  name: 'CategoryGameNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Category Games not found',
  errorCode: 3061
}
export const GameExistsErrorType = {
  name: 'GameExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game already exists',
  errorCode: 3062
}
export const CountryNotFoundErrorType = {
  name: 'CountryNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Country not found',
  errorCode: 3063
}
export const CountryIdNotFoundErrorType = {
  name: 'CountryIdNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Country Id not found',
  errorCode: 3064
}
export const ItemsNotFoundErrorType = {
  name: 'ItemsNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Restricted items not found',
  errorCode: 3065
}
export const ItemsIdNotFoundErrorType = {
  name: 'ItemsIdNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Restricted items Id not found',
  errorCode: 3066
}
export const EmailTemplateExistsErrorType = {
  name: 'EmailTemplateExists',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Email template exists',
  errorCode: 3067
}
export const GameSubCategoryExistsErrorType = {
  name: 'GameSubCategoryExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Casino Sub Category exists',
  errorCode: 3068
}
export const EmailTemplateNotAllowEditErrorType = {
  name: 'EmailTemplateNotAllowEdit',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Email template edit action not allow',
  errorCode: 3069
}
export const CasinoTransactionsNotFoundErrorType = {
  name: 'CasinoTransactionsNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Casino transactions not found',
  errorCode: 3070
}
export const UserNotExistErrorType = {
  name: 'UserNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Not Exist',
  errorCode: 3071
}
export const CustomDateErrorType = {
  name: 'CustomDateError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: ERROR_MSG.CUSTOM_DATES_REQUIRED,
  errorCode: 3072
}
export const FooterExistErrorType = {
  name: 'FooterExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Footer already exist',
  errorCode: 3073
}
export const TargetUrlRequiredErrorType = {
  name: 'TargetUrlRequiredError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Target Url Required For External CMS',
  errorCode: 3074
}
export const BonusTypeExistErrorType = {
  name: 'BonusTypeExist',
  statusCode: StatusCodes.CONFLICT,
  isOperational: true,
  description: 'Active daily bonus already exists',
  errorCode: 3075
}
export const SubChildExistErrorType = {
  name: 'SubChildExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Category has child Sub Categories',
  errorCode: 3076
}
export const GameCategoryNotFoundErrorType = {
  name: 'GameCategoryNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game Category not found',
  errorCode: 3077
}
export const BannerExistErrorType = {
  name: 'BannerExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Banner Type Exist',
  errorCode: 3078
}
export const BannerNameExistErrorType = {
  name: 'BannerNameExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Banner Name Exist',
  errorCode: 3079
}
export const TodayDateErrorType = {
  name: 'TodayDateError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please select today or after today date',
  errorCode: 3080
}
export const BonusWelComeTypeExistErrorType = {
  name: 'BonusWelComeTypeExist',
  statusCode: StatusCodes.CONFLICT,
  isOperational: true,
  description: 'Welcome bonus already exists',
  errorCode: 3081
}
export const BonusExistErrorType = {
  name: 'BonusExist',
  statusCode: StatusCodes.CONFLICT,
  isOperational: true,
  description: 'Bonus already exists',
  errorCode: 3082
}
export const InvalidAssetURLErrorType = {
  name: 'InvalidAsset',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Asset URL must be valid URI',
  errorCode: 3083
}
export const UploadErrorErrorType = {
  name: 'UploadError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Upload Error',
  errorCode: 3084
}
export const BonusValidationFailErrorType = {
  name: 'BonusValidationFail',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Bonus GC or SC does not equal 0 .',
  errorCode: 3085
}
export const FeaturedSubCategoryExists = {
  name: 'FeaturedSubCategoryExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Maximum featured sub category limit exceeded.',
  errorCode: 3086
}
export const UserResponsibleSettingNotExistType = {
  name: 'UserResponsibleSettingNotExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User responsible setting not available',
  errorCode: 3087
}
export const SelfExclusionRequireType = {
  name: 'SelfExclusionRequire',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'selfExclusion require self exclusion type',
  errorCode: 3088
}
export const SessionReminderTimeRequireType = {
  name: 'SessionReminderTimeRequire',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'sessionReminder require for session type',
  errorCode: 3089
}
export const TimeBreakDurationRequireType = {
  name: 'TimeBreakDurationRequire',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'timeBreakDuration require for session TIME BREAK type',
  errorCode: 3090
}
export const CsvFileErrorType = {
  name: 'CsvFileErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid csv file',
  errorCode: 3091
}
export const PostalBonusErrorType = {
  name: 'PostalBonusErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Before uploading csv please configure AMOE deposit bonus',
  errorCode: 3092
}
export const SendEmailError = {
  name: 'SendEmailError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Failed to send mail',
  errorCode: 3093
}
export const PackageTypeAndColorRequiredErrorType = {
  name: 'PackageTypeAndColorRequiredErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Package type, and colors are required',
  errorCode: 3094
}

export const PreviousAmountErrorType = {
  name: 'PreviousAmountErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Previous Amount should be greater than current amount',
  errorCode: 3096
}
export const PasswordValidationFailedError = {
  name: 'PasswordValidationFailedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description:
    'Your password should contain at least 8 characters, one upper case letter, one lower case letter, one number, and one special character.',
  errorCode: 3097
}
export const WrongPhoneVerificationError = {
  name: 'WrongPhoneVerificationError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description:
    'Wrong Phone Verification Type either phone is already Verified/Unverified',
  errorCode: 3098
}
export const UserNotLockedErrorType = {
  name: 'UserNotLockedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Already Unlocked',
  errorCode: 3099
}
export const TransactionsNotFoundErrorType = {
  name: 'TransactionsNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Transactions not found',
  errorCode: 3100
}
export const InsufficientScBalanceError = {
  name: 'InsufficientScBalanceError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Insufficient SC Balance',
  errorCode: 3101
}
export const InsufficientGcBalanceError = {
  name: 'InsufficientGcBalanceError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Insufficient GC Balance',
  errorCode: 3102
}
export const InvalidSsnLengthError = {
  name: 'InvalidSsnLengthError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'SSN Number length should be 9 ',
  errorCode: 3103
}

export const AlreadyTestUserErrorType = {
  name: 'AlreadyTestUser',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Can not update this User because this is already a Test user',
  errorCode: 3104
}

export const ActivityLogErrorType = {
  name: 'ActivityLogNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Activity log not found',
  errorCode: 3105
}
export const UserAllReadyLogoutType = {
  name: 'UserAllReadyLogout',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User all ready logout',
  errorCode: 3106
}

export const DailyLimitExceedsWeeklyLimitType = {
  name: 'DailyLimitExceedsWeeklyLimit',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Daily Limit Exceeds Weekly Limit',
  errorCode: 3187
}

export const DailyLimitExceedsMonthlyLimitType = {
  name: 'DailyLimitExceedsMonthlyLimit',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Daily Limit Exceeds Monthly Limit',
  errorCode: 3187
}

export const WeeklyLimitLessThanDailyLimitType = {
  name: 'WeeklyLimitLessThanDailyLimit',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Weekly Limit Less Than Daily Limit',
  errorCode: 3187
}

export const WeeklyLimitExceedsMonthlyLimitType = {
  name: 'WeeklyLimitExceedsMonthlyLimit',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Weekly LimitExceeds Monthly Limit',
  errorCode: 3187
}

export const MonthlyLimitLessThanDailyLimitType = {
  name: 'MonthlyLimitLessThanDailyLimit',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Monthly Limit Less Than Daily Limit',
  errorCode: 3187
}

export const MonthlyLimitLessThanWeeklyLimitType = {
  name: 'MonthlyLimitLessThanWeeklyLimit',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Monthly Limit Less Than Weekly Limit',
  errorCode: 3187
}

export const GroupIdCountryIdRequireType = {
  name: 'GroupIdCountryIdRequire',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'groupId or countryId require',
  errorCode: 3188
}

export const IsEmailIsRestrictIsAlertRequireType = {
  name: 'IsEmailIsRestrictIsAlertRequire',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'isEmail isType isRestrict require',
  errorCode: 3189
}

export const ProviderIdRequireType = {
  name: 'ProviderIdRequire',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'providerId require',
  errorCode: 3190
}

export const SingleAmountSumAmountRequireType = {
  name: 'SingleAmountSumAmount',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'singleAmount or sumAmount require',
  errorCode: 3191
}

export const DaysRequireType = {
  name: 'DaysRequire',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'days require',
  errorCode: 3191
}

export const GroupIdNoTExistType = {
  name: 'GroupIdNoTExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'group id not exist',
  errorCode: 3192
}

export const WithSameIpWithSameDeviceRequireType = {
  name: 'WithSameIpWithSameDeviceRequire',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'withSameIp or withSameDevice require',
  errorCode: 3193
}

export const IsDuplicateIsSameAddressRequireType = {
  name: 'IsDuplicateIsSameAddressRequire',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'isDuplicate or isSameAddress require',
  errorCode: 3194
}

export const ActivityDoesNotExistType = {
  name: 'ActivityDoesNotExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'activity does not exist',
  errorCode: 3195
}

export const OtpVerificationFailedErrorType = {
  name: 'InvalidToken',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid otp',
  errorCode: 3107
}
export const TicketNotFoundType = {
  name: 'TicketNotFound',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Player Ticket not found',
  errorCode: 3107
}
export const TicketResolvedType = {
  name: 'TicketResolved',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Player Ticket is Resolved',
  errorCode: 3108
}
export const TicketNotAssignedType = {
  name: 'TicketNotAssigned',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'This ticket is not assigned to this admin.',
  errorCode: 3108
}

export const SingleAmountSumAmountCountRequireType = {
  name: 'SingleAmountSumAmountCount',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'singleAmount or sumAmount or count require',
  errorCode: 3191
}

export const PageAlreadyExistErrorType = {
  name: 'PageAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Page already exists',
  errorCode: 3196
}

export const PageNotFoundErrorType = {
  name: 'PageNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Page not found',
  errorCode: 3197
}

export const InvalidAssetValueErrorType = {
  name: 'InvalidAssetValue',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid asset value',
  errorCode: 3198
}

export const AssetKeyAlreadyExistErrorType = {
  name: 'AssetKeyAlreadyExist',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Asset key already exist',
  errorCode: 3198
}

export const AssetKeyNotFoundErrorType = {
  name: 'AssetKeyNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Asset key not found',
  errorCode: 3199
}

export const CoinsUsedErrorType = {
  name: 'CoinsUsedErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description:
    'Coins used by player, cannot void/refund the transaction amount',
  errorCode: 3200
}

export const PackageNotFoundErrorType = {
  name: 'PackageNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Package not found',
  errorCode: 3201
}

export const ThirdPartyApiErrorType = {
  name: 'ThirdPartyApiErrorType',
  statusCode: StatusCodes.CONFLICT,
  isOperational: false,
  description: 'Third Party API Failure',
  errorCode: 3202
}
export const AffiliatesAlreadyExistsErrorType = {
  name: 'Affiliates Already Exists',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Affiliates Already Exists',
  errorCode: 3203
}

export const AffiliatesNotFoundErrorType = {
  name: 'Affiliates Not Found',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Affiliates Not Found',
  errorCode: 3204
}

export const AffiliatesNotExistErrorType = {
  name: 'Affiliates Not Exist',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Affiliates Not Exist',
  errorCode: 3205
}

export const AffiliateInActiveLoginErrorType = {
  name: 'Affiliate In Active Login Error',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Affiliate In Active',
  errorCode: 3205
}

export const LoginPasswordErrorType = {
  name: 'LoginPasswordError',
  statusCode: StatusCodes.UNAUTHORIZED,
  isOperational: true,
  description: 'Incorrect Password',
  errorCode: 3206
}

export const AffiliateInActiveErrorType = {
  name: 'AffiliateInActive',
  statusCode: StatusCodes.FORBIDDEN,
  isOperational: true,
  description: 'Affiliate Inactive',
  errorCode: 3207
}

export const GameAggregatorNotExistsErrorType = {
  name: 'GameAggregatorNotExistsError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: false,
  description: 'Selected Casino Aggregator does not exists',
  errorCode: 3203
}
export const TermsAndConditionErrorType = {
  name: 'TermsAndConditionError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Terms and Condition is not accepted',
  errorCode: 3208
}

export const VerifyEmailTokenErrorType = {
  name: 'VerifyEmailTokenErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Verify Email Token Error',
  errorCode: 3209
}

export const EmailAlreadyVerifiedErrorType = {
  name: 'Email Already Verified Error',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email Already Verified Error',
  errorCode: 3210
}

export const SamePasswordErrorType = {
  name: 'SamePasswordError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: "New and old password can't be same",
  errorCode: 3211
}

export const InvalidOldPasswordErrorType = {
  name: 'InvalidOldPassword',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Old Password',
  errorCode: 3212
}

export const AffiliateNotApprovedErrorType = {
  name: 'AffiliateNotApprovedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Affiliate Is Not Approved ',
  errorCode: 3212
}

export const AffiliateAlreadyApprovedErrorType = {
  name: 'AffiliateAlreadyApprovedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Affiliate Already Approved',
  errorCode: 3213
}

export const ResetPasswordTokenErrorType = {
  name: 'ResetPasswordTokenError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Reset Password Token',
  errorCode: 3214
}

export const AffiliatesRoleNotExistsErrorType = {
  name: 'Affiliates Role Not Exists Error Type',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Affiliates Role Not Exists',
  errorCode: 3215
}

export const TransactionAlreadyProcessedErrorType = {
  name: 'TransactionAlreadyProcessedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Required Transaction is already processed.',
  errorCode: 3215
}

export const InvalidDateErrorType = {
  name: 'Invalid Date Error',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please check the entered dates, It should be greater than current date',
  errorCode: 3216
}

export const TournamentNotFoundErrorType = {
  name: 'Tournament  Not Found Error',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Tournament Not Found Error',
  errorCode: 3219
}

export const TournamentNotExistErrorType = {
  name: 'Tournament Not Exist Error',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Tournament Not Exist ',
  errorCode: 3220
}

export const MaximumGameLimitExceededErrorType = {
  name: 'Maximum Game Limit Exceeded Error',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You can add maximum of 6 games.',
  errorCode: 3221
}

export const MinimumGameLimitBreachedErrorType = {
  name: 'Minimum Game Limit Breached Error',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You can add maximum of 6 games.',
  errorCode: 3222
}

export const WinnerPercentageCannotBeOtherThan100ErrorType = {
  name: 'Winner Percentage Is Not 100',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description:
    'Winner percentages sum is not allowed to be less or greater than 100.',
  errorCode: 3223
}

export const TournamentAlreadyFinishedErrorType = {
  name: 'TournamentAlreadyFinishedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot update tournament as it is already finished.',
  errorCode: 3224
}

export const AmountShouldNotNegativeErrorType = {
  name: 'Amount Should Not be Negative Error',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Amount Should Not be Negative.',
  errorCode: 3225
}

export const WinnersCannotBeMoreThanAllowedPlayersErrorType = {
  name: 'WinnersCannotBeMoreThanAllowedPlayersError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: "Winner's cannot be more than allowed players !",
  errorCode: 3226
}

export const RegisteredUserExceedErrorType = {
  name: 'RegisteredUserExceedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description:
    'Player limit cannot be decreased beyond the number of registered participants.',
  errorCode: 3227
}
export const GiveawaysAlreadyExistWithinTimeFrameErrorType = {
  name: 'GiveawaysAlreadyExistWithinTimeFrameError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Giveaways Already Exist Within the Time Frame',
  errorCode: 3228
}

export const GiveawaysNotExistErrorType = {
  name: 'GiveawaysNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Giveaways Not Exist Error',
  errorCode: 3229
}

export const GiveawaysNotExistWithThisTimeFrame = {
  name: 'GiveawaysNotExistWithThisTimeFrameError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Giveaways Not Exist With This Time Frame Error',
  errorCode: 3230
}
export const GiveawaysAlreadyRunningWithinTimeFrameErrorType = {
  name: 'RaffleAlreadyRunningWithinTimeFrameError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Giveaways Already Running Within Time Frame Error',
  errorCode: 3231
}

export const GiveawaysNotCompletedErrorType = {
  name: 'GiveawaysNotCompletedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Payout Cannot be initialized as Giveaway is not over.',
  errorCode: 3232
}

export const CannotDeActivateAsPlayersHaveEntries = {
  name: 'CannotDeActivateAsPlayersHaveEntriesError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot De Activate As Players Have Entries',
  errorCode: 3233
}

export const TierNotFoundErrorType = {
  name: 'TierNotFoundError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Tier Cannot Be Found',
  errorCode: 3233
}

export const CannotUpdateTierErrorType = {
  name: 'CannotUpdateTierError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description:
    'There are users present in this tier, you cannot delete/disable this tier.',
  errorCode: 3234
}

export const TiersCannotBeMoreThanSixErrorType = {
  name: 'TiersCannotBeMoreThanSixError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Due to UI issues, you cannot set more than 6 tiers.',
  errorCode: 3234
}

export const BaseTierCannotBeMoreThanOneErrorType = {
  name: 'TiersCannotBeMoreThanSixError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Due to UI issues, you cannot more than 6 tiers cannot be set.',
  errorCode: 3234
}

export const TiersCannotHaveSameNameOrRequiredXpErrorType = {
  name: 'TiersCannotHaveSameNameOrRequiredXpError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description:
    '2 different tiers neither can have same name or same experience points',
  errorCode: 3235
}

export const BaseTierCannotBeDisabledErrorType = {
  name: 'BaseTierCannotBeDisabledError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You Cannot disable Base Tier.',
  errorCode: 3236
}

export const PromocodeAlreadyExistErrorType = {
  name: 'PromocodeAlreadyExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promocode already exists.',
  errorCode: 3237
}

export const EmailIsRequiredErrorType = {
  name: 'EmailIsRequiredError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email is Required',
  errorCode: 3238
}

export const InsufficientBScBalanceError = {
  name: 'InsufficientBScBalanceError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Insufficient BSC Balance',
  errorCode: 3239
}
export const InsufficientPScBalanceError = {
  name: 'InsufficientPScBalanceError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Insufficient PSC Balance',
  errorCode: 3240
}
export const InsufficientWScBalanceError = {
  name: 'InsufficientWScBalanceError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Insufficient WSC Balance',
  errorCode: 3241
}
export const FirstPurchaseBonusNotFoundOrInactiveErrorType = {
  name: 'FirstPurchaseBonusNotFoundOrInactive',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'First Purchase Bonus Not Found or Inactive',
  errorCode: 3242
}

export const UserPhoneNoNotExistErrorType = {
  name: 'UserPhoneNoNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User PhoneNo Not Exist',
  errorCode: 3243
}
export const UserEmailNotExistErrorType = {
  name: 'UserEmailNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Email Not Exist',
  errorCode: 3244
}

export const YouCannotAddOrDeductMoreThanAllowedGcLimitErrorType = {
  name: 'YouCannotAddOrDeductMoreThanAllowedGcLimit',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You Cannot Add Or Deduct More Than Allowed GC Limit',
  errorCode: 3245
}
export const YouCannotAddOrDeductMoreThanAllowedScLimitErrorType = {
  name: 'YouCannotAddOrDeductMoreThanAllowedScLimit',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'You Cannot Add Or Deduct More Than Allowed SC Limit',
  errorCode: 3246
}

export const GameAlreadyExistErrorType = {
  name: 'GameAlreadyExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game Already exists with this ID and provider.',
  errorCode: 3247
}

export const FirstAndWelcomePurchaseBonusNotApplicableErrorType = {
  name: 'FirstAndWelcomePurchaseBonusNotApplicableError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'First And Welcome Purchase Bonus Not Applicable In One Package.',
  errorCode: 3248
}

export const WelcomePurchaseBonusAlreadyExistErrorType = {
  name: 'WelcomePurchaseBonusAlreadyExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Welcome Purchase Package Already Exist.',
  errorCode: 3248
}

export const WelcomePurchaseBonusMinutesErrorType = {
  name: 'WelcomePurchaseBonusMinutesExceededErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Welcome purchase package time cannot be more than 24 Hours.',
  errorCode: 3249
}

export const KycApplicantDoesNotExistsErrorType = {
  name: 'KycApplicantDoesNotExistsError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Kyc Applicant does not exists.',
  errorCode: 3250
}

export const PromocodeNotExistErrorType = {
  name: 'PromocodeNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promocode not exists.',
  errorCode: 3250
}

export const InvalidPercentageValueErrorType = {
  name: 'InvalidPercentageValueError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid percentage value ',
  errorCode: 3251
}

export const UsersAlreadyAppliedPromocodeErrorType = {
  name: 'UsersAlreadyAppliedPromocodeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'This promocode is already applied by the users ',
  errorCode: 3252
}

export const MinimumPurchaseAmountInvalidErrorType = {
  name: 'MinimumPurchaseAmountInvalid',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Minimum purchase amount not valid ',
  errorCode: 3254
}

export const RuleAlreadyExistErrorType = {
  name: 'RuleAlreadyExists',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Rule already exists',
  errorCode: 3255
}

export const RuleNotFoundErrorType = {
  name: 'RuleNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Rule not found',
  errorCode: 3256
}

export const ReasonWithSameTitleAlreadyExistErrorType = {
  name: 'ReasonWithSameTitleAlreadyExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Reason With Same Title Already Exist. Please choose a different title.',
  errorCode: 3257
}

export const BanUserReasonNotExistErrorType = {
  name: 'BanUserReasonNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Ban User Reason Not Exist.',
  errorCode: 3258
}

export const ReasonNotFoundErrorType = {
  name: 'ReasonNotFoundError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Reason Not Found .',
  errorCode: 3259
}

export const UserWalletHasBeenAlreadyClearOutErrorType = {
  name: 'UserWalletHasBeenAlreadyClearOutError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Wallet Has Been Already ClearOut.',
  errorCode: 3260
}

export const AffiliatePromocodeAlreadyExistErrorType = {
  name: 'AffiliatePromocodeAlreadyExistErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promocode by code or affiliate ID already exists, cannot create more.',
  errorCode: 3261
}
export const UserReportNotFoundErrorType = {
  name: 'UserReportNotFoundErrorType',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'User report not found.',
  errorCode: 3061
}

export const FirstPurchaseBonusNotExistErrorType = {
  name: 'FirstPurchaseBonusNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'First Purchase Bonus Not Exist.',
  errorCode: 3262
}

export const PackageWithSameNameAlreadyExistErrorType = {
  name: 'PackageWithSameNameAlreadyExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Package With Same Name Already Exist.',
  errorCode: 3263
}

export const FtpBonusValidationFailErrorType = {
  name: 'FtpBonusValidationFail',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Bonus GC or SC should not be negative .',
  errorCode: 3264
}

export const FirstPurchasePackageMustHaveBonusErrorType = {
  name: 'FirstPurchasePackageMustHaveBonusError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'First Purchase Package Must Have Bonus.',
  errorCode: 3265
}

export const FirstPurchasePackageMustContainAtLeastOneBonusErrorType = {
  name: 'FirstPurchasePackageMustContainAtLeastOneBonusError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'First Purchase Package Must Contain AtLeast One Bonus.',
  errorCode: 3266
}
export const BonusTypeNotFoundErrorType = {
  name: 'BonusTypeNotFoundErrorType',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Bonus Type Not Found',
  errorCode: 3267
}
export const PostalCodeNotFoundErrorType = {
  name: 'PostalCodeNotFoundErrorType',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Postal Code Not Found',
  errorCode: 3268
}
export const PostalCodeAlreadySuccessErrorType = {
  name: 'PostalCodeAlreadySuccessErrorType',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Postal Bonus has already been claimed',
  errorCode: 3269
}
export const StatusTypeNotFoundErrorType = {
  name: 'StatusTypeNotFoundErrorType',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Status Type Not Found',
  errorCode: 3270
}

export const PackageWithSamePurchaseNoAlreadyExistErrorType = {
  name: 'PackageWithSamePurchaseNoAlreadyExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Package with same purchase number already exist.',
  errorCode: 3271
}

export const PromocodeAlreadyExistsErrorType = {
  name: 'PromocodeAlreadyExistsError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promocode already exists!',
  errorCode: 3272
}

export const PromocodeDoesNotExistsErrorType = {
  name: 'PromocodeDoesNotExistsError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: "Promocode doesn't exists!",
  errorCode: 3273
}

export const PromocodeIsNotActiveErrorType = {
  name: 'PromocodeDoesNotExistsError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promocode is not active!',
  errorCode: 3274
}

export const PromotionalBonusNotExistErrorType = {
  name: 'PromotionalBonusDoesNotExistsError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promotional Bonus does not exist!',
  errorCode: 3275
}

export const PromocodeAlreadyExistInCrmErrorType = {
  name: 'PromocodeAlreadyExistsInCRMError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promocode already exists in CRM!',
  errorCode: 3276
}

export const UserEntryDoesNotExistErrorType = {
  name: 'UserEntryDoesNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'This Entry does not exist in this raffle',
  errorCode: 3277
}

export const ApiKeyNotCorrectErrorType = {
  name: 'ApiKeyNotCorrectErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'API keys is not correct',
  errorCode: 3278
}
export const PostalCodeExpiredErrorType = {
  name: 'PostalCodeExpiredErrorType',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Postal Bonus has expired, Please ask user to generate a new one',
  errorCode: 3279
}
export const InvalidNumberOfBonusErrorType = {
  name: 'InvalidNumberOfBonus',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'The value in time or minute field should be greater than 1',
  errorCode: 3280
}
export const RouteRequiresAtLeastOneBannerErrorType = {
  name: 'RouteRequiresAtLeastOneBannerError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'A single banner is the minimum requirement for this page.',
  errorCode: 3281
}

export const UpdateRouteRequiresAtLeastOneBannerErrorType = {
  name: 'UpdateRouteRequiresAtLeastOneBannerError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'This page needs a banner since altering the route is not possible',
  errorCode: 3282
}

export const BlockedDomainNotFoundErrorType = {
  name: 'BlockedDomainNotFoundErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Blocked Domain Cannot Be Found',
  errorCode: 3283
}

export const BlockedDomainExistsErrorType = {
  name: 'BlockedDomainExistsErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Blocked Domain Already Exists',
  errorCode: 3284
}

export const PaymentProviderNotSkrillErrorType = {
  name: 'PaymentProviderNotSkrillError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Check Status can only be done for Skrill Redemptions, Pay By Bank will update the status automatically after 15 sec of approving the payment.',
  errorCode: 3285
}

export const PlayerAlreadyBootedErrorType = {
  name: 'PlayerAlreadyBootedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'The player is already booted from the tournament',
  errorCode: 3286
}

export const UserAlreadyInTournamentErrorType = {
  name: 'UserAlreadyInTournamentError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'The player already joined the tournament',
  errorCode: 3287
}

export const UserNotEqualToWinnerTournamentErrorType = {
  name: 'UserNotEqualToWinnerTournamentError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'The users must be equal to winner',
  errorCode: 3288
}

export const TournamentNotFinishedErrorType = {
  name: 'TournamentNotFinishedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot do payout as tournament is running',
  errorCode: 3289
}
export const InvalidNumberErrorType = {
  name: 'InvalidNumber',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'The value in either null or a integer value',
  errorCode: 3290
}
export const TournamentIsRunningStartDateErrorType = {
  name: 'TournamentIsRunningStartDateError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot change the start date as tournament is already running',
  errorCode: 3291
}
export const TournamentEndDateErrorType = {
  name: 'TournamentEndDateError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Tournament end date cannot be less than tournament start date or current time',
  errorCode: 3292
}
export const TournamentIsCancelledErrorType = {
  name: 'TournamentIsCancelledError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Tournament is cancelled',
  errorCode: 3293
}
export const CannotCancelTournamentErrorType = {
  name: 'CannotCancelTournamentError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot cancel tournament as it is already completed.',
  errorCode: 3294
}

export const UserTierNotFoundErrorType = {
  name: 'UserTierNotFoundError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Tier Not Found',
  errorCode: 3295
}

export const PromotedTierLevelMustBeGreaterErrorType = {
  name: 'PromotedTierLevelMustBeGreaterError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promoted tier level must be greater than current level',
  errorCode: 3296
}

export const DuplicateSpecialPackageErrorType = {
  name: 'DuplicateSpecialPackageError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot create more than one special package.',
  errorCode: 3297
}

export const NoNeedToCreateTemplatePackageErrorType = {
  name: 'NoNeedToCreateTemplatePackageError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Package has not been purchased by any user, please edit out the package.',
  errorCode: 3298
}

export const NoOneWinTournamentErrorType = {
  name: 'NoOneWinTournamentError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'No one win the tournament',
  errorCode: 3299
}
export const InvalidTournamentWinnerErrorType = {
  name: 'InvalidTournamentWinnerError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Tournament winner percentage is not correct',
  errorCode: 3300
}
export const PayoutIsAlreadyCompletedTournamentErrorType = {
  name: 'PayoutIsAlreadyCompletedTournamentError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Payout is already completed for this tournament',
  errorCode: 3301
}

export const InvalidCsvFileEmailColumnIsRequiredErrorType = {
  name: 'InvalidCSVFileEmailColumnIsRequiredError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Error parsing CSV file: Invalid CSV file: email column is required',
  errorCode: 3302
}
export const CannotBootPlayerErrorType = {
  name: 'CannotBootPlayerError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot boot player, as payout is completed for this tournament',
  errorCode: 3303
}
export const NoNeedToCreateTPromocodeErrorType = {
  name: 'NoNeedToCreateTPromocodeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promocode has not been used by any user, please edit out the promocode.',
  errorCode: 3304
}

export const VipTournamentRequiredMoreThanZeroUsersErrorType = {
  name: 'VipTournamentRequiredMoreThanZeroUsersError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Players cannot be zero in VIP Tournament',
  errorCode: 3305
}

export const VipTournamentErrorType = {
  name: 'VipTournamentError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot Upload Csv in a Non Vip tournament',
  errorCode: 3306
}

export const InvalidDayErrorType = {
  name: 'InvalidDayError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Day must be between 1 to 7.',
  errorCode: 3307
}

export const MaintenanceModeDetailsNotFoundErrorType = {
  name: 'MaintenanceModeDetailsNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Maintenance mode details not found.',
  errorCode: 3308
}

export const MaintenanceModeDeletionErrorType = {
  name: 'MaintenanceModeDeletionError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Maintenance mode is active. Deletion is not allowed at this time',
  errorCode: 3309
}

export const MaintenanceModeEndTimeErrorType = {
  name: 'MaintenanceModeEndTimeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Maintenance mode end date time cannot be less than or equal to maintenance mode start date time',
  errorCode: 3310
}

export const MaintenanceModeAlreadyExistErrorType = {
  name: 'MaintenanceModeAlreadyExistsError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Maintenance mode already scheduled!',
  errorCode: 3311
}

export const UserVipRatingErrorType = {
  name: 'UserVipRatingErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'For approve player rating should be greater than & equal to 0 and less than & equal to 3.',
  errorCode: 3312
}

export const QuestionnaireExistsErrorType = {
  name: 'QuestionnaireExistsErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Questionnaire Already Exists',
  errorCode: 3213
}

export const PaymentProviderNotExistErrorType = {
  name: 'PaymentProviderNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Payment Provider does not exist',
  errorCode: 3314
}

export const LimitTypeOrAmountRequireType = {
  name: 'LimitTypeOrAmountRequire',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'limitType or amount require for time and purchase type',
  errorCode: 3315
}

export const ValueShouldGreaterThanZeroErrorType = {
  name: 'ValueShouldGreaterThanZeroError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Value should be greater than zero',
  errorCode: 3316
}

export const TrustlyCertificationNotCompletedErrorType = {
  name: 'TrustlyCertificationNotCompletedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Trustly Certification is not completed, until then payment method cannot be activated',
  errorCode: 3316
}

export const BlogPostAlreadyExistErrorType = {
  name: 'BlogPostAlreadyExistsError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Blog post already exists!',
  errorCode: 3317
}

export const BlogPostNotFoundErrorType = {
  name: 'BlogPostNotFound',
  statusCode: StatusCodes.NOT_FOUND,
  isOperational: true,
  description: 'Blog post not found!',
  errorCode: 3318
}

export const QuestionnaireNotFoundErrorType = {
  name: 'QuestionnaireNotFoundErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Question not exists',
  errorCode: 3316
}

export const QuestionAlreadyAnsweredErrorType = {
  name: 'QuestionAlreadyAnsweredErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'This question has already been answered and cannot be updated',
  errorCode: 3316
}

export const PromocodeIsAlreadyActiveErrorType = {
  name: 'PromocodeIsAlreadyActiveErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promocode is already active, you cannot update Valid From Date',
  errorCode: 3317
}

export const ValidTillValidFromRequiredErrorType = {
  name: 'ValidTillValidFromRequiredError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Valid Till and Valid From are required error Type',
  errorCode: 3318
}

export const PromocodeUpcomingActiveReuseErrorType = {
  name: 'PromocodeUpcomingActiveReuseError',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Promocode is either Active or Upcoming, You cannot Reuse it',
  errorCode: 3319
}

export const PromocodeExpiredErrorType = {
  name: 'PromocodeExpiredErrorType',
  statusCode: StatusCodes.BAD_DATA,
  isOperational: true,
  description: 'Cannot Update Promocode as it is expired or deleted',
  errorCode: 3320
}

export const PromocodeCrmRequiredFieldErrorType = {
  name: 'PromocodeCrmRequiredFieldErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please provide promotion Name, promotionType for CRM Promocode',
  errorCode: 3321
}

export const CrmPromocodeIsAlreadyActiveErrorType = {
  name: 'CrmPromocodeIsAlreadyActiveError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot update Crm Promocode, promocode name as it is already active',
  errorCode: 3322
}

export const InvalidJackpotShareErrorType = {
  name: 'InvalidJackpotShareErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Admin and Pool Share doesn\'t add up to 100%',
  errorCode: 3317
}

export const JackpotBreakEvenErrorType = {
  name: 'JackpotBreakEvenErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Admin share from ticket sales is insufficient to cover the seed amount. Please adjust the admin share, entry amount, or max ticket size to ensure no loss.',
  errorCode: 3318
}

export const JackpotNotUpcomingErrorType = {
  name: 'JackpotNotUpcomingErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Jackpot is not a upcoming jackpot.',
  errorCode: 3319
}

export const JackpotNotExistErrorType = {
  name: 'JackpotNotExistErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Jackpot does not exists.',
  errorCode: 3320
}

export const FaqExistsErrorType = {
  name: 'FaqExistsErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'All FAQs already exist for this blog post.',
  errorCode: 3322
}

export const FaqNotExistsErrorType = {
  name: 'FaqNotExistsErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Faq not exists.',
  errorCode: 3323
}

export const UserVipApproveErrorType = {
  name: 'UserVipApproveErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User can only be revoked if previously approved.',
  errorCode: 3321
}
export const AdminWillBeInLossErrorType = {
  name: 'AdminWillBeInLossErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Admin share from ticket sales is insufficient to cover the seed amount. Please adjust the admin share, entry amount, or max ticket size to ensure no loss.',
  errorCode: 3322
}

export const PackageIsAlreadyActiveErrorType = {
  name: 'PackageIsAlreadyActiveErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Package is already active, you cannot update Valid From Date',
  errorCode: 3323
}

export const ValidFromValidTillRequiredErrorType = {
  name: 'ValidFromValidTillRequiredError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please provide both Valid From and Valid Till',
  errorCode: 3324
}

export const SpecialPackageValidFromValidTillRequiredErrorType = {
  name: 'SpecialPackageValidFromValidTillRequiredError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'For Special Package both Valid From and Valid Till are required',
  errorCode: 3325
}
export const PackageIsAlreadyScheduledErrorType = {
  name: 'PackageIsAlreadyScheduledError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot change the status of the Package as it is already scheduled.',
  errorCode: 3326
}

export const InternalUserSkillQuestionErrorType = {
  name: 'InternalUserSkillQuestionErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Please mark the user as an Internal User before marking them as a Canadian User.',
  errorCode: 3327
}

export const UserAlreadyExistsErrorType = {
  name: 'UserAlreadyExistsErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Skill based question already activated for this user',
  errorCode: 3328
}

export const PromotionThumbnailNotFoundErrorType = {
  name: 'PromotionThumbnailNotFoundErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Promotion Thumbnail not exists',
  errorCode: 3328
}

export const ScratchCardNotFoundErrorType = {
  name: 'ScratchCardNotFoundErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Scratch Card Not Found',
  errorCode: 3329
}

export const EmailTemplateNotExistErrorType = {
  name: 'EmailTemplateNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Email Template is required.',
  errorCode: 3322
}

export const FreeSpinBonusNotExistErrorType = {
  name: 'FreeSpinBonusNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Free Spin Bonus Not Exist.',
  errorCode: 3323
}

export const FreeSpinAlreadyFinishedErrorType = {
  name: 'FreeSpinAlreadyFinishedError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Free-spin Already Finished.',
  errorCode: 3324
}

export const FreeSpinIsRunningStartDateErrorType = {
  name: 'FreeSpinIsRunningStartDateError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot change the start date as freeSpin is already running',
  errorCode: 3325
}

export const FreeSpinIsCancelledErrorType = {
  name: 'FreeSpinIsCancelledError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Free-spin is cancelled ',
  errorCode: 3326
}

export const CannotCancelFreeSpinErrorType = {
  name: 'CannotCancelFreeSpinError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Cannot cancel Free-spin as it is already completed.',
  errorCode: 3327
}

export const UserNotExistForRemovalErrorType = {
  name: 'SomeUsersNotExistForRemovalError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'User Not applicable for removal.',
  errorCode: 3328
}

export const GamePageNotFoundErrorType = {
  name: 'GamePageNotFoundErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game page not found',
  errorCode: 3329
}

export const GamePageAlreadyExistErrorType = {
  name: 'GamePageAlreadyExistErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game page already exists',
  errorCode: 3330
}

export const GamePageCardAlreadyExistErrorType = {
  name: 'GamePageCardAlreadyExistErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game page card already exists',
  errorCode: 3331
}

export const GamePageCardNotFoundErrorType = {
  name: 'GamePageCardNotFoundErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game page card not found',
  errorCode: 3332
}

export const GamePageFaqNotFoundErrorType = {
  name: 'GamePageFaqNotFoundErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game page faq not found',
  errorCode: 3333
}

export const blogPostGamePageExistsErrorType = {
  name: 'blogPostGamePageExistsErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game page blog post already exists',
  errorCode: 3334
}

export const InvalidCsvFileUserIdAndEmailColumnAreRequiredErrorType = {
  name: 'InvalidCsvFileUserIdAndEmailColumnIsRequiredErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Error parsing CSV file: Invalid CSV file: userId and email columns are required',
  errorCode: 3335
}

export const SubscriptionPlanAlreadyActiveErrorType = {
  name: 'SubscriptionPlanAlreadyActiveError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Another subscription plan is already active, please deactivate it create this plan under inactive status',
  errorCode: 3336
}

export const SubscriptionFeatureNotExistErrorType = {
  name: 'SubscriptionFeatureNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Either Subscription Feature does not exist or not active',
  errorCode: 3337
}

export const SubscriptionFeatureValueTypeErrorType = {
  name: 'SubscriptionFeatureValueTypeError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Subscription Feature value type does not match with subscription plan value type',
  errorCode: 3338
}

export const FreeSpinWithSameTitleAlreadyExistErrorType = {
  name: 'FreeSpinWithSameTitleAlreadyExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'FreeSpin With Same Title Already Exist',
  errorCode: 3339
}

export const FreeSpinBetScaleAmountIsNotDefineErrorType = {
  name: 'FreeSpinBetScaleAmountIsNotDefineError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Free Spin Bet Scale Amount Is Not Define!',
  errorCode: 3340
}

export const SubscriptionPlanNotExistErrorType = {
  name: 'SubscriptionPlanNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Subscription Plan does not exist',
  errorCode: 3341
}

export const SubscriptionPlanLimitErrorType = {
  name: 'SubscriptionPlanLimitError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Only 3 active subscription plans are allowed, please deactivate other plan first',
  errorCode: 3342
}

export const InvalidNumberRangeErrorType = {
  name: 'InvalidNumberRange',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid number range: minimum should be less than maximum.',
  errorCode: 3305
}

export const OverlappingNumberRangeErrorType = {
  name: 'OverlappingNumberRange',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'The provided number range overlaps with an existing range.',
  errorCode: 3306
}

export const ProviderRateAlreadyExistErrorType = {
  name: 'ProviderRateAlreadyExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Provider rate is already exist,',
  errorCode: 3307
}

export const EmptyRateEntriesErrorType = {
  name: 'EmptyRateEntriesError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Rate entries array cannot be empty.',
  errorCode: 3308
}

export const FirstRangeMustStartFromZeroErrorType = {
  name: 'FirstRangeMustStartFromZeroError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'The first range must start from ggrMinimum = 0.',
  errorCode: 3308
}

export const LastRangeMustBeInfiniteErrorType = {
  name: 'LastRangeMustBeInfiniteError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'The last range must have ggrMaximum = null (infinite range).',
  errorCode: 3309
}

export const RangeMustBeSequentialErrorType = {
  name: 'RangeMustBeSequentialError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Each range must start immediately after the previous range\'s maximum value.',
  errorCode: 3310
}

export const ProviderRateNotExistErrorType = {
  name: 'ProviderRateNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Provider rate does not exist.',
  errorCode: 3311
}

export const SubscriptionWithSameNameAlreadyExistErrorType = {
  name: 'SubscriptionWithSameNameAlreadyExistErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Subscription With Same Name Already Exist, Please Change Subscription Name',
  errorCode: 3312
}

export const DiscountAlreadyExistsForThisMonthErrorType = {
  name: 'DiscountAlreadyExistsForThisMonthError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Discount Percentage already exists for this game and month.',
  errorCode: 3313
}

export const GameMonthlyDiscountNotExistErrorType = {
  name: 'GameMonthlyDiscountNotExistError',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Game monthly discount not exist.',
  errorCode: 3314
}

export const SubscriptionMonthlyAmountGreaterThanYearlyAmountErrorType = {
  name: 'SubscriptionMonthlyAmountGreaterThanYearlyAmountErrorType',
  statusCode: StatusCodes.BAD_REQUEST,
  isOperational: true,
  description: 'Subscription monthly amount is greater than yearly amount.',
  errorCode: 3315
}
