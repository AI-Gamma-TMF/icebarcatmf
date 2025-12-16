// import React from "react";
// import { Row, Col, Card, Form as BForm } from "@themesberg/react-bootstrap";
// import { useTranslation } from 'react-i18next'
// import './lexisnesixverification.scss'

// const LexisNexisverification = ({ basicInfo, handleCheckboxChange, lexinexisChecked }) => {
//   const { t } = useTranslation('verification')

//   return (
//     <>
//       <Row className='my-5 w-100 m-auto'>
//         <Row className='w-100 m-auto p-0'>
//           <Col className='d-flex'>
//             <h5>{t("lexisnexis.title")}&nbsp;</h5>
//             <BForm.Check
//               type='checkbox'
//               name='lexisnexis'
//               onChange={() => handleCheckboxChange('lexisnexis')}
//               checked={lexinexisChecked}
//             />
//           </Col>
//         </Row>
//         <Row className='w-100 m-auto p-0'>

//           <Col className='col-padding custom-col col-md-6 col-12 mb-3'>
//             <Card className='card-overview'>
//               <div className='div-overview'>
//                 <div className="input-range-line">
//                   <span className="input-range-bg"></span>
//                 </div>
//                 <div className="input-range-box">

//                   <span className="input-range input-range-one">
//                     <span className="input-range-number">0</span>
//                   </span>
//                   <span className="input-range">
//                     <span className="input-range-number">10</span>
//                   </span>
//                   <span className="input-range">
//                     <span className="input-range-number">20</span>
//                   </span>
//                   <span className="input-range">
//                     <span className="input-range-number">30</span>
//                   </span>
//                   <span className="input-range">
//                     <span className="input-range-number">40</span>
//                   </span>
//                   <span className="input-range input-range-last">
//                     <span className="input-range-number">50</span>
//                   </span>
//                 </div>
//                 <div className="input-range-selector">
//                   <input
//                     type="range"
//                     min='0'
//                     max='100'
//                     className='slider-range'
//                     value={basicInfo?.moreDetails?.lexisNexisComprehensiveVerificationIndex ? (basicInfo?.moreDetails?.lexisNexisComprehensiveVerificationIndex)*2 : 0}
//                   />
//                 </div>
//               </div>
//             </Card>
//           </Col>
//           <Col className='col-padding col-md-6 col-12'>
//             <Card className='card-overview'>
//               <div className='div-overview'>
//                 {basicInfo?.moreDetails?.lexisnexisReason ? basicInfo?.moreDetails?.lexisnexisReason : 'No Message Available'}
//               </div>
//             </Card>
//           </Col>
//         </Row>
//       </Row>
//     </>

//   );
// };

// export default LexisNexisverification;

// not in use 