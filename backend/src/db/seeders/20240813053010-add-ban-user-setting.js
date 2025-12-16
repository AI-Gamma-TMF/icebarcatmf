'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = [
      {
        reason_title: 'Underage Gaming',
        reason_description: 'We have reason to believe that you do not meet the minimum age requirement to participate on our platform. As a responsible operator, we strictly enforce age restrictions in compliance with regulatory requirements. We regret that this action was necessary, but we must ensure that our platform is a safe and legal environment for all users.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Multiple Accounts',
        reason_description: 'We have reason to believe that you have created and operated more than one account on our platform, which is against our policy of one account per user. This policy helps ensure fair play and prevent abuse of our services.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Fraudulent Activity',
        reason_description: 'We have reason to believe that your account has been involved in activity consistent with fraudulent behavior, including but not limited to unauthorized payment methods or charge backs. To protect the integrity of our platform and our user community, we are unable to maintain your account.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Collusion and Cheating',
        reason_description: 'We have reason to believe that your account has been involved in behavior that violates our fair play policies, including suspected collusion with other players or the use of unauthorized software to gain an unfair advantage. This kind of activity is strictly prohibited on our platform.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Violation of Terms of Service',
        reason_description: 'We have reason to believe that your account was found to be in breach of our Terms of Service, which include guidelines on acceptable behavior, responsible gaming, and the use of our platform. Maintaining a safe and enjoyable environment for all users is our top priority',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Illegal Activity',
        reason_description: 'We have reason to believe that your account has been involved in activity that violates legal regulations or involves prohibited practices. We take compliance with the law very seriously and must close accounts that do not adhere to these standards.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Abuse of Bonuses and Promotions',
        reason_description: 'We have reason to believe that your account has been involved in activities that violate our bonus and promotion policies. These rules are in place to ensure a fair experience for all our users.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Failure to Verify Identity',
        reason_description: 'We have reason to believe that your account has not provided the necessary documentation to verify your identity. Our platform requires all users to verify their identity to ensure compliance with legal and regulatory standards, and we are unable to keep your account active without this verification.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Inactive Accounts',
        reason_description: 'We have reason to believe that your account has been inactive for an extended period, and in accordance with our terms and conditions, inactive accounts may be closed to maintain the security and efficiency of our platform.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Misuse of Social Features',
        reason_description: 'We have reason to believe that your account has been involved in misuse of our platform\'s social features, including behavior that violates our community standards, such as inappropriate or offensive communication. We strive to create a respectful and safe environment for all our users.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Breach of Responsible Gaming Policies',
        reason_description: 'We have reason to believe that your account was found to be in breach of our Terms of Service, which include guidelines on acceptable behavior, responsible gaming, and the use of our platform. Maintaining a safe and enjoyable environment for all users is our top priority.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Excluded State or Territory',
        reason_description: 'We hope this message finds you well. We are writing to inform you that your account with The Money Factory has been closed. After a thorough review, we have reason to believe that your account is associated with a state or territory where our services are not permitted.\n\n As part of our commitment to compliance with legal and regulatory requirements, we are unable to offer our platform\'s services in certain regions. Unfortunately, this means that we must close accounts linked to these excluded areas.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Other',
        reason_description: 'We hope this message finds you well. We are writing to inform you that your account with The Money Factory has been closed. After a thorough review, we have reason to believe that your account is in violation of our platform\'s policies.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Account Misidentification',
        reason_description: 'After further review, it was determined that the initial identification of multiple accounts or suspicious activity was incorrect, and the account has been reinstated.',
        is_active: true,
        deactivate_reason: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Cleared Regulatory Issue',
        reason_description: 'The user has provided the necessary documentation or clarification to comply with regulatory requirements, allowing the account to be reactivated.',
        is_active: true,
        deactivate_reason: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Appeal Granted',
        reason_description: 'We hope this message finds you well. Following your appeal, we have reviewed your account with The Money Factory. While we initially believed it was in violation of our platform’s policies, we have reconsidered the decision, and your account has been reactivated.',
        is_active: true,
        deactivate_reason: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Other Reason',
        reason_description: 'We hope this message finds you well. We are writing to inform you that, upon further review, your account with The Money Factory has been restored. We previously believed your account was in violation of our platform\'s policies. However, we have now confirmed that your account is in compliance, and it has been reactivated.',
        is_active: true,
        deactivate_reason: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        reason_title: 'Internal User',
        reason_description: 'Mark this user as Internal User.',
        is_active: true,
        deactivate_reason: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]

    await queryInterface.bulkInsert('ban_user_setting', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ban_user_setting', null, {})
  }
}
