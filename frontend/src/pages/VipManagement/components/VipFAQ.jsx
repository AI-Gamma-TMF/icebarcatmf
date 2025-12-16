import React, { useState } from "react";
import { Row, Accordion } from "@themesberg/react-bootstrap";
import useVipQuestions from "../hooks/useVipQuestions";

const VipFAQ = () => {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const {
    vipAnswersList,
    isVipAnswerLoading,
  } = useVipQuestions(accordionOpen);

  return (
    <>
      <Accordion
        className="mt-3 vip-dashboard"
        activeKey={accordionOpen ? "0" : null}
        onSelect={(eventKey) => {
          setAccordionOpen((prev) => (eventKey === "0" ? !prev : false));
        }}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>Questions and Answers</Accordion.Header>
          <Accordion.Body>
            {
              !isVipAnswerLoading &&
              vipAnswersList.map((queAndAns, index) => (
                <Row className="mt-3" spacing={1} key={index}>
                  <Accordion
                    className="questionnaire-accordion vip-dashboard"
                  >
                    <Accordion.Item eventKey={index.toString()}>
                      <Accordion.Header className="p-1">
                        {queAndAns?.questionText} {!queAndAns?.isActiveQuestion && <span className="text-danger ms-4">In-Active</span>}
                      </Accordion.Header>
                      <Accordion.Body expanded={index}>
                        {queAndAns?.readableAnswer && (Array.isArray(queAndAns?.readableAnswer) ? queAndAns?.readableAnswer?.join(", ") : queAndAns?.readableAnswer) || 'No Answer Provided'}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Row>
              ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default VipFAQ;
