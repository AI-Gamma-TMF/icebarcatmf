import React from "react";
import { Accordion, Row } from "@themesberg/react-bootstrap";

// Generic TournamentAccordionForm Component

const TournamentAccordionForm = ({
  activeKey,
  eventKey,
  title,
  onToggle,
  children,
  errorMessage,
}) => {
  return (
    <Accordion activeKey={activeKey}>
      <Accordion.Item className="mb-3" eventKey={eventKey}>
        <Accordion.Header onClick={onToggle}>
          <Row style={{ cursor: "pointer" }}>
            <h5 className="accordian-heading mb-0">
              <span>{title}</span>
            </h5>
          </Row>
        </Accordion.Header>
        <Accordion.Body>
          {children}
          {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default TournamentAccordionForm;
