// import React from "react";
// import { PlayerTABSEHeader, RSGLimitType, RSGStatus } from "../constants";
// import { Table } from "@themesberg/react-bootstrap";
// import { InlineLoader } from "../../../components/Preloader";
// import { getDateTime, addHours } from "../../../utils/dateFormatter";

// const PlayerTABSETable = ({ data, loading, header }) => {

//   const getTableData = () => {
//     return (
//       (data?.length) ? data?.map(
//         ({ createdAt, status, amount, updatedAt, limitType }, index) => {
//           return (
//             (header == 'TIME_BREAK' || header == 'SESSION') ?
//               (<tr key={index}>
//                 <td>{getDateTime(createdAt)}</td>
//                 <td>
//                   {parseInt(status) === 0
//                     ? getDateTime(updatedAt)
//                     : parseInt(status) === 1
//                       ? getDateTime(createdAt)
//                       : getDateTime(addHours(new Date(createdAt), 24))}
//                 </td>
//                 <td>{getDateTime(updatedAt)}</td>
//                 <td>-</td>
//                 <td>{RSGStatus?.[status]}</td>
//               </tr>)
//               :
//               (<tr key={index}>
//                 <td>{RSGLimitType?.[limitType]}</td>
//                 <td>{amount}</td>
//                 <td>-</td>
//                 <td>{getDateTime(createdAt)}</td>
//                 <td>
//                   {parseInt(status) === 0
//                     ? getDateTime(updatedAt)
//                     : parseInt(status) === 1
//                       ? getDateTime(createdAt)
//                       : getDateTime(addHours(new Date(createdAt), 24))}
//                 </td>
//                 <td>{getDateTime(updatedAt)}</td>
//                 <td>-</td>
//                 <td>{RSGStatus?.[status]}</td>
//               </tr>)
//           );
//         }
//       ) : (
//         <tr>
//           <td colSpan={9} className='text-danger text-center'>
//             No Data Found
//           </td>
//         </tr>
//       )
//     )
//   }

//   return (
//     <>
//       <Table bordered striped responsive hover className='text-center'>
//         <thead className='thead-dark'>
//           <tr>
//             {PlayerTABSEHeader?.[header]?.map((h, idx) => (
//               <th key={idx} className=''>
//                 {h}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {getTableData(data)}
//         </tbody>
//       </Table>
//       {loading && <InlineLoader />}
//     </>
//   );
// };

// export default PlayerTABSETable;

// not in use 