import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Col, Row, Form as BForm, Button, Spinner, Table, OverlayTrigger, Tooltip } from "@themesberg/react-bootstrap";
import Datetime from "react-datetime";
import { toast } from "../../../components/Toast/index.jsx";
import {
  errorHandler,
  useCreatePromoCodeMutation,
} from "../../../reactQuery/hooks/customMutationHook/index.js";
import { AdminRoutes } from "../../../routes.js";
import { useNavigate } from "react-router-dom";
import { createPromoSchema } from "../schemas.js";
import { useGetPackagesListingQuery } from "../../../reactQuery/hooks/customQueryHook/index.js";
import moment from "moment";
import PaginationComponent from "../../../components/Pagination/index.jsx";

const CreatePromoCode = () => {
  const [selectedId, setSelectedId] = useState([]);
  const navigate = useNavigate();
  // const yesterday = new Date(Date.now());
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const { data, isLoading: loading } = useGetPackagesListingQuery({
    params: {
      orderBy: "packageId",
      sort: "desc",
      isActive: "active",
      pageNo:page,
      limit:limit
    },
  });
  const totalPages = Math.ceil(data?.count / limit);
  const { mutate: createPromoCode, isLoading: createLoading } =
    useCreatePromoCodeMutation({
      onSuccess: () => {
        toast("Promotion Bonus Created Successfully", "success");
        navigate(AdminRoutes.PromoCodeBonus);
      },
      onError: (error) => {
        errorHandler(error);
      },
    });

  const handleCreatePromotionBonusSubmit = (formValues) => {
    const body = {
      promocode: formValues.promocode,
      // isActive: formValues.isActive,
      validTill: moment(formValues.validTill).utc().format() || null,
      validFrom: formValues.validFrom
        ? moment(formValues.validFrom).utc().format()
        : null,
      maxUsersAvailed: formValues.maxUsersAvailed,
      perUserLimit: formValues.perUserLimit,
      isDiscountOnAmount: formValues.isDiscountOnAmount,
      discountPercentage: formValues.discountPercentage,
      // bonusPercentage : formValues.bonusPercentage,
      packages: selectedId,
      description: formValues.description,
    };
    createPromoCode(body);
  };

  const handleAddGame = (e, item) => {
    const data = [...selectedId];
    if (e.target.checked) {
      data.push(item.packageId);
      setSelectedId(data);
    } else {
      const updatedSelectedId = data.filter((row) => row !== item.packageId);
      setSelectedId(updatedSelectedId);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data?.rows?.map((item) => item.packageId) || [];
      setSelectedId(allIds);
    } else {
      setSelectedId([]);
    }
  };

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Create Purchase Promo Codes</h3>
        </Col>
      </Row>

      <Formik
        initialValues={{
          promocode: "",
          // isActive: true,
          validTill: "",
          validFrom: "",
          maxUsersAvailed: 0,
          perUserLimit: 0,
          isDiscountOnAmount: false,
          discountPercentage: 0,
          // bonusPercentage:0,
          // isValidUntil: false,
          description: "",
        }}
        validationSchema={createPromoSchema}
        onSubmit={handleCreatePromotionBonusSubmit}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue,
        }) => (
          <Form>
            <Row>
              <Col>
                <BForm.Label>
                  Promocode
                  <span className="text-danger"> *</span>
                </BForm.Label>
                <BForm.Control
                  type="text"
                  name="promocode"
                  placeholder="Enter Promocode"
                  value={values.promocode}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <ErrorMessage
                  component="div"
                  name="promocode"
                  className="text-danger"
                />
              </Col>
              <Col>
                <BForm.Label>Discount on Amount</BForm.Label>
                <BForm.Check
                  type="switch"
                  name="isDiscountOnAmount"
                  checked={values.isDiscountOnAmount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col>
              <Col>
                <BForm.Label>
                  {values.isDiscountOnAmount
                    ? "Discount Percentage On Amount"
                    : "Bonus Coins percentage"}
                  <span className="text-danger"> *</span>
                </BForm.Label>
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
                    name="discountPercentage"
                    placeholder="Enter Percentage"
                    min="0"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-", "."].includes(evt.key) &&
                      evt.preventDefault()
                    }
                    max="100"
                    value={values.discountPercentage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </OverlayTrigger>
                <ErrorMessage
                  component="div"
                  name="discountPercentage"
                  className="text-danger"
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <BForm.Label>
                  Max Users Availed (Zero as none limit)
                </BForm.Label>
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
                    name="maxUsersAvailed"
                    placeholder="Enter Max Users Availed"
                    min="0"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-", "."].includes(evt.key) &&
                      evt.preventDefault()
                    }
                    value={values.maxUsersAvailed}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </OverlayTrigger>
                <ErrorMessage
                  component="div"
                  name="maxUsersAvailed"
                  className="text-danger"
                />
              </Col>
              <Col>
                <BForm.Label>
                  Per Promocode User Limit (Zero as none limit)
                </BForm.Label>
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
                    name="perUserLimit"
                    placeholder="Enter Per User Limit"
                    min="0"
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-", "."].includes(evt.key) &&
                      evt.preventDefault()
                    }
                    value={values.perUserLimit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </OverlayTrigger>
                <ErrorMessage
                  component="div"
                  name="perUserLimit"
                  className="text-danger"
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <BForm.Label>
                  Promo Code Description
                  {/* <span className="text-danger"> *</span> */}
                </BForm.Label>
                <BForm.Control
                  as="textarea"
                  name="description"
                  placeholder="Enter description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  component="div"
                  name="description"
                  className="text-danger"
                />
              </Col>
              {/* <Col md={2}>
                <BForm.Label>Active</BForm.Label>
                <BForm.Check
                  type="switch"
                  name="isActive"
                  checked={values.isActive}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col> */}

              <Col md={4} lg={3}>
                <BForm.Label>
                  Valid From
                  <span className="text-danger"> *</span>
                </BForm.Label>
                <Datetime
                  inputProps={{
                    placeholder: "MM-DD-YYYY",
                    disabled: false,
                    readOnly: true,
                  }}
                  dateFormat="MM/DD/YYYY"
                  timeFormat={true}
                  isValidDate={(current) =>
                    current.isAfter(moment().subtract(1, "days"))
                  }
                  onChange={(e) => setFieldValue("validFrom", moment(e).utc())}
                  value={
                    values.validFrom ? moment(values.validFrom).local() : ""
                  }
                />
                <ErrorMessage
                  component="div"
                  name="validFrom"
                  className="text-danger"
                />
              </Col>

              {/* <Col md={2}>
                <BForm.Label>Valid Until</BForm.Label>
                <BForm.Check
                  type="switch"
                  name="isValidUntil"
                  checked={values.isValidUntil}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col > */}
              {/* {values.isValidUntil && ( */}
              <Col md={4} lg={3}>
                <BForm.Label>
                  Valid Till
                  <span className="text-danger"> *</span>
                </BForm.Label>
                <Datetime
                  inputProps={{
                    placeholder: "MM-DD-YYYY",
                    disabled: false,
                    readOnly: true,
                  }}
                  dateFormat="MM/DD/YYYY"
                  timeFormat={true}
                  isValidDate={(current) =>
                    current.isAfter(moment().subtract(1, "days"))
                  } // Allow today and future dates only
                  onChange={(e) => setFieldValue("validTill", moment(e).utc())}
                  value={
                    values.validTill ? moment(values.validTill).local() : ""
                  }
                />
                <ErrorMessage
                  component="div"
                  name="validTill"
                  className="text-danger"
                />
              </Col>
              {/* )} */}
            </Row>

            <Row className="mt-3">
              <BForm.Label>Package Details</BForm.Label>
              <Col md={2}>
                {selectedId?.length > 0 && (
                  <Button
                    variant="primary"
                    onClick={() => setSelectedId([])}
                    style={{ width: "100px", marginTop: "20px" }}
                  >
                    Clear
                  </Button>
                )}
              </Col>
              <div style={{ overflow: "auto" }}>
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center my-4">
                    <Spinner animation="border" role="status" />
                  </div>
                ) : data ? (
                  <>
                    <Table
                      bordered
                      striped
                      hover
                      size="sm"
                      className="text-center mt-4"
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th>
                            <input
                              name="selectAll"
                              type="checkbox"
                              className="form-check-input cursor-pointer"
                              checked={
                                selectedId?.length > 0 &&
                                selectedId?.length === data?.rows?.length
                              }
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th>Package ID</th>
                          <th>Amount</th>
                          <th>GC Coin</th>
                          <th>SC Coin</th>
                          <th>Package Type</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.rows?.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <input
                                name="select"
                                type="checkbox"
                                className="form-check-input cursor-pointer"
                                checked={selectedId?.includes(item.packageId)}
                                onChange={(e) => handleAddGame(e, item)}
                              />
                            </td>
                            <td>{item.packageId}</td>
                            <td>{item.amount}</td>
                            <td>
                              {item.gcCoin} + {item.bonusGc}
                            </td>
                            <td>
                              {item.scCoin} + {item.bonusSc}{" "}
                            </td>
                            <td>
                              {item.welcomePurchaseBonusApplicable
                                ? "Welcome Purchase Package"
                                : item.firstPurchaseApplicable &&
                                  item.isSpecialPackage
                                ? "Special First Purchase Package"
                                : item.firstPurchaseApplicable
                                ? "First Purchase Package"
                                : item.isSpecialPackage
                                ? "Special Package"
                                : "Basic Package"}
                            </td>
                            <td>{item.isActive ? "Active" : "Inactive"}</td>
                          </tr>
                        ))}
                        {data?.rows?.filter((item) => item.isActive).length ===
                          0 && (
                          <tr>
                            <td className="text-danger" colSpan={6}>
                              No Data Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <p className="text-danger text-center mt-3">
                    No Data Available
                  </p>
                )}
              </div>
            </Row>
            {data?.count !== 0 && data?.rows?.length > 0 && (
              <PaginationComponent
                page={data?.count < page ? setPage(1) : page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
              />
            )}
            <div className="mt-4 d-flex justify-content-between align-items-center">
              <Button
                variant="warning"
                onClick={() => navigate(AdminRoutes.PromoCodeBonus)}
              >
                Cancel
              </Button>

              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={createLoading}
              >
                Submit
                {createLoading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreatePromoCode;
