// import React from "react";
// import { Formik, Form, ErrorMessage } from "formik";
// import { Col, Row, Form as BForm, Button, Spinner } from "@themesberg/react-bootstrap";
// import { useNavigate, useParams } from "react-router-dom";
// import { AdminRoutes } from "../../../routes.js";
// import { redeemRules } from "../constants.js";
// import { editRulesSchema } from "../schemas.js";
// import useEditRedeemRules from "../hooks/useEditRedeemRules.js";

// const EditRedeemRules = () => {
//   const navigate = useNavigate();
//   const { ruleId } = useParams();
//   const { redeemRuleDetail, handleEditPromotionBonusSubmit, updateLoading } = useEditRedeemRules(ruleId);

//   // console.log("0000",ruleId,redeemRuleDetail); 

//   return (
//     <div>
//       <Row>
//         <Col sm={8}>
//           <h3>Edit Redeem Rules</h3>
//         </Col>
//       </Row>

//       <Formik
//         enable
//         enableReinitialize
//         initialValues={{
//           isActive: redeemRuleDetail?.isActive || false,
//           ruleName: redeemRuleDetail?.ruleName || '',
//           ruleDescription: redeemRuleDetail?.ruleDescription || '',
//           comparisionOperator: redeemRuleDetail?.comparisionOperator || '',
//           value: redeemRuleDetail?.value || '',
//           conditionalOperator: redeemRuleDetail?.conditionalOperator || '',
//         }}
//         validationSchema={editRulesSchema}
//         onSubmit={handleEditPromotionBonusSubmit}
//       >
//         {({
//           values,
//           handleChange,
//           handleSubmit,
//           handleBlur,
//           setFieldValue,
//         }) => (
//           <Form>
//             <Row>
//               <Col>
//                 <BForm.Label>Select Rules
//                   <span className="text-danger"> *</span>
//                 </BForm.Label>
//                 <BForm.Select
//                   as="select"
//                   name="ruleName"
//                   value={values.ruleName}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   disabled
//                 >
//                   <option value="">Select Rules</option>
//                   {redeemRules.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}

//                 </BForm.Select>
//                 <ErrorMessage component="div" name="ruleName" className="text-danger" />
//               </Col>
//               <Col>
//                 <BForm.Label>Value
//                   <span className="text-danger"> *</span>
//                 </BForm.Label>
//                 <BForm.Control
//                   type="number"
//                   onKeyDown={(evt) =>
//                     ["e", "E", "+", '.', '-'].includes(evt.key) && evt.preventDefault()
//                   }
//                   name="value"
//                   value={values.value}
//                   onChange={handleChange}
//                   placeholder="Enter Filter Value"
//                   onBlur={handleBlur}
//                 // disabled={isEdit}
//                 />
//                 <ErrorMessage component="div" name="value" className="text-danger" />
//               </Col>
//               <Col>
//                 <BForm.Label>Comparison Operator
//                   <span className="text-danger"> *</span>
//                 </BForm.Label>
//                 <BForm.Select
//                   as="select"
//                   name="comparisionOperator"
//                   value={values.comparisionOperator}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 >
//                   <option value="">Select Comparison Operator</option>
//                   <option value="=">=</option>
//                   <option value=">">&gt;</option>
//                   <option value="<">&lt;</option>
//                   <option value=">=">&gt;=</option>
//                   <option value="<=">&lt;=</option>
//                 </BForm.Select>
//                 <ErrorMessage component="div" name="comparisionOperator" className="text-danger" />
//               </Col>
//             </Row>
//             <Row className="mt-3">
//               <Col md={2}>
//                 <BForm.Label>Active</BForm.Label>
//                 <BForm.Check
//                   type="switch"
//                   name="isActive"
//                   checked={values.isActive}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 />
//               </Col>
//               <Col>
//                 <BForm.Label>Conditional Operator
//                   <span className="text-danger"> *</span>
//                 </BForm.Label>
//                 <BForm.Select
//                   as="select"
//                   name="conditionalOperator"
//                   value={values.conditionalOperator}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 >
//                   <option value="">Select Conditional Operator</option>
//                   <option value="OR">OR</option>
//                   <option value="AND">AND</option>

//                 </BForm.Select>
//                 <ErrorMessage component="div" name="conditionalOperator" className="text-danger" />
//               </Col>
//               <Col>
//                 <BForm.Label>Rule Description
//                   <span className="text-danger"> *</span>
//                 </BForm.Label>
//                 <BForm.Control
//                   type="text"
//                   name="ruleDescription"
//                   placeholder="Enter ruleDescription"
//                   value={values.ruleDescription}
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                 />
//                 <ErrorMessage
//                   component="div"
//                   name="ruleDescription"
//                   className="text-danger"
//                 />
//               </Col>
//             </Row>
//             <div className="mt-4 d-flex justify-content-between align-items-center">
//               <Button
//                 variant="warning"
//                 onClick={() => navigate(AdminRoutes.RedeemReqRuleConfig)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="success"
//                 onClick={handleSubmit}
//                 disabled={updateLoading}
//               >
//                 Submit
//                 {updateLoading && (
//                   <Spinner
//                     as="span"
//                     animation="border"
//                     size="sm"
//                     role="status"
//                     aria-hidden="true"
//                   />
//                 )}
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default EditRedeemRules;

// not in use
