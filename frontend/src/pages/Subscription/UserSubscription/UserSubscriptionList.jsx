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
import "../subscriptionListing.scss";

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
            <div className="dashboard-typography subscription-page">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                    <div>
                        <h3 className="subscription-page__title">User Subscription</h3>
                        <p className="subscription-page__subtitle">
                            View and manage user subscriptions
                        </p>
                    </div>
                </div>

                <Card className="dashboard-filters subscription-filters mb-4">
                    <Card.Body>
                        <Row className="g-3 align-items-end">
                            <Col xs={12} md={6} lg={3}>
                                <Form.Label>User Id</Form.Label>
                                <Form.Control
                                    type="search"
                                    placeholder="Search by User Id"
                                    value={userId}
                                    onChange={(event) => {
                                        const inputValue = event?.target?.value;
                                        if (/^\d*$/.test(inputValue)) {
                                            if (inputValue.length <= 10) {
                                                setPage(1);
                                                setUserId(inputValue);
                                                setError("");
                                            } else {
                                                setError("User Id cannot exceed 10 digits");
                                            }
                                        }
                                    }}
                                />
                                {!!error && <div className="text-danger mt-1">{error}</div>}
                            </Col>

                            <Col xs={12} md={6} lg={3}>
                                <Form.Label>User Name or Email</Form.Label>
                                <Form.Control
                                    type="search"
                                    placeholder="Search by Username or Email"
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event?.target?.value?.replace(/[~`%^#)()><?]+/g, "").trim());
                                        setError("");
                                    }}
                                />
                            </Col>

                            <Col xs={12} md={6} lg={3}>
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    onChange={(e) => {
                                        setPage(1);
                                        setStatus(e?.target?.value);
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

                            <Col xs={12} md={6} lg={2}>
                                <Form.Label>Subscription Type</Form.Label>
                                <Form.Select
                                    onChange={(e) => {
                                        setPage(1);
                                        setSubscriptionType(e?.target?.value);
                                    }}
                                    value={subscriptionType}
                                >
                                    <option value="all">All</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </Form.Select>
                            </Col>

                            <Col xs={12} lg="auto">
                                <Trigger message="Reset Filters" id={"redo"} />
                                <Button id={"redo"} variant="secondary" onClick={resetFilters}>
                                    <FontAwesomeIcon icon={faRedoAlt} />
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <div className="dashboard-data-table">
                    <div className="subscription-table-wrap">
                        <Table bordered striped responsive hover size="sm" className="mb-0 text-center">
                            <thead>
                                <tr>
                                    {tableHeaders?.map((h, idx) => (
                                        <th
                                            key={idx}
                                            onClick={() => {
                                                allowedUserListKeysforOrder.includes(h.value) &&
                                                    (setOrderBy(h.value) || setSort(sort === "ASC" ? "DESC" : "ASC"));
                                            }}
                                            style={{
                                                cursor: allowedUserListKeysforOrder.includes(h.value) ? "pointer" : "default",
                                            }}
                                            className={selected(h) ? "sortable active" : "sortable"}
                                        >
                                            {h?.labelKey}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={tableHeaders.length} className="text-center py-4">
                                            <InlineLoader />
                                        </td>
                                    </tr>
                                ) : UserSubscriptionList?.data?.rows?.length > 0 ? (
                                    UserSubscriptionList?.data?.rows?.map((value, index) => {
                                        const pillClass =
                                            value?.status === "active"
                                                ? "subscription-pill subscription-pill--active"
                                                : value?.status === "cancelled"
                                                    ? "subscription-pill subscription-pill--danger"
                                                    : value?.status === "expired"
                                                        ? "subscription-pill subscription-pill--warning"
                                                        : value?.status === "renewed"
                                                            ? "subscription-pill subscription-pill--primary"
                                                            : value?.status === "upgraded"
                                                                ? "subscription-pill subscription-pill--info"
                                                                : "subscription-pill subscription-pill--secondary";

                                        return (
                                            <tr key={index} className="align-middle">
                                                <td>{value?.userId}</td>
                                                <td>{value?.username}</td>
                                                <td>
                                                    <Link to={`/admin/player-details/${value?.userId}`} className="text-decoration-none">
                                                        {value?.email}
                                                    </Link>
                                                </td>
                                                <td>{value?.subscriptionName}</td>
                                                <td>{value?.subscriptionId}</td>
                                                <td>{getDateTime(convertToTimeZone(value?.startDate, timezoneOffset))}</td>
                                                <td>{getDateTime(convertToTimeZone(value?.endDate, timezoneOffset))}</td>
                                                <td>
                                                    <span className={pillClass}>
                                                        {value?.status?.charAt(0).toUpperCase() + value?.status?.slice(1)}
                                                    </span>
                                                </td>
                                                <td>{value?.planType?.charAt(0).toUpperCase() + value?.planType?.slice(1)}</td>
                                                <td>{value?.autoRenew ? "Yes" : "No"}</td>
                                                <td>{value?.transactionId}</td>
                                                <td>
                                                    <div className="subscription-actions">
                                                        <Trigger message="Delete" id={value?.userSubscriptionId + "delete"} />
                                                        <Button
                                                            className="subscription-icon-btn"
                                                            id={value?.userSubscriptionId + "delete"}
                                                            size="sm"
                                                            variant="danger"
                                                            onClick={() => handleActionClick(value?.userSubscriptionId)}
                                                            hidden={isHidden({ module: { key: "Subscription", value: "D" } })}
                                                            disabled={["cancelled", "expired", "renewed", "upgraded", "rejected"].includes(value?.status)}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={tableHeaders.length} className="text-center py-4 subscription-empty">
                                            No data Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
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
