import { Row, Col, Card } from "@themesberg/react-bootstrap";
import { useTranslation } from 'react-i18next';

import GameLobby from "./components/GameLobby";


const CasinoGameLobby = () => {
  const { t } = useTranslation(['casino']);


  return (
    <div className="dashboard-typography">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
        <div>
          <h3>Game Lobby</h3>
          <p className="text-muted mb-0">Manage lobby settings and game presentation</p>
        </div>
      </div>

      <Card className="dashboard-filters mb-4">
        <Card.Body>
          <GameLobby />
        </Card.Body>
      </Card>
    </div>
  );
};

export default CasinoGameLobby;
