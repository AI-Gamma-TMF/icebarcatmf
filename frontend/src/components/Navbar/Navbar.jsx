import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./navbar.scss";
import {
  Button,
  OverlayTrigger,
  Tooltip,
  Badge,
  Form,
  Col,
  Dropdown
} from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserAlt,
  faSignOutAlt,
  faBars,
  faXmark,
  faTriangleExclamation,
  faCalendarDays
} from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "../../store/store";
import Notifications from "../Notifications/Notifications";
import { toast } from "../Toast";
import { AdminRoutes, AffiliateRoute } from "../../routes";

import { useLogoutUser } from "../../reactQuery/hooks/customMutationHook";
import { getItem, removeLoginToken, setItem } from "../../utils/storageUtils";
// import useNotifications from "../../pages/NotificationCenter/hooks/useNotifications";
import { getFormattedTimeZoneOffset } from "../../utils/helper";
import { timeZones } from "../../pages/Dashboard/constants";
import CriticalNotifications from "../Notifications/CriticalNotifications";
import useCriticalNotifications from "../../pages/NotificationCenter/hooks/useCriticalNotifications";
import useCheckPermission from "../../utils/checkPermission";

const Navbar = ({ open, setOpen }) => {
  const { t } = useTranslation(["sidebar"]);
  const navigate = useNavigate();
  const isUserAffiliate = useUserStore((state) => state.isUserAffiliate);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [alertpopoverOpen, setAlertPopoverOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [alertcount, setAlertCount] = useState(0)
  const notificationRef = useRef(null);
  const alertNotificationRef = useRef(null);
  const currentTimeZone = getItem("timezone");
  const currentTimezoneOffset = timeZones?.find(
    (x) => x.code === currentTimeZone
  )?.value;
  const timeZoneOffset = getFormattedTimeZoneOffset();
  const [timeStamp, setTimeStamp] = useState(
    currentTimezoneOffset ? currentTimezoneOffset : timeZoneOffset
  );
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const { isHidden } = useCheckPermission();
  // const { count } = useNotifications({showNotification: false});
  const { setTimeZoneCode } = useUserStore((state) => state);
  // const { alertcount, refetchCriticalNotifications } = useCriticalNotifications({showNotification: false});
  useEffect(() => {
    setTimeZoneCode(timeZones.find((x) => x.value === timeStamp)?.code);
    setItem("timezone", timeZones.find((x) => x.value === timeStamp)?.code);
  }, [timeStamp]);

  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
    // refetchNotifications()
  };
  const alerttogglePopover = () => {
    setAlertPopoverOpen(!alertpopoverOpen);

  };

  const logoutUser = () => {
    removeLoginToken();
    localStorage.clear();
    toast(t("logoutSuccessToast"), "success", "logoutToast");
    navigate(
      isUserAffiliate ? AffiliateRoute.AffiliateSignIn : AdminRoutes.AdminSignin
    );
  };

  const { mutate: logout } = useLogoutUser({ onSuccess: () => logoutUser() });

  return (
    <>
      <div className="app-navbar d-flex justify-content-end align-items-center">
        <OverlayTrigger
          key="menu"
          placement="bottom"
          overlay={
            <Tooltip id={`tooltip-profile`}>
              {!open ? <strong>Open Menu</strong> : <strong>Close Menu</strong>}
            </Tooltip>
          }
        >
          <Button
            onClick={() => setOpen((current) => !current)}
            className="btn menu-btn"
          >
            {!open ? (
              <FontAwesomeIcon
                icon={faBars}
                className="me-1"
                style={{ color: "rgb(38,43,64)" }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faXmark}
                className="me-1"
                style={{ color: "rgb(38,43,64)" }}
              />
            )}
          </Button>
        </OverlayTrigger>
        <div className="notification-popup">

          <OverlayTrigger
            key="critcalAlert"
            placement="bottom"
            overlay={
              <Tooltip id={`alert-notifications`}>
                <strong>Critical Notifications</strong>
              </Tooltip>
            }
          >
            <Button
              ref={alertNotificationRef}
              onClick={alerttogglePopover}
              className="btn notification-btn"
            >
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="me-1"
                style={{ color: "rgb(204, 48, 48)" }}
              />
              <Badge bg="secondary" className="translate-middle rounded-pill">
                {alertcount}
              </Badge>
            </Button>
          </OverlayTrigger>
          <CriticalNotifications isOpen={alertpopoverOpen}
            onClose={() => setAlertPopoverOpen(false)}
            title="Critical Notification"
            alertcount={alertcount}
            setAlertCount={setAlertCount}
            targetElement={alertNotificationRef.current} />
        </div>
        {/* <div className="notification-popup">
          <OverlayTrigger
            key="notifications"
            placement="bottom"
            overlay={
              <Tooltip id={`tooltip-notifications`}>
                <strong>Critical Alert</strong>
              </Tooltip>
            }
          >
            <Button
              ref={notificationRef}
              onClick={togglePopover}
              className="btn notification-btn"
            >
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="me-1"
                style={{ color: "rgb(204, 48, 48)" }}
              />
              <Badge bg="secondary" className="translate-middle rounded-pill">
                {count}
              </Badge>
            </Button>
          </OverlayTrigger>

          <Notifications isOpen={popoverOpen}
            onClose={() => setPopoverOpen(false)}
            title="Notifications"
            targetElement={notificationRef.current} />

        </div>
        */}
        <div className="notification-popup">
          <OverlayTrigger
            key="notifications"
            placement="bottom"
            overlay={
              <Tooltip id={`tooltip-notifications`}>
                <strong>Notifications</strong>
              </Tooltip>
            }
          >
            <Button
              ref={notificationRef}
              onClick={togglePopover}
              className="btn notification-btn"
            >
              <FontAwesomeIcon
                icon={faBell}
                className="me-1"
                style={{ color: "rgb(38,43,64)" }}
              />
              <Badge bg="secondary" className="translate-middle rounded-pill">
                {count}
              </Badge>
            </Button>
          </OverlayTrigger>

          <Notifications isOpen={popoverOpen}
            onClose={() => setPopoverOpen(false)}
            title="Notifications"
            count={count}
            setCount={setCount}
            targetElement={notificationRef.current} />

        </div>
       {isHidden({ module: { key: "Calender", value: "R" } }) ? <></> : 
        <OverlayTrigger
          key="calendar"
          placement="bottom"
          overlay={
            <Tooltip id={`tooltip-calendar`}>
              <strong>Scheduled Events</strong>
            </Tooltip>
          }
        >
          <Button
            onClick={() => navigate(AdminRoutes.Calendar)}
            className="btn profile-btn"
          >
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="me-1"
              style={{ color: "rgb(38,43,64)" }}
            />
          </Button>
        </OverlayTrigger> }
        <OverlayTrigger
          key="profile"
          placement="bottom"
          overlay={
            <Tooltip id={`tooltip-profile`}>
              <strong>Profile</strong>
            </Tooltip>
          }
        >
          <Button
            onClick={() => navigate(AdminRoutes.Profile)}
            className="btn profile-btn"
          >
            <FontAwesomeIcon
              icon={faUserAlt}
              className="me-1"
              style={{ color: "rgb(38,43,64)" }}
            />
          </Button>
        </OverlayTrigger>
        <Form.Select
          className="w-auto timezone-select"
          // style={{ maxWidth: "250px" }}
          value={timeStamp}
          onChange={(event) => {
            setTimeStamp(event.target.value);
          }}
        >
          {timeZones?.map(({ labelKey, value, code }) => {
            return (
              <option key={value} value={value}>
                {t(labelKey)} ({code}) {value}
              </option>
            );
          })}
        </Form.Select>
        <OverlayTrigger
          key="logout"
          placement="bottom"
          overlay={
            <Tooltip id={`tooltip-logout`}>
              <strong>Logout</strong>
            </Tooltip>
          }
        >
          <Button onClick={() => logout()} className="btn navbar-logout-btn">
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="me-1"
              style={{ color: "rgb(38,43,64)" }}
            />
          </Button>
        </OverlayTrigger>
      </div>
    </>
  );
};

export default Navbar;