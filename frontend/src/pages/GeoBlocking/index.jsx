// import { Button, Table, Row, Col, Spinner } from '@themesberg/react-bootstrap'
// import * as React from 'react'
// import useGeoBlocking from './hooks/useGeoBlocking'
// import { InlineLoader } from '../../components/Preloader'
// import { AdminRoutes } from '../../routes'
// const GeoBlocking = () => {
// 	const {
// 		state: stateData,
// 		isLoading,
// 		isUpdateListLoading,
// 		tableHeaders,
// 		t,
// 		updateAllowedStatesFn,
// 		dispatch,
// 		navigate
// 	} = useGeoBlocking()


	

// 	return (
// 		<Row>
// 			<Col xs='9'>
// 				<h3>Geo blocking</h3>
// 			</Col>
// 			<Table bordered striped responsive hover size='sm' className='text-center mt-4'>
// 				<thead className='thead-dark'>
// 					<tr>
// 						{tableHeaders.map((h, idx) => (
// 							<th
// 								key={idx}
// 								// onClick={() => h.value !== '' && setOrderBy(h.value)}
// 								style={{
// 									cursor: 'pointer'
// 								}}
// 							// className={
// 							// 	selected(h)
// 							// 		? 'border-3 border border-blue'
// 							// 		: ''
// 							// }
// 							>
// 								{(h.labelKey)}{' '}

// 							</th>
// 						))}
// 					</tr>
// 				</thead>


// 				{isLoading ? (<tr>
// 					<td colSpan={10} className="text-center">
// 						<InlineLoader />
// 					</td>
// 				</tr>) : <tbody>
// 					{stateData && stateData?.map((state) => {
// 						return (
// 							<tr key={state.state_id}
// 								onContextMenu={(e) => {
// 									e.preventDefault();

// 								}}>
// 								<td>{state?.state_id}</td>
// 								<td>{state?.name}</td>
// 								<td>{state?.stateCode}</td>

// 								<td>
// 									{state?.isAllowed ? "True" : "False"}

// 								</td>
// 								{/* <td>{player.kycStatus}</td> */}
// 								<td>
// 									{state?.isAllowed ?
// 										<Button style={{ backgroundColor: "red" }} onClick={() => dispatch({ type: 'remove', value: state?.state_id })}>Restrict </Button> :
// 										<Button onClick={() => dispatch({ type: 'add', value: state?.state_id })}>Allow </Button>
// 									}
// 								</td>

// 							</tr>
// 						)
// 					})
// 					}

// 					{stateData?.rows?.length === 0 && !isLoading &&
// 						<tr>
// 							<td colSpan={6} className='text-danger text-center'>
// 								{t('noDataFound')}
// 							</td>
// 						</tr>}
// 				</tbody>}
// 			</Table>

// 			<div style={{ marginTop: "20px" }}>
// 				{/* <Button onClick={resetToggler} disabled={isLoading}>Reset</Button> */}
// 				<Button
// 					variant='warning'
// 					className='m-2'
// 					onClick={() => navigate(AdminRoutes.Dashboard)}
// 				>
// 					Cancel
// 				</Button>
// 				<Button style={{ float: 'right' }} disabled={isLoading || isUpdateListLoading} onClick={() => updateAllowedStatesFn(stateData)}>Submit
// 					{(isLoading || isUpdateListLoading) && (
// 						<Spinner
// 							as="span"
// 							animation="border"
// 							size="sm"
// 							role="status"
// 							aria-hidden="true"
// 						/>
// 					)}

// 				</Button>
// 			</div>
// 		</Row>
// 	)
// }

// export default GeoBlocking

// not in use 