// import { Table } from "@themesberg/react-bootstrap";
// import React, { useState } from "react";
// import { auditTableHeaders } from "../constants";
// import { getDateTime } from "../../../utils/dateFormatter";
// import { InlineLoader } from "../../../components/Preloader";
// import PaginationComponent from "../../../components/Pagination";
// import { useQuery } from "@tanstack/react-query";
// import { getAuditLogs } from "../../../utils/apiCalls";
// import { useParams } from "react-router-dom";
// import Trigger from "../../../components/OverlayTrigger";

// const AuditTable = () => {
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(30);
//   const { userId } = useParams();

//   const { data, isLoading: loading } = useQuery({
//     queryKey: ["auditList", limit, page],
//     queryFn: ({ queryKey }) => {
//       const params = {
//         pageNo: queryKey[2],
//         limit: queryKey[1],
//         userId,
//         actioneeType: "all",
//       };
//       return getAuditLogs(params);
//     },
//     refetchOnWindowFocus: false,
//     select: (res) => res?.data?.activityLogs,
//   });

//   const totalPages = Math.ceil(data?.count / limit);

//   return (
//     <>
//       <Table
//         bordered
//         striped
//         responsive
//         hover
//         size='sm'
//         className='text-center'
//       >
//         <thead className='thead-dark'>
//           <tr>
//             {auditTableHeaders?.map((h, idx) => (
//               <th key={idx} className=''>
//                 {h}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {data &&
//             data?.rows?.map(
//               (
//                 {
//                   fieldChanged,
//                   originalValue,
//                   changedValue,
//                   remark,
//                   updatedAt,
//                   actioneeType,
//                   admin,
//                 },
//                 index
//               ) => {
//                 return (
//                   <tr key={index}>
//                     <td>
//                       {actioneeType === "admin" ? admin?.adminUsername || "NA" : "NA"}
//                     </td>
//                     <td>{fieldChanged || '-'}</td>
//                     <td>{originalValue || '-'}</td>
//                     <td>{changedValue || '-'}</td>
//                     <td>
//                       {actioneeType ? (
//                         actioneeType === 'admin' ? 'Back Office Audit' : (actioneeType === 'user' ? 'Player Website Audit' : 'NA')
//                       ) : 'NA'}
//                     </td>                   
//                      <td>{getDateTime(updatedAt)}</td>
//                     <td>
//                       <Trigger message={remark || "NA"} id='remark' />
//                       <span
//                         id='remark'
//                         style={{
//                           width: "200px",
//                           cursor: "pointer",
//                         }}
//                         className='d-inline-block text-truncate'
//                       >
//                         {remark || "NA"}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               }
//             )}

//           {data?.count === 0 && (
//             <tr>
//               <td colSpan={9} className='text-danger text-center'>
//                 No Data Found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>
//       {loading && <InlineLoader />}
//       {data?.count !== 0 && (
//         <PaginationComponent
//           page={data?.count < page ? setPage(1) : page}
//           totalPages={totalPages}
//           setPage={setPage}
//           limit={limit}
//           setLimit={setLimit}
//         />
//       )}
//     </>
//   );
// };

// export default AuditTable;

// not in use 