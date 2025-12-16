import React, { useEffect, useState } from "react";


import { loginCountSocket } from "../../../../utils/socket";
import { useUserStore } from "../../../../store/store";

export const Ticker = ({ _loginData, data }) => {
  const [loginCount, setLoginCount] = useState(0);
  const [livePlayersCount, setLivePlayersCount] = useState(0);
  const [vaultSc, setVaultSc] = useState(0);
  const [walletSc, setWalletSc] = useState(0);
  // const labelList = loginData.find(
  //   (data) => data?.label === "loginKeys.CURRENT_LOGIN"
  // ).total;

  const loginCountSocketConnection = useUserStore(
    (state) => state.loginCountSocketConnection
  );
  const livePlayersCountConnection = useUserStore(
    (state) => state.livePlayersCountConnection
  );

  const loginCountSocketData = (data) => {
    setLoginCount(data);
  };

  const livePlayersCountSocketData = (data) => {
    setLivePlayersCount(data);
  };

  useEffect(() => {
    if (!loginCountSocketConnection) return;
    loginCountSocket.on("COMBINED_LIVE_UPDATE", (data) => {
      setWalletSc(Math.round(data?.totalScCoin * 100) / 100);
      setVaultSc(Math.round(data?.totalVaultScCoin * 100) / 100);

      loginCountSocketData(data?.liveLoginCount);
    });
    return () => {
      loginCountSocket.off("COMBINED_LIVE_UPDATE", () => {
        console.log("socket disconnected");
      });
    };
  }, [loginCountSocketConnection]);

  useEffect(() => {
    if (!livePlayersCountConnection) return;

    loginCountSocket.on("COMBINED_LIVE_UPDATE", (data) => {
      setWalletSc(Math.round(data?.totalScCoin * 100) / 100);
      setVaultSc(Math.round(data?.totalVaultScCoin * 100) / 100);

      livePlayersCountSocketData(data?.liveGamePlayCount);
    });
    return () => {
      loginCountSocket.off("COMBINED_LIVE_UPDATE", () => {
        console.log("socket disconnected");
      });
    };
  }, [livePlayersCountConnection]);
  const formattedVaultData =
    Math.round(data?.DASHBOARD_REPORT?.totalVaultScCoin * 100) / 100;
  const formattedWalletData =
    Math.round(data?.DASHBOARD_REPORT?.totalWalletScCoin * 100) / 100;

  return (
    <>
      <div className="ticker-wrapper w-100 p-2">
        <div className="ticker-container online">
          <div className="ticker-today-loginC">
            <div className="ticker-label">
              {" "}
              {/* <FontAwesomeIcon icon={faUserAlt} style={{ color: "black" }} />
               */}
              <img src="/online-players.png" />
              <label>Online Players</label>
            </div>
            <div className="ticket-todayC">
              {" "}
              <p>{loginCount ? loginCount.toLocaleString() : data?.DASHBOARD_REPORT?.currentLogin}</p>
              {/* <p className="green-c">{" (+50%) "}</p> */}
              {/* <FontAwesomeIcon icon={faArrowUp} style={{fontSize:"25px",color:"green"}} /> */}
            </div>
          </div>
        </div>
        <div className="ticker-container active">
          <div className="ticker-today-loginC">
            <div className="ticker-label">
              {/* <FontAwesomeIcon icon={faUserAlt} style={{ color: "black" }} /> */}
              <img src="/active-players.png" />
              <label>Active Players</label>
            </div>
            <div className="ticket-todayC">
              {" "}
              <p>
                {livePlayersCount
                  ? livePlayersCount.toLocaleString()
                  : data?.DASHBOARD_REPORT?.activePlayersCount}
              </p>
            </div>
          </div>
        </div>

        <div className="ticker-container total-wallet">
          <div className="ticker-today-loginC">
            <div className="ticker-label">
              {/* <FontAwesomeIcon icon={faDollarSign} style={{ color: "black" }} /> */}
              <img src="/total-wallet-sc.png" />
              <label>Total Wallet SC</label>
            </div>
            <div className="ticket-todayC">
              {" "}
              <p>
                {walletSc
                  ? walletSc.toLocaleString()
                  : data
                  ? formattedWalletData.toLocaleString()
                  : 0}
              </p>
            </div>
          </div>
        </div>
        <div className="ticker-container total-vault">
          <div className="ticker-today-loginC">
            <div className="ticker-label">
              {/* <FontAwesomeIcon icon={faDollarSign} style={{ color: "black" }} /> */}
              <img src="/total-vault-sc.png" />
              <label>Total Vault SC</label>
            </div>
            <div className="ticket-todayC">
              {" "}
              <p>
                {vaultSc
                  ? vaultSc.toLocaleString()
                  : data
                  ? formattedVaultData.toLocaleString()
                  : 0}
              </p>
            </div>
          </div>
        </div>
        <div className="ticker-container overall">
          <div className="ticker-today-loginC">
            <div className="ticker-label">
              {/* <FontAwesomeIcon icon={faDollarSign} style={{ color: "black" }} /> */}
              <img src="/overall-rate.png" />
              <label>Overall Redemption Rate</label>
            </div>
            <div className="ticket-todayC">
              {" "}
              <p>
                {data?.DASHBOARD_REPORT?.redemptionRateOverall
                  ? data?.DASHBOARD_REPORT?.redemptionRateOverall
                  : 0}%
              </p>
            </div>
          </div>
        </div>
        <div className="ticker-container today">
          <div className="ticker-today-loginC">
            <div className="ticker-label">
              {/* <FontAwesomeIcon icon={faDollarSign} style={{ color: "black" }} /> */}
              <img src="/today-rate.png" />
              <label>Today Redemption Rate</label>
            </div>
            <div className="ticket-todayC">
              {" "}
              <p>
                {data?.DASHBOARD_REPORT?.redemptionRateToday
                  ? data?.DASHBOARD_REPORT?.redemptionRateToday
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ticker;
