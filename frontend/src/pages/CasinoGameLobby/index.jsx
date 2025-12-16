import { Row, Col } from "@themesberg/react-bootstrap";
import { useTranslation } from 'react-i18next';

import GameLobby from "./components/GameLobby";


const CasinoGameLobby = () => {
  const { t } = useTranslation(['casino']);


  return (
    <Row className="mb-2">
      <Col>
        <h3>Game Lobby</h3>
      </Col>

      <Col lg={12}>
        <GameLobby  />
      </Col>
    </Row>
  );
};

export default CasinoGameLobby;
