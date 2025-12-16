import React, { useEffect, useState } from "react";
import {
    Col,
    Row,
    Form as BForm,
    Button,
    Spinner,
    Table,
    Form,
} from "@themesberg/react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getScratchCardUserDetails } from "../../../utils/apiCalls";
import useScratchCard from "../hooks/useScratchCard";
import Trigger from "../../../components/OverlayTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faEdit, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import Datetime from 'react-datetime'
import { useUserStore } from "../../../store/store";
import { convertTimeZone, convertToUtc } from "../../../utils/helper";
import { useDebounce } from "use-debounce";
import { useDeleteScratchCard } from "../../../reactQuery/hooks/customMutationHook";
import { DeleteConfirmationModal } from "../../../components/ConfirmationModal";
import { toast } from "../../../components/Toast";
import BannerViewer from '../../BannerManagement/BannerViewer.jsx';

const ViewScratchCard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const queryClient = useQueryClient();
    const [scratchCardRecords,setScratchCardRecords] = useState([]);
    const [userId, setUserId] = useState('')
    const [scratchCardName,setScratchCardName] = useState("");
    const timeZoneCode = useUserStore((state) => state.timeZoneCode)
    const [startDate, setStartDate] = useState(convertTimeZone(new Date(), timeZoneCode));
    const [endDate, setEndDate] = useState(convertTimeZone(new Date(), timeZoneCode));
    const [errorEnd, setErrorEnd] = useState('')
    const [errorStart, setErrorStart] = useState('')
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebounce(search, 500)
    const [limit, setLimit] = useState(15)
    const [page, setPage] = useState(1)
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [deleteScratchCardData, setDeleteScratchCardData] = useState({});
    const { editRowId, isHidden, handleEditClick, handleInputMinReward, handleInputMaxReward, handleInputpercentage, setEditRowId, setChildData,
        handleInputPlayerLimit, handleChangeIsActive, handleMessage, handleSubmit, editErrors, setEditErrors, editValues, setEditValues, handleImage,
        scratchCardViewList, scratchCardId,parentData,refetchView
    } = useScratchCard();

    const { data: userDetail, isLoading: loadingUserDetail } = useQuery({
        queryKey: ['scratchCardUserList', limit, page, scratchCardId, convertToUtc(startDate),
            convertToUtc(endDate), userId, debouncedSearch],
        queryFn: ({ queryKey }) => {
            const params = { limit: queryKey[1], pageNo: queryKey[2], timezone: timeZoneCode };
            if (queryKey[3]) params.scratchCardId = queryKey[3]
            if (queryKey[4]) params.startDate = queryKey[4]
            if (queryKey[5]) params.endDate = queryKey[5]
            if (queryKey[6]) params.idSearch = queryKey[6]
            if (queryKey[7]) params.search = queryKey[7]
            return getScratchCardUserDetails(params);
        },
        select: (res) => res?.data,
        refetchOnWindowFocus: false,
    });

    const totalPagesUserDetail = Math.ceil(userDetail?.count / limit);
    useEffect(() => {
        if (scratchCardViewList) {
            setChildData(scratchCardViewList.data[0] || {})
            setScratchCardName(scratchCardViewList.scratchCardName || '');
            setScratchCardRecords(scratchCardViewList.config || []);
        }
    }, [scratchCardViewList]);

    const handleCancel = () => {
        setEditRowId(null);
        setEditErrors({});
    };
    const handleStartDateChange = (date) => {
        setStartDate(date)
        if (endDate && date && date.isAfter(endDate)) {
            setErrorStart('Start date cannot be greater than end date.')
        } else {
            setErrorEnd('')
            setErrorStart('')
        }
    }

    const handleEndDateChange = (date) => {
        setEndDate(date)
        if (startDate && date && date.isBefore(startDate)) {
            setErrorEnd('End date must be greater than the start date.')
        } else {
            setErrorStart('')
            setErrorEnd('')
        }
    }
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }
    const handleChange = (event) => {
        const value = event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, '')
        setSearch(value)
        setPage(1)

        // Validate email
        if (value && !validateEmail(value)) {
            setError('Please enter a valid email address.')
        } else {
            setError('')
        }
    }
    const { mutate: deleteScratchCard, isLoading: deleteLoading } = useDeleteScratchCard({
        onSuccess: (data) => {
            if (data?.data?.status) { toast(data?.data?.message, 'success') }
            else { toast(data?.data?.message, 'error') }
            refetchView()
            queryClient.invalidateQueries({ queryKey: ['scratchCardDelete'] });

        },
    });

    const handleDeleteModal = (data) => {
        setDeleteScratchCardData(data);
        setDeleteModalShow(true);
    };

    const handleDeleteYes = () => {
        setDeleteModalShow(false);
        deleteScratchCard(deleteScratchCardData);
    };
    return (
        <>
            <div>
                <Row>
                    <Col sm={8}>
                        <h3>View Scratch Card</h3>
                    </Col>
                </Row>
                <div className="mt-4">
                    <h4>Configuration Details</h4>
                    <Table bordered
                        striped
                        responsive
                        hover
                        size="sm"
                        className="text-center mt-4">
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Reward Type</th>
                                <th>Min</th>
                                <th>Max</th>
                                <th>percentage</th>
                                <th>Player Limit</th>
                                <th>Message</th>
                                <th>Image</th>
                                <th>Active</th>
                               {!parentData && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {scratchCardViewList?.data[0]?.scratchCardConfigs?.map((config,index) => (
                                <tr key={config.id}>
                                    <td>{config.id}</td>
                                    <td>{config.rewardType}</td>
                                    <td>
                                        {editRowId === config.id ? (
                                            <>
                                                <Form.Control
                                                    type="number"
                                                    name="minReward"
                                                    min="1"
                                                    max="1000000"
                                                    step="any"
                                                    value={editValues.minReward || ""}
                                                    onChange={handleInputMinReward}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                {editErrors.minReward && (
                                                    <div
                                                        style={{
                                                            color: "red",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {editErrors.minReward}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            config.minReward
                                        )}
                                    </td>
                                    <td>
                                        {editRowId === config.id ? (
                                            <>
                                                <Form.Control
                                                    type="number"
                                                    name="maxReward"
                                                    min="1"
                                                    max="1000000"
                                                    step="any"
                                                    value={editValues.maxReward || ""}
                                                    onChange={handleInputMaxReward}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                {editErrors.maxReward && (
                                                    <div
                                                        style={{
                                                            color: "red",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {editErrors.maxReward}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            config.maxReward
                                        )}
                                    </td>
                                    <td>
                                        {editRowId === config.id ? (
                                            <>
                                                <Form.Control
                                                    type="number"
                                                    name="percentage"
                                                    min="1"
                                                    max="1000000"
                                                    step="any"
                                                    value={editValues.percentage || ""}
                                                    onChange={handleInputpercentage}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                {editErrors.percentage && (
                                                    <div
                                                        style={{
                                                            color: "red",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {editErrors.percentage}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            config.percentage
                                        )}
                                    </td>
                                    <td>
                                        {editRowId === config.id ? (
                                            <>
                                                <Form.Control
                                                    type="number"
                                                    name="playerLimit"
                                                    min="1"
                                                    max="1000000"
                                                    step="any"
                                                    value={editValues.playerLimit || ""}
                                                    onChange={handleInputPlayerLimit}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                 {editErrors.playerLimit && (
                                                    <div
                                                        style={{
                                                            color: "red",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {editErrors.playerLimit}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            config.playerLimit
                                        )}
                                    </td>
                                    <td>
                                        {editRowId === config.id ? (
                                            <>
                                                <Form.Control
                                                    type="text"
                                                    name="message"
                                                    value={editValues.message || ""}
                                                    onChange={handleMessage}
                                                />
                                            </>
                                        ) : (
                                            config.message
                                        )}
                                    </td>
                                    <td>                                    
                                        {editRowId === config.id ? (
                                            <>
                                                <BForm.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImage}
                                                />
                                                {editValues.imageUrl && typeof editValues.imageUrl === 'string' && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={editValues.imageUrl}
                                                            alt="Preview"
                                                            style={{ maxHeight: '80px' }}
                                                        />
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            config.imageUrl && (
                                             <BannerViewer thumbnailUrl={config.imageUrl} />
                                            )
                                        )}
                                    </td>
                                    <td>
                                        {editRowId === config.id ? (
                                            <>
                                                <Form.Check
                                                    type="switch"
                                                    name="isActive"
                                                    checked={editValues?.isActive}
                                                    onChange={handleChangeIsActive}
                                                />
                                            </>
                                        ) : config.isActive ? (
                                            "True"
                                        ) : (
                                            "False"
                                        )}
                                    </td>
                                 {!parentData && (
                                    <td>
                                        <>
                                            <>
                                                {editRowId === config.id ? (
                                                    <>
                                                        <Trigger
                                                            message={"Save"}
                                                            id={config.id + "save"}
                                                        />
                                                        <Button
                                                            id={config.id + "save"}
                                                            className="m-1"
                                                            size="sm"
                                                            variant="warning"
                                                            onClick={() =>
                                                                handleSubmit({
                                                                    id: config.id,
                                                                    scratchCardId: scratchCardId,
                                                                    minReward: editValues?.minReward,
                                                                    maxReward: editValues?.maxReward,
                                                                    rewardType: config.rewardType,
                                                                    playerLimit: editValues.playerLimit,
                                                                    percentage:
                                                                        editValues?.percentage,
                                                                    isActive: editValues.isActive,
                                                                    message: editValues?.message,
                                                                    imageUrl: editValues?.imageUrl,
                                                                },index, )
                                                            }
                                                            hidden={isHidden({
                                                                module: {
                                                                    key: "ScratchCardConfiguration",
                                                                    value: "U",
                                                                },
                                                            })}
                                                        >
                                                            <FontAwesomeIcon icon={faSave} />
                                                        </Button>
                                                        <Trigger
                                                            message={"Cancel"}
                                                            id={config.id + "cancel"}
                                                        />

                                                        <Button
                                                            id={config.id + "cancel"}
                                                            className="m-1"
                                                            size="sm"
                                                            variant="warning"
                                                            onClick={() => handleCancel()}
                                                            hidden={isHidden({
                                                                module: {
                                                                    key: "ScratchCardConfiguration",
                                                                    value: "U",
                                                                },
                                                            })}
                                                        >
                                                            <FontAwesomeIcon icon={faCancel} />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trigger
                                                            message={"Edit"}
                                                            id={config.id + "edit"}
                                                        />
                                                        <Button
                                                            id={config.id + "edit"}
                                                            className="m-1"
                                                            size="sm"
                                                            variant="warning"
                                                            onClick={() => handleEditClick(config)}
                                                            hidden={isHidden({
                                                                module: {
                                                                    key: "ScratchCardConfiguration",
                                                                    value: "U",
                                                                },
                                                            })}
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </Button>
                                                    </>
                                                )}
                                            </>
                                            <>
                                                <Trigger
                                                    message={"Delete"}
                                                    id={config.id + "delete"}
                                                />
                                                <Button
                                                    id={config.id + "delete"}
                                                    className="m-1"
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() =>
                                                        handleDeleteModal({
                                                            configId: config.id,
                                                            scratchCardId: scratchCardId,
                                                        })}
                                                    hidden={isHidden({
                                                        module: { key: 'ScratchCardConfiguration', value: 'D' },
                                                    })}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </>
                                        </>
                                    </td>   )}
                                </tr>
                            ))}
                            {scratchCardViewList?.data?.length === 0 &&
                                <tr>
                                    <td colSpan={10} className='text-danger text-center'>
                                        No Data Found
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </Table>

                </div>
                <Row className="mt-4">
                    <Col sm={8}>
                        <h4>User Details</h4>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col xs='12' sm='6' lg='2' className='mb-3'>
                        <Form.Label>User Id</Form.Label>
                        <Form.Control
                            type='number'
                            value={userId}
                            placeholder='Search By User Id'
                            onChange={(event) => {
                                setPage(1)
                                setUserId(event.target.value.replace(/[~`!$%^&*#=)()><?]+/g, ''))
                            }}
                        />
                    </Col>
                    <Col xs='12' sm='6' lg='3' className='mb-3'>
                        <Form.Label>Search</Form.Label>
                        <Form.Control
                            type='search'
                            value={search}
                            placeholder='Search By Full Email'
                            onChange={handleChange}
                            isInvalid={!!error}
                        />
                        {error && (<div style={{ color: 'red', marginTop: '5px' }}>{error}</div>)}
                    </Col>
                    <Col xs='12' sm='6' lg='2' className='col-lg-2 col-sm-6 col-12 mt-2 mt-sm-0'>
                        <Form.Label column='sm' className='mx-auto text-nowrap px-2'>Start Date</Form.Label>
                        <Datetime
                            value={startDate}
                            onChange={handleStartDateChange}
                            // onChange={(date) => setStartDate(date)}
                            timeFormat={false}
                            inputProps={{ readOnly: true }}
                        />
                        {errorStart && (<div style={{ color: 'red', marginTop: '5px' }}>{errorStart}</div>)}
                    </Col>

                    <Col xs='12' sm='6' lg='2' className='col-lg-2 col-sm-6 col-12 mt-2 mt-sm-0'>
                        <Form.Label column='sm' className='mx-auto text-nowrap px-2'>End Date</Form.Label>
                        <Datetime
                            value={endDate}
                            onChange={handleEndDateChange}
                            // onChange={(date) => setEndDate(date)}
                            timeFormat={false}
                            inputProps={{ readOnly: true }}
                        />
                        {errorEnd && (<div style={{ color: 'red', marginTop: '5px' }}>{errorEnd}</div>)}
                    </Col>
                </Row>
                <div className="mt-4">
                    <Table bordered
                        striped
                        responsive
                        hover
                        size="sm"
                        className="text-center mt-4">
                        <thead className="thead-dark">
                            <tr>
                                <th>User ID</th>
                                <th>Email</th>
                                <th>Username</th>
                                <th>Claimed Count</th>
                                <th>SC Bonus Claimed</th>
                                <th>GC Bonus Claimed</th>
                                <th>Pending To Claimed SC Bonus</th>
                                <th>Pending To Claimed GC Bonus</th>
                                <th>Scratchcard Id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userDetail?.rows?.map((data, index) => {
                                return (
                                    <tr key={data.scratch_card_id}>
                                        <td className="scratch-id">{data.user_id}</td>
                                        <td>{data.email}</td>
                                        <td>{data.username}</td>
                                        <td>{data.total_claimed_count}</td>
                                        <td>{data.total_sc_bonus_claimed}</td>
                                        <td>{data.total_gc_bonus_claimed}</td>
                                        <td>{data.pending_to_claim_sc_bonus}</td>
                                        <td>{data.pending_to_claim_gc_bonus}</td>
                                        <td>{data.scratch_card_id}</td>
                                    </tr>
                                )
                            })}
                            {userDetail?.count === 0 &&
                                <tr>
                                    <td colSpan={7} className='text-danger text-center'>
                                        No Data Found
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </Table>

                </div>
            </div>
            {deleteModalShow && (
                <DeleteConfirmationModal
                    deleteModalShow={deleteModalShow}
                    setDeleteModalShow={setDeleteModalShow}
                    handleDeleteYes={handleDeleteYes}
                />

            )}
        </>
    );
};

export default ViewScratchCard;
