import React from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Container,
  Card,
} from "@themesberg/react-bootstrap";
import useReorderQuestion from "../../hooks/useReorderQuestions";
import { InlineLoader } from "../../../../components/Preloader";

const VipFormPreview = () => {
  const { loading, state } = useReorderQuestion();
  return (
    <>
      <h2 className="p-4 m-auto">Admin Preview: VIP Questions Form</h2>
      <Container className="p-4 border rounded">
        {loading ? (
          <InlineLoader />
        ) : (
          <Form>
            <Row className="g-3">
              {state?.rows
                ?.filter(({ isActive }) => Boolean(isActive))
                ?.map(
                  (
                    { question, frontendQuestionType, options, required },
                    index
                  ) => {
                    const isFullWidth =
                      frontendQuestionType === "checkbox" ||
                      frontendQuestionType === "radio";
                    return (
                      <Col
                        md={isFullWidth ? 12 : 6}
                        className="mt-4"
                        key={index}
                      >
                        <Form.Group>
                          <Form.Label className="mb-3">
                            {index + 1} {" . "} {question}{" "}
                            {required && <span className="text-danger">*</span>}
                          </Form.Label>
                          {(frontendQuestionType === "text" ||
                            frontendQuestionType === "email" ||
                            frontendQuestionType === "number") && (
                            <Form.Control
                              type={frontendQuestionType}
                              placeholder={question}
                              disabled
                            />
                          )}

                          {frontendQuestionType === "textarea" && (
                            <Form.Control
                              as="textarea"
                              style={{ resize: "none" }}
                              rows={8}
                              placeholder={question}
                              disabled
                            />
                          )}
                          {frontendQuestionType === "select" && (
                            <Form.Select disabled>
                              <option value="" selected>
                                Select an option
                              </option>
                              {options.map((opt, _idx) => (
                                <option key={opt.id}>{opt.text}</option>
                              ))}
                            </Form.Select>
                          )}

                          {(frontendQuestionType === "radio" ||
                            frontendQuestionType === "checkbox") && (
                            <Card
                              style={{ backgroundColor: "#f5f8fb", opacity: 1 }}
                            >
                              <Card.Body style={{ padding: "1rem 1rem" }}>
                                <Form.Group className="d-flex flex-column flex-sm-row flex-wrap gap-2 gap-sm-4">
                                  {options.map((opt, idx) => (
                                    <Form.Check
                                      key={idx}
                                      type={frontendQuestionType}
                                      label={opt?.text}
                                      name={opt?.text}
                                      disabled
                                    />
                                  ))}
                                </Form.Group>
                              </Card.Body>
                            </Card>
                          )}
                        </Form.Group>
                      </Col>
                    );
                  }
                )}
            </Row>
            <div className="m-4 d-flex justify-content-center">
              <Button
                style={{
                  borderRadius: "7.8rem",
                  minWidth: "130px",
                  padding: "0.67rem",
                }}
                className="m-auto"
                disabled
              >
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Container>
    </>
  );
};

export default VipFormPreview;
