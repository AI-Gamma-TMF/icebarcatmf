import { faEdit, faCancel, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Row,
  Col,
  Table,
  Form as BForm,
} from "@themesberg/react-bootstrap";
import { useEffect, useState } from "react";

import { ConfirmationModal } from "../../components/ConfirmationModal";
import Trigger from "../../components/OverlayTrigger";
import { InlineLoader } from "../../components/Preloader";
import useCheckPermission from "../../utils/checkPermission";
import { getFormattedTimeZoneOffset } from "../../utils/helper";
import { getItem } from "../../utils/storageUtils";
import { timeZones } from "../Dashboard/constants";
import useDailyBonusStreak from "./hooks/useDailyBonusStreak";
import { toast } from "../../components/Toast";
import { getDropdownData } from "../../utils/apiCalls";

const DailyBonusStreakListing = () => {
  const { isHidden } = useCheckPermission();
  const [dataBonus, setDataBonus] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [errorGC, setErrorGC] = useState("");
  const [errorSC, setErrorSC] = useState("");
  const { updateBonus } = useDailyBonusStreak();

  const handleSubmit = (updateValues) => {
    if (!editValues.gcAmount || !editValues.scAmount || errorGC || errorSC) {
      toast("SC Amount and GC Amount cannot be empty!", "error");
      return;
    }
    updateBonus(updateValues);
    setEditRowId(null);
  };

  const {
    statusShow,
    setStatusShow,
    status,
    handleYes,
    dailyBonusStreakData,
    loading,
    bonus,
  } = useDailyBonusStreak();

  const {
    data: scratchCardDropdowndata,
    isLoading: scratchLoading,
    refetch: scratchRefetch,
  } = useQuery({
    queryKey: ["scratchCardDropdowndata"],
    queryFn: ({ queryKey }) => {
      return getDropdownData({ bonusType: "scratch-card-bonus" });
    },
    select: (res) => res?.data?.dropdownList,
    refetchOnWindowFocus: false,
  });
  const {
    data: freeSpinDropdowndata,
    isLoading: freeSpiinLoading,
    refetch: freeSpinRefetch,
  } = useQuery({
    queryKey: ["freeSpinDropdowndata"],
    queryFn: ({ queryKey }) => {
      return getDropdownData({ bonusType: "free-spin-bonus" });
    },
    select: (res) => res?.data?.dropdownList,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const set = new Set();
    dailyBonusStreakData?.rows?.map((bonus) => {
      set.add(bonus?.bonusType);
    });
    setDataBonus(Array.from(set));
  }, [dailyBonusStreakData]);

  const timeZone = getItem("timezone");
  const timezoneOffset =
    timeZone != null
      ? timeZones.find((x) => x.code === timeZone).value
      : getFormattedTimeZoneOffset();

  const handleEditClick = (row) => {
    setEditRowId(row.bonusId);
    setEditValues({
      scAmount: row.scAmount,
      gcAmount: row.gcAmount,
      bonusImg: row.bonusImg,
      scratchCard: row?.scratchCard?.scratchCardId || "",
      bonusType: row?.freeSpinId
        ? "Free-Spin"
        : row?.scratchCard
        ? "Scratch-Card"
        : "",
      rewardSource: row?.scratchCard?.scratchCardId
        ? row?.scratchCard?.scratchCardId
        : (row?.freeSpinBonus?.status == 1 || row?.freeSpinBonus?.status == 0)
        ? row?.freeSpinBonus?.freeSpinId
        : "",
    });
  };

  const handleChange = (e, field) => {
    setEditValues({
      ...editValues,
      [field]: e.target.value,
    });
  };

  const validateSCInput = (value) => {
    if (!/^\d*\.?\d*$/.test(value)) {
      return "Only numbers are allowed.";
    }
    if (Number(value) === 0 && value !== "") {
      return "Value must be greater than 0.";
    }
    if (Number(value) > 1000000) {
      return "Value must be between 1 and 1,000,000.";
    }
    return "";
  };
  const validateGCInput = (value) => {
    if (!/^\d*\.?\d*$/.test(value)) {
      return "Only numbers are allowed.";
    }
    if (Number(value) === 0 && value !== "") {
      return "Value must be greater than 0.";
    }
    if (Number(value) > 1000000) {
      return "Value must be between 1 and 1,000,000.";
    }
    return "";
  };

  const handleInputSCChange = (e) => {
    const value = e.target.value.replace(/\s+/g, ""); // Remove spaces

    const errorMessage = validateSCInput(value);
    setErrorSC(errorMessage);

    e.target.value = value; // Ensure cleaned value is set in input

    if (!errorMessage || value === "") {
      handleChange(e, "scAmount"); // Allow clearing but prevent invalid values
    }
  };
  const handleInputGCChange = (e) => {
    const value = e.target.value.replace(/\s+/g, ""); // Remove spaces

    const errorMessage = validateGCInput(value);
    setErrorGC(errorMessage);

    if (!errorMessage) {
      handleChange(e, "gcAmount"); // Update state only if valid
    }

    e.target.value = value; // Ensure cleaned value is set in input
  };
  return (
    <>
      <Row>
        <Col xs="9">
          <h3>Daily Bonus Streak</h3>
        </Col>
      </Row>
      <Row className="mt-2"></Row>
      {
        <Table
          bordered
          striped
          responsive
          hover
          size="sm"
          className="text-center mt-4"
        >
          <thead className="thead-dark">
            <tr>
              {[
                "Day",
                "SC Amount",
                "GC Amount",
                "Image",
                "Bonus Type",
                "Applicable Bonus",
                "Action",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Boolean(dailyBonusStreakData) &&
              dailyBonusStreakData?.rows?.map((bonus) => {
                const {
                  bonusId,
                  bonusName,
                  imageUrl,
                  day,
                  validFrom,
                  isActive,
                  minimumPurchase,
                  gcAmount,
                  scAmount,
                  description,
                  btnText,
                  termCondition,
                  scratchCard,
                } = bonus;
                return (
                  <tr key={bonusId}>
                    <td>{day}</td>
                    <td>
                      {editRowId === bonusId ? (
                        <>
                          <BForm.Control
                            type="number"
                            name="scAmount"
                            min="1"
                            max="1000000"
                            step="any"
                            value={editValues.scAmount || ""}
                            onChange={handleInputSCChange}
                          />
                          {errorSC && (
                            <div style={{ color: "red", marginTop: "5px" }}>
                              {errorSC}
                            </div>
                          )}
                        </>
                      ) : (
                        scAmount
                      )}
                    </td>
                    <td>
                      {editRowId === bonusId ? (
                        <>
                          <BForm.Control
                            type="number"
                            name="gcAmount"
                            min="1"
                            max="1000000"
                            step="any"
                            value={editValues.gcAmount || ""}
                            onChange={handleInputGCChange}
                          />
                          {errorGC && (
                            <div style={{ color: "red", marginTop: "5px" }}>
                              {errorGC}
                            </div>
                          )}
                        </>
                      ) : (
                        gcAmount
                      )}
                    </td>
                    <td>
                      {editRowId === bonusId ? (
                        <BForm.Control
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            setEditValues({
                              scAmount: scAmount,
                              scratchCard: scratchCard,
                              gcAmount: gcAmount,
                              bonusImg: file,
                            });
                          }}
                        />
                      ) : (
                        imageUrl
                      )}
                    </td>
                    <td>
                      {editRowId === bonusId ? (
                        <BForm.Select
                          value={editValues.bonusType || ""}
                          onChange={(e) => {
                            const selectedType = e.target.value;
                            setEditValues((prev) => ({
                              ...prev,
                              bonusType: selectedType,
                              rewardSource: "", // reset when switching type
                            }));
                          }}
                        >
                          <option value="">Select Bonus Type</option>
                          <option value="Scratch-Card">Scratch Card</option>
                          <option value="Free-Spin">Free Spin</option>
                        </BForm.Select>
                      ) : (
                        <>
                          {bonus?.scratchCardId
                            ? "Scratch Card"
                            : bonus?.freeSpinId
                            ? "Free Spin"
                            : "-"}
                        </>
                      )}
                    </td>

                    <td>
                      {editRowId === bonusId ? (
                        <>
                          {editValues.bonusType === "Scratch-Card" && (
                            <BForm.Select
                              value={editValues.rewardSource || ""}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  rewardSource: e.target.value,
                                }))
                              }
                            >
                              {[
                                {
                                  scratchCardId: "",
                                  scratchCardName: "Select Scratch Card",
                                },
                                ...scratchCardDropdowndata,
                              ].map((item, idx) => (
                                <option
                                  key={item.scratchCardId}
                                  value={item.scratchCardId}
                                  disabled={idx === 0}
                                >
                                  {item.scratchCardName}
                                </option>
                              ))}
                            </BForm.Select>
                          )}

                          {editValues.bonusType === "Free-Spin" && (
                            <BForm.Select
                              value={editValues.rewardSource || ""}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  rewardSource: e.target.value,
                                }))
                              }
                            >
                              {[
                                { freeSpinId: "", title: "Select Free Spin" },
                                ...freeSpinDropdowndata,
                              ].map((item, idx) => (
                                <option
                                  key={item.freeSpinId}
                                  value={item.freeSpinId}
                                  disabled={idx === 0}
                                >
                                  {item.title}
                                </option>
                              ))}
                            </BForm.Select>
                          )}
                        </>
                      ) : (
                        <>
                          {bonus?.scratchCardId
                            ? bonus?.scratchCard?.scratchCardName || "-"
                            : (bonus?.freeSpinBonus?.status == 1 || bonus?.freeSpinBonus?.status ==  0 ) 
                            ? bonus?.freeSpinBonus?.title || "-"
                            : "-"}
                        </>
                      )}
                    </td>

                    <td>
                      {editRowId === bonusId ? (
                        <>
                          <Trigger message={"Save"} id={bonusId + "save"} />
                          <Button
                            id={bonusId + "save"}
                            className="m-1"
                            size="sm"
                            variant="warning"
                            onClick={() =>
                              handleSubmit({
                                bonusId,
                                bonusName,
                                startDate: validFrom,
                                gcAmount: editValues.gcAmount,
                                scAmount: editValues.scAmount,
                                bonusImg: editValues.bonusImg,
                                description,
                                isActive,
                                btnText,
                                termCondition,
                                scratchCardId:
                                  editValues.bonusType === "Scratch-Card"
                                    ? editValues.rewardSource
                                    : null,
                                freeSpinId:
                                  editValues.bonusType === "Free-Spin"
                                    ? editValues.rewardSource
                                    : null,
                              })
                            }
                            hidden={isHidden({
                              module: { key: "Bonus", value: "U" },
                            })}
                          >
                            <FontAwesomeIcon icon={faSave} />
                          </Button>
                          <Trigger message={"Cancel"} id={bonusId + "cancel"} />

                          <Button
                            id={bonusId + "cancel"}
                            className="m-1"
                            size="sm"
                            variant="warning"
                            onClick={() => setEditRowId(null)}
                            hidden={isHidden({
                              module: { key: "Bonus", value: "U" },
                            })}
                          >
                            <FontAwesomeIcon icon={faCancel} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Trigger message={"Edit"} id={bonusId + "edit"} />
                          <Button
                            id={bonusId + "edit"}
                            className="m-1"
                            size="sm"
                            variant="warning"
                            onClick={() => handleEditClick(bonus)}
                            hidden={isHidden({
                              module: { key: "Bonus", value: "U" },
                            })}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            {dailyBonusStreakData?.count === 0 && (
              <tr>
                <td colSpan={6} className="text-danger text-center">
                  {"No Data Found"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      }
      {loading && <InlineLoader />}
      {statusShow && (
        <ConfirmationModal
          isBonus={true}
          bonus={bonus}
          setShow={setStatusShow}
          show={statusShow}
          handleYes={handleYes}
          active={status}
        />
      )}
    </>
  );
};

export default DailyBonusStreakListing;
