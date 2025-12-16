// import React from 'react'
// import {
//   Form,
//   Row,
//   Col,
//   Table,
//   Button
// } from '@themesberg/react-bootstrap'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faStoreSlash, faBan , faArrowCircleUp, faArrowCircleDown,} from '@fortawesome/free-solid-svg-icons'
// import useCheckPermission from '../../utils/checkPermission'
// import PaginationComponent from '../../components/Pagination'
// import { tableHeaders } from './constants'
// import { useTranslation } from 'react-i18next'
// import Trigger from '../../components/OverlayTrigger'
// import useCountriesListing from './useCountriesListing'
// import { searchRegEx } from '../../utils/helper'
// import { useNavigate } from 'react-router-dom'
// import { InlineLoader } from '../../components/Preloader'

// const Countries = () => {
//   const navigate = useNavigate()
//   const { t } = useTranslation(['countries'])
//   const {
//     loading,
//     page,
//     data,
//     limit,
//     setLimit,
//     setPage,
//     totalPages,
//     setOrderBy,
//     selected,
//     sort,
//     setSort,
//     over,
//     setOver,
//     search,
//     setSearch
//   } =
//     useCountriesListing()
//   const { isHidden } = useCheckPermission()

//   return (
//     <>
//       <Row>
//         <Col>
//           <h3>{t('title')}</h3>
//         </Col>

//         <Col xs='auto'>
//           <div className='d-flex justify-content-end align-items-center w-100'>
//             <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
//             {t('search')}
//             </Form.Label>

//             <Form.Control
//               type='search'
//               placeholder='Search Country Name'
//               style={{ maxWidth: '230px' }}
//               value={search}
//               onChange={(event) => {
//                 setPage(1)
//                 const mySearch = event.target.value.replace(searchRegEx, '')
//                 setSearch(mySearch)
//               }}
//             />
//           </div>
//         </Col>
//       </Row>

//       {<Table bordered striped responsive hover size='sm' className='text-center mt-4'>
//         <thead className='thead-dark'>
//           <tr>
//             {tableHeaders.map((h, idx) => (
//               <th
//                 key={idx}
//                 onClick={() => h.value !== '' && setOrderBy(h.value)}
//                 style={{
//                   cursor: 'pointer'
//                 }}
//                 className={
//                   selected(h)
//                     ? 'border-3 border border-blue'
//                     : ''
//                 }
//               >
//                 {t(h.labelKey)}{' '}
//                 {selected(h) &&
//                       (sort === 'asc'
//                         ? (
//                           <FontAwesomeIcon
//                             style={over ? { color: 'red' } : {}}
//                             icon={faArrowCircleUp}
//                             onClick={() => setSort('desc')}
//                             onMouseOver={() => setOver(true)}
//                             onMouseLeave={() => setOver(false)}
//                           />
//                           )
//                         : (
//                           <FontAwesomeIcon
//                             style={over ? { color: 'red' } : {}}
//                             icon={faArrowCircleDown}
//                             onClick={() => setSort('asc')}
//                             onMouseOver={() => setOver(true)}
//                             onMouseLeave={() => setOver(false)}
//                           />
//                           ))}
//               </th>
//             ))}
//           </tr>

//         </thead>

//         <tbody>
//           {data &&
//             data?.rows.map(
//               ({ countryId, code, name: countryName }) => (
//                 <tr key={countryId}>
//                   <td>{countryId}</td>
//                   <td>{code}</td>
//                   <td>{countryName}</td>

//                   <td>
//                     {!isHidden({ module: { key: 'RestrictedCountry', value: 'U' } })
//                       ? (
//                         <>
//                           <Trigger message='View Blocked Games' id={countryId+'game'} />
//                             <Button
//                               id={countryId+'game'}
//                               className='m-1'
//                               size='sm'
//                               variant='warning'
//                               onClick={() => navigate(`/admin/restricted-games/${countryId}`)}
//                             >
//                               <FontAwesomeIcon icon={faBan} />
//                             </Button>

//                           <Trigger message='View Blocked Providers' id={countryId+'provider'} />
//                             <Button
//                               id={countryId+'provider'}
//                               className='m-1'
//                               size='sm'
//                               variant='success'
//                               onClick={() => navigate(`/admin/restricted-providers/${countryId}`)}
//                             >
//                               <FontAwesomeIcon icon={faStoreSlash} />
//                             </Button>
//                         </>)
//                       : '-'}
//                   </td>
//                 </tr>
//               )
//             )}
//         </tbody>
//         {data?.count === 0 &&
//           (
//             <tr>
//               <td
//                 colSpan={4}
//                 className='text-danger text-center'
//               >
//                 {t('noDataFound')}
//               </td>
//             </tr>
//           )}
//       </Table>}
//       {loading && <InlineLoader />}

//       {data?.count !== 0 &&
//         (
//           <PaginationComponent
//             page={data?.count < page ? setPage(1) : page}
//             totalPages={totalPages}
//             setPage={setPage}
//             limit={limit}
//             setLimit={setLimit}
//           />
//         )}
//     </>
//   )
// }

// export default Countries


// not in use 