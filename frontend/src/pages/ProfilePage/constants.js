export const profileConstants = [
  { key: 'firstName', value: 'firstName', edit: true },
  { key: 'oldPassword', value: 'oldPassword', edit: true },
  { key: 'lastName', value: 'lastName', edit: true },
  { key: 'newPassword', value: 'newPassword', edit: true },
  { key: 'email', value: 'email' },
  { key: 'confirmNewPassword', value: 'confirmNewPassword', edit: true },
  { key: 'userName', value: 'adminUsername' },
  { key: 'role', value: 'AdminRole', subValue: 'name' }
]

export const allowOnlyNumber = (value) => {
	return value.toString().replace(/[^0-9]/g, '')
  }
  