import React from "react";
import { casinoCategorySchema } from "../schemas";
import { Formik, Form, ErrorMessage, FieldArray } from "formik";
import {
  Col,
  Row,
  Form as BForm,
  Button,
  Spinner,
  Tabs,
  Tab,
} from "@themesberg/react-bootstrap";
import Trigger from "../../../components/OverlayTrigger";
import LeaderBoard from "./LeaderBoard";
import useCreateTier from "../hooks/useCreateTier";

const CreateTier = ({ data, details }) => {
  const { t, loading, updateTournament, createTournamentList } =
    useCreateTier();
  const tierData = data?.tierDetail || null;
  return (
    <>
      <Row>
        <Col sm={12}>
          <h3>
            {tierData ? (details ? "View" : "Edit") : "Create"}{" "}
            {t("tournaments.createCategory.label")}
          </h3>
        </Col>
      </Row>
      <Tabs
        defaultActiveKey={tierData ? (details ? "View" : "Edit") : "Create"}
        id="justify-tab-example"
        className={`${tierData && details ? "mt-5 ms-2" : "mt-2"} m-3`}
        // justify
      >
        <Tab
          eventKey={tierData ? (details ? "View" : "Edit") : "Create"}
          title={tierData ? (details ? "View" : null) : null}
        >
          <Formik
            enableReinitialize
            initialValues={{
              isActive: tierData ? tierData.isActive : false,
              isWeekelyBonusActive: tierData
                ? tierData.isWeekelyBonusActive
                : false,
              isMonthlyBonusActive: tierData
                ? tierData.isMonthlyBonusActive
                : false,
              name: tierData ? tierData.name : "",
              requiredXp: tierData ? tierData.requiredXp : "",
              bonusGc: tierData ? tierData.bonusGc : "",
              bonusSc: tierData ? tierData.bonusSc : "",
              weeklyBonusPercentage: tierData
                ? tierData.weeklyBonusPercentage
                : "",
              monthlyBonusPercentage: tierData
                ? tierData.monthlyBonusPercentage
                : "",
              icon: "",
            }}
            validationSchema={casinoCategorySchema(t)}
            onSubmit={(formValues) => {
              // let data = { ...formValues, gameId: formValues?.gameId?.map((info) => info.value) || [] }
              const data = {
                isActive: formValues.isActive,
                isWeekelyBonusActive: formValues.isWeekelyBonusActive,
                isMonthlyBonusActive: formValues.isMonthlyBonusActive,
                name: formValues.name,
                bonusSc: Number(formValues.bonusSc),
                bonusGc: Number(formValues.bonusGc),
                monthlyBonusPercentage: formValues.monthlyBonusPercentage,
                weeklyBonusPercentage: formValues.weeklyBonusPercentage,
                requiredXp: formValues.requiredXp,
                icon: formValues.icon,
              };
              tierData
                ? updateTournament({
                    ...data,
                    tierId: tierData?.tierId,
                  })
                : createTournamentList(data);
            }}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              errors,
              handleBlur,
              setFieldValue,
            }) => (
              <Form>
                <Row className="mt-3">
                  <Col md={12} sm={12} className="mt-3">
                    <BForm.Label>
                      {t("tournaments.inputField.categoryName.label")}
                      <span className="text-danger"> *</span>
                    </BForm.Label>

                    <BForm.Control
                      type="text"
                      name="name"
                      placeholder={t(
                        "tournaments.inputField.categoryName.placeholder"
                      )}
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={details}
                      autoComplete="off"
                    />

                    <ErrorMessage
                      component="div"
                      name="name"
                      className="text-danger"
                    />
                  </Col>

                  <Col md={6} sm={12} className="mt-3">
                    <BForm.Label>
                      {t("tournaments.inputField.bonusSc.label")}
                      <span className="text-danger"> *</span>
                    </BForm.Label>

                    <BForm.Control
                      type="number"
                      name="bonusSc"
                      min="0"
                      placeholder={t(
                        "tournaments.inputField.bonusSc.placeholder"
                      )}
                      value={values.bonusSc}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={tierData ? (details ? true : true) : false}
                    />

                    <ErrorMessage
                      component="div"
                      name="bonusSc"
                      className="text-danger"
                    />
                  </Col>

                  <Col md={6} sm={12} className="mt-3">
                    <BForm.Label>
                      {t("tournaments.inputField.bonusGc.label")}
                      <span className="text-danger"> *</span>
                    </BForm.Label>

                    <BForm.Control
                      type="number"
                      name="bonusGc"
                      min="1"
                      placeholder={t(
                        "tournaments.inputField.bonusGc.placeholder"
                      )}
                      value={values.bonusGc}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={tierData ? (details ? true : true) : false}
                    />

                    <ErrorMessage
                      component="div"
                      name="bonusGc"
                      className="text-danger"
                    />
                  </Col>

                  <Col md={6} sm={12} className="mt-3">
                    <BForm.Label>
                      {t("tournaments.inputField.weeklyBonusPercentage.label")}
                      <span className="text-danger"> *</span>
                    </BForm.Label>

                    <BForm.Control
                      type="number"
                      name="weeklyBonusPercentage"
                      min="1"
                      placeholder={t(
                        "tournaments.inputField.weeklyBonusPercentage.placeholder"
                      )}
                      value={values.weeklyBonusPercentage}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={details}
                    />

                    <ErrorMessage
                      component="div"
                      name="weeklyBonusPercentage"
                      className="text-danger"
                    />
                  </Col>

                  <Col md={6} sm={12} className="mt-3">
                    <BForm.Label>
                      {t("tournaments.inputField.monthlyBonusPercentage.label")}
                      <span className="text-danger"> *</span>
                    </BForm.Label>

                    <BForm.Control
                      type="number"
                      name="monthlyBonusPercentage"
                      min="1"
                      placeholder={t(
                        "tournaments.inputField.monthlyBonusPercentage.placeholder"
                      )}
                      value={values.monthlyBonusPercentage}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={details}
                    />

                    <ErrorMessage
                      component="div"
                      name="monthlyBonusPercentage"
                      className="text-danger"
                    />
                  </Col>

                  <Col md={6} sm={12} className="mt-3">
                    <BForm.Label>
                      {t("tournaments.inputField.requiredXp.label")}
                      <span className="text-danger"> *</span>
                    </BForm.Label>

                    <BForm.Control
                      type="number"
                      name="requiredXp"
                      min="1"
                      placeholder={t(
                        "tournaments.inputField.requiredXp.placeholder"
                      )}
                      value={values.requiredXp}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={tierData ? (details ? true : true) : false}
                    />

                    <ErrorMessage
                      component="div"
                      name="requiredXp"
                      className="text-danger"
                    />
                  </Col>

                  <Col md={3} sm={6} className="d-flex mt-3">
                    <BForm.Label>
                      {t("tournaments.inputField.isActive.label")}
                    </BForm.Label>

                    <BForm.Check
                      type="checkbox"
                      className="ms-6"
                      name="isActive"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.isActive}
                      disabled={details}
                    />
                  </Col>

                  <Col md={3} sm={6} className="d-flex mt-3">
                    <BForm.Label>
                      {t("tournaments.inputField.isWeekelyBonusActive.label")}
                    </BForm.Label>

                    <BForm.Check
                      type="checkbox"
                      className="ms-6"
                      name="isWeekelyBonusActive"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.isWeekelyBonusActive}
                      disabled={details}
                    />
                  </Col>

                  <Col md={3} sm={6} className="d-flex mt-3">
                    <BForm.Label>
                      {t("tournaments.inputField.isMonthlyBonusActive.label")}
                    </BForm.Label>

                    <BForm.Check
                      type="checkbox"
                      className="ms-6"
                      name="isMonthlyBonusActive"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.isMonthlyBonusActive}
                      disabled={details}
                    />
                  </Col>

                  <Col md={6} sm={12} className="mt-3 d-grid">
                    <BForm.Label>
                      {t("tournaments.inputField.thumbnail.label")}
                    </BForm.Label>

                    <BForm.Text>
                      <Trigger
                        message={t("tournaments.inputField.thumbnail.message")}
                        id={"mes"}
                      />
                      <input
                        id={"mes"}
                        title=" "
                        name="icon"
                        type="file"
                        onChange={(event) => {
                          setFieldValue("icon", event.currentTarget.files[0]);
                        }}
                        disabled={details}
                      />
                      {values?.icon && (
                        <img
                          alt="not found"
                          width="100px"
                          src={URL.createObjectURL(values.icon)}
                        />
                      )}
                      {!values?.icon && tierData?.icon && (
                        <img alt="not found" width="60px" src={tierData.icon} />
                      )}
                    </BForm.Text>

                    <ErrorMessage
                      component="div"
                      name="icon"
                      className="text-danger"
                    />
                  </Col>
                </Row>

                <div className="mt-4">
                  <Button
                    hidden={details}
                    variant="success"
                    onClick={handleSubmit}
                    className="ml-2"
                    disabled={loading}
                  >
                    {t("tournaments.createCategory.submit")}
                    {loading && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Tab>
        {tierData && details && (
          <Tab eventKey="LeaderBoard" title="LeaderBoard">
            <LeaderBoard />
          </Tab>
        )}
      </Tabs>
    </>
  );
};

export default CreateTier;
