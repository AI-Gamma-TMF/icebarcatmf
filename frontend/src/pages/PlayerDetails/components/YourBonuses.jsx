// import { faInfo, faWindowClose } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { Button, ButtonGroup, Col, Form, Row, Table } from '@themesberg/react-bootstrap'
// import React from 'react'
// import { BonusInfoModal } from '../../../components/InfoModals'
// import Trigger from '../../../components/OverlayTrigger'
// import PaginationComponent from '../../../components/Pagination'
// import Preloader from '../../../components/Preloader'
// import useCheckPermission from '../../../utils/checkPermission'
// import { formatDate } from '../../../utils/dateFormatter'
// import { bonusStatus, bonusTypes, tableHeaders } from '../constants'
// import useYourBonuses from '../hooks/useYourBonuses'
// import { faInfo, faWindowClose } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { Button, ButtonGroup, Col, Form, Row, Table } from '@themesberg/react-bootstrap'
// import React from 'react'
// import { BonusInfoModal } from '../../../components/InfoModals'
// import Trigger from '../../../components/OverlayTrigger'
// import PaginationComponent from '../../../components/Pagination'
// import Preloader from '../../../components/Preloader'
// import useCheckPermission from '../../../utils/checkPermission'
// import { formatDate } from '../../../utils/dateFormatter'
// import { bonusStatus, bonusTypes, tableHeaders } from '../constants'
// import useYourBonuses from '../hooks/useYourBonuses'

// const YourBonuses = ({
//   currencyCode
// }) => {
//   const {
//     loading,
//     userBonus,
//     limit,
//     page,
//     totalPages,
//     status,
//     bonusType,
//     cancelBonusHandler,
//     setBonusType,
//     setStatus,
//     setLimit,
//     setPage,
//     infoModal,
//     setInfoModal,
//     bonusData,
//     setBonusData
//   } = useYourBonuses()

//   const { isHidden } = useCheckPermission()

//   return (
//     <>

//       {loading && <Preloader />}

//       <Row>
//         <Col className='d-flex' xs='auto'>
//           <Form.Label column='sm' style={{ marginRight: '15px', minWidth: 'fit-content' }}>
//             Bonus Type
//           </Form.Label>
//           <Form.Select
//             name='bonusType'
//             size='sm'
//             value={bonusType}
//             onChange={(e) => setBonusType(e.target.value)}
//             style={{ maxWidth: '230px' }}
//           >
//             {bonusTypes.map((item) => {
//               return (
//                 item.value !== 'cashfreespins' &&
//                   <option key={`bonusType ${item.value}`} value={item.value}>
//                     {item?.label}
//                   </option>
//               )
//             })}
//           </Form.Select>

//           <Form.Label column='sm' style={{ margin: '0 15px', minWidth: 'fit-content' }}>
//             Status
//           </Form.Label>
//           <Form.Select
//             name='isActive'
//             size='sm'
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             style={{ maxWidth: '230px' }}
//           >
//             {bonusStatus?.map(({ label, value }, i) => {
//               return (
//                 <option value={value} key={`player-your-bonuses-status-filter ${i}`}>
//                   {label}
//                 </option>
//               )
//             })}
//           </Form.Select>
//         </Col>
//       </Row>

//       <Table bordered striped responsive hover size='sm' className='text-center mt-4'>

//         <thead className='thead-dark'>
//           <tr>
//             {tableHeaders.map((h, idx) => (
//               <th
//                 key={`player-your-bonuses-heading ${idx}`}
//               >
//                 {h.label}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {userBonus?.rows?.map((item, i) => {
//             return (
//               <tr key={`player-your-bonuses-row ${i}`}>
//                 <td>{item?.userBonusId}</td>
//                 <td>{item?.bonus?.promotionTitle?.EN}</td>
//                 <td>{item?.bonusType}</td>
//                 <td>{formatDate(item?.expireAt)}</td>
//                 <td>{formatDate(item?.expireAt) > formatDate(new Date()) ? 'Yes' : 'No'}</td>
//                 <td>{item?.status}</td>
//                 <td>{item?.cancelledBy || '-'}</td>
//                 <td>{item?.updatedAt ? formatDate(item?.updatedAt) : '-'}</td>
//                 <td>
//                   <ButtonGroup>
//                     {!isHidden({ module: { key: 'Bonus', value: 'Issue' } }) &&
//                       <><Trigger message='Cancel Bonus' id={i+'bonus'} />
//                         <Button
//                         id={i+'bonus'}
//                           className='m-1'
//                           size='sm'
//                           variant='danger'
//                           disabled={!(item?.status === 'CLAIMING' || item?.status === 'PENDING' || item?.status === 'IN-PROCESS')}
//                           onClick={() => cancelBonusHandler(item?.userBonusId)}
//                         >
//                           <FontAwesomeIcon icon={faWindowClose} />
//                         </Button></>
//                       }
//                     <Trigger message='More Info' id={i+'info'} />
//                       <Button
//                       id={i+'info'}
//                         className='m-1'
//                         size='sm'
//                         variant='warning'
//                         onClick={() => {
//                           setBonusData(item)
//                           setInfoModal(true)
//                         }}
//                       >
//                         <FontAwesomeIcon icon={faInfo} />
//                       </Button>
//                   </ButtonGroup>
//                 </td>
//               </tr>
//             )
//           })}

//           {userBonus?.count === 0 && (
//             <tr>
//               <td colSpan={9} className='text-danger text-center'>
//                 No data found
//               </td>
//             </tr>
//           )}

//         </tbody>
//       </Table>

//       {userBonus?.count > 0 && (
//         <PaginationComponent
//           page={userBonus?.count < page ? setPage(1) : page}
//           totalPages={totalPages}
//           setPage={setPage}
//           limit={limit}
//           setLimit={setLimit}
//         />
//       )}

//       {infoModal &&
//         <BonusInfoModal
//           show={infoModal}
//           setShow={setInfoModal}
//           bonusData={bonusData}
//           currencyCode={currencyCode}
//         />}
//     </>
//   )
// }

// export default YourBonuses

// not in use

