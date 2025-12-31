import { useEffect } from "react";
import { useUserStore } from "../../../store/store";
import { jackpotSocket, loginCountSocket, whaleAlertSocket } from "../../../utils/socket";

const useMainRoute =()=>{
    
    const setIsUserAffiliate = useUserStore((state) => state.setIsUserAffiliate);
    const setloginCountSocketConnection = useUserStore((state) => state.setloginCountSocketConnection)
    const setlivePlayersCountConnection = useUserStore((state) => state.setlivePlayersCountConnection)
    const setNotificationsSocketConnection = useUserStore((state) => state.setNotificationsSocketConnection)
    const setJackpotSocketConnection = useUserStore((state) => state.setJackpotSocketConnection)

    const userDetails = useUserStore((state) => state)
    const affiliateUrls = [
      '/affiliate/signin',
      '/affiliate-admin/dashboard',
      '/affiliate-admin/profile',
      '/affiliate-admin/players',
      '/affiliate-admin/player-details/:userId',
      '/affiliates/set-Password',
      '/affiliate/transitions',
      '/affiliate/casinoTransition',
      '/affiliate/commission'
    ];
  
    const currentPath = window.location.pathname;

    const isAffiliateLogin = affiliateUrls.some(url => currentPath.includes(url));
    
    useEffect(()=>{
      if (isAffiliateLogin) {
        setIsUserAffiliate(true)
      }else{
        setIsUserAffiliate(false)
      }
    },[isAffiliateLogin])
    
    useEffect(() => {
      if (!userDetails.userDetails) return
      // Perf: sockets can keep the tab “hot” (frequent messages) and spike CPU/GPU on some machines.
      // In low-power mode, we skip opening realtime connections.
      const lowPower =
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("gs-low-power");
      if (lowPower) return;
      loginCountSocket.connect()
      whaleAlertSocket.connect()
      jackpotSocket.connect()
      setloginCountSocketConnection(true)
      setlivePlayersCountConnection(true)
      setNotificationsSocketConnection(true)
      setJackpotSocketConnection(true)
      return () => {
        loginCountSocket.disconnect()
        whaleAlertSocket.disconnect()
        jackpotSocket.disconnect()
      }
    }, [!!userDetails.userDetails])

    return{
        isAffiliateLogin
    }
}

export default useMainRoute