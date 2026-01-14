import { useUserStore } from '../store/store'

const useCheckPermission = () => {
  const permissions = useUserStore((state) => state.permissions)
  const isHidden = ({ module }) => {
    // If permissions haven't loaded yet, don't hide the element (show by default)
    if (!permissions) return false
    return !(Object.keys(permissions).includes(module.key) && permissions[module.key].includes(module.value))
  }
  return { isHidden }
}
export default useCheckPermission
