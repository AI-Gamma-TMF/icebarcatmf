export const AGE_RESTRICTION_19 = [ '2', '33']

export const stateListConst = (data) => {
    const tempStateList = data?.filter((item) => {
      item.label = item.name
      item.value = item.state_id
      return true
    })
    return tempStateList || []
  }
  
  export const CityListConst = (data) => {
    const tempCityList = data?.filter((item) => {
      item.label = item.name
      item.value = item.city_id
      return true
    })
    return tempCityList || []
  }

export const genderConst = [
	{ value: 'male', label: 'Male' },
	{ value: 'female', label: 'Female' },
	{ value: 'other', label: 'Other' }
  ]