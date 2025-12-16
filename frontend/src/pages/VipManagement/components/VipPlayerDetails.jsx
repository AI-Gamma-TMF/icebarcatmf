import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Accordion, Dropdown } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import useVipPlayerDetails from "../hooks/useVipPlayerDetails";
import Preloader, { InlineLoader } from "../../../components/Preloader";
import { daysOptions } from "../constants";
import { getDateDaysAgo, getDateTime } from "../../../utils/dateFormatter";
import DateRangePicker from "./DateRangePicker";
import useVipPlayerReport from "../hooks/useVipPlayerReport";
import VipFAQ from "./VipFAQ";
import GlobalSearchBar from "./GlobalSearch";
import {
  capitalizeFirstLetter,
  convertTimeZone,
  formatNumber,
} from "../../../utils/helper";
import { FaChevronDown } from "react-icons/fa";
import Trigger from "../../../components/OverlayTrigger";
import { AdminRoutes } from "../../../routes";

const VipPlayerDetails = () => {
  const { vipPlayerDetails, vipPlayerDataLoading } = useVipPlayerDetails();
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState("7 Days");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: getDateDaysAgo(7),
    endDate: new Date(),
  });

  const {
    vipPlayerReport,
    vipPlayerReportLoading,
    setStartDate,
    setEndDate,
    userId,
    timeZoneCode,
  } = useVipPlayerReport();

  useEffect(() => {
    setSelectedDays("7 Days");
    setShowDatePicker(false);
    setStartDate(getDateDaysAgo(7));
    setEndDate(convertTimeZone(new Date(), timeZoneCode));
  }, [userId, timeZoneCode]);
  const handleDateChange = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate });
  };

  const handleSelect = (eventKey) => {
    const label =
      eventKey === "custom"
        ? "Custom Range"
        : daysOptions.find(({ value }) => value === +eventKey)?.label || "";
    if (eventKey === "custom") {
      setShowDatePicker(true);
    } else {
      setStartDate(getDateDaysAgo(eventKey));
      setEndDate(new Date());
      setShowDatePicker(false);
    }

    setSelectedDays(label);
  };
  const handlePickerClose = () => {
    setStartDate(dateRange.startDate);
    setEndDate(dateRange.endDate);
  };
  return (
    <>
      {vipPlayerDataLoading ? (
        <Preloader />
      ) : (
        <div>
          <Row className="mt-1 d-flex  justify-content-between">
            <Col sm={6} lg={4}>
              <GlobalSearchBar />
            </Col>

            <Trigger message={"help"} id={"help-icon"} />
            <FontAwesomeIcon
              id="help-icon"
              style={{ cursor: "pointer" }}
              className="w-auto "
              icon={faCircleInfo}
              onClick={() => navigate(`${AdminRoutes.VipDashboardHelp}`)}
            />
          </Row>
          <Row className="mt-1">
            <Accordion defaultActiveKey="1" className="vip-dashboard">
              <Accordion.Item eventKey="1">
                <Accordion.Header>VIP Player Details</Accordion.Header>
                <Accordion.Body>
                  <Row /* className='ps-6'*/>
                    <Col className="d-flex flex-column align-items-center ">
                      <img
                        src={
                          vipPlayerDetails?.user?.profileImage ||
                          "/logoImage.png"
                        }
                        loading="lazy"
                        alt="profile-image"
                      />
                      <h3>
                        {vipPlayerDetails?.user?.firstName &&
                        vipPlayerDetails?.user?.lastName
                          ? `${vipPlayerDetails?.user?.firstName} ${vipPlayerDetails?.user?.lastName}`
                          : "NA"}
                      </h3>
                      <p>{vipPlayerDetails?.user?.email || "NA"}</p>
                    </Col>

                    <Col>
                      <p>
                        <b>Address : </b>{" "}
                        {vipPlayerDetails?.user?.addressLine_1 || "NA"}
                      </p>
                      <p>
                        <b>Date of Birth :</b>{" "}
                        {vipPlayerDetails?.user?.dateOfBirth || "NA"}
                      </p>
                      <p>
                        <b>Phone No :</b>{" "}
                        {vipPlayerDetails?.user?.phone ?? "NA"}
                      </p>{" "}
                      <p>
                        <b>Last Online :</b>{" "}
                        {getDateTime(vipPlayerDetails?.user?.lastLoginDate)}
                      </p>{" "}
                      <p>
                        <b>Last Big Win * :</b>{" "}
                        {formatNumber(
                          vipPlayerDetails?.user?.UserReport?.biggestWin,
                          { isDecimal: true }
                        )}{" "}
                        SC
                      </p>
                      <p>
                        <b>Exclusion : </b>{" "}
                        {vipPlayerDetails?.user?.selfExclusion || "No"}
                      </p>
                      <p>
                        <b>Loyalty Tier :</b>{" "}
                        {vipPlayerDetails?.user?.UserTier?.tierName || "NA"}
                      </p>
                      <p>
                        <b>KYC Status : </b>
                        {vipPlayerDetails?.user?.kycStatus || "NA"}
                      </p>
                      <p>
                        <b>VIP Questionnaire Submitted : </b>
                        {vipPlayerDetails?.user?.isVipQuestionnaireBonus
                          ? "Yes"
                          : "No"}
                      </p>
                      <p>
                        <b> VIP Questionnaire Bonus : </b>{" "}
                        {vipPlayerDetails?.user?.vipQuestionnaireBonusAmount ||
                          0}
                      </p>
                    </Col>
                    <Col>
                      <p>
                        <b>Account Managed by : </b>{" "}
                        {vipPlayerDetails?.user?.accountManagerBy || "NA"}
                      </p>

                      <p>
                        {" "}
                        <b>Registration Date :</b>{" "}
                        {getDateTime(vipPlayerDetails?.user?.createdAt)}
                      </p>
                      <p>
                        <b>Currently Online : </b>
                        {vipPlayerDetails?.user?.currentlyOnline ? "Yes" : "No"}
                      </p>

                      <p>
                        <b> Most Played Game * : </b>
                        {vipPlayerDetails?.user?.UserReport
                          ?.mostPlayedGameName || "NA"}
                      </p>
                      <p>
                        <b> Most Played Provider * : </b>
                        {vipPlayerDetails?.user?.UserReport
                          ?.mostPlayedProviderName || "NA"}
                      </p>
                      <p>
                        <b>Take a Break (how long) : </b>
                        {vipPlayerDetails?.user?.responsibleGambling[0]
                          ?.timeBreakDuration || "NA"}
                      </p>

                      <p>
                        <b>Player Rating : </b>{" "}
                        {vipPlayerDetails?.user?.UserInternalRating?.rating ||
                          "NA"}
                      </p>
                      <p>
                        <b>VIP Status : </b>{" "}
                        {capitalizeFirstLetter(
                          vipPlayerDetails?.user?.UserInternalRating?.vipStatus
                        ) || "NA"}
                      </p>
                      <p>
                        <b> VIP Approved Date : </b>{" "}
                        {getDateTime(
                          vipPlayerDetails?.user?.UserInternalRating
                            ?.vipApprovedDate
                        )}
                      </p>
                      <p>
                        <b> VIP Revoked Date : </b>{" "}
                        {getDateTime(
                          vipPlayerDetails?.user?.UserInternalRating
                            ?.vipRevokedDate
                        )}
                      </p>
                      <p>
                        <b> Manager Assigned Date : </b>{" "}
                        {getDateTime(
                          vipPlayerDetails?.user?.UserInternalRating
                            ?.managedByAssignmentDate
                        )}
                      </p>
                    </Col>
                  </Row>
                  <Row className="ms-1 mt-2 fw-bold">
                    * Note : The dataset under consideration begins on April
                    1st, 2025, and is updated every 24 hours.
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Row>
        </div>
      )}

      <Row className="mt-3" spacing={1}>
        <Accordion defaultActiveKey="0" className="vip-dashboard">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <div className="d-flex justify-content-between w-100 align-items-center">
                <span>Date-Specific Metrics</span>

                <div className="d-flex align-items-center me-3">
                  {showDatePicker && (
                    <DateRangePicker
                      onChange={handleDateChange}
                      onClose={handlePickerClose}
                    />
                  )}

                  <Dropdown
                    onClick={(e) => e.stopPropagation()}
                    onSelect={(eventKey) => handleSelect(eventKey)}
                    className="ms-2"
                  >
                    <Dropdown.Toggle variant="primary">
                      {selectedDays} <FaChevronDown />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {daysOptions.map(({ value, label }) => (
                        <Dropdown.Item key={value} eventKey={value}>
                          {label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              {vipPlayerReportLoading ? (
                <InlineLoader />
              ) : (
                <>
                  <Row spacing={1}>
                    <Col sm={4} md={6} lg={3} className="mt-3">
                      <div className="vip-member-accordion-card">
                        <img
                          src="/svg/vip-player-purchase.svg"
                          alt="vip-player-purchase"
                          loading="lazy"
                        />
                        <div>
                          <h4 className="pink-text">
                            {" "}
                            {formatNumber(
                              vipPlayerReport?.data?.totalPurchaseAmountSum,
                              { isDecimal: true }
                            )}{" "}
                            SC
                          </h4>
                          <p>Total Purchase</p>
                        </div>
                      </div>
                    </Col>
                    <Col sm={4} md={6} lg={3} className="mt-3">
                      <div className="vip-member-accordion-card">
                        <img
                          src="/svg/vip-player-redemption.svg"
                          alt="vip-player-redemption"
                          loading="lazy"
                        />
                        <div>
                          <h4 className="red-text">
                            {formatNumber(
                              vipPlayerReport?.data
                                ?.approvedRedemptionAmountSum,
                              { isDecimal: true }
                            )}{" "}
                            SC
                          </h4>
                          <p>Total Redemption</p>
                        </div>
                      </div>
                    </Col>
                    <Col sm={4} md={6} lg={3} className="mt-3">
                      <div className="vip-member-accordion-card">
                        <img
                          src="/svg/vip-player-redemption-to-ratio.svg"
                          alt="vip-player-ratio"
                          loading="lazy"
                        />
                        <div>
                          <h4 className="green-text">
                            {" "}
                            {formatNumber(
                              vipPlayerReport?.data?.redemptionToPurchaseRatio,
                              { isDecimal: true }
                            )}{" "}
                          </h4>
                          <p>Redemption to Purchase Ratio</p>
                        </div>
                      </div>
                    </Col>
                    <Col sm={4} md={6} lg={3} className="mt-3">
                      <div className="vip-member-accordion-card">
                        <img
                          src="/svg/vip-player-total-bets.svg"
                          alt="vip-player-total-bets"
                          loading="lazy"
                        />
                        <div>
                          <h4 className="light-yellow-text">
                            {" "}
                            {formatNumber(
                              vipPlayerReport?.data?.totalScBetAmountSum,
                              { isDecimal: true }
                            )}{" "}
                            SC
                          </h4>
                          <p>Total Bets</p>
                        </div>
                      </div>
                    </Col>

                    <Col sm={4} md={6} lg={3} className="mt-3">
                      <div className="vip-member-accordion-card">
                        <img
                          src="/svg/vip-ggr.svg"
                          alt="vip-player-ggr"
                          loading="lazy"
                        />
                        <div>
                          <h4 className="yellow-text">
                            {" "}
                            {formatNumber(vipPlayerReport?.data?.totalGgr, {
                              isDecimal: true,
                            })}{" "}
                            SC
                          </h4>
                          <p>Gross Gaming Revenue (GGR)</p>
                        </div>
                      </div>
                    </Col>
                    <Col sm={4} md={6} lg={3} className="mt-3">
                      <div className="vip-member-accordion-card">
                        <img
                          src="/svg/vip-ngr.svg"
                          alt="vip-player-ngr"
                          loading="lazy"
                        />
                        <div>
                          <h4 className="dark-blue-text">
                            {formatNumber(vipPlayerReport?.data?.ngr, {
                              isDecimal: true,
                            })}{" "}
                            SC
                          </h4>
                          <p>Net Gaming Revenue (NGR)</p>
                        </div>
                      </div>
                    </Col>
                    <Col sm={4} md={6} lg={3} className="mt-3">
                      <div className="vip-member-accordion-card">
                        <img
                          src="/svg/vip-player-hold-percentage.svg"
                          alt="vip-player-hold-percentage"
                          loading="lazy"
                        />
                        <div>
                          <h4 className="blue-text">
                            {" "}
                            {formatNumber(
                              vipPlayerReport?.data?.holdPercentage,
                              { isDecimal: true }
                            )}{" "}
                            %
                          </h4>
                          <p>Hold Percentage</p>
                        </div>
                      </div>
                    </Col>
                    <Col sm={4} md={6} lg={3} className="mt-3">
                      <div className="vip-member-accordion-card">
                        <img
                          src="/svg/vip-player-reinvestment-percentage.svg"
                          alt="vip-player-reinvestment-percentage"
                          loading="lazy"
                        />
                        <div>
                          <h4 className="pink-text">
                            {" "}
                            {formatNumber(
                              vipPlayerReport?.data?.reinvestmentPercentage,
                              { isDecimal: true }
                            )}{" "}
                            %
                          </h4>
                          <p>Reinvestment Percentage</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Row>
      <VipFAQ />
    </>
  );
};
export default VipPlayerDetails;
