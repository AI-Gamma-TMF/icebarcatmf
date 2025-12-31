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
    <ButtonGroup className="bonus-auto-refresh mt-3">
      <Trigger message='reset' id={'reset'} />
      <Button
        id={'reset'}
        onClick={resetFilters}
        className="bonus-auto-refresh__reset"
      >
        <FontAwesomeIcon icon={faRedoAlt} />
      </Button>

      <Trigger message='Time setup' id={'timeSetup'} />
      <Dropdown id={'timeSetup'} as={ButtonGroup} onToggle={(isOpen) => setDropdownOpen(isOpen)}>
        <Dropdown.Toggle
          variant="outline-primary"
          id="dropdown-split-refresh"
          className={[
            "bonus-auto-refresh__toggle",
            refreshInterval === "off" ? "is-off" : "",
          ].join(" ")}
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
