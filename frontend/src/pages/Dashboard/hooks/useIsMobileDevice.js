import { useEffect, useState } from "react";

export function useIsMobileDevice() {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const checkIsMobile = () => {
        setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
      };
  
      checkIsMobile(); // Initial check
  
      // Update on window resize (optional)
      const handleResize = () => {
        checkIsMobile();
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []); // Empty dependency array ensures the effect runs only once on mount
  
    return isMobile;
  }