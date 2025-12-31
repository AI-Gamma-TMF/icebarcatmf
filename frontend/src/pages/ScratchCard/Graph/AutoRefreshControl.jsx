import React, { useState } from "react";
import { Button, Dropdown, ButtonGroup } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRedoAlt,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { autoRefreshOptions } from "./constant";
import Trigger from "../../../components/OverlayTrigger";

const AutoRefreshControl = ({
  resetFilters,
  refreshInterval,
  setRefreshInterval,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ButtonGroup className="mt-3 position-relative scratch-auto-refresh" style={{ top: "5px" }}>
      <Trigger message='reset' id={'reset'} />
      <Button
        id={'reset'}
        onClick={resetFilters}
        style={{
          borderRadius: "24px 0 0 24px",
          border: "1px solid rgba(var(--gs-cta-rgb), 0.22)",
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.55) 100%)",
          color: "rgba(234, 250, 245, 0.92)",
          fontWeight: 500,
          padding: "6px 12px",
        }}
      >
        <FontAwesomeIcon icon={faRedoAlt} />
      </Button>

      <Trigger message='Time setup' id={'timeSetup'} />
      <Dropdown id={'timeSetup'} as={ButtonGroup} onToggle={(isOpen) => setDropdownOpen(isOpen)}>
        <Dropdown.Toggle
          variant="outline-primary"
          id="dropdown-split-refresh"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            borderRadius: "0 24px 24px 0",
            border: "1px solid rgba(var(--gs-cta-rgb), 0.22)",
            background:
              "linear-gradient(135deg, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.55) 100%)",
            color: "rgba(234, 250, 245, 0.92)",
            fontWeight: 500,
            padding: "6px 16px",
            minWidth: refreshInterval === "off" ? "42px" : "auto",
            borderLeft: "none",
          }}
        >
          {refreshInterval !== "off" && (
            <span style={{ whiteSpace: "nowrap" }}>
              {
                autoRefreshOptions?.find(
                  (opt) => opt?.value === refreshInterval
                )?.label
              }
            </span>
          )}
          <FontAwesomeIcon icon={dropdownOpen ? faChevronUp : faChevronDown} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {autoRefreshOptions.map((option) => (
            <Dropdown.Item
              key={option?.value}
              active={refreshInterval === option?.value}
              onClick={() => setRefreshInterval(option?.value)}
            >
              {option?.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </ButtonGroup>
  );
};

export default AutoRefreshControl;
