import React, { useEffect, useState } from "react";
// import axios from "axios";
import { Button, Spinner, Alert, Card } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBlogFaq } from "../../../utils/apiCalls";
import { DeleteConfirmationModal } from "../../../components/ConfirmationModal";
import useGamePageListing from "../../DynamicGamePage/hooks/useGamePageLIsting";
import useBlogsListing from "../hooks/useBlogsListing";

const ViewFaq = () => {
  const [faqs, setFaqs] = useState([]);
  const [deletingId, _setDeletingId] = useState(null);
  const [error, _setError] = useState(null);
  const { blogId } = useParams();
  const {handleFaqDeleteModal,deleteModalShow,setDeleteModalShow,handleFaqDeleteYes} = useBlogsListing()

  const {
    isLoading: isFaqLoading,
    // refetch: faqRefetch,
    data: faqData,
  } = useQuery({
    queryKey: ["faq", blogId],
    queryFn: () => getBlogFaq({ blogPostId: blogId }),
    select: (res) => res?.data?.faqs,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (faqData) {
      setFaqs(faqData);
    }
  }, [faqData]);

  // const deleteFaq = async (faqId) => {
  //   try {
  //     setDeletingId(faqId);
  //     await axios.delete(`/api/faqs/${faqId}`); // Adjust endpoint accordingly
  //     setFaqs((prev) => prev.filter((faq) => faq.id !== faqId));
  //   } catch (err) {
  //     setError("Failed to delete FAQ");
  //   } finally {
  //     setDeletingId(null);
  //   }
  // };

  if (isFaqLoading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h3 className="mb-4">FAQs : {faqs?.blogPostMetaTitle}</h3>
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
                onClick={() => handleFaqDeleteModal(faq?.faqId,blogId)}
                disabled={deletingId === faq?.faqId}
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

export default ViewFaq;
