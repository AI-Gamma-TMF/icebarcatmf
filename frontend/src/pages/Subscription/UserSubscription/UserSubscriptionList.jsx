import React, { useEffect, useState } from "react";
import {
    Col,
    Row,
    Table,
    Card,
    Form,
    Button
} from "@themesberg/react-bootstrap";
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faClock,
    faTimesCircle,
    faUsers,
    faRedoAlt,
    faTrash
} from '@fortawesome/free-solid-svg-icons';
import useUserSubscriptionList from "../hooks/useUserSubscriptionList";
import { InlineLoader } from "../../../components/Preloader";
import { getDateTime } from "../../../utils/dateFormatter";
import { convertToTimeZone, getFormattedTimeZoneOffset } from "../../../utils/helper";
import { timeZones } from "../../Dashboard/constants";
import { getItem } from "../../../utils/storageUtils";
import PaginationComponent from "../../../components/Pagination";
import { allowedUserListKeysforOrder, tableHeaders } from "../constants";
import Trigger from "../../../components/OverlayTrigger";
import { toast } from "../../../components/Toast";
import { useCancelUserSubscription } from "../../../reactQuery/hooks/customMutationHook";
import { ConfirmationModal } from "../../../components/ConfirmationModal";
import useCheckPermission from "../../../utils/checkPermission";

const iconStyle = {
    marginBottom: "10px",
};

const titleStyle = {
    fontWeight: "600",
    marginBottom: "5px",
};

const numberStyle = {
    fontSize: "24px",
};

