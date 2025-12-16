import { useUserStore } from '../store/store'

const useCheckPermission = () => {
  const permissions = useUserStore((state) => state.permissions)
  const isHidden = ({ module }) => {
    return !(permissions && (Object.keys(permissions).includes(module.key) && permissions[module.key].includes(module.value)))
  }
  return { isHidden }
}
export default useCheckPermission
