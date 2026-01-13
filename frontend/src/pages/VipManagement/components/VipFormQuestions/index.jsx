import React from 'react';
import { useNavigate } from 'react-router-dom'
import { Row, Col, Button, Table, Form, Card } from '@themesberg/react-bootstrap'
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
import './vipQuestions.scss';

const VipformQuestions = () => {
	const { isHidden } = useCheckPermission();
	const navigate = useNavigate();
	const { limit, setLimit, page, setPage, sort, setSort, setOrderBy, selected, over, setOver, vipQuestionsList, isLoading, totalPages, handleStatusShow, statusShow, setStatusShow, handleYes, status, handleDeleteYes, updateLoading,
		handleDeleteModal, setDeleteModalShow, deleteModalShow, deleteQuestionLoading, setIsActive, search, setSearch } = useVipFormQuestions();

	const getQuestionTypeLabel = (question) => {
		const typeValue = question?.frontendQuestionType ?? question?.moreDetails?.type;
		if (typeValue) return getFieldLabel(typeValue) || typeValue;

		const qt = (question?.questionType || '').toString().toLowerCase();
		const fallbackMap = {
			one_liner: 'Short Text',
			single_choice: 'Single Choice',
			multi_choice: 'Multiple Choice',
			tick_mark: 'Tick Mark',
			sequence: 'Sequence',
		};
		return fallbackMap[qt] || (question?.questionType ?? 'NA');
	};

	return (
		<>
			<div className="vip-questions-page dashboard-typography">
				<Row className="vip-questions-page__header align-items-center mb-2">
					<Col xs={12} md={7}>
						<h3 className="vip-questions-page__title">Vip Questions</h3>
						<div className="vip-questions-page__subtitle">
							Create, reorder, preview, and manage VIP questionnaire items.
						</div>
					</Col>

					<Col xs={12} md={5} className="vip-questions-page__actions">
						<Button
							variant="success"
							className="vip-questions-page__action-btn"
							size="sm"
							onClick={() => navigate(AdminRoutes.VipCreateQuestion)}
							hidden={isHidden({ module: { key: 'VipManagement', value: 'C' } })}
						>
							Create Questions
						</Button>
						<Button
							variant="warning"
							className="vip-questions-page__action-btn vip-questions-page__action-btn--warning"
							size="sm"
							onClick={() => navigate(AdminRoutes.VipReorderQuestion)}
							hidden={isHidden({ module: { key: 'VipManagement', value: 'U' } })}
						>
							Reorder
						</Button>
						<Button
							variant="secondary"
							className="vip-questions-page__action-btn vip-questions-page__action-btn--secondary"
							size="sm"
							onClick={() => navigate(AdminRoutes.VipViewForm)}
							hidden={isHidden({ module: { key: 'VipManagement', value: 'R' } })}
						>
							Form Preview
						</Button>
					</Col>
				</Row>

				<Card className="vip-questions-page__filters dashboard-filters p-3 mb-3">
					<Row className="g-3 align-items-start">
						<Col xs={12} md={6} lg={4}>
							<Form.Label className="form-label">Search</Form.Label>
							<Form.Control
								className="vip-questions-page__input"
								type="search"
								value={search}
								placeholder="Search question"
								onChange={(event) => setSearch(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ''))}
							/>
						</Col>
						<Col xs={12} md={6} lg={3}>
							<Form.Label className="form-label">Status</Form.Label>
							<Form.Select
								className="vip-questions-page__select"
								onChange={(event) => {
									setPage(1)
									setIsActive(event.target.value);
								}}
							>
								{statusOptions.map((status) => (
									<option key={status.label} value={status.value}>
										{status.label}
									</option>
								))}
							</Form.Select>
						</Col>
					</Row>
				</Card>

				<div className="vip-questions-page__table-wrap table-responsive dashboard-table">
					<Table hover size="sm" className="dashboard-data-table vip-questions-table">
						<colgroup>
							<col className="vip-questions-table__col vip-questions-table__col--id" />
							<col className="vip-questions-table__col vip-questions-table__col--question" />
							<col className="vip-questions-table__col vip-questions-table__col--type" />
							<col className="vip-questions-table__col vip-questions-table__col--status" />
							<col className="vip-questions-table__col vip-questions-table__col--action" />
						</colgroup>
						<thead>
					<tr>
						{
							formBuilderHeader.map((header, idx) => (
							<th key={idx} onClick={() => header.value !== 'action' && setOrderBy(header.value)}

								style={{ cursor: (header.value !== 'action' && 'pointer') }}
								className={[
									'vip-questions-table__th',
									`vip-questions-table__th--${header.value}`,
									selected(header) ? 'border-3 border border-blue' : '',
								].join(' ')}
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
							<td colSpan={formBuilderHeader.length} className='text-center'>
								<InlineLoader />
							</td>
						</tr>
					)
						:


						(vipQuestionsList && vipQuestionsList?.questions?.rows && vipQuestionsList?.questions?.rows?.length > 0 ? vipQuestionsList?.questions?.rows?.map((question) => {
							return (
								<tr key={question?.questionnaireId}>
									<td className="vip-questions-table__td vip-questions-table__td--id text-center">
										{question?.questionnaireId}
									</td>
									<td className="vip-questions-table__td vip-questions-table__td--question">
										<div
											className="vip-questions-table__questionText"
											title={question?.question || ''}
										>
											{question?.question || 'NA'}
										</div>
									</td>
									<td className="vip-questions-table__td vip-questions-table__td--type text-center">
										{getQuestionTypeLabel(question)}
									</td>
									<td
										className={[
											'vip-questions-table__td',
											'vip-questions-table__td--status',
											'text-center',
											question?.isActive ? 'text-success' : 'text-danger',
										].join(' ')}
									>
										{question?.isActive ? 'Active' : 'Inactive'}
									</td>
									<td className="vip-questions-table__td vip-questions-table__td--action">
										<div className="vip-questions-table__actions">
											<div className="vip-questions-table__actionsRow">
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

												{!question?.isActive ? (
													<>
														<Trigger message={'Set Status Active'} id={question?.questionnaireId + 'active'} />
														<Button
															id={question?.questionnaireId + 'active'}
															className='m-1'
															size='sm'
															variant='success'
															onClick={() => handleStatusShow(question?.questionnaireId, question?.isActive)}
															hidden={isHidden({
																module: { key: 'VipManagement', value: 'T' },
															})}
														>
															<FontAwesomeIcon icon={faCheckSquare} />
														</Button>
													</>
												) : (
													<>
														<Trigger message={'Set Status In-Active'} id={question?.questionnaireId + 'inactive'} />
														<Button
															id={question?.questionnaireId + 'inactive'}
															className='m-1'
															size='sm'
															variant='danger'
															onClick={() => handleStatusShow(question?.questionnaireId, question?.isActive)}
															hidden={isHidden({
																module: { key: 'VipManagement', value: 'T' },
															})}
														>
															<FontAwesomeIcon icon={faWindowClose} />
														</Button>
													</>
												)}
											</div>
										</div>
									</td>
								</tr>
							)
						}
						)
							:
							<tr>
								<td colSpan={formBuilderHeader.length} className='text-center'>
									<span className="vip-questions-page__empty">No Data Found</span>
								</td>
							</tr>

						)
					}
				</tbody>

					</Table>
				</div>
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

			</div>
		</>
	)
}

export default VipformQuestions;