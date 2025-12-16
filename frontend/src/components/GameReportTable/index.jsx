// import React from 'react'
// import { Table } from '@themesberg/react-bootstrap'
// // import { getPercentageColor, getTextColor } from '../../utils/dashboardEffects'
// const GameReportTable = ({ tableData, isPlayer, loading }) => {
//   return (
//     <div style={{ overflow: 'auto', maxHeight: '385px' }}>
//       <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
//         <thead className='thead-dark'>
//           <tr>
//             {isPlayer
//               ? ['ID',
//                   'Name',
//                   'Number of Rounds',
//                   'Total Bets',
//                   'Total Wins',
//                   'Game Revenue',
//                   'Payout'
//                 ].map((h) => (
//                   <th key={h}>{h}</th>
//                 ))
//               : [
//                   'ID',
//                   'Name',
//                   'Number of Rounds',
//                   'Number of Player',
//                   'Total Bets',
//                   'Total Wins',
//                   'Game Revenue',
//                   'Payout'
//                 ].map((h) => (
//                   <th key={h}>{h}</th>
//                 ))}
//           </tr>
//         </thead>

//         {!loading && <tbody>
//           {tableData && tableData.length > 0
//             ? tableData.map(({ id, name, roundCount, playerCount, totalBet, totalWin, GGR, payout }, _idx) => {
//               return (
//                 <tr key={`top-loosers ${id}`}>
//                   <td>{id}</td>
//                   <td style={{ textAlign: 'start' }}>
//                     {name}
//                   </td>
//                   <td>{roundCount || '0'}</td>
//                   {!isPlayer && <td>{playerCount || '0'}</td>}
//                   <td style={{ color: 'green' }}>€ {totalBet || '0'}</td>
//                   <td style={{ color: 'red' }}>€ {totalWin || '0'}</td>
//                   <td>€ {GGR || '0'}</td>
//                   <td>{payout || '0'}</td>
//                 </tr>
//               )
//             })
//             : (
//               <tr>
//                 <td colSpan={7} className='text-danger text-center'>
//                   No data found
//                 </td>
//               </tr>
//               )}
//         </tbody>}
//       </Table>
//     </div>
//   )
// }

// export default GameReportTable

// not in use 