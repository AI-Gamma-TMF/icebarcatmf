import React from "react";
import {
  Button,
  Form as BForm,
  Row,
  Col,
  Container,
} from "@themesberg/react-bootstrap";
import { add, divide, multiply, subtract } from "lodash";
import { toast } from "../../../../../components/Toast";

const SubPackageDetailsForm = ({
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  setShowAddSubPackages,
  showAddSubPackages,
}) => {
  const handleChangeDiscountAmount = (e) => {
    const value = e.target.value;
    if (value?.match(/^(\d+(\.\d{0,2})?)?$/)) {
      const discountedAmount = value;
      const roundedScCoin = Math.ceil(+discountedAmount);
      const roundedGcCoin = Math.ceil(+discountedAmount) * 1000;

      const bonusPercentage = Math.floor(
        +multiply(
          +divide(
            +subtract(
              +add(roundedScCoin, +values?.subpackageScBonus ?? 0),
              +discountedAmount
            ),
            +discountedAmount
          ),
          100
        )
      );

      setFieldValue("discountedAmount", value);
      setFieldValue("subpackageScCoin", roundedScCoin);
      setFieldValue("subpackageGcCoin", roundedGcCoin);
      setFieldValue("subpackageBonusPercentage", bonusPercentage);
    } else {
      setFieldValue("subpackageScCoin", "");
      setFieldValue("subpackageGcCoin", "");
      setFieldValue("discountedAmount", "");
      setFieldValue("subpackageBonusPercentage", 0);
    }
  };

  const handleChangeScCoin = (e) => {
    const value = e.target.value;

    const bonusPercentage = Math.floor(
      +multiply(
        +divide(
          +subtract(
            +add(+value, +values?.subpackageScBonus ?? 0),
            +values?.discountedAmount
          ),
          +values?.discountedAmount
        ),
        100
      )
    );
    setFieldValue("subpackageBonusPercentage", bonusPercentage);
    setFieldValue("subpackageScCoin", value);
  };

  const handleChangeSubpackageScBonus = (e) => {
    const value = e.target.value;

    if (value) {
      const bonusPercentage = Math.floor(
        +multiply(
          +divide(
            +subtract(
              +add(+values?.subpackageScCoin, +value ?? 0),
              +values?.discountedAmount
            ),
            +values?.discountedAmount
          ),
          100
        )
      );
      setFieldValue("subpackageBonusPercentage", bonusPercentage);
      setFieldValue("subpackageScBonus", value);
    } else {
      setFieldValue("subpackageBonusPercentage", 0);
      setFieldValue("subpackageScBonus", "");
    }
  };

  const handleCancelSubPackage = () => {
    setShowAddSubPackages(!showAddSubPackages);

    setFieldValue("intervalDays", "");
    setFieldValue("discountedAmount", "");
    setFieldValue("subpackageScCoin", "");
    setFieldValue("subpackageGcCoin", "");
    setFieldValue("subpackageGcBonus", "");
    setFieldValue("subpackageScBonus", "");
    setFieldValue("subpackageBonusPercentage", "");

    setFieldValue("subpackageNoOfPurchase", null);
    setFieldValue("subpackagePurchaseDate", false);
    setFieldValue("subpackageIsActive", false);
  };

  const handleAddSubPackages = () => {
    const newSubPackage = {
      intervalDays: values?.intervalDays,
      discountedAmount: values?.discountedAmount,
      subpackageGcCoin: values?.subpackageGcCoin,
      subpackageScCoin: values?.subpackageScCoin,
      subpackageGcBonus: values?.subpackageGcBonus,
      subpackageScBonus: values?.subpackageScBonus,
      subpackageBonusPercentage: values?.subpackageBonusPercentage,
      subpackageNoOfPurchase: values?.subpackageNoOfPurchase,
      subpackagePurchaseDate: values?.subpackagePurchaseDate,
      subpackageIsActive: values?.subpackageIsActive,
    };

    const existingPackages = values.intervalsConfig || [];
    const alreadyExists = existingPackages.some(
      (pkg) => pkg.intervalDays === newSubPackage.intervalDays
    );

    if (alreadyExists) {
      toast(
        `Package with the same interval already exists in the list`,
        "error"
      );
      return;
    }

    setFieldValue("intervalsConfig", [...existingPackages, newSubPackage]);

    setFieldValue("intervalDays", "");
    setFieldValue("discountedAmount", "");
    setFieldValue("subpackageScCoin", "");
    setFieldValue("subpackageGcCoin", "");
    setFieldValue("subpackageGcBonus", "");
    setFieldValue("subpackageScBonus", "");
    setFieldValue("subpackageBonusPercentage", "");
    setFieldValue("subpackageNoOfPurchase", null);
    setFieldValue("subpackagePurchaseDate", false);
    setFieldValue("subpackageIsActive", false);
  };

  return (
    <>
      <Container fluid className="mt-4 rounded border p-4">
        <Row>
          <Col xs={3} className="mb-3">
            <BForm.Label>
              Days <span className="text-danger"> *</span>
            </BForm.Label>

            <BForm.Control
              type="number"
              placeholder="Enter interval days"
              name="intervalDays"
              min="0"
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault()
              }
              value={values?.intervalDays}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Col>

          <Col xs={3} className="mb-3">
            <BForm.Label>
              Discounted Amount <span className="text-danger"> *</span>
            </BForm.Label>
            <BForm.Control
              type="number"
              placeholder={"Enter the Discounted Amount"}
              name="discountedAmount"
              min="0"
              onKeyDown={(evt) =>
                ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
              }
              value={values?.discountedAmount}
              onChange={handleChangeDiscountAmount}
              onBlur={handleBlur}
            />
          </Col>

          <Col xs={3} className="mb-3">
            <BForm.Label>
              SC Coin <span className="text-danger"> *</span>
            </BForm.Label>
            <BForm.Control
              type="number"
              name="subpackageScCoin"
              value={values?.subpackageScCoin}
              onChange={handleChangeScCoin}
              onBlur={handleBlur}
              min="0"
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault()
              }
            />
          </Col>
          <Col xs={3} className="mb-3">
            <BForm.Label>
              GC Coin <span className="text-danger"> *</span>
            </BForm.Label>
            <BForm.Control
              type="number"
              min="0"
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault()
              }
              name="subpackageGcCoin"
              value={values?.subpackageGcCoin}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Col>
          <Col xs={3} className="mb-3">
            <BForm.Label>
              SC Bonus Coin <span className="text-danger"> *</span>
            </BForm.Label>
            <BForm.Control
              type="number"
              name="subpackageScBonus"
              min="0"
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault()
              }
              placeholder="Enter Subpackage SC Bonus"
              value={values?.subpackageScBonus}
              onChange={handleChangeSubpackageScBonus}
              onBlur={handleBlur}
            />
          </Col>
          <Col xs={3} className="mb-3">
            <BForm.Label>
              GC Bonus Coin <span className="text-danger"> *</span>
            </BForm.Label>
            <BForm.Control
              type="number"
              name="subpackageGcBonus"
              min="0"
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault()
              }
              placeholder="Enter Subpackage GC Bonus"
              value={values?.subpackageGcBonus}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Col>
          <Col xs={3} className="mb-3">
            <BForm.Label>Calculated Bonus Percentage</BForm.Label>
            <BForm.Control
              type="number"
              name="subpackageBonusPercentage"
              value={values?.subpackageBonusPercentage}
              onChange={handleChange}
              min="0"
              onKeyDown={(evt) =>
                ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
              }
              onBlur={handleBlur}
              disabled
            />
          </Col>
          <Col xs={3} className="mb-3">
            <BForm.Label>Number of Purchases</BForm.Label>
            <BForm.Control
              type="number"
              name="subpackageNoOfPurchase"
              min="0"
              value={values?.subpackageNoOfPurchase || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault()
              }
            />
          </Col>

          <Col xs={3} className="mb-4">
            <div className="d-flex align-items-center  rounded p-2 justify-content-between border">
              <BForm.Label>
                {values?.subpackagePurchaseDate
                  ? "Last Purchase Date enabled"
                  : "Registration Date enabled"}
              </BForm.Label>
              <BForm.Check
                type="switch"
                name="subpackagePurchaseDate"
                value="true"
                checked={values?.subpackagePurchaseDate}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </Col>
          <Col xs={3} className="mb-4">
            <div className="d-flex align-items-center  rounded p-2 justify-content-between border">
              <BForm.Label>Active</BForm.Label>
              <BForm.Check
                name="subpackageIsActive"
                value="true"
                checked={values?.subpackageIsActive}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </Col>
          <Col xs={6} className="mb-4 d-flex justify-content-end gap-2">
            <Button
              className="w-auto"
              variant="warning"
              onClick={handleCancelSubPackage}
            >
              Cancel
            </Button>
            <Button
              className="w-auto"
              variant="primary"
              onClick={handleAddSubPackages}
            
              disabled={
                values?.intervalDays <= 0 ||
                values?.discountedAmount <= 0 ||
                values?.subpackageScCoin === "" ||
                values?.subpackageGcCoin === "" ||
                values?.subpackageGcBonus === "" ||
                values?.subpackageScBonus === "" ||
                values?.subpackageBonusPercentage < 0
              }
            >
              Add SubPackages
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SubPackageDetailsForm;
