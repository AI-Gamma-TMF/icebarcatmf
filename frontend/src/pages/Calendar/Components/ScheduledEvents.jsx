import React, { useState, useEffect } from "react";
import { Row, Col, Dropdown, Button, Form } from "@themesberg/react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCircle,
  faChevronRight,
  faChevronDown,
  faInfoCircle,
  faTimes
} from "@fortawesome/free-solid-svg-icons";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useCalendar from "../hooks/useCalendar";
import { InlineLoader } from "../../../components/Preloader";
import { AdminRoutes } from "../../../routes";
import {
  CalendarType,
  CreateEventOptions,
  EVENT_TYPE_COLORS,
  typeLabels,
} from "../constant";
import "./scheduledEventsStyle.scss";

const localizer = momentLocalizer(moment);

const TimeGutterHeader = () => (
  <div className="time-gutter-header">Full day Events</div>
);

const CustomToolbar = (toolbar) => {
  const goToBack = () => toolbar.onNavigate("PREV");
  const goToNext = () => toolbar.onNavigate("NEXT");
  const goToToday = () => toolbar.onNavigate("TODAY");
  const handleViewChange = (view) => toolbar.onView(view);
  const viewOptions = ["month", "week", "work_week", "day"];
  const formatLabel = (view) =>
    view === "work_week"
      ? "Work Week"
      : view.charAt(0).toUpperCase() + view.slice(1);

  return (
    <div className="custom-toolbar">
      <div className="nav-buttons">
        <button className="today-button" onClick={goToToday}>
          Today
        </button>
        <Button variant="light" size="sm" className="border" onClick={goToBack}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <div className="toolbar-label">
          <span>{toolbar.label}</span>
        </div>
        <Button variant="light" size="sm" className="border" onClick={goToNext}>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
      <div className="view-controls">
        <div className="view-toggle">
          {viewOptions.map((view, index) => (
            <button
              key={view}
              onClick={() => handleViewChange(view)}
              className={toolbar.view === view ? "active" : ""}
            >
              {formatLabel(view)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CustomDayHeader = ({ label, date, view }) => {
  const isToday = moment(date).isSame(new Date(), "day");
  return (
    <div
      className={`custom-day-header ${isToday ? "today" : ""} ${view === "month" ? "month-view" : ""
        }`}
    >
      <div className="day-name">{moment(date).format("ddd").toUpperCase()}</div>
      {view !== "month" && (
        <div className="day-number">{moment(date).format("D")}</div>
      )}
    </div>
  );
};

const ScheduledEvents = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [currentView, setCurrentView] = useState("month");
  const [selectedTypes, setSelectedTypes] = useState(["all"]);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [createEventValue, setCreateEventValue] = useState("");
  const [showColorLegend, setShowColorLegend] = useState(false);

  const customEventRenderer = ({ event }) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const isMultiDay = start.toDateString() !== end.toDateString();
    const isTimed = !isMultiDay;
    const displayText = isMultiDay
      ? `${event.title}, ${moment(start).format("MMM D, h:mm A")} - ${moment(
        end
      ).format("MMM D, h:mm A")}`
      : `${event.title}, ${moment(start).format("h:mm A")} - ${moment(end).format("h:mm A")}`;

    return (
      <div
        className={`custom-event ${isTimed ? "timed" : ""} ${event?.status === 3 ? "cancelled-event" : ""
          }`}
        style={{
          backgroundColor: event.eventColor,
          border: `1px solid ${event.eventColor}`,
        }}
        title={displayText}
      >
        {displayText}
        {event?.status === 3 && (
          <span
            style={{ fontStyle: "italic", marginLeft: "5px", fontWeight: 700 }}
          >
            - Cancelled
          </span>
        )}
      </div>
    );
  };

  const eventPropGetter = () => ({
    style: { backgroundColor: "transparent", padding: 0, border: "none" },
  });

  const startOfRange =
    currentView === "month"
      ? startOfMonth(selectedRange.startDate)
      : currentView === "week"
        ? startOfWeek(selectedRange.startDate)
        : selectedRange.startDate;

  const endOfRange =
    currentView === "month"
      ? endOfMonth(selectedRange.endDate)
      : currentView === "week"
        ? endOfWeek(selectedRange.endDate)
        : selectedRange.endDate;

  const {
    calendarData: events,
    refetchCalendar,
    isLoading,
  } = useCalendar({
    selectedFilters: selectedTypes.includes("all") ? ["all"] : selectedTypes,
    startDate: startOfRange,
    endDate: endOfRange,
  });

  const handleCreateEvent = (value) => {
    setCreateEventValue(value);
    const route = {
      tournament: AdminRoutes.tournamentCreate,
      packages: AdminRoutes.CreatePackage,
      crmBonus: AdminRoutes.CrmPromoBonusCreate,
      crmPromocode: AdminRoutes.CrmPromoCodeCreate,
      purchasePromocode: AdminRoutes.PromoCodeCreate,
      raffles: AdminRoutes.RaffleCreate,
    }[value];
    if (route) navigate(route);
  };

  const handleTypeChange = (value) => {
    if (value === "all") {
      setSelectedTypes(["all"]);
    } else {
      let updatedTypes = selectedTypes.includes(value)
        ? selectedTypes.filter((type) => type !== value)
        : [...selectedTypes.filter((type) => type !== "all"), value];

      // If all individual types are selected, toggle to "all" (optional)
      const allTypeValues = CalendarType.filter((e) => e.value !== "all").map(
        (e) => e.value
      );
      if (allTypeValues.every((type) => updatedTypes.includes(type))) {
        updatedTypes = ["all"];
      }

      setSelectedTypes(updatedTypes);
    }
  };

  const mapEvents = (items, type) =>
    (items || [])?.map((item) => {
      let start = new Date(item?.startDate);
      let end = new Date(item?.endDate);
      const allDay = false;
      if (
        start.getHours() === 0 &&
        start.getMinutes() === 0 &&
        end.getHours() === 0 &&
        end.getMinutes() === 0 &&
        end - start >= 24 * 60 * 60 * 1000
      ) {
        end.setHours(23, 59, 59, 999);
      }
      return {
        id: item.id || `${type}-${item.name}`,
        title: item.name || `${type} Event`,
        start,
        end,
        allDay,
        status: item.status,
        type,
        eventColor: EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.default,
      };
    });

  const mergedEvents = selectedTypes.includes("all")
    ? Object.entries(events || {}).flatMap(([type, items]) =>
      mapEvents(items, type)
    )
    : selectedTypes.flatMap((type) => mapEvents(events?.[type], type));

  useEffect(() => {
    refetchCalendar();
  }, [selectedTypes, selectedRange, currentView]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".floating-event-modal")) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Row className="align-items-center events-calendar-filter justify-content-between mb-2">
        <Col>
          <h4 className="mb-0">Scheduled Events</h4>
        </Col>
        <Col xs="auto" className="d-flex gap-3 align-items-end">
          <div>
            <Form.Label className="mb-0">Select Event Types</Form.Label>
            <Dropdown className="event-type-dropdown">
              <Dropdown.Toggle
                variant="light"
                className="w-100 d-flex justify-content-between align-items-center border"
                style={{ minWidth: "220px", textAlign: "left" }}
              >
                <span className="text-truncate" style={{ maxWidth: "180px" }}>
                  {selectedTypes.includes("all")
                    ? "All"
                    : CalendarType.filter(({ value }) =>
                      selectedTypes.includes(value)
                    )
                      .map(({ label }) => label)
                      .join(", ")}
                </span>
                <FontAwesomeIcon icon={faChevronDown} className="ms-2" />
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{ maxHeight: 250, overflowY: "auto", width: "100%" }}
              >
                {CalendarType?.map(({ label, value }) => (
                  <Form.Check
                    key={value}
                    type="checkbox"
                    label={label}
                    checked={selectedTypes.includes(value)}
                    onChange={() => handleTypeChange(value)}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div>
              <Form.Label className="mb-0">Create Event</Form.Label>
              <Form.Select
                value={createEventValue}
                onChange={(e) => handleCreateEvent(e.target.value)}
              >
                <option value="" disabled hidden>
                  Create Event
                </option>
                {CreateEventOptions?.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="info-icon-wrapper" style={{ position: "relative" }}>
              <Button
                variant="link"
                className="p-0"
                onClick={() => setShowColorLegend(!showColorLegend)}
                title="Event Type Colors"
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ fontSize: "26px", color: "gray", marginTop: "25px" }}
                />
              </Button>

              {showColorLegend && (
                <div className="event-type-legend-popup">
                  <div className="legend-header d-flex justify-content-between align-items-center">
                    <h5>Event Type Colors</h5>
                    <button
                      className="close-btn"
                      onClick={() => setShowColorLegend(false)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                  <ul className="legend-list">
                    {Object.entries(EVENT_TYPE_COLORS)?.map(
                      ([type, color]) =>
                        type !== "default" && (
                          <li
                            key={type}
                            className="d-flex align-items-center mb-2"
                          >
                            <span
                              className="legend-color"
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                backgroundColor: color,
                                marginRight: 8,
                              }}
                            ></span>
                            <span className="text-capitalize">
                              {typeLabels[type]}
                            </span>
                          </li>
                        )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col style={{ height: "100%", overflow: "hidden" }}>
          {isLoading ? (
            <InlineLoader />
          ) : (
            <div
              className="tournament-calendar"
              style={{
                height: "100%",
                maxHeight: "calc(100vh - 200px)",
                overflowY: "auto",
              }}
            >
              <Calendar
                popup={true}
                allDayAccessor="allDay"
                localizer={localizer}
                events={mergedEvents}
                startAccessor="start"
                endAccessor="end"
                date={selectedRange.startDate}
                onNavigate={(date) =>
                  setSelectedRange((prev) => ({
                    ...prev,
                    startDate: date,
                    endDate: date,
                  }))
                }
                view={currentView}
                onView={(view) => {
                  setCurrentView(view);
                  const currentDate = selectedRange?.startDate;

                  let newStartDate = currentDate;
                  let newEndDate = currentDate;

                  if (view === "month") {
                    newStartDate = startOfMonth(currentDate);
                    newEndDate = endOfMonth(currentDate);
                  } else if (view === "week" || view === "work_week") {
                    newStartDate = startOfWeek(currentDate);
                    newEndDate = endOfWeek(currentDate);
                  } else if (view === "day") {
                    newStartDate = new Date(currentDate.setHours(0, 0, 0, 0));
                    newEndDate = new Date(
                      currentDate.setHours(23, 59, 59, 999)
                    );
                  }

                  setSelectedRange({
                    startDate: newStartDate,
                    endDate: newEndDate,
                  });
                }}
                views={["month", "week", "work_week", "day"]}
                selectable={true}
                onSelectEvent={(event) => {
                  setSelectedEvent(event);
                  setShowModal(true);
                }}
                step={180}
                timeslots={1}
                eventPropGetter={eventPropGetter}
                components={{
                  timeGutterHeader: TimeGutterHeader,
                  event: customEventRenderer,
                  toolbar: CustomToolbar,
                  header: (headerProps) => (
                    <CustomDayHeader {...headerProps} view={currentView} />
                  ),
                  month: {
                    dateHeader: (props) => {
                      const { label, date } = props;
                      return (
                        <div
                          style={{
                            textAlign: "center",
                            fontWeight: 500,
                            fontSize: "12px",
                          }}
                        >
                          {label}
                        </div>
                      );
                    },
                  },
                }}
                formats={{
                  timeGutterFormat: (date) => moment(date).format("h A"),
                }}
                style={{ height: "100%" }}
                showCurrentTimeIndicator={["week", "work_week", "day"].includes(
                  currentView
                )}
              />
            </div>
          )}
        </Col>
      </Row>

      {showModal && selectedEvent && (
        <div
          className={`floating-event-modal ${showModal ? "show" : ""}`}
          style={{
            top: popupPosition.y,
            left: popupPosition.x,
            zIndex: 9999,
          }}
        >
          <div className="event-popup-header">
            <h4 className="title">
              <FontAwesomeIcon
                icon={faCircle}
                style={{
                  fontSize: 12,
                  color: selectedEvent?.eventColor,
                  margin: "0 6px",
                }}
              />
              {selectedEvent?.title}
            </h4>
            <div className="header-actions">
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          <div className="event-popup-body">
            <div className="event-row">
              {moment(selectedEvent?.start).isSame(
                selectedEvent?.end,
                "day"
              ) ? (
                <span>
                  {moment(selectedEvent.start).format("dddd, MMMM D")}
                  <FontAwesomeIcon
                    icon={faCircle}
                    style={{ fontSize: 3, margin: "0 6px" }}
                  />
                  {`${moment(selectedEvent?.start).format("h:mm A")} - ${moment(
                    selectedEvent?.end
                  ).format("h:mm A")}`}
                </span>
              ) : (
                <div className="d-flex flex-column">
                  <div>
                    <strong>Start:</strong>{" "}
                    {moment(selectedEvent?.start).format(
                      "dddd, MMMM D • h:mm A"
                    )}
                  </div>
                  <div>
                    <strong>End:</strong>{" "}
                    {moment(selectedEvent?.end).format("dddd, MMMM D • h:mm A")}
                  </div>
                </div>
              )}
            </div>

            <div className="event-row">
              <strong>Event Type: </strong>{" "}
              {typeLabels[selectedEvent?.type] ||
                selectedEvent?.type.charAt(0).toUpperCase() +
                selectedEvent?.type.slice(1)}
            </div>

            <div className="event-row">
              <strong>ID:</strong> {selectedEvent?.id}
            </div>

            <div className="event-row">
              <strong>Status:</strong>
              <span className={`status-label status-${selectedEvent?.status}`}>
                {selectedEvent?.status === 0 && "Upcoming"}
                {selectedEvent?.status === 1 && "Ongoing"}
                {selectedEvent?.status === 2 && "Completed"}
                {selectedEvent?.status === 3 && "Cancelled"}
              </span>
            </div>
          </div>

          <div className="event-popup-footer">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const routeMap = {
                  crmBonus: AdminRoutes?.CrmPromoBonusView,
                  tournament: AdminRoutes?.TournamentDetails,
                  packages: AdminRoutes?.ViewPackages,
                  crmPromocode: AdminRoutes?.CrmPromoCodeView,
                  purchasePromocode: AdminRoutes?.PromoCodeView,
                };
                const baseRoute = routeMap[selectedEvent?.type]
                  ?.split(":")
                  .shift();
                if (baseRoute) navigate(`${baseRoute}${selectedEvent?.id}`);
              }}
            >
              View More Details
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ScheduledEvents;
