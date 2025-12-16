import * as Yup from 'yup';

export const getScratchCardValidationSchema = (existingRecords) => {
  return Yup.object().shape({
    minReward: Yup.number()
      .typeError('Min Reward must be a number')
      .required('Min Reward is required')
      .min(0, 'Min Reward must be at least 0')
      .test(
        'min-less-than-max',
        'Min Reward should be less than Max Reward',
        function (value) {
          const { maxReward } = this.parent;
          return value < maxReward;
        }
      )
      .test(
        'chain-validation',
        'Min Reward must be greater than the previous Max Reward',
        function (value) {
          if (!existingRecords?.length) return true; // First record, no check needed

          const lastMax = Number(existingRecords[existingRecords.length - 1].maxReward);
          const currentMin = Number(value);

          // Ensure the current min is greater than the last max (not equal)
          return currentMin > lastMax;
        }
      )
      .test(
        'minReward-max-digits',
        'Min Reward cannot exceed 10 digits',
        (value) => {
          return value === undefined || value.toString().replace('.', '').length <= 10;
        }
      ),

    maxReward: Yup.number()
      .typeError('Max Reward must be a number')
      .required('Max Reward is required')
      .moreThan(Yup.ref('minReward'), 'Max Reward should be more than Min Reward')
      .test(
        'maxReward-max-digits',
        'Max Reward cannot exceed 10 digits',
        (value) => {
          return value === undefined || value.toString().replace('.', '').length <= 10;
        }
      ),

    rewardType: Yup.string()
      .required('Reward Type is required'),

    percentage: Yup.number()
      .typeError('percentage must be a number')
      .required('percentage is required')
      .min(1, 'percentage must be at least 1')
      .max(100, 'percentage cannot exceed 100'),
    playerLimit: Yup.number()
      .typeError("Player limit must be a number")
      .integer("Player limit must be an integer")
    //  .min(0, "Player limit cannot be negative")
      .nullable()
      .notRequired()
      .test(
        'playerLimit-max-digits',
        'Player Limit cannot exceed 10 digits',
        (value) => {
          return value === undefined || value.toString().length <= 10;
        }
      ),

    isAllow: Yup.boolean().required(),
    isActive: Yup.boolean().required()
  });
};
