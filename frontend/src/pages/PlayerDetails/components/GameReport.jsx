// import React from 'react'
// import { Row, Col, Tabs, Tab, Form, Button, Spinner } from '@themesberg/react-bootstrap'

// import { DateRangePickerWithoutInput } from '../../../components/DateRangePicker'
// import useGameReport from '../hooks/useGameReport'
// import DateOptionsFilter from '../../../components/DateOptionsFilter'
// import GameReportTable from '../../../components/GameReportTable'
// import { downloadFile } from '../../../utils/fileDownloader'
// import { limitConstants } from '../../../components/DateOptionsFilter/dateConstants'

// const GameReport = () => {
//   const {
//     setState, state, selectedTab, setSelectedTab, gameReportPlayer,
//     setDateOptions,
//     dateOptions,
//     getCsvDownloadUrl,
//     limit,
//     loading,
//     setLimit
//   } = useGameReport()

//   return (
//     <>
//       <Row>
//         <Col />

//         <Col xs='auto'>
//           <div className='d-flex justify-content-end align-items-center mb-1'>
//             {dateOptions === 'custom' &&
//               <DateRangePickerWithoutInput
//                 state={state} setState={setState}
//               />}

//             <Form.Label style={{ width: '50px', marginLeft: '20px', marginTop: '5px' }}>
//               Limit
//             </Form.Label>

//             <Form.Select
//               onChange={(e) => setLimit(e.target.value)}
//               value={limit}
//               style={{ width: 'auto', marginRight: '10px' }}
//               size='sm'
//             >
//               {limitConstants.map(({ label, value }) =>
//                 <option value={value} key={value}>{label}</option>
//               )}
//             </Form.Select>

//             <Form.Label style={{ width: '100px', marginLeft: '20px', marginTop: '5px', marginRight: '10px' }}>
//               Date Options
//             </Form.Label>
//             <DateOptionsFilter dateOptions={dateOptions} setDateOptions={setDateOptions} />
//             <Button
//               variant='success'
//               size='sm'
//               style={{ width: '150px' }}
//               disabled={gameReportPlayer?.length < 1}
//               onClick={() => { downloadFile(getCsvDownloadUrl()) }}
//             >
//               Export Details
//             </Button>
//           </div>
//         </Col>

//       </Row>

//       <Tabs
//         activeKey={selectedTab}
//         onSelect={(tab) => setSelectedTab(tab)}
//         className='nav-light dashboard'
//       >
//         <Tab eventKey='game' title='GAME'>
//           <div className='mt-2'>
//             <Row className='mt-3 d-flex flex-row-reverse text-right'>
//               <GameReportTable loading={loading} tableData={gameReportPlayer || []} isPlayer />
//             </Row>
//           </div>
//         </Tab>

//         <Tab eventKey='provider' title='PROVIDER'>
//           <div className='mt-2'>
//             <Row className='mt-3 d-flex flex-row-reverse text-right'>
//               <GameReportTable loading={loading} tableData={gameReportPlayer || []} isPlayer />
              
//             </Row>
//           </div>
//         </Tab>
//       </Tabs>
//       <div style={{display: 'flex', marginTop: '7px', justifyContent: 'center'}}>
//       {loading && (
//         <Spinner
//           as='span'
//           animation='border'
//           size='sm'
//           role='status'
//           aria-hidden='true'
//         />
//       )}
//       </div>

//     </>

//   )
// }

// export default GameReport
