import React, { useEffect, useRef } from "react";
import { Button } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Popup = ({ isOpen, onClose, title, children, targetElement }) => {
  // const [popoverPosition, setPopoverPosition] = useState({});
  const popoverRef = useRef(null);

  // Set popover position based on targetElement
  useEffect(() => {
    if (targetElement && popoverRef.current) {
      const _targetRect = targetElement.getBoundingClientRect();
      const _popoverRect = popoverRef.current.getBoundingClientRect();

      // setPopoverPosition({
      //   // top: targetRect.bottom + window.scrollY,
      //   top: targetRect.bottom,
      //   // left: targetRect.right + window.scrollX - popoverRect.width,
      //   left: targetRect.right + window.scrollX - 500,
      // });
    }
  }, [targetElement, isOpen]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="popover-container"
      style={{
        position: "fixed",
        // top: `${popoverPosition.top}px`,
        top: "50px",
        right: "20px",
        // left: `${popoverPosition.left}px`,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
      }}
      onClick={onClose}
    >
      <div
        ref={popoverRef}
        className="popover-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popover-header">
          <h5 className="popover-title">{title}</h5>
          <Button type="button" className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
        <div className="popover-body">{children}</div>
      </div>
    </div>
  );
};

export default Popup;
