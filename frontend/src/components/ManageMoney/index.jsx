// import { Button, Form, FormCheck, InputGroup, Modal, Table } from '@themesberg/react-bootstrap'
// import { ErrorMessage, Formik } from 'formik'
// import React from 'react'
// import useManageMoney from './hooks/useManageMoney'
// import { depositSchema } from './schemas'

// const ManageMoney = ({
//   show,
//   handleClose,
//   user,
//   getUserDetails
// }) => {
//   const {
//     deposit
//   } = useManageMoney({getUserDetails})

//   return (
//     <>
//       <Formik
//         initialValues={{
//           addAmount: '',
//           transactionType: '',
//           walletType: ''
//         }}
//         validationSchema={depositSchema}
//         onSubmit={(formValues, { resetForm }) => {
//           deposit(formValues)
//           handleClose()
//           resetForm({ formValues: '' })
//         }}
//       >
//         {({ values, touched, errors, handleChange, handleBlur, handleSubmit }) => (
//           <Form>
//             <Modal
//               show={show}
//               onHide={handleClose}
//               backdrop='static'
//               keyboard={false}
//             >
//               <Modal.Header closeButton>
//                 <Modal.Title>Manage Wallet</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 <Table>
//                   <tbody>
//                     <tr>
//                       <td>
//                         <h6>Transaction Type</h6>
//                         <ErrorMessage
//                           component='div'
//                           name='transactionType'
//                           className='text-danger'
//                         />
//                       </td>
//                       <td>
//                         <FormCheck.Input
//                           type='radio'
//                           id='add-money'
//                           name='transactionType'
//                           label='Add Money'
//                           aria-label='Add Money'
//                           value='add-money'
//                           style={{ marginRight: '10px' }}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                         />
//                         <FormCheck.Label htmlFor='add-money'>Add Money</FormCheck.Label>
//                       </td>
//                       <td>
//                         <FormCheck.Input
//                           type='radio'
//                           id='remove-money'
//                           name='transactionType'
//                           label='Remove Money'
//                           aria-label='Remove Money'
//                           value='remove-money'
//                           style={{ marginRight: '10px' }}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                         />
//                         <FormCheck.Label htmlFor='remove-money'>Remove Money</FormCheck.Label>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <h6>Wallet Type</h6>
//                         <ErrorMessage
//                           component='div'
//                           name='walletType'
//                           className='text-danger'
//                         />
//                       </td>
//                       <td>
//                         <FormCheck.Input
//                           type='radio'
//                           id='cash'
//                           name='walletType'
//                           aria-label='Cash Wallet'
//                           value='cash'
//                           style={{ marginRight: '10px' }}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                         />
//                         <FormCheck.Label htmlFor='cash'>SC</FormCheck.Label>
//                       </td>
//                       <td>
//                         <FormCheck.Input
//                           type='radio'
//                           id='non-cash'
//                           name='walletType'
//                           aria-label='Non-Cash Wallet'
//                           value='non-cash'
//                           style={{ marginRight: '10px' }}
//                           onChange={handleChange}
//                           onBlur={handleBlur}
//                         />
//                         <FormCheck.Label htmlFor='non-cash'>GC</FormCheck.Label>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </Table>

//                 <div className='form-group'>
//                   <label
//                     htmlFor='addAmount'
//                     className={touched.addAmount && errors.addAmount ? 'text-danger' : ''}
//                   >
//                     Coins
//                   </label>

//                   <InputGroup
//                     className={touched.addAmount && errors.addAmount
//                       ? 'border border-danger'
//                       : ''}
//                   >
//                     <InputGroup.Text>
//                       {user?.currencyCode}
//                     </InputGroup.Text>

//                     <Form.Control
//                       name='addAmount'
//                       type='number'
//                       step='.01'
//                       placeholder='Enter the coins'
//                       value={values.addAmount}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                     />
//                   </InputGroup>

//                   <ErrorMessage
//                     component='div'
//                     name='addAmount'
//                     className='text-danger'
//                   />
//                 </div>
//               </Modal.Body>
//               <div className='mt-4 '>
//                 <Modal.Footer className='d-flex justify-content-between align-items-center'>
//                   <Button
//                     variant='warning'
//                     onClick={() => handleClose(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     variant='success'
//                     onClick={handleSubmit}
//                     className='ml-2'
//                   >
//                     Submit
//                   </Button>
//                 </Modal.Footer>
//               </div>
//             </Modal>
//           </Form>
//         )}
//       </Formik>
//     </>
//   )
// }

// export default ManageMoney

// not in use 