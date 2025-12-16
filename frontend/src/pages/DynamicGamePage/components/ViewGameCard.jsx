import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
} from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { DeleteConfirmationModal } from "../../../components/ConfirmationModal";
import useGamePageDetails from "../hooks/useGamePageDetails";
import { AdminRoutes } from "../../../routes";

const ViewFaq = () => {
  const [gameCards, setGameCards] = useState([]);
  const [deletingId, _setDeletingId] = useState(null);
  const [error, _setError] = useState(null);
  const { gamePageId } = useParams();
  const {
    gamePageCardsDetail,
    gameCardLoading,
    navigate,
    handleGameCardDelete,
    handleGameCardDeleteYes,
    deleteModalShow,
    setDeleteModalShow,
  } = useGamePageDetails();

  useEffect(() => {
    if (gamePageCardsDetail) {
      setGameCards(gamePageCardsDetail);
    }
  }, [gamePageCardsDetail]);

  if (gameCardLoading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h3 className="mb-4">
        Game Cards: {gamePageCardsDetail?.gamePageTitle || "Untitled"}
      </h3>

      {gameCards?.rows?.length === 0 ? (
        <p>No game cards found.</p>
      ) : (
        gameCards?.rows?.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-2">
                <strong>Section Title:</strong> {section.title}
              </Card.Title>
              <Card.Text>
                <strong>Section Description:</strong> {section.description}
              </Card.Text>

              <h6 className="mt-4 mb-2">Cards</h6>
              <Row className="gy-4">
                {section?.image?.map((img, index) => (
                  <Col xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card className="h-100 border">
                      {img.imageUrl && (
                        <Card.Img
                          variant="top"
                          src={img.imageUrl}
                          alt={img.altTag || ""}
                          style={{
                            objectFit: "cover",
                            maxHeight: "200px",
                          }}
                        />
                      )}
                      <Card.Body>
                        <Card.Title>{img.caption || "Untitled"}</Card.Title>
                        <Card.Text>{img.altTag || "No description"}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="mt-4">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    handleGameCardDelete(section?.gamePageCardId, gamePageId)
                  }
                  disabled={deletingId === section?.gamePageCardId}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-1" />
                  {deletingId === section.gamePageCardId
                    ? "Deleting..."
                    : "Delete Section"}
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="mx-2"
                  onClick={() =>
                    navigate(
                      `${AdminRoutes.GamePageCardEdit.split(
                        ":"
                      ).shift()}${gamePageId}/${section.gamePageCardId}`
                    )
                  }
                  disabled={deletingId === section?.id}
                >
                  <FontAwesomeIcon icon={faEdit} className="me-1" />
                  {"Edit Game Card"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      )}

      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleGameCardDeleteYes}
        />
      )}
    </div>
  );
};

export default ViewFaq;
