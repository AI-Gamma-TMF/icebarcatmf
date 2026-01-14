import { useUserStore } from '../store/store'

// Check if running on demo host - bypass all permission checks
const isDemoHost = () => {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  return (
    hostname.includes("icebarcatmf-admin-demo") ||
    hostname.includes("ondigitalocean.app") ||
    hostname === "localhost" ||
    hostname === "127.0.0.1"
  );
};

const useCheckPermission = () => {
  const permissions = useUserStore((state) => state.permissions)
  const isHidden = ({ module }) => {
    // On demo host, never hide any elements - show everything
    if (isDemoHost()) return false
    // If permissions haven't loaded yet, don't hide the element (show by default)
    if (!permissions) return false
    return !(Object.keys(permissions).includes(module.key) && permissions[module.key].includes(module.value))
  }
  return { isHidden }
}
export default useCheckPermission
