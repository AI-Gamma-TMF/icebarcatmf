import React from 'react';
import { useNavigate } from 'react-router-dom'
import { Row, Col, Button, Table, Form } from '@themesberg/react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowCircleUp, faArrowCircleDown, faEdit, faCheckSquare, faWindowClose, faEye } from '@fortawesome/free-solid-svg-icons';
import { formBuilderHeader, getFieldLabel, statusOptions } from '../../constants';
import useCheckPermission from '../../../../utils/checkPermission';
import useVipFormQuestions from '../../hooks/useVipFormQuestions';
import PaginationComponent from '../../../../components/Pagination';
import { InlineLoader } from '../../../../components/Preloader';
import Trigger from '../../../../components/OverlayTrigger';
import { ConfirmationModal, DeleteConfirmationModal } from '../../../../components/ConfirmationModal';
import { AdminRoutes } from '../../../../routes';

const VipformQuestions = () => {
	const { isHidden } = useCheckPermission();
	const navigate = useNavigate();
	const { limit, setLimit, page, setPage, sort, setSort, setOrderBy, selected, over, setOver, vipQuestionsList, isLoading, totalPages, handleStatusShow, statusShow, setStatusShow, handleYes, status, handleDeleteYes, updateLoading,
		handleDeleteModal, setDeleteModalShow, deleteModalShow, deleteQuestionLoading, setIsActive, search, setSearch } = useVipFormQuestions();

	return (
		<>
			<Row>
				<Col>
					<h3>Vip Questions</h3>
				</Col>

				<Col>
					<div className='d-flex justify-content-end'>
						<Button
							variant='success'
							className='mb-2 m-1'
							size='sm'
							onClick={() => navigate(AdminRoutes.VipCreateQuestion)}
							hidden={isHidden({ module: { key: 'VipManagement', value: 'C' } })}

						>
							Create Questions
						</Button>
						<Button
							variant='warning'
							className='mb-2 m-1'
							size='sm'
							onClick={() => navigate(AdminRoutes.VipReorderQuestion)}
							hidden={isHidden({ module: { key: 'VipManagement', value: 'U' } })}

						>
							Reorder
						</Button>
						<Button variant='secondary' className='mb-2 m-1' size='sm' onClick={()=>navigate(AdminRoutes.VipViewForm)}
							hidden={isHidden({module:{key:'VipManagement', value:'R'}})}>
								Form Preview
						</Button>
					</div>
					
				</Col>
			</Row>
			<Row className='mt-3'>
				<Col sm={6} lg={3}>
					<Form.Label>Search</Form.Label>
					<Form.Control
						type='search'
						value={search}
						placeholder='Search question'
						onChange={(event) => setSearch(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ''))}
					/>
				</Col>
				<Col sm={6} lg={3}>
					<Form.Label

					>
						Status
					</Form.Label>
					<Form.Select

						onChange={(event) => {
							setPage(1)
							setIsActive(event.target.value);
						}}
					>
						{statusOptions.map((status, _idx) => (
							<option key={status.label} value={status.value}>
								{status.label}
							</option>
						))}
					</Form.Select>
				</Col>

			</Row>

			<Table bordered striped responsive hover size='sm' className='text-center mt-4'>
				<thead className='thead-dark'>
					<tr>
						{
							formBuilderHeader.map((header, idx) => (
							<th key={idx} onClick={() => header.value !== 'action' && setOrderBy(header.value)}

								style={{ cursor: (header.value !== 'action' && 'pointer') }}
								className={selected(header) ? 'border-3 border border-blue' : ''}
							>
								{header.labelKey} {' '} {selected(header) && (sort === 'asc' ? (<FontAwesomeIcon
									style={over ? { color: 'red' } : {}}
									icon={faArrowCircleUp}
									onClick={() => setSort('desc')}
									onMouseOver={() => setOver(true)}
									onMouseLeave={() => setOver(false)}
								/>) : (<FontAwesomeIcon
									style={over ? { color: 'red' } : {}}
									icon={faArrowCircleDown}
									onClick={() => setSort('asc')}
									onMouseOver={() => setOver(true)}
									onMouseLeave={() => setOver(false)}
								/>))
								}
							</th>
							))}
					</tr>
				</thead>

				<tbody>

					{isLoading ? (
						<tr>
							<td colSpan={5} className='text-center'>
								<InlineLoader />
							</td>
						</tr>
					)
						:


						(vipQuestionsList && vipQuestionsList?.questions?.rows && vipQuestionsList?.questions?.rows?.length > 0 ? vipQuestionsList?.questions?.rows?.map((question) => {
							return (
								<tr key={question?.questionnaireId}>
									<td>
										{question?.questionnaireId}
									</td>
									<td>
										{question?.question || 'NA'}
									</td>
									<td>
										{getFieldLabel(question?.frontendQuestionType) || 'NA'}
									</td>
									<td className={question?.isActive ? 'text-success' :
										'text-danger'
									}>{question?.isActive ? 'Active' : 'In - Active'}</td>
									<td>

										<>
											<Trigger message='Edit' id={question?.questionnaireId + 'edit'} />
											<Button
												id={question?.questionnaireId + 'edit'}
												className='m-1'
												size='sm'
												variant='warning'
												onClick={() =>
													navigate(`${AdminRoutes.EditVipQuestion.split(':')[0]}${question?.questionnaireId}`)
												}
												hidden={isHidden({
													module: { key: 'VipManagement', value: 'U' },
												})}
											>
												<FontAwesomeIcon icon={faEdit} />
											</Button>
										</>
										<>
											<Trigger message={'View Question'} id={question?.questionnaireId + 'view'} />
											<Button
												id={question?.questionnaireId + 'view'}
												className='m-1'
												size='sm'
												variant='info'
												onClick={() =>
													navigate(
														`${AdminRoutes.ViewVipQuestion.split(':').shift()}${question?.questionnaireId}`
													)}
											>
												<FontAwesomeIcon icon={faEye} />
											</Button>

										</>
										<>
											<Trigger message={'Delete'} id={question?.questionnaireId + 'delete'} />
											<Button
												id={question?.questionnaireId + 'delete'}
												className='m-1'
												size='sm'
												variant='danger'

												onClick={() => handleDeleteModal(question?.questionnaireId)}
												hidden={isHidden({
													module: { key: 'VipManagement', value: 'D' },
												})}
											>
												<FontAwesomeIcon icon={faTrash} />
											</Button>
										</>
										<>
											{!question?.isActive
												? (
													<>
														<Trigger message={'Set Status Active'} id={question?.questionnaireId + 'active'} />
														<Button
															id={question?.questionnaireId + 'active'}
															className='m-1'
															size='sm'
															variant='success'
															onClick={() =>
																handleStatusShow(question?.questionnaireId, question?.isActive)}
															hidden={isHidden({
																module: { key: 'VipManagement', value: 'T' },
															})}
														>
															<FontAwesomeIcon icon={faCheckSquare} />
														</Button>
													</>
												)
												: (<>
													<Trigger message={'Set Status In-Active'} id={question?.questionnaireId + 'inactive'} />
													<Button
														id={question?.questionnaireId + 'inactive'}
														className='m-1'
														size='sm'
														variant='danger'
														onClick={() =>
															handleStatusShow(question?.questionnaireId, question?.isActive)}
														hidden={isHidden({
															module: { key: 'VipManagement', value: 'T' },
														})}
													>
														<FontAwesomeIcon icon={faWindowClose} />
													</Button>
												</>
												)}
										</>

									</td>
								</tr>
							)
						}
						)
							:
							<tr>
								<td colSpan={9} className='text-danger text-center'>
									No Data Found
								</td>
							</tr>

						)
					}
				</tbody>

			</Table>
			{vipQuestionsList?.questions?.count !== 0 && <PaginationComponent
				page={vipQuestionsList?.questions?.count < page ? setPage(1) : page}
				totalPages={totalPages}
				setPage={setPage}
				limit={limit}
				setLimit={setLimit} />}

			{
				deleteModalShow && <DeleteConfirmationModal
					deleteModalShow={deleteModalShow}
					setDeleteModalShow={setDeleteModalShow}
					handleDeleteYes={handleDeleteYes}
					loading={deleteQuestionLoading} />

			}
			{
				statusShow && <ConfirmationModal show={statusShow} setShow={setStatusShow} handleYes={handleYes} active={status} loading={updateLoading} />
			}

		</>
	)
}

export default VipformQuestions;