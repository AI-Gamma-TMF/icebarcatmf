import { useState } from 'react'
// import { AdminRoutes } from '../../../routes'
const createOption = (label) => ({
  label: label,
  // value: label.toLowerCase().replace(/\W/g, ''),
  value: label,
  newOptions: true
})
const useCreatePackage = (_onSuccess) => {
  // const navigate = useNavigate()
  // const [enabled, setEnabled] = useState(false)
  const [typeValue, setTypeValue] = useState(null)
  const [typeOptions, setTypesOptions] = useState([])
  const [isSelectLoading, setIsSetLoading] = useState(false)

  const handleCreateOption = (inputValue) => {
    setIsSetLoading(true)
    setTimeout(() => {
      const newOption = createOption(inputValue)
      setIsSetLoading(false)
      const newList = [...typeOptions, newOption]
      setTypesOptions(newList)
      setTypeValue(newOption)
    }, 1000)
  }


  // useEffect(() => {
  //   setEnabled(true)
  // }, [])

  return {
    typeOptions,
    setTypesOptions,
    typeValue,
    setTypeValue,
    isSelectLoading,
    handleCreateOption
  }
}

export default useCreatePackage
