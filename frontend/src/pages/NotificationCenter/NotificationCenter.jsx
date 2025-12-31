import React, { useState, useEffect } from 'react'
import useNotificationsCenter from './hooks/useNotificationsCenter';
import { Formik, Form, ErrorMessage } from "formik";
import { Row, Col, Form as BForm, OverlayTrigger, Tooltip, Button, Spinner, Card } from '@themesberg/react-bootstrap'
import { notificationSettingsSchema } from './schemas';
import useCheckPermission from '../../utils/checkPermission'
import './notificationCenter.scss'
const NotificationCenter = () => {
  const { isHidden } = useCheckPermission()
  const { notificationSettings, setNotificationSettings, settingsLoading } = useNotificationsCenter()
  const [initialValues, setInitialValues] = useState({
    MinWin: 0,
    SlotsMinBet: 0,
    TableMinBet: 0,
    PackageActivation: false,
    TournamentActivation: false,
    GiveawayActivation: false,
    LoginActivation: 0,
    DepositActivation: 0,
    SignupActivation: 0,
    ProviderBasedActivation: 0,
    liveWinnerGC: 0,
    liveWinnerSc: 0
  })

  useEffect(() => {
    const mappedValues = notificationSettings?.data?.settings.reduce((acc, setting) => {
      switch (setting.key) {
        case "ADMIN_NOTIFICATION_MIN_WIN":
          acc.MinWin = Number(setting.value);
          break;
        case "ADMIN_NOTIFICATION_MIN_BET_SLOTS":
          acc.SlotsMinBet = Number(setting.value);
          break;
        case "ADMIN_NOTIFICATION_MIN_BET_TABLE_GAMES":
          acc.TableMinBet = Number(setting.value);
          break;
        case "ADMIN_NOTIFICATION_PACKAGE_ACTIVATION":
          acc.PackageActivation = setting.value === "true";
          break;
        case "ADMIN_NOTIFICATION_TOURNAMENT_ACTIVATION":
          acc.TournamentActivation = setting.value === "true";
          break;
        case "ADMIN_NOTIFICATION_GIVEAWAY_ACTIVATION":
          acc.GiveawayActivation = setting.value === "true";
          break;
        case 'ADMIN_CRITICAL_ALERT_NEW_LOGIN_PLAYER_TIME':
          acc.LoginActivation = Number(setting.value)
          break
        case 'ADMIN_CRITICAL_ALERT_NEW_REGISTERED_PLAYER_TIME':
          acc.SignupActivation = Number(setting.value)
          break
        case 'ADMIN_CRITICAL_ALERT_CASINO_PROVIDER_TIME':
          acc.ProviderBasedActivation = Number(setting.value)
          break
        case 'ADMIN_CRITICAL_ALERT_NEW_DEPOSIT_TIME':
          acc.DepositActivation = Number(setting.value)
          break
        case "ADMIN_LIVE_WINNER_SC_AMOUNT":
          acc.liveWinnerSc = Number(setting.value)
          break
        case 'ADMIN_LIVE_WINNER_GC_AMOUNT':
          acc.liveWinnerGC = Number(setting.value)
          break
        default:
          break;
      }
      return acc;
    }, {});

    setInitialValues(prev => ({ ...prev, ...mappedValues }));
  }, [notificationSettings]);

  return (
    <>
      <div className="dashboard-typography notification-center-page">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h3 className="notification-center-page__title">Notification Center</h3>
            <p className="notification-center-page__subtitle">
              Configure admin alert thresholds and activation toggles
            </p>
          </div>
        </div>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={notificationSettingsSchema}
        onSubmit={(formValues, { _resetForm }) => {
          const data = {
            ADMIN_NOTIFICATION_MIN_WIN: parseInt(formValues.MinWin),
            ADMIN_NOTIFICATION_MIN_BET_SLOTS: parseInt(formValues.SlotsMinBet),
            ADMIN_NOTIFICATION_MIN_BET_TABLE_GAMES: parseInt(formValues.TableMinBet),
            ADMIN_NOTIFICATION_PACKAGE_ACTIVATION: formValues.PackageActivation,
            ADMIN_NOTIFICATION_TOURNAMENT_ACTIVATION: formValues.TournamentActivation,
            ADMIN_NOTIFICATION_GIVEAWAY_ACTIVATION: formValues.GiveawayActivation,
            ADMIN_CRITICAL_ALERT_NEW_LOGIN_PLAYER_TIME: formValues.LoginActivation,
            ADMIN_CRITICAL_ALERT_NEW_REGISTERED_PLAYER_TIME: formValues.SignupActivation,
            ADMIN_CRITICAL_ALERT_CASINO_PROVIDER_TIME: formValues.ProviderBasedActivation,
            ADMIN_CRITICAL_ALERT_NEW_DEPOSIT_TIME: formValues.DepositActivation,
            ADMIN_LIVE_WINNER_SC_AMOUNT: formValues.liveWinnerSc,
            ADMIN_LIVE_WINNER_GC_AMOUNT: formValues.liveWinnerGC

          };
          setNotificationSettings(data)
          // resetForm();
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          dirty,
          resetForm
        }) => (
          <Form>
            <Card className="dashboard-form-card notification-center-card">
              <Card.Body>
                <Row className="g-3">
                  <Col md={4}>
                    <BForm.Label>
                      Max Win <span className="text-danger">*</span>
                    </BForm.Label>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip-top">
                      Enter zero if you do not want to add a limit.
                    </Tooltip>
                  }
                >
                  <BForm.Control
                    type="number"
                    name="MinWin"
                    placeholder="Enter Min Bet"
                    min="0"
                    max="99999"
                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                    value={values.MinWin}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value) && Number(value) <= 100000) {
                        handleChange(e);
                      }
                    }}
                  />
                </OverlayTrigger>
                <ErrorMessage
                  component="div"
                  name="MinWin"
                  className="text-danger"
                />
              </Col>
              <Col md={4}>
                <BForm.Label>
                  Slots Max Bet <span className="text-danger">*</span>
                </BForm.Label>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip-top">
                      Enter zero if you do not want to add a limit.
                    </Tooltip>
                  }
                >
                  <BForm.Control
                    type="number"
                    name="SlotsMinBet"
                    placeholder="Enter Slots Min Bet"
                    min="0"
                    max="99999"
                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                    value={values.SlotsMinBet}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value) && Number(value) <= 100000) {
                        handleChange(e);
                      }
                    }}
                    onBlur={handleBlur}
                  />
                </OverlayTrigger>
                <ErrorMessage
                  component="div"
                  name="SlotsMinBet"
                  className="text-danger"
                />
              </Col>
              <Col md={4}>
                <BForm.Label>
                  Table Max Bet <span className="text-danger">*</span>
                </BForm.Label>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip-top">
                      Enter zero if you do not want to add a limit.
                    </Tooltip>
                  }
                >
                  <BForm.Control
                    type="number"
                    name="TableMinBet"
                    placeholder="Enter Tables Min Bet"
                    min="0"
                    max="99999"
                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                    value={values.TableMinBet}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value) && Number(value) <= 100000) {
                        handleChange(e);
                      }
                    }}
                  />
                </OverlayTrigger>
                <ErrorMessage
                  component="div"
                  name="TableMinBet"
                  className="text-danger"
                />
              </Col>
            </Row>
            <Row className="g-3 mt-2">
              <Col md={4}>
                <BForm.Label>Package Notifications</BForm.Label>
                <BForm.Check
                  type="switch"
                  name="PackageActivation"
                  checked={values.PackageActivation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col>
              <Col md={4}>
                <BForm.Label>Tournament Notifications</BForm.Label>
                <BForm.Check
                  type="switch"
                  name="TournamentActivation"
                  checked={values.TournamentActivation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col>
              <Col md={4}>
                <BForm.Label>Giveaway Notifications</BForm.Label>
                <BForm.Check
                  type="switch"
                  name="GiveawayActivation"
                  checked={values.GiveawayActivation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col>


            </Row>
            <div className="notification-center-section">
              <h5 className="notification-center-section__title">Critical Notifications</h5>
              <Row className="g-3">
                <Col md={3}>
                <BForm.Label>Login Notifications</BForm.Label>

                <BForm.Control
                  type="number"
                  name="LoginActivation"
                  placeholder="Enter Duration in Minutes..."
                  min="10"
                  max="40"
                  onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                  value={values.LoginActivation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  component="div"
                  name="LoginActivation"
                  className="text-danger"
                />
              </Col>

              <Col md={3}>
                <BForm.Label>SignUp Notifications</BForm.Label>

                <BForm.Control
                  type="number"
                  name="SignupActivation"
                  placeholder="Enter Duration in Minutes..."
                  min="10"
                  max="40"
                  onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                  value={values.SignupActivation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  component="div"
                  name="SignupActivation"
                  className="text-danger"
                />
              </Col>
              <Col md={3}>
                <BForm.Label>Deposit Notifications</BForm.Label>

                <BForm.Control
                  type="number"
                  name="DepositActivation"
                  placeholder="Enter Duration in Minutes..."
                  min="10"
                  max="40"
                  onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                  value={values.DepositActivation}

                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  component="div"
                  name="DepositActivation"
                  className="text-danger"
                />
              </Col>
              <Col md={3}>
                <BForm.Label>Provider Based Notifications</BForm.Label>

                <BForm.Control
                  type="number"
                  name="ProviderBasedActivation"
                  placeholder="Enter Duration in Minutes..."
                  min="10"
                  max="40"
                  onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                  value={values.ProviderBasedActivation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  component="div"
                  name="ProviderBasedActivation"
                  className="text-danger"
                />
              </Col>

            </Row>
            </div>

            <div className="notification-center-section">
              <h5 className="notification-center-section__title">Live Winners Notification</h5>
              <Row className="g-3">
              <Col md={3}>
                <BForm.Label>Live Winner GC limit</BForm.Label>

                <BForm.Control
                  type="number"
                  name="liveWinnerGC"
                  placeholder="Enter Amount"
                  min="0"
                  max="99999"
                  onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                  value={values.liveWinnerGC}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onPaste={(e) => e.preventDefault()}
                />
                <ErrorMessage
                  component="div"
                  name="liveWinnerGC"
                  className="text-danger"
                />
              </Col>
              <Col md={3}>
                <BForm.Label>Live Winner SC limit</BForm.Label>

                <BForm.Control
                  type="number"
                  name="liveWinnerSc"
                  placeholder="Enter Amount"
                  min="0"
                  max="99999"
                  onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                  value={values.liveWinnerSc}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onPaste={(e) => e.preventDefault()}
                />
                <ErrorMessage
                  component="div"
                  name="liveWinnerSc"
                  className="text-danger"
                />
              </Col>
            </Row>
            </div>

            <div className="notification-center-actions mt-3">
              <Button
                onClick={() => resetForm()}
                disabled={!dirty}
                className="dashboard-secondary-btn"
                variant="secondary"
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                className="dashboard-primary-btn"
                onClick={handleSubmit}
                disabled={settingsLoading || !dirty}
                hidden={isHidden({ module: { key: "NotificationCenter", value: "U" } })}
              >
                Submit
                {settingsLoading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="ms-2"
                  />
                )}
              </Button>
            </div>
              </Card.Body>
            </Card>
          </Form>
        )}
      </Formik>

      </div>
    </>
  )
}

export default NotificationCenter