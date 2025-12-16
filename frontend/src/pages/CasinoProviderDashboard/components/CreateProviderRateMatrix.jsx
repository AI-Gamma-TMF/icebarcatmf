import { Formik, Form, ErrorMessage, Field } from "formik";
import { Col, Row, Form as BForm, Button, Table } from "@themesberg/react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import useCreateProviderRate from "../hooks/useCreateProviderRate.js";
import { useState } from "react";
import { toast } from "../../../components/Toast/index.jsx";
import { providerSchema } from "../schema.js";
import { AdminRoutes } from "../../../routes.js";

const CreateProviderRateMatrix = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const {
    matrixDetails,
    createLoading,
    handleCreateSubmit,
  } = useCreateProviderRate(providerId);




  const [rateList, setRateList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const getNextMinGGR = () => {
    if (rateList.length === 0) return 0;
    const last = rateList[rateList.length - 1];
    return (last?.ggrMaximum ?? last?.ggrMinimum) + 1;
  };

  const handleDelete = (index) => {
    const updatedList = [...rateList];
    updatedList.splice(index, 1); // Remove the selected item

    // If there's a next item, update its ggrMinimum
    if (index < updatedList.length && index > 0) {
      const prevItem = updatedList[index - 1];
      updatedList[index] = {
        ...updatedList[index],
        ggrMinimum: (prevItem.ggrMaximum ?? prevItem.ggrMinimum) + 1,
      };
    }

    // Edge case: if first item is deleted, ensure the new first item starts at 0
    if (index === 0 && updatedList.length > 0) {
      updatedList[0] = {
        ...updatedList[0],
        ggrMinimum: 0,
      };
    }

    setRateList(updatedList);
  };

  const handleEdit = (index, setValues) => {
    const rate = rateList[index];
    setValues({
      ggrMinimum: rate.ggrMinimum,
      ggrMaximum: rate.ggrMaximum ?? '',
      rate: rate.rate,
    });
    setEditIndex(index);
  };

  return (
    <div>
      <Row>
        <Col sm={8}>
          <h3>Create Provider Rate Matrix</h3>
        </Col>
      </Row>

      <Row>
        <Col>
          <Formik
            enableReinitialize
            initialValues={{
              aggregatorName: matrixDetails?.aggregatorName,
              providerName: matrixDetails?.providerName,
              ggrMinimum: getNextMinGGR(),
              rate: '',
              ggrMaximum: '',
            }}
            validationSchema={providerSchema}
            onSubmit={(values, { resetForm }) => {
              const normalizeMax = (val) => {
                if (val === '' || val === null || String(val).toLowerCase() === 'infinite') return null;
                return Number(val);
              };

              const updatedRate = {
                ggrMinimum: Number(values.ggrMinimum),
                ggrMaximum: normalizeMax(values.ggrMaximum),
                rate: Number(values.rate),
              };

              let updatedList = [...rateList];

              if (editIndex !== null) {
                // Remove overlapping entries with updated range (excluding the one being edited)
                updatedList = updatedList.filter((item, index) => {
                  if (index === editIndex) return true; // keep the edited one for now
                  const inRange = (
                    (item.ggrMinimum >= updatedRate.ggrMinimum && item.ggrMinimum <= updatedRate.ggrMaximum) ||
                    (item.ggrMaximum !== null &&
                      item.ggrMaximum >= updatedRate.ggrMinimum &&
                      item.ggrMaximum <= updatedRate.ggrMaximum)
                  );
                  return !inRange;
                });

                // Update the edited item
                updatedList[editIndex] = updatedRate;

                // Sort again by ggrMinimum to maintain order
                updatedList.sort((a, b) => a.ggrMinimum - b.ggrMinimum);

                // Update the next item's ggrMinimum if needed
                const nextIndex = updatedList.findIndex((_, idx) => idx > editIndex);
                if (nextIndex !== -1) {
                  updatedList[nextIndex] = {
                    ...updatedList[nextIndex],
                    ggrMinimum: (updatedRate.ggrMaximum ?? updatedRate.ggrMinimum) + 1,
                  };
                }

                setEditIndex(null);
              } else {
                // New entry
                if (updatedList.length > 0) {
                  updatedList[updatedList.length - 1].ggrMaximum = updatedRate.ggrMinimum - 1;
                }
                updatedList.push(updatedRate);
              }

              // Final sort and state update
              updatedList.sort((a, b) => a.ggrMinimum - b.ggrMinimum);
              setRateList(updatedList);

              resetForm({
                values: {
                  ggrMinimum: updatedRate.ggrMaximum !== null ? updatedRate.ggrMaximum + 1 : 0,
                  ggrMaximum: '',
                  rate: '',
                },
              });
            }}

          >
            {({ handleSubmit, setValues, values }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Row className="my-3">
                  <Col sm={6} lg={6}>
                    <BForm.Label>
                      Aggregator
                    </BForm.Label>
                    <BForm.Control
                      type="text"
                      name="aggregatorName"
                      value={values.aggregatorName}
                      disabled
                    />
                  </Col>

                  <Col sm={6} lg={6}>
                    <BForm.Label>
                      Game Provider
                    </BForm.Label>
                    <BForm.Control
                      type="text"
                      name="providerName"
                      value={values.providerName}
                      disabled
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={3}>
                    <BForm.Label>Min GGR<span className="text-danger">*</span></BForm.Label>
                    <Field className="form-control" name="ggrMinimum" type="number" disabled />
                    <ErrorMessage name="ggrMinimum" className="text-danger" component="div" />
                  </Col>
                  <Col md={3}>
                    <BForm.Label>Max GGR (add "infinite" for last range) <span className="text-danger">*</span></BForm.Label>
                    <Field className="form-control" name="ggrMaximum" type="text" />
                    <ErrorMessage name="ggrMaximum" className="text-danger" component="div" />
                  </Col>
                  <Col md={3}>
                    <BForm.Label>Rate (%) <span className="text-danger">*</span></BForm.Label>
                    <Field className="form-control" name="rate" type="number" />
                    <ErrorMessage name="rate" className="text-danger" component="div" />
                  </Col>

                  <Col md={3} >
                    <Button
                      style={{ marginTop: '32px' }}
                      variant="primary"
                      type="submit"
                      disabled={editIndex === null && rateList.length > 0 && rateList[rateList.length - 1].ggrMaximum === null}
                    >
                      {editIndex !== null ? 'Update' : 'Add'}
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {rateList.length > 0 && (
                      <Table
                        bordered
                        striped
                        responsive
                        hover
                        size="sm"
                        className="text-center mt-4"
                      >
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Min GGR</th>
                            <th>Max GGR</th>
                            <th>Rate</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rateList.map((rate, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{rate.ggrMinimum}</td>
                              <td>{rate.ggrMaximum !== null ? rate.ggrMaximum : '∞'}</td>
                              <td>{rate.rate}</td>
                              <td>
                                <Button
                                  variant="warning"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleEdit(index, setValues)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleDelete(index, setValues)}
                                >
                                  Delete
                                </Button>

                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>


          <div className="text-end mt-3">
            <div className="mt-4 d-flex justify-content-between align-items-center">
              <Button variant="warning" onClick={() => navigate(AdminRoutes.DashboardCasinoProviders, {
                state: { openMatrixOnce: true }
              })}>
                Cancel
              </Button>
              {rateList.length > 0 && (
                <Button
                  variant="success"
                  onClick={() => {

                    if (rateList.length === 0) return;

                    const firstNodeInvalid = rateList[0].ggrMinimum !== 0;
                    if (firstNodeInvalid) {
                      toast('First GGR minimum must start from 0.', 'error');
                      return;
                    }
                    const lastIndex = rateList.length - 1;
                    const lastNode = rateList[lastIndex];

                    const invalidNodeIndex = rateList.findIndex((node, idx) => {
                      return node.ggrMaximum === null && idx !== lastIndex;
                    });

                    if (rateList.length >= 1 && lastNode.ggrMaximum !== null) {
                      toast('Please add one more slab with GGR Maximum as null (infinite range).', 'error');
                      return;
                    }

                    if (invalidNodeIndex !== -1) {
                      toast('Only the last slab can have "infinite" GGR (i.e., ggrMaximum: null).', 'error');
                      return;
                    }

                    if (rateList.length === 1 && lastNode.ggrMaximum !== null) {
                      toast('If only one slab exists, it must end with an infinite GGR (ggrMaximum: null).', 'error');
                      return;
                    }
                    const payload = {
                      aggregatorId: matrixDetails?.aggregatorId || "",
                      providerId: matrixDetails?.providerId || "",
                      rateEntries: rateList,
                    };

                    handleCreateSubmit(payload);
                  }}
                >
                  Submit All Rates
                </Button>
              )}
            </div>
          </div>

        </Col>
      </Row>

      <Row className="ms-1 mt-1 fw-bold">
        <div style={{ marginTop: '10px', color: '#555', fontSize: '14px' }}>
          <strong>Note:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
            <li>The first rate <strong>must start at 0 GGR</strong> (e.g., 0 - 1000).</li>
            <li>The final rate <strong>must end at ∞ (infinity)</strong> (e.g., 5000 - ∞).</li>
            <li>Ensure the ranges are:
              <ul>
                <li>Continuous (no gaps),</li>
                <li>Non-overlapping,</li>
                <li>In increasing order based on GGR.</li>
              </ul>
            </li>
          </ul>
        </div>
      </Row>
    </div>
  );
};

export default CreateProviderRateMatrix;
