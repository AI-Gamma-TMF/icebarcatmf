// import { Button, Modal, Row, Col, Table } from '@themesberg/react-bootstrap'
// import React from 'react'
// import useInfoModals from './useInfoModals'
// import './style.scss'
// import { Button, Modal, Row, Col, Table } from '@themesberg/react-bootstrap'
// import React from 'react'
// import useInfoModals from './useInfoModals'
// import './style.scss'

// export const BonusInfoModal = ({
//   bonusData,
//   show,
//   setShow,
//   currencyCode
// }) => {
//   const {
//     bonusDetail,
//     keys
//   } = useInfoModals({ bonusId: bonusData?.bonus?.bonusId, currencyCode })

//   return (
//     <Modal show={show} onHide={() => setShow(false)}>
//       <Modal.Header closeButton>
//         <Modal.Title>Title: {bonusData?.bonus?.promotionTitle?.EN} (Bonus Id: {bonusData?.bonus?.bonusId})</Modal.Title>
//       </Modal.Header>

//       <Modal.Body className='infoModalLabels'>
//         {bonusData?.bonusType !== 'freespins'
//           ? keys?.map(({ label, value }) => {
//             return (
//               <Row key={label}>
//                 <Col xs={7}><h6>{label}</h6></Col>
//                 <Col><span>{value}</span></Col>
//               </Row>
//             )
//           })
//           : <>
//             <Row>
//               <Col xs={7}><h6>Bet Level</h6></Col>
//               <Col><span>{bonusData?.betLevel}</span></Col>
//             </Row>
//             <Row>
//               <Col xs={7}><h6>Free Spins</h6></Col>
//               <Col><span>{bonusData?.betLevel}</span></Col>
//             </Row>
//             {bonusDetail?.isSticky &&
//               <>
//                 <Row>
//                   <Col xs={7}><h6>Wagering Multiplier</h6></Col>
//                   <Col><span>{bonusDetail?.wageringMultiplier}</span></Col>
//                 </Row>
//               </>}
//             <div>
//               <Table bordered striped hover size='sm' className='text-center mt-2'>
//                 <thead className='thead-dark'>
//                   <tr><th>Games</th></tr>
//                 </thead>
//                 <tbody>
//                   {bonusDetail?.games?.map(({ name,i }) => {
//                     return (
//                       <tr key={"bonus"+i}>
//                         <td>{name}</td>
//                       </tr>
//                     )
//                   })}
//                 </tbody>
//               </Table>
//             </div>

//           </>}
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant='warning' onClick={() => setShow(false)}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   )
// }

// not in use