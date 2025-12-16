// import { Table } from '@themesberg/react-bootstrap'
// import React from 'react'
// import { formatDate } from '../../../utils/dateFormatter'

// const UserWallet = ({ myUserData, t }) => {
//   return (
//     <>
//       {/* Table with UserWallet info */}
//       <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
//         <tbody>
//           <tr key={`walletId-${myUserData?.userWallet?.walletId}`}>
//             <td>{t('playerDetails.wallet.walletId')}</td>
//             <td>{myUserData?.userWallet?.walletId}</td>
//           </tr>
//           {/* <tr key={`owner-${myUserData?.userWallet?.ownerId}`}>
//             <td>Owner ID</td>
//             <td>{myUserData?.userWallet?.ownerId}</td>
//           </tr>
//           <tr key={`ownerType-${myUserData?.userWallet?.ownerType}`}>
//             <td>User Type</td>
//             <td>{myUserData?.userWallet?.ownerType}</td>
//           </tr> */}
//           <tr key={`currencyCode-${myUserData?.userWallet?.currencyCode}`}>
//             <td>{t('playerDetails.wallet.currencyCode')}</td>
//             <td>{myUserData?.userWallet?.currencyCode}</td>
//           </tr>
//           <tr key={`nonCashAmount-${myUserData?.userWallet?.gcCoin}`}>
//             <td>{t('playerDetails.wallet.gc')}</td>
//             <td>{myUserData?.userWallet?.gcCoin}</td>
//           </tr>
//           <tr key={`amount-${myUserData?.userWallet?.scCoin}`}>
//             <td>{t('playerDetails.wallet.psc')}</td>
//             <td>{myUserData?.userWallet?.scCoin.psc}</td>
//           </tr>
//           <tr key={`amount-${myUserData?.userWallet?.scCoin}`}>
//             <td>{t('playerDetails.wallet.bsc')}</td>
//             <td>{myUserData?.userWallet?.scCoin.bsc}</td>
//           </tr>
//           <tr key={`amount-${myUserData?.userWallet?.scCoin}`}>
//             <td>{t('playerDetails.wallet.wsc')}</td>
//             <td>{myUserData?.userWallet?.scCoin.wsc}</td>
//           </tr>
//           <tr key={`amount-${myUserData?.userWallet?.scCoin}`}>
//             <td>{t('playerDetails.wallet.totalSc')}</td>
//             <td>{myUserData?.userWallet?.totalScCoin}</td>
//           </tr>
//           <tr key={`createdAt-${myUserData?.userWallet?.createdAt}`}>
//             <td>{t('playerDetails.wallet.createdAt')}</td>
//             <td>
//               {myUserData?.userWallet?.createdAt &&
//                     formatDate(myUserData?.userWallet?.createdAt)}
//             </td>
//           </tr>
//           <tr key={`updatedAt-${myUserData?.userWallet?.updatedAt}`}>
//             <td>{t('playerDetails.wallet.updatedAt')}</td>
//             <td>
//               {myUserData?.userWallet?.updatedAt &&
//                     formatDate(myUserData?.userWallet?.updatedAt)}
//             </td>
//           </tr>
//         </tbody>
//       </Table>
//     </>
//   )
// }

// export default UserWallet

// not in use 