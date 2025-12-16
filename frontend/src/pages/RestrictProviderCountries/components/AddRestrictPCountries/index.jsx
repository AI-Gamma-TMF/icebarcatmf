// import React from 'react'
// import { Button, Row, Col, Form,Spinner } from '@themesberg/react-bootstrap'

// import CountriesList from '../CountriesList'
// import { useTranslation } from 'react-i18next'

// const AddRestrictPCountries = ({
//   unRestrictedCountries,
//   limit,
//   page,
//   setLimit,
//   setPage,
//   totalPages,
//   addCountries,
//   selectedCountries,
//   removeCountries,
//   addRestrictedCountries,loading
// }) => {
//   const { t } = useTranslation(['casino'])
//   return (
//     <>
//       <Row>
//         <Col xs={4}>
//           <Form.Label>
//             <h5>{t('restrictedCountries.addCountriesAppearHere')}</h5>
//           </Form.Label>
//         </Col>

//         <Col className='text-right'>
//           <Button
//             variant='success'
//             className='f-right'
//             disabled={selectedCountries.count === 0|| loading}
//             onClick={addRestrictedCountries}
//           >
//             {t('restrictedCountries.submitButton')}{loading && (
//               <Spinner
//                 as="span"
//                 animation="border"
//                 size="sm"
//                 role="status"
//                 aria-hidden="true"
//               />
//             )}
//           </Button>
//         </Col>
//       </Row>

//       <CountriesList
//         disablePagination
//         countries={selectedCountries}
//         hasActions
//         hasRemoveGamesAction
//         removeCountries={removeCountries}
//       />

//       <Row className='mt-3'>
//         <Col xs={4}>
//           <Form.Label>
//             <h5>{t('restrictedCountries.unRestrictedCountriesLabel')}</h5>
//           </Form.Label>
//         </Col>
//       </Row>

//       <CountriesList
//         limit={limit}
//         setLimit={setLimit}
//         page={page}
//         setPage={setPage}
//         countries={unRestrictedCountries}
//         totalPages={totalPages}
//         hasActions
//         hasAddGamesAction
//         addCountries={addCountries}
//       />
//     </>
//   )
// }

// export default AddRestrictPCountries

// not in use 