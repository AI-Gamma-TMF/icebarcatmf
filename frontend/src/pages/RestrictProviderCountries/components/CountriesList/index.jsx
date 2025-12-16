// import React from 'react'
// import {
//   Table,
//   Button
// } from '@themesberg/react-bootstrap'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {
//   faPlusSquare,
//   faMinusSquare
// } from '@fortawesome/free-solid-svg-icons'

// import PaginationComponent from '../../../../components/Pagination'
// import { useTranslation } from 'react-i18next'
// import Trigger from '../../../../components/OverlayTrigger'

// const CountriesList = ({
//   page,
//   limit,
//   setLimit,
//   setPage,
//   totalPages,
//   countries,
//   disablePagination = false,
//   hasActions = false,
//   hasAddGamesAction = false,
//   hasRemoveGamesAction = false,
//   addCountries,
//   removeCountries
// }) => {
//   const { t } = useTranslation(['casino'])
//   return (
//     <>
//       <Table bordered striped responsive hover size='sm' className='text-center mt-1'>
//         <thead className='thead-dark'>
//           <tr>
//             {[
//               'Id',
//               'Name',
//               'Code'
//             ].map((h) => (
//               <th key={h}>{h}</th>
//             ))}
//             {hasActions && <th>{t('restrictedCountries.actions')}</th>}
//           </tr>
//         </thead>

//         <tbody>
//           {countries?.count > 0 &&
//                     countries?.rows?.map(
//                       ({
//                         countryId,
//                         name,
//                         code
//                       }) => {
//                         return (
//                           <tr key={countryId}>

//                             <td>{countryId}</td>

//                             <td>
//                               <Trigger message={name} id={countryId} />
//                                 <span
//                                 id={countryId}
//                                   style={{
//                                     width: '200px',
//                                     cursor: 'pointer'
//                                   }}
//                                   className='d-inline-block text-truncate'
//                                 >
//                                   {name}
//                                 </span>
//                             </td>

//                             <td>{code}</td>

//                             {hasAddGamesAction && (
//                               <td>
//                                 <>
//                                   <Trigger message='Add this Country' id={countryId + 'add'} />
//                                     <Button
//                                     id={countryId+'add'}
//                                       className='m-1'
//                                       size='sm'
//                                       variant='success'
//                                       onClick={() => addCountries({
//                                         countryId,
//                                         name,
//                                         code
//                                       })}
//                                     >
//                                       <FontAwesomeIcon icon={faPlusSquare} />
//                                     </Button>
//                                 </>
//                               </td>
//                             )}

//                             {hasRemoveGamesAction && (
//                               <td>
//                                 <>
//                                   <Trigger message='Remove this Country' id={countryId+'remove'} />
//                                     <Button
//                                     id={countryId+'remove'}
//                                       className='m-1'
//                                       size='sm'
//                                       variant='danger'
//                                       onClick={() => removeCountries(countryId)}
//                                     >
//                                       <FontAwesomeIcon icon={faMinusSquare} />
//                                     </Button>
//                                 </>
//                               </td>
//                             )}
//                           </tr>
//                         )
//                       }
//                     )}

//           {countries?.count === 0 &&
//                       (
//                         <tr>
//                           <td
//                             colSpan={hasActions ? 5 : 4}
//                             className='text-danger text-center'
//                           >
//                             {t('restrictedCountries.noDataFound')}
//                           </td>
//                         </tr>
//                       )}
//         </tbody>
//       </Table>
//       {/* <div style={{margin: '10px'}}>
//       {!disablePagination && countries?.count !== 0 &&
//             (
//               <PaginationComponent
//                 page={countries?.count < page ? setPage(1) : page}
//                 totalPages={totalPages}
//                 setPage={setPage}
//                 limit={limit}
//                 setLimit={setLimit}
//               />
//             )}
//             </div> */}
//     </>
//   )
// }

// export default CountriesList

// not in use 