import React, { useState } from "react";
import { Button, Dropdown, ButtonGroup } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Trigger from "../../../components/OverlayTrigger";
import { autoRefreshOptions } from "../../Reports/BonusReport/constant";

const JackpotAutoRefreshControl = ({ resetFilters, refreshInterval, setRefreshInterval }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <ButtonGroup className="jackpot-auto-refresh">
      <Trigger message="reset" id={"jackpot-reset"} />
      <Button
        id={"jackpot-reset"}
        onClick={resetFilters}
        style={{
          borderRadius: "24px 0 0 24px",
          border: "1px solid rgba(var(--gs-cta-rgb), 0.22)",
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.55) 100%)",
          color: "rgba(234, 250, 245, 0.92)",
          fontWeight: 700,
          padding: "10px 12px",
          height: "44px",
        }}
      >
        <FontAwesomeIcon icon={faRedoAlt} />
      </Button>

      <Trigger message="Time setup" id={"jackpot-timeSetup"} />
      <Dropdown
        id={"jackpot-timeSetup"}
        as={ButtonGroup}
        onToggle={(isOpen) => setDropdownOpen(isOpen)}
      >
        <Dropdown.Toggle
          variant="outline-primary"
          id="jackpot-dropdown-split-refresh"
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
            fontWeight: 800,
            padding: "10px 16px",
            height: "44px",
            minWidth: refreshInterval === "off" ? "54px" : "auto",
            borderLeft: "none",
          }}
        >
          {refreshInterval !== "off" && (
            <span style={{ whiteSpace: "nowrap" }}>
              {autoRefreshOptions?.find((opt) => opt?.value === refreshInterval)?.label}
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

export default JackpotAutoRefreshControl;


