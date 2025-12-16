import React, { useEffect, useState } from "react";
import { Button, Spinner, Alert, Card } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGamePageFaq } from "../../../utils/apiCalls";
import { DeleteConfirmationModal } from "../../../components/ConfirmationModal";
import useGamePageListing from "../hooks/useGamePageLIsting";

const ViewGamePageFaq = () => {
  const [faqs, setFaqs] = useState([]);
  const [deletingId, _setDeletingId] = useState(null);
  const [error, _setError] = useState(null);
  const { gamePageId } = useParams();
  const {handleFaqDeleteModal,deleteModalShow,setDeleteModalShow,handleFaqDeleteYes} = useGamePageListing()

  const {
    isLoading: isFaqLoading,
    // refetch: faqRefetch,
    data: faqData,
  } = useQuery({
    queryKey: ["gamePageId", gamePageId],
    queryFn: () => getGamePageFaq({ gamePageId: gamePageId }),
    select: (res) => res?.data?.faqs,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (faqData) {
      setFaqs(faqData);
    }
  }, [faqData]);


  if (isFaqLoading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h3 className="mb-4">FAQs : {faqs?.gamePageTitle}</h3>
      {faqs?.rows?.length === 0 ? (
        <p>No FAQs found.</p>
      ) : (
        faqs?.rows?.map((faq) => (
          <Card key={faq.faqId} className="mb-3">
            <Card.Body>
              <Card.Title>Q: {faq.question}</Card.Title>
              <Card.Text>
                <strong>A:</strong> {faq.answer}
              </Card.Text>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleFaqDeleteModal(faq?.gamePageFaqId,gamePageId)}
                disabled={deletingId === faq?.gamePageFaqId}
              >
                <FontAwesomeIcon icon={faTrash} className="me-1" />
                {deletingId === faq.faqId ? "Deleting..." : "Delete"}
              </Button>
            </Card.Body>
          </Card>
        ))
      )}

      {deleteModalShow && (
        <DeleteConfirmationModal
          deleteModalShow={deleteModalShow}
          setDeleteModalShow={setDeleteModalShow}
          handleDeleteYes={handleFaqDeleteYes}
        //   loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default ViewGamePageFaq;
