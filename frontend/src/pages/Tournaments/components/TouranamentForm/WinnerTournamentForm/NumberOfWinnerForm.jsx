// NumberOfWinnerForm.js
import React from 'react';
import {
  Col,
  Row,
  Form as BForm,
  ProgressBar,
} from "@themesberg/react-bootstrap";
import { ErrorMessage, FieldArray } from "formik";
import RankPercentSelector from './RankPercentSelector';


const NumberOfWinnerForm = ({
  t,
  values,
  setFieldValue,
  handleBlur,
  tournamentData,
  details,
  errors
}) => {

  function WithLabelExample(info) {
    let sum = info?.reduce((acc, o) => acc + parseFloat(o), 0);
    sum = Math.round(sum);
    return <ProgressBar now={sum} label={`${sum}%`} />;
  }

  return (
    <Row className="mt-0">
      {/* Number of Winners */}
      <Col md={6} sm={12} className="mt-3">
        <BForm.Label>
          {t(
            "tournaments.inputField.numberOfWinners.label"
          )}
          <span className="text-danger"> *</span>
        </BForm.Label>

        <BForm.Control
          type="number"
          name="numberOfWinners"
          min="1"
          placeholder={t(
            "tournaments.inputField.numberOfWinners.placeholder"
          )}
          value={values?.numberOfWinners}
          onKeyDown={(e) => {
            if (["e", ".", "-"].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            setFieldValue(
              "numberOfWinners",
              e.target.value
            );
          }}
          onBlur={handleBlur}
          disabled={details}
        />

        <ErrorMessage
          component="div"
          name="numberOfWinners"
          className="text-danger"
        />
      </Col>

      <Row className="mt-3">
        <Col md={6} sm={12}>
          {values?.winnerPercentage?.length > 0 &&
            WithLabelExample(values?.winnerPercentage)}
        </Col>
      </Row>
      <Row className="mt-3">
        <FieldArray
          name="winnerPercentage"
          render={() => {
            return (
              <div>
                {values?.numberOfWinners && (
                  <Col
                    md={12}
                    sm={12}
                    className="mt-3"
                    key={`winnerPercentage-key`}
                  >
                    <RankPercentSelector
                      isDisabled={details}
                      tournamentData={tournamentData}
                      setFieldValue={setFieldValue}
                      numberOfWinners={
                        values?.numberOfWinners
                      }
                    />
                  </Col>
                )}
              </div>
            );
          }}
        />
      </Row>
      {!Array.isArray(errors?.winnerPercentage) &&
        !errors?.numberOfWinners &&
        errors?.winnerPercentage && (
          <ErrorMessage
            component="div"
            name={`winnerPercentage`}
            className="text-danger"
          />
        )}
    </Row>
  );
};

export default NumberOfWinnerForm;
