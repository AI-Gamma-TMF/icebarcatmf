import React from "react";
import {
  Row,
  Col,
  Form as BForm,
  OverlayTrigger,
  Tooltip,
} from "@themesberg/react-bootstrap";
import { ErrorMessage } from "formik";

const WelcomePurchaseBonusSection = ({
  values,
  handleChange,
  handleBlur,
  t,
}) => {
  return (
    <>
      <Row>
        <Col xs={3} className="mb-3">
          <BForm.Label>
            Timer
            <span className="text-danger"> *</span>
          </BForm.Label>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-timer">
                Set the timer for special purchases in minutes.
              </Tooltip>
            }
          >
            <BForm.Control
              type="number"
              name="welcomePurchaseBonusApplicableMinutes"
              min="0"
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault()
              }
              placeholder={t(
                "createPackage.inputFields.welcomePurchaseBonusApplicableMinutes.placeholder"
              )}
              value={values.welcomePurchaseBonusApplicableMinutes ?? ""}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!values.welcomePurchaseBonusApplicable}
            />
          </OverlayTrigger>
          <ErrorMessage
            component="div"
            name="welcomePurchaseBonusApplicableMinutes"
            className="text-danger"
          />
        </Col>

        <Col xs={3} className="mb-3">
          <BForm.Label>
            Welcome Purchase Percentage
            <span className="text-danger"> *</span>
          </BForm.Label>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-welcome-percentage">
                Enter the percentage for welcome purchases.
              </Tooltip>
            }
          >
            <BForm.Control
              type="number"
              name="welcomePurchasePercentage"
              min="0"
              placeholder={"Welcome Purchase Percentage"}
              value={values.welcomePurchasePercentage}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!values.welcomePurchaseBonusApplicable}
            />
          </OverlayTrigger>
          <ErrorMessage
            component="div"
            name="welcomePurchasePercentage"
            className="text-danger"
          />
        </Col>
      </Row>
    </>
  );
};

export default WelcomePurchaseBonusSection;
