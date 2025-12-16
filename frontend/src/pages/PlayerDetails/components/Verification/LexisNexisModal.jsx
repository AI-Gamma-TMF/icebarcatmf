// import React from "react";
// import {
//     Row,
// } from "@themesberg/react-bootstrap";
// import ModalView from "../../../../components/Modal";

// const LexisNexisModal = ({ showModal, data , toggleModal, type}) => {

//     const displayInstantIDResponse = (instantIDResponse) => {
//         const response = instantIDResponse?.InstantIDResponseEx?.response;
      
//         return (
//           <div>
//             <h2>Response Data</h2>
      
//             <h6>Header</h6>
//             <p>Status: {response?.Header?.Status}</p>
//             <p>Query ID: {response?.Header?.QueryId}</p>
//             <p>Transaction ID: {response?.Header?.TransactionId}</p>
      
//             <h6>Result</h6>
//             <p>First Name: {response?.Result?.InputEcho?.Name?.First}</p>
//             <p>Last Name: {response?.Result?.InputEcho?.Name?.Last}</p>
//             <p>Street Address: {response?.Result?.InputEcho?.Address?.StreetAddress1}</p>
//             <p>City: {response?.Result?.InputEcho?.Address?.City}</p>
//             <p>State: {response?.Result?.InputEcho?.Address?.State}</p>
//             <p>Zip Code: {response?.Result?.InputEcho?.Address?.Zip5}</p>
//             <p>Date of Birth: {`${response?.Result?.InputEcho?.DOB?.Year}-${response?.Result?.InputEcho?.DOB?.Month}-${response?.Result?.InputEcho?.DOB?.Day}`}</p>
//             <p>Home Phone: {response?.Result?.InputEcho?.HomePhone}</p>
      
//             <p>Unique ID: {response?.Result?.UniqueId}</p>
//             <p>DOB Verified: {response?.Result?.DOBVerified?.toString()}</p>
//             <p>Name Address SSN Summary: {response?.Result?.NameAddressSSNSummary}</p>
      
//             <p>Comprehensive Verification Index: {response?.Result?.ComprehensiveVerification?.ComprehensiveVerificationIndex}</p>
      
//             <h6>Risk Indicators</h6>
//             {response?.Result?.ComprehensiveVerification?.RiskIndicators?.RiskIndicator?.map((risk, index) => (
//               <p key={index}>
//                 Risk Code: {risk?.RiskCode}, Description: {risk?.Description}, Sequence: {risk?.Sequence}
//               </p>
//             ))}
      
//             <h6>Potential Followup Actions</h6>
//             {response?.Result?.ComprehensiveVerification?.PotentialFollowupActions?.FollowupAction?.map((action, index) => (
//               <p key={index}>
//                 Risk Code: {action?.RiskCode}, Description: {action?.Description}
//               </p>
//             ))}
      
//             <h6>New Area Code</h6>
//             <p>Area Code: {response?.Result?.NewAreaCode?.AreaCode}</p>
//             <p>Effective Date: {`${response?.Result?.NewAreaCode?.EffectiveDate?.Year}-${response?.Result?.NewAreaCode?.EffectiveDate?.Month}-${response?.Result?.NewAreaCode?.EffectiveDate?.Day}`}</p>
      
//             <p>Additional Score 1: {response?.Result?.AdditionalScore1}</p>
//             <p>Additional Score 2: {response?.Result?.AdditionalScore2}</p>
//             <p>Passport Validated: {response?.Result?.PassportValidated?.toString()}</p>
      
//             <p>DOB Match Level: {response?.Result?.DOBMatchLevel}</p>
//             <p>SSN Found For LexID: {response?.Result?.SSNFoundForLexID?.toString()}</p>
//             <p>Address PO Box: {response?.Result?.AddressPOBox?.toString()}</p>
//             <p>Address CMRA: {response?.Result?.AddressCMRA?.toString()}</p>
//             <p>Instant ID Version: {response?.Result?.InstantIDVersion}</p>
//             <p>Emerging ID: {response?.Result?.EmergingId?.toString()}</p>
//             <p>Address Standardized: {response?.Result?.AddressStandardized?.toString()}</p>
      
//             <h6>Standardized Input Address</h6>
//             <p>Street Name: {response?.Result?.StandardizedInputAddress?.StreetName}</p>
//             <p>Street Address 1: {response?.Result?.StandardizedInputAddress?.StreetAddress1}</p>
//             <p>Street Address 2: {response?.Result?.StandardizedInputAddress?.StreetAddress2}</p>
//             <p>City: {response?.Result?.StandardizedInputAddress?.City}</p>
//             <p>State: {response?.Result?.StandardizedInputAddress?.State}</p>
//             <p>Zip5: {response?.Result?.StandardizedInputAddress?.Zip5}</p>
//             <p>County: {response?.Result?.StandardizedInputAddress?.County}</p>
//             <p>Latitude: {response?.Result?.StandardizedInputAddress?.Latitude}</p>
//             <p>Longitude: {response?.Result?.StandardizedInputAddress?.Longitude}</p>
      
//             <p>Address Secondary Range Mismatch: {response?.Result?.AddressSecondaryRangeMismatch}</p>
//             <p>Bureau Deleted: {response?.Result?.BureauDeleted?.toString()}</p>
//             <p>ITIN Expired: {response?.Result?.ITINExpired?.toString()}</p>
//             <p>Is Phone Current: {response?.Result?.IsPhoneCurrent?.toString()}</p>
//             <p>Phone Line Type: {response?.Result?.PhoneLineType}</p>
//             <p>Phone Line Description: {response?.Result?.PhoneLineDescription}</p>
//           </div>
//         );
//       };

//     const displayUserData = (userData) => {
//         return (
//             <div>
//                 <h2>Request Data</h2>
//                 <p>Reference Code: {userData?.InstantIDRequest?.User?.ReferenceCode}</p>
//                 <p>Query ID: {userData?.InstantIDRequest?.User?.QueryId}</p>
//                 <p>Global Purpose: {userData?.InstantIDRequest?.User?.GLBPurpose}</p>
//                 <p>Data License Purpose: {userData?.InstantIDRequest?.User?.DLPurpose}</p>

//                 <h6>End User Information</h6>
//                 <p>Street Address: {userData?.InstantIDRequest?.User?.EndUser?.StreetAddress1}</p>
//                 <p>City: {userData?.InstantIDRequest?.User?.EndUser?.City}</p>
//                 <p>State: {userData?.InstantIDRequest?.User?.EndUser?.State}</p>
//                 <p>Zip Code: {userData?.InstantIDRequest?.User?.EndUser?.Zip5}</p>
//                 <p>Phone: {userData?.InstantIDRequest?.User?.EndUser?.Phone}</p>

//                 <h6>Options</h6>
//                 <p>Name Input Order: {userData?.InstantIDRequest?.Options?.NameInputOrder}</p>
//                 <p>Include DOB: {userData?.InstantIDRequest?.Options?.CVICalculationOptions?.IncludeDOB?.toString()}</p>
//                 {/* Include other fields from the 'Options' section as needed */}

//                 <h6>Search By</h6>
//                 <p>First Name: {userData?.InstantIDRequest?.SearchBy?.Name?.First}</p>
//                 <p>Last Name: {userData?.InstantIDRequest?.SearchBy?.Name?.Last}</p>
//                 <p>Street Address: {userData?.InstantIDRequest?.SearchBy?.Address?.StreetAddress1}</p>
//                 <p>City: {userData?.InstantIDRequest?.SearchBy?.Address?.City}</p>
//                 <p>State: {userData?.InstantIDRequest?.SearchBy?.Address?.State}</p>
//                 <p>Zip Code: {userData?.InstantIDRequest?.SearchBy?.Address?.Zip5}</p>
//                 <p>Date of Birth: {`${userData?.InstantIDRequest?.SearchBy?.DOB?.Year}-${userData?.InstantIDRequest?.SearchBy?.DOB?.Month}-${userData?.InstantIDRequest?.SearchBy?.DOB?.Day}`}</p>
//                 <p>Home Phone: {userData?.InstantIDRequest?.SearchBy?.HomePhone}</p>
//             </div>
//         );
//     };

//     return (
//         <ModalView
//             openModal={showModal}
//             toggleModal={toggleModal}
//             size={'lg'}
//             hideHeader
//             center
//             className=''
//             hideFooter
//         >

//             <Row className='mt-3'>
//                 {type == 'request' ? displayUserData(data) : displayInstantIDResponse(data)}
//             </Row>
//         </ModalView>

//     );
// };

// export default LexisNexisModal;


// not in use 