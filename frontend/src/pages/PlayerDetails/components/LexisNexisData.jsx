// import { Button, Table } from "@themesberg/react-bootstrap";
// import React, { useState } from "react";
// import Trigger from "../../../components/OverlayTrigger";
// import { getDateTime } from "../../../utils/dateFormatter";
// import CopyToClipboard from "react-copy-to-clipboard";
// import { toast } from "react-hot-toast";
// import { useTranslation } from "react-i18next";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCopy } from "@fortawesome/free-regular-svg-icons";
// import LexisNexisModal from "./Verification/LexisNexisModal";

// const LexisNexisData = ({ LNData }) => {
//   const { t } = useTranslation();
//   const [showModal, setShowModal] = useState(false);
//   const [data, setData] = useState(null)
//   const [type, setType] = useState('')

//   const handleClose = () => setShowModal(false);
//   const toggleModal = () => {
//     setShowModal(!showModal);
//   };

//   const handleView = (type, data) => {
//     setShowModal(true);
//     setData(data)
//     setType(type)
//   }

//   // const a = "{\"InstantIDRequest\":{\"User\":{\"GLBPurpose\":\"5\",\"DLPurpose\":\"3\",\"ReferenceCode\":\"VERIFICATION\",\"QueryId\":\"3956\"},\"Options\":{\"WatchLists\":{\"WatchList\":[\"ALL\"]},\"IncludeModels\":{\"FraudPointModel\":{\"IncludeRiskIndices\":true}},\"DOBMatch\":{\"MatchType\":\"FuzzyCCYYMMDD\"},\"NameInputOrder\":\"Unknown\"},\"SearchBy\":{\"Name\":{\"First\":\"PETER\",\"Last\":\"PAVYEL\"},\"Address\":{\"StreetAddress1\":\"10201 E EMILY DR\",\"City\":\"NEW YORK\",\"State\":\"AK\",\"Zip5\":\"85730\"},\"DOB\":{\"Year\":1991,\"Month\":5,\"Day\":12},\"HomePhone\":null}}}"


//   return (
//     <>
//       {showModal && <LexisNexisModal
//         handleClose={handleClose}
//         showModal={showModal}
//         data={data}
//         type={type}
//         toggleModal={toggleModal}
//       />}
//       <Table bordered striped responsive hover size='sm' className='text-center'>
//         <thead className='thead-dark'>
//           <tr>
//             <th>Communication Type</th>
//             <th>Code</th>
//             <th className='d-flex align-items-center justify-content-center'>
//               Request Data&nbsp;
//               <Trigger
//                 message='Copy Data'
//                 id={JSON.stringify(LNData?.requestData) || "NA"}
//               />
//               <CopyToClipboard
//                 text={JSON.stringify(LNData?.requestData) || "NA"}
//                 onCopy={() => {
//                   toast(t("confirmationModal.copiedToClipboardToast"), "success");
//                 }}
//               >
//                 <Button
//                   id={JSON.stringify(LNData?.requestData) || "NA"}
//                   className='d-flex align-items-center'
//                   variant='primary'
//                   size='sm'
//                 >
//                   <FontAwesomeIcon icon={faCopy} />
//                 </Button>
//               </CopyToClipboard>
//             </th>
//             <th>Transaction ID</th>
//             <th>Request Time</th>
//             <th className='d-flex align-items-center justify-content-center'>
//               Response Data&nbsp;
//               <Trigger
//                 message='Copy Data'
//                 id={JSON.stringify(LNData?.responseData) || "NA"}
//               />
//               <CopyToClipboard
//                 text={JSON.stringify(LNData?.responseData) || "NA"}
//                 onCopy={() => {
//                   toast(t("confirmationModal.copiedToClipboardToast"), "success");
//                 }}
//               >
//                 <Button
//                   id={JSON.stringify(LNData?.responseData) || "NA"}
//                   className='d-flex align-items-center'
//                   variant='primary'
//                   size='sm'
//                 >
//                   <FontAwesomeIcon icon={faCopy} />
//                 </Button>
//               </CopyToClipboard>
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           <tr>
//             <td>{LNData?.communicationType || "NA"}</td>
//             <td>{LNData?.errorCode || "NA"}</td>
//             {LNData?.requestData ?
//               <td className='text-link'
//                 style={{ cursor: "pointer" }} onClick={() => handleView('request', JSON.parse(LNData?.requestData))}>View Data</td>
//                :
//               <td> NA</td>
//             } 
           
//             <td>{LNData?.transactionId || "NA"}</td>
//             <td>
//               {LNData?.requestTime ? getDateTime(LNData?.requestTime) : "NA"}
//             </td>
//             {LNData?.responseData ?
//               <td className='text-link'
//                 style={{ cursor: "pointer" }}
//                 onClick={() => handleView('response', JSON.parse(LNData?.responseData))}>View Data</td>
//               :
//               <td> NA </td>
//             }
//           </tr>
//         </tbody>
//       </Table>
//     </>
//   );
// };

// export default LexisNexisData;

// not in use 