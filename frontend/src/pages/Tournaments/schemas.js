import * as Yup from 'yup'
const today = new Date(Date.now());

export const casinoCategorySchema = (t, tournamentData, TOURNAMENT_STATUS) => {
  let dateSchema = {};
  if (String(tournamentData?.status) !== String(TOURNAMENT_STATUS.ON_GOING)) {
    dateSchema = {
      startDate: Yup.date()
        .min(today, 'Date cannot be earlier than today.')
        .max(Yup.ref('endDate'), "Start Date must be less than end Date.")
        .typeError('The value must be a date (MM-DD-YYYY)')
        .required('Start Date field is required'),

      endDate: Yup.date().min(
        Yup.ref('startDate'),
        "End Date must be greater than start Date."
      )
        .test('notSameAsStart', 'End date cannot be the same as start date', function (endDate) {
          const { startDate } = this.parent;
          return !startDate || !endDate || startDate.getTime() !== endDate.getTime();
        }).required('End Date field is required'),
    }
  }
  return Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .test('title', 'Title cannot be just spaces', (value) => {
        return value?.trim()
      }
      )
      .min(5, 'Title must be at least 5 characters')
      .max(50, 'Title must not exceed 50 characters')
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        'Title must only contain letters, numbers, and spaces'
      )
    ,
    entryAmount: Yup.number()
      .min(0, 'Joining Amount should be 0 or more')
      .required('Joining Amount Required'),

    playerLimitIsActive: Yup.boolean(),

    // tournamentImg : Yup.mixed()
    //           .test('File Size', t('casinoBannerManagement.inputField.desktopImage.errors.max'),
    //             (value) => !value || (value && value.size <= 582 * 314)
    //           )
    //           .test('FILE_FORMAT', t('casinoBannerManagement.inputField.desktopImage.errors.invalidFormat'),
    //             (value) =>
    //               !value ||
    //               (value && ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type))).nullable(),
    //         // : Yup.mixed().test('File Size', t('casinoBannerManagement.inputField.desktopImage.errors.max'),
    //         //   (value) => !value || (value && value.size <= 582 * 314))
    //         //   .test('FILE_FORMAT', t('casinoBannerManagement.inputField.desktopImage.errors.invalidFormat'),
    //         //     (value) =>
    //         //       !value ||
    //         //       (value && ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type)))
    //         //   .nullable(),

    playerLimit: Yup.number().when('playerLimitIsActive', {
      is: (riskClassification) => riskClassification,
      then: (schema) => schema.min(1, 'Minimum player should be 1').required('Player limit is Required'),
      otherwise: () => Yup.number().nullable()
    }),
    // allowedUsers: Yup.array().when('vipTournament', {
    //   is: (vipTournament) => vipTournament, // Only apply when VIP tournament is enabled
    //   then: ()=>Yup.array()
    //   .min(1, 'At least one user must be selected for the VIP tournament.')
    //   .required('VIP Users are required when VIP tournament is enabled.'),
    //   otherwise: ()=> Yup.array().nullable(),
    // }),
    description: Yup.string()
      .required('Descriptions is required')
      .test('description', 'Description cannot be just spaces', (value) => {
        return value?.trim()
      }
      )
      .min(1, 'descriptions must be at least 5 characters'),

    vipTournamentTitle: Yup.string()
      .transform((value) => (value ? value.trim() : '')) // Trim and convert undefined/null to empty string
      .test(
        'min-if-present',
        'VIP Tournament Title must be at least 5 characters',
        (value) => !value || value.length >= 5
      )
      .test(
        'max-if-present',
        'VIP Tournament Title must not exceed 50 characters',
        (value) => !value || value.length <= 50
      ),



    winGc: Yup.number()
      .test('onePrizeZero', 'One prize amount (SC or GC) can be 0 but not both', function (value) {
        const { winSc } = this.parent;
        if (value === 0 && winSc === 0) {
          return false;
        }
        return true;
      })
      // .min(0.01, 'Prize GC should be greater than 0')
      .required('Prize GC Required'),

    winSc: Yup.number()
      .test('onePrizeZero', 'One prize amount (SC or GC) can be 0 but not both', function (value) {
        const { winGc } = this.parent;
        if (value === 0 && winGc === 0) {
          return false;
        }
        return true;
      })
      // .min(0.01, 'Prize SC should be greater than 0')
      .required('Prize SC Required'),

    ...dateSchema,

    numberOfWinners: Yup.number().required('Number of winners is required')
      .min(1, 'Number should be greater than 0')
      .max(100, 'Number should not be greater than 100'),

    gameId: Yup.array()
      .min(1, 'Please select at least one game')
      .max(50, 'You can select up to 50 games only'),


    winnerPercentage: Yup.array()
      .of(Yup.number().max(100, `Maximum value should be 100`).required("Field is required"))
      .test('winnerPercentage', 'Sum of Ranks must be  100', (value) => {
        const sum = value.reduce((acc, curr) => acc + curr, 0)
        return Math.round(sum) === 100
      }
      )
  })


}
