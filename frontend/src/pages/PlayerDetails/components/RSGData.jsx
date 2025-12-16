// import { Table } from "@themesberg/react-bootstrap";
// import React from "react";
// import {
//   PlayerLimitHeader,
//   RSGLimitType,
//   RSGStatus,
// } from "../constants";
// import PlayerTABSETable from "./PlayerTABSETable";
// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { InlineLoader } from "../../../components/Preloader";
// import { getPlayerResponsible } from "../../../utils/apiCalls";
// import { addHours, getDateTime } from "../../../utils/dateFormatter";

// const RSGData = () => {
//   const { userId } = useParams();

//   const { data, isFetching: loading } = useQuery({
//     queryKey: ["rsgList"],
//     queryFn: () => {
//       const params = {
//         userId,
//       };
//       return getPlayerResponsible(params);
//     },
//     refetchOnWindowFocus: false,
//     select: (res) => res?.data,
//   });

//   return (
//     <>
//       <div>
//         <h5>Player Purchase Limit History</h5>
//         <Table bordered striped responsive hover className='text-center'>
//           <thead className='thead-dark'>
//             <tr>
//               {PlayerLimitHeader?.map((h, idx) => (
//                 <th key={idx} className=''>
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {(!!data?.groupedData?.PURCHASE?.length &&
//               !loading) ?
//               data?.groupedData?.PURCHASE?.map(
//                 ({ limitType, amount, createdAt, updatedAt, status }, index) => {
//                   return (
//                     <tr key={index}>
//                       <td>{RSGLimitType?.[limitType]}</td>
//                       <td>{amount}</td>
//                       <td>-</td>
//                       <td>{getDateTime(createdAt)}</td>
//                       <td>
//                         {parseInt(status) === 2
//                           ? getDateTime(addHours(new Date(createdAt), 24))
//                           : getDateTime(updatedAt)}
//                       </td>
//                       <td>{getDateTime(updatedAt)}</td>
//                       <td>-</td>
//                       <td>{RSGStatus?.[status]}</td>
//                     </tr>
//                   );
//                 }
//               ):(
//               <tr>
//                 <td colSpan={9} className='text-danger text-center'>
//                   No Data Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//         {loading && <InlineLoader />}
//       </div>

//       <div className='mt-4'>
//         <h5>Player Bet Limit History</h5>
//         <PlayerTABSETable loading={loading} data={data?.groupedData?.BET} header={'BET'} />
//       </div>
//       <div className='mt-4'>
//         <h5>Player Take A Break History</h5>
//         <PlayerTABSETable loading={loading} data={data?.groupedData?.TIME_BREAK} header={'TIME_BREAK'} />
//       </div>
//       <div className='mt-4'>
//         <h5>Player Session History</h5>
//         <PlayerTABSETable loading={loading} data={data?.groupedData?.SESSION} header={'SESSION'} />
//       </div>
//       <div className='mt-4'>
//         <h5>Player Self Exclusion History</h5>
//         <PlayerTABSETable loading={loading} data={data?.groupedData?.SELF_EXCLUSION} header={'SELF_EXCLUSION'} />
//       </div>
//     </>
//   );
// };

// export default RSGData;


// not in use 