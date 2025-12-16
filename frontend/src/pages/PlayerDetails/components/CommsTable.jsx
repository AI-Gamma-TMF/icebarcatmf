// import { Table } from "@themesberg/react-bootstrap";
// import React, { useState } from "react";
// import { commsTableHeaders } from "../constants";
// import { InlineLoader } from "../../../components/Preloader";
// import PaginationComponent from "../../../components/Pagination";
// import { useQuery } from "@tanstack/react-query";
// import { getCommsLogs } from "../../../utils/apiCalls";
// import { useParams } from "react-router-dom";
// import { getDateTime } from "../../../utils/dateFormatter";

// const CommsTable = () => {
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(30);
//   const { userId } = useParams();

//   const { data, isLoading: loading } = useQuery({
//     queryKey: ["commsList", limit, page],
//     queryFn: ({ queryKey }) => {
//       const params = {
//         pageNo: queryKey[2],
//         limit: queryKey[1],
//         userId,
//       };
//       return getCommsLogs(params);
//     },
//     refetchOnWindowFocus: false,
//     select: (res) => res?.data?.emailCommsDetails,
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
//             {commsTableHeaders?.map((h, idx) => (
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
//                   emailLogId,
//                   email,
//                   emailTemplateId,
//                   emailTemplateName,
//                   messageId,
//                   source,
//                   updatedAt,
//                 },
//                 index
//               ) => {
//                 return (
//                   <tr key={index}>
//                     <td>{emailLogId}</td>
//                     <td>{getDateTime(updatedAt)}</td>
//                     <td>{email}</td>
//                     <td>{emailTemplateId}</td>
//                     <td>{emailTemplateName}</td>
//                     <td>{messageId}</td>
//                     <td>{source}</td>
//                     <td>NA</td>
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

// export default CommsTable;

// not in use 