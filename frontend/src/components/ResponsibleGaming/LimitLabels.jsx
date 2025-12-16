import React from "react"
import Trigger from "../OverlayTrigger";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@themesberg/react-bootstrap";
const LimitLabels = ({
  setLimitModal,
  setLimit,
  t,
  isHidden,
  label,
  value,
  minimum,
  limitType,
  selfExclusion,
  image,
}) => {
  return (
    <div key={value} className="col-12 col-lg-4">
      <div className="d-flex justify-content-between w-100" key={label}>
        <div className="d-flex gap-2 align-items-center">
         {image &&  <img src={image} alt="rsg-img" style={{ width: "20px" }} />}
          <h6>{label}</h6>
        </div>
        <div>
          <span>{value || t("playerLimit.notSet")}</span>
          <Trigger message={t("playerLimit.setLimit")} id={label + "_set"} />
          <Button
            id={label + "_set"}
            variant="warning"
            size="sm"
            onClick={() => {
              setLimit({ label, value, minimum, limitType, selfExclusion });
              setLimitModal(true);
            }}
            hidden={isHidden({ module: { key: "Users", value: "R" } })}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LimitLabels);
