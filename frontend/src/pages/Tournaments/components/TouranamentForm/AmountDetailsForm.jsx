// AmountDetailsForm.js
import React from 'react';
import {
    Col,
    Row,
    Form as BForm,
} from "@themesberg/react-bootstrap";
import { ErrorMessage } from "formik";


const AmountDetailsForm = ({
    t,
    values,
    handleBlur,
    details,
    handleChange
}) => {
    return (
        <Row className="mt-0">
            <Col md={6} sm={12} className="mt-3">
                <BForm.Label>
                    {t("tournaments.inputField.entryAmount.label")}
                    <span className="text-danger"> *</span>
                </BForm.Label>

                <BForm.Control
                    type="number"
                    name="entryAmount"
                    min="0"
                    placeholder={t(
                        "tournaments.inputField.entryAmount.placeholder"
                    )}
                    value={values?.entryAmount}
                    onChange={(event) => {
                        const value = event.target.value;

                        const updatedValue = value.match(
                            /^(\d+(\.\d{0,2})?)?$/
                        )
                            ? value
                            : values?.entryAmount || "";
                        handleChange({
                            target: {
                                name: event.target.name,
                                value: updatedValue,
                            },
                        });
                    }}
                    onBlur={handleBlur}
                    disabled={details}
                // disabled={isEdit}
                />

                <ErrorMessage
                    component="div"
                    name="entryAmount"
                    className="text-danger"
                />
            </Col>

            <Col md={6} sm={12} className="mt-3">
                <BForm.Label style={{ minWidth: "108px" }}>
                    Joining Coin Type
                    <span className="text-danger"> *</span>
                </BForm.Label>
                <BForm.Select
                    type="text"
                    name={"entryCoin"}
                    value={values?.entryCoin}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={details}
                >
                    {
                        <>
                            <option key={"SC"} value={"SC"}>
                                SC
                            </option>
                            <option key={"GC"} value={"GC"}>
                                GC
                            </option>
                        </>
                    }
                </BForm.Select>
            </Col>

            <Col md={6} sm={12} className="mt-3">
                <BForm.Label>
                    {t("tournaments.inputField.winSc.label")}
                    <span className="text-danger"> *</span>
                </BForm.Label>

                <BForm.Control
                    type="number"
                    name="winSc"
                    min="0"
                    placeholder={t(
                        "tournaments.inputField.winSc.placeholder"
                    )}
                    value={values?.winSc}
                    onChange={(event) => {
                        const value = event.target.value;

                        const updateValue = value.match(
                            /^(\d+(\.\d{0,2})?)?$/
                        )
                            ? value
                            : values?.winSc || "";
                        handleChange({
                            target: {
                                name: event.target.name,
                                value: updateValue,
                            },
                        });
                    }}
                    onBlur={handleBlur}
                    disabled={details}
                />

                <ErrorMessage
                    component="div"
                    name="winSc"
                    className="text-danger"
                />
            </Col>

            <Col md={6} sm={12} className="mt-3">
                <BForm.Label>
                    {t("tournaments.inputField.winGc.label")}
                    <span className="text-danger"> *</span>
                </BForm.Label>

                <BForm.Control
                    type="number"
                    name="winGc"
                    min="1"
                    placeholder={t(
                        "tournaments.inputField.winGc.placeholder"
                    )}
                    value={values?.winGc}
                    onChange={(event) => {
                        const value = event.target.value;

                        const updateValue = value.match(
                            /^(\d+(\.\d{0,2})?)?$/
                        )
                            ? value
                            : values?.winGc || "";

                        handleChange({
                            target: {
                                name: event.target.name,
                                value: updateValue,
                            },
                        });
                    }}
                    onBlur={handleBlur}
                    disabled={details}
                />

                <ErrorMessage
                    component="div"
                    name="winGc"
                    className="text-danger"
                />
            </Col>
        </Row>
    );
};

export default AmountDetailsForm;