const UserSubscriptionList = () => {
    const {
        setLimit,
        setPage,
        totalPages,
        limit,
        page,
        UserSubscriptionList,
        loading,
        userId,
        setUserId,
        status,
        setStatus,
        subscriptionType,
        setSubscriptionType,
        resetFilters,
        orderBy,
        setOrderBy,
        sort,
        setSort,
        selected,
        search,
        setSearch,
        UserSubscriptionListRefetch,
        isError,
        navigate,
    } = useUserSubscriptionList();

    const { isHidden } = useCheckPermission()

    const [error, setError] = useState('')
    const [statusShow, setStatusShow] = useState(false);
    const [itemToUpdate, setItemToUpdate] = useState(null);

    const cancelUserSubscription = useCancelUserSubscription({});

    const handleOnSubmit = async () => {
        const payload = {
            userSubscriptionId: itemToUpdate,
        };

        cancelUserSubscription.mutate(payload, {
            onSuccess: (res) => {
                if (res) {
                    toast(res?.data?.message, 'success');
                    UserSubscriptionListRefetch();
                }
                setStatusShow(false);
            },
            onError: () => {
                setStatusShow(false);
            }
        });
    };

    const handleActionClick = (userSubscriptionId) => {
        setItemToUpdate(userSubscriptionId);
        setStatusShow(true);
    };

    const timeZone = getItem("timezone");
    const timezoneOffset = timeZone != null ? timeZones.find(x => x.code === timeZone).value : getFormattedTimeZoneOffset()

    return (
        <>
            <Row className="mb-3">
                <Col sm={12}>
                    <h3>User Subscription</h3>
                </Col>
            </Row>

            <Row>
                <Col xs={3}>
                    <Form.Label>
                        User Id
                    </Form.Label>

                    <Form.Control
                        type='search'
                        placeholder='Search by User Id'
                        value={userId}
                        onChange={(event) => {
                            const inputValue = event?.target?.value;
                            if (/^\d*$/.test(inputValue)) {
                                if (inputValue.length <= 10) {
                                    setPage(1)
                                    setUserId(inputValue)
                                    setError('')
                                } else {
                                    setError('User Id cannot exceed 10 digits')
                                }
                            }
                        }}
                    />
                    {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
                </Col>

                <Col xs={3}>
                    <Form.Label>
                        User Name or  Email
                    </Form.Label>

                    <Form.Control
                        type='search'
                        placeholder='Search by Username or Email'
                        value={search}
                        onChange={(event) => {
                            setSearch(event?.target?.value?.replace(/[~`%^#)()><?]+/g, "").trim());
                            setError('')
                        }}
                    />
                </Col>

                <Col xs={2}>
                    <Form.Label>
                        Status
                    </Form.Label>

                    <Form.Select
                        onChange={(e) => {
                            setPage(1)
                            setStatus(e?.target?.value)
                        }}
                        value={status}
                    >
                        <option value="all">All</option>
                        <option value="active">Trial</option>
                        <option value="active">Active</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="expired">Expired</option>
                        <option value="expired">Paused</option>
                        <option value="expired">Pending</option>
                        <option value="expired">Rejected</option>
                        <option value="renewed">Renewed</option>
                        <option value="upgraded">Upgraded</option>
                    </Form.Select>
                </Col>

                <Col xs={2}>
                    <Form.Label>
                        Subscription Type
                    </Form.Label>

                    <Form.Select
                        onChange={(e) => {
                            setPage(1)
                            setSubscriptionType(e?.target?.value)
                        }}
                        value={subscriptionType}
                    >
                        <option value="all">All</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </Form.Select>
                </Col>

                <Col xs={2} style={{ marginTop: "31px" }}>
                    <Trigger message="Reset Filters" id={"redo"} />
                    <Button
                        id={"redo"}
                        variant="success"
                        className=""
                        onClick={resetFilters}
                    >
                        <FontAwesomeIcon icon={faRedoAlt} />
                    </Button>
                </Col>
            </Row>

            <Row>
                <Table
                    bordered
                    striped
                    responsive
                    hover
                    size="sm"
                    className="text-center mt-4"
                >
                    <thead className="thead-dark">
                        {tableHeaders?.map((h, idx) => (
                            <th
                                key={idx}
                                onClick={() => {
                                    (allowedUserListKeysforOrder.includes(h.value) &&
                                        (setOrderBy(h.value) || setSort(sort === 'ASC' ? 'DESC' : 'ASC')))
                                }}
                                style={{
                                    cursor: allowedUserListKeysforOrder.includes(h.value)
                                        ? "pointer"
                                        : "default",
                                }}
                                className={
                                    selected(h)
                                        ? 'border-3 border border-blue'
                                        : ''
                                }
                            >
                                {h?.labelKey}
                            </th>
                        ))}

                    </thead>
                    {loading ? (
                        <tr>
                            <td colSpan={10} className="text-center">
                                <InlineLoader />
                            </td>
                        </tr>
                    ) : (
                        <tbody>
                            {UserSubscriptionList?.data &&
                                UserSubscriptionList?.data?.rows?.length > 0 ? (
                                UserSubscriptionList?.data?.rows?.map((value, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="text-center"
                                            style={{
                                                height: "40px",
                                                verticalAlign: "middle",
                                            }}
                                        >
                                            <td>{value?.userId}</td>
                                            <td>{value?.username}</td>
                                            <td>
                                                <Link
                                                    to={`/admin/player-details/${value?.userId}`}
                                                    style={{ color: "blue" }}
                                                >
                                                    {value?.email}
                                                </Link>
                                            </td>
                                            <td>{value?.subscriptionName}</td>
                                            <td>{value?.subscriptionId}</td>
                                            <td>{getDateTime(convertToTimeZone(value?.startDate, timezoneOffset))}</td>
                                            <td>{getDateTime(convertToTimeZone(value?.endDate, timezoneOffset))}</td>
                                            <td className={
                                                value?.status === "active"
                                                    ? "text-success"
                                                    : value?.status === "cancelled"
                                                        ? "text-danger"
                                                        : value?.status === "expired"
                                                            ? "text-warning"
                                                            : value?.status === "renewed"
                                                                ? "text-primary"
                                                                : value?.status === "upgraded"
                                                                    ? "text-info"
                                                                    : "text-secondary"
                                            }>
                                                {value?.status?.charAt(0).toUpperCase() + value?.status?.slice(1)}
                                            </td>
                                            <td>{value?.planType?.charAt(0).toUpperCase() + value?.planType?.slice(1)}</td>
                                            <td>{value?.autoRenew ? "Yes" : "No"}</td>
                                            <td>{value?.transactionId}</td>
                                            <td>
                                                <Trigger message="Delete" id={value?.userSubscriptionId + "delete"} />
                                                <Button
                                                    className="btn btn-danger m-1"
                                                    id={value?.userSubscriptionId + "delete"}
                                                    size="sm"
                                                    onClick={() => handleActionClick(value?.userSubscriptionId)}
                                                    hidden={isHidden({ module: { key: "Subscription", value: "D" } })}
                                                    disabled={["cancelled", "expired", "renewed", "upgraded", "rejected"].includes(value?.status)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-danger text-center">
                                        No data Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    )}
                </Table>
            </Row>
            {UserSubscriptionList?.data?.count !== 0 && !loading && (
                <PaginationComponent
                    page={UserSubscriptionList?.data?.count < page ? setPage(1) : page}
                    totalPages={totalPages}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            )}

            <ConfirmationModal
                setShow={setStatusShow}
                show={statusShow}
                handleYes={handleOnSubmit}
                message={`Are you sure you want to cancel this?`}
            />
        </>
    );
};

export default UserSubscriptionList;
