import React from "react";
import { Card } from "@themesberg/react-bootstrap";

const TournamentSummaryCard = ({ tournamentSummaryData, tournamentData }) => {

  const formatPriceWithCommas = (price) => {
    if (price) {
      const roundedPrice = parseFloat(price).toFixed(2); // Round to 2 decimal places
      const finalPrice = roundedPrice.endsWith(".00") ? parseInt(roundedPrice) : roundedPrice; // Remove .00 if whole number
      return finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    }
    return "0";
  };

  return (
    <div className="tournament-detail-wrap ">
      <Card className=" tournament-card p-2">
        <div>
          <h3>Tournament GGR</h3>
          <h3
            style={{
              color:
                tournamentSummaryData?.tournamentSummary?.ggr < 0
                  ? "red"
                  : "green",
            }}
          >
            {formatPriceWithCommas(tournamentSummaryData?.tournamentSummary?.ggr)} {tournamentData?.entryCoin}
          </h3>
        </div>
        <div>
          <img src="/tournament-ggr.png" alt="ggr" />
        </div>
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Total Win</h3>
          <h3>
            {formatPriceWithCommas(tournamentSummaryData?.tournamentSummary?.totalWin)} {tournamentData?.entryCoin}
          </h3>
        </div>
        <div>
          <img src="/total-win.png" alt="ggr" />
        </div>
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Total Bet</h3>
          <h3>
            {formatPriceWithCommas(tournamentSummaryData?.tournamentSummary?.totalBet)} {tournamentData?.entryCoin}
          </h3>
        </div>
        <div>
          <img src="/total-bet.png" alt="ggr" />
        </div>
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Total Player Joined</h3>
          <h3>
            {formatPriceWithCommas(tournamentSummaryData?.tournamentSummary?.totalPlayerCount)}
          </h3>
        </div>
        <div>
          <img src="/player-joined.png" alt="ggr" />
        </div>
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Prize Pool SC</h3>
          <h3>
            {formatPriceWithCommas(tournamentSummaryData?.tournamentSummary?.pricePoolSc)}
          </h3>
        </div>
        <div>
          {" "}
          <img src="/pool-sc.png" alt="ggr" />
        </div>
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Prize Pool GC</h3>
          <h3>
            {formatPriceWithCommas(tournamentSummaryData?.tournamentSummary?.pricePoolGc)}
          </h3>
        </div>
        <div>
          {" "}
          <img src="/pool-gc.png" alt="ggr" />
        </div>
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Entry Amount</h3>
          <h3>
            {formatPriceWithCommas(tournamentData?.entryAmount)} {tournamentData?.entryCoin}
          </h3>
        </div>
        {tournamentData?.entryCoin === "SC" ? <div>
          <img src="/entry-amount-sc.png" alt="ggr" />
        </div> : <div>
          <img src="/entry-amount-gc.png" alt="ggr" />
        </div>}
      </Card>
      <Card className=" tournament-card p-2">
        <div>
          <h3>Number of winners</h3>
          <h3>
            {formatPriceWithCommas(tournamentSummaryData?.tournamentSummary?.noOfWinners)}
          </h3>
        </div>
        <div>
          <img src="/noOfWinners.png" alt="noOfWinners" />
        </div>
      </Card>
    </div>
  );
};

export default TournamentSummaryCard;
