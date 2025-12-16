import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form as BForm,
  OverlayTrigger,
  Tooltip,
} from "@themesberg/react-bootstrap";
import { ErrorMessage } from "formik";
import {
  getDropdownData,
  getScratchCardDropdown,
} from "../../../../../utils/apiCalls";
import { useQuery } from "@tanstack/react-query";

const PackageDetailsForm = ({
  values,
  handleChange,
  handleBlur,
  handleSelect,
  t,
  isEdit,
  selectedOption,
  selectedScratchCardOption,
  handleSelectScratchCard,
  selectedFreeSpinOption,
  handleSelectFreeSpin,
}) => {
  const [bonusType, setBonusType] = useState("");
  const {
    data: scratchCardDropdownList = [],
    isLoading: isLoading,
    refetch,
  } = useQuery({
    queryKey: ["scratchCardDropdownList"],
    queryFn: ({ queryKey }) => {
      return getDropdownData({ bonusType: "scratch-card-bonus" });
    },
    select: (res) => res?.data?.dropdownList,
    refetchOnWindowFocus: false,
  });
  const {
    data: freeSpinDropdownData = [],
    isLoading: freeSpinLoading,
    refetch: freeSpinRefetch,
  } = useQuery({
    queryKey: ["freeSpinDropdownData"],
    queryFn: ({ queryKey }) => {
      return getDropdownData({ bonusType: "free-spin-bonus" });
    },
    select: (res) => res?.data?.dropdownList,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (
      selectedScratchCardOption &&
      selectedScratchCardOption !== "null" &&
      selectedScratchCardOption !== ""
    ) {
      setBonusType("scratch-card");
    }
  }, [selectedScratchCardOption]);

  useEffect(() => {
    if (
      selectedFreeSpinOption &&
      selectedFreeSpinOption !== "null" &&
      selectedFreeSpinOption !== ""
    ) {
      setBonusType("free-spin");
    }
  }, [selectedFreeSpinOption]);

  return (
    <>
      <Row>
        <Col xs={3} className="mb-3">
          <BForm.Label>Select Package Type</BForm.Label>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-package-type">
                Select the type of package.
              </Tooltip>
            }
          >
            <BForm.Select
              name="packageType"
              value={selectedOption}
              onChange={(e) => handleSelect(e.target.value)}
              onBlur={handleBlur}
            >
              <option value="Basic Package">Basic Package</option>
              <option value="Welcome Purchase Packages">
                Welcome Purchase Package
              </option>
              {/* {!isEditPage && <option value='Ladder Packages'>Ladder Packages</option>} */}
            </BForm.Select>
          </OverlayTrigger>
          <ErrorMessage
            component="div"
            name="packageType"
            className="text-danger"
          />
        </Col>
        {!values?.welcomePurchaseBonusApplicable &&
          !values?.isLadderPackage && (
            <Col xs={3} className="mb-3">
              <BForm.Label>Package Purchase Number</BForm.Label>
              <div style={{ position: "relative" }}>
                <BForm.Check
                  type="switch"
                  name="ispurchaseNo"
                  checked={values.ispurchaseNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isEdit}
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "auto",
                    right: "10px",
                    zIndex: 2,
                  }}
                />
                {values.ispurchaseNo === true ? (
                  <>
                    <BForm.Control
                      type="number"
                      name="purchaseNo"
                      min="1"
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-", "."].includes(evt.key) &&
                        evt.preventDefault()
                      }
                      placeholder={t("Enter Package Purchase Number")}
                      value={values.purchaseNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onPaste={(evt) => evt.preventDefault()}
                    />

                    <ErrorMessage
                      component="div"
                      name="purchaseNumber"
                      className="text-danger"
                    />
                  </>
                ) : (
                  <>
                    <div className="">
                      <BForm.Control
                        type="number"
                        name="purchaseNumber"
                        min="0"
                        disabled={true}
                      />
                      <ErrorMessage
                        component="div"
                        name="purchaseNumber"
                        className="text-danger"
                      />
                    </div>
                  </>
                )}
              </div>
            </Col>
          )}
        {!values?.isLadderPackage && (
          <Col xs={3} className="mb-3">
            <BForm.Label>
              Package Name
              <span className="text-danger"> *</span>
            </BForm.Label>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-package-name">
                  Enter the name of the package.
                </Tooltip>
              }
            >
              <BForm.Control
                type="text"
                name="packageName"
                placeholder={t("Package Name")}
                value={values?.packageName}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={(evt) =>
                  ["+", "-", "."].includes(evt.key) && evt.preventDefault()
                }
              />
            </OverlayTrigger>

            <ErrorMessage
              component="div"
              name="packageName"
              className="text-danger"
            />
          </Col>
        )}

        <Col xs={3} className="mb-3">
          <BForm.Label>Package purchase limit per user</BForm.Label>
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
              name="purchaseLimitPerUser"
              min="0"
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault()
              }
              placeholder={t(
                "createPackage.inputFields.purchaseLimitPerUser.placeholder"
              )}
              value={values.purchaseLimitPerUser}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={values.welcomePurchaseBonusApplicable}
            />
          </OverlayTrigger>
          <ErrorMessage
            component="div"
            name="purchaseLimitPerUser"
            className="text-danger"
          />
        </Col>
        <Col xs={3} className="mb-3">
          <BForm.Label>
            Package Tag
          </BForm.Label>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-package-tag">Enter the package Tag.</Tooltip>
            }
          >
            <BForm.Control
              type="text"
              name="packageTag"
              placeholder={t("Package Tag")}
              value={values?.packageTag}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(evt) =>
                ["+", "-", "."].includes(evt.key) && evt.preventDefault()
              }
            />
          </OverlayTrigger>

          <ErrorMessage
            component="div"
            name="packageTag"
            className="text-danger"
          />
        </Col>
        <Col xs={3} className="mb-3">
          <BForm.Label>Select Bonus Type</BForm.Label>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-bonus-type">Select Bonus Type</Tooltip>
            }
          >
            <BForm.Select
              name="bonusType"
              value={bonusType}
              onChange={(e) => setBonusType(e.target.value)}
            >
              <option value="" disabled>
                Select Bonus Type
              </option>
              <option value="scratch-card">Scratch Card</option>
              <option value="free-spin">Free Spin</option>
            </BForm.Select>
          </OverlayTrigger>
        </Col>

        {bonusType === "scratch-card" && (
          <Col xs={3} className="mb-3">
            <BForm.Label>Select Scratch Card</BForm.Label>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-scratch-card">
                  Select Scratch Card.
                </Tooltip>
              }
            >
              <BForm.Select
                name="scratchCardId"
                value={selectedScratchCardOption}
                onChange={(e) => handleSelectScratchCard(e.target.value)}
              >
                {[
                  {
                    scratchCardId: "",
                    scratchCardName: "Select a Scratch Card",
                  },
                  // { scratchCardId: '', scratchCardName: 'None' },
                  ...scratchCardDropdownList,
                ].map((item, index) => (
                  <option
                    key={item?.scratchCardId || "default-option"}
                    value={item?.scratchCardId?.toString()}
                    disabled={index === 0}
                    style={
                      index === 0 ? { background: "#999", color: "#fff" } : {}
                    }
                  >
                    {item?.scratchCardName}
                  </option>
                ))}
              </BForm.Select>
            </OverlayTrigger>
            <ErrorMessage
              component="div"
              name="scratchCard"
              className="text-danger"
            />
          </Col>
        )}

        {bonusType === "free-spin" && (
          <Col xs={3} className="mb-3">
            <BForm.Label>Select Free Spin</BForm.Label>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-free-spin">Select Free Spin.</Tooltip>
              }
            >
              <BForm.Select
                name="freeSpinId"
                value={selectedFreeSpinOption}
                onChange={(e) => handleSelectFreeSpin(e.target.value)}
              >
                {[
                  { freeSpinId: "", title: "Select Free Spin" },
                  // { freeSpinId: '', title: 'None' },
                  ...freeSpinDropdownData,
                ].map((item, index) => (
                  <option
                    key={item?.freeSpinId || "default-option"}
                    value={item?.freeSpinId?.toString()}
                    disabled={index === 0}
                    style={
                      index === 0 ? { background: "#999", color: "#fff" } : {}
                    }
                  >
                    {item?.title}
                  </option>
                ))}
              </BForm.Select>
            </OverlayTrigger>
            <ErrorMessage
              component="div"
              name="freeSpin"
              className="text-danger"
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default PackageDetailsForm;
