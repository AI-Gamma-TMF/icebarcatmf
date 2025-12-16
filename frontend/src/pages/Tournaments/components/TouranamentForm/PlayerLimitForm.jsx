// PlyerLimitForm.js
import React from 'react';
import {
    Col,
    Row,
    Form as BForm,
} from "@themesberg/react-bootstrap";
import { ErrorMessage } from "formik";


const PlayerLimitForm = ({
    t,
    values,
    handleBlur,
    details,
    handleChange
}) => {
    return (
        <Row className="mt-0">
            {/* Player Limit */}
            <Col md={3} sm={6} className="d-flex mt-3">
                <BForm.Label>
                    {"Enable Player Limit"}
                    {/* <span className='text-danger'> *</span> */}
                </BForm.Label>

                <BForm.Check
                    type="switch"
                    name="playerLimitIsActive"
                    className="ms-6"
                    // placeholder='Enter Ac'
                    checked={values?.playerLimitIsActive}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={details}
                />

                <ErrorMessage
                    component="div"
                    name="playerLimitIsActive"
                    className="text-danger"
                />
            </Col>
            {values?.playerLimitIsActive && (
                <Col md={6} sm={12} className="mt-3">
                    <BForm.Label>
                        {t("tournaments.inputField.playerLimit.label")}
                        {values?.playerLimitIsActive && (
                            <span className="text-danger"> *</span>
                        )}
                    </BForm.Label>

                    <BForm.Control
                        type="number"
                        name="playerLimit"
                        min="1"
                        onKeyDown={(e) => {
                            if (["e", ".", "-"].includes(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        placeholder={t(
                            "tournaments.inputField.playerLimit.placeholder"
                        )}
                        value={values?.playerLimit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={details}
                    />

                    <ErrorMessage
                        component="div"
                        name="playerLimit"
                        className="text-danger"
                    />
                </Col>
            )}
        </Row>
    );
};

export default PlayerLimitForm;
