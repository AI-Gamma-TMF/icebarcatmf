import { Button, Col, Row, Form } from "@themesberg/react-bootstrap";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import VIPTournamentList from "./VIPTournamentList";
import SelectedUserTable from "./SelectedUserTable";
import Trigger from "../../../../../components/OverlayTrigger";
import useVIPTournament from "../../../hooks/useVIPTournament";


const AddVIPTournament = ({ selectedUser, setSelectedUser, isViewMode, disabled, tournamentData, type, setFieldValue, csvData }) => {
    const {
        setLimit,
        setPage,
        totalPages,
        limit,
        page,
        UserData,
        loading,
        emailSearch,
        setEmailSearch,
        tierSearch,
        setTierSearch,
        resetFilters,
        playerId,
        setPlayerId,
        username,
        setUsername,
        tierList
        // vipStatus,
        // setVipStatus
    } = useVIPTournament({ setSelectedUser, isViewMode, type });

    const tierOptions = tierList?.rows

    // useEffect(() => {
    //     return () => {
    //         setSelectedUser([]);
    //     };
    // }, []);

    useEffect(() => {
        if (csvData?.data?.data?.allowedUsersArray) {
            const importedUsers = csvData?.data?.data?.allowedUsersArray;

            // Avoid duplicating users in selectedUser state
            const newSelectedUser = [...selectedUser];

            importedUsers.forEach(user => {
                const userExists = selectedUser?.some(({ userId }) => userId === user.userId);

                if (!userExists) {
                    newSelectedUser.push(user);
                }
            });
            setSelectedUser(newSelectedUser);
        }
    }, [csvData?.data?.data?.allowedUsersArray]); // Dependency array to track changes in csvData

    const handleSelectUsers = (user) => {
        const { userId: selectedUserId } = user;

        const selectedUserIds = selectedUser?.map(({ userId }) => userId)

        if (selectedUserIds?.includes(selectedUserId)) {
            const updatedUser = selectedUser.filter(({ userId }) => userId !== selectedUserId);
            setSelectedUser(updatedUser);
        } else {
            const updatedUser = [...selectedUser, user];
            setSelectedUser(updatedUser);
        }
    };

    const handleClearAll = () => {
        setSelectedUser([]);  // Reset the local selectedUser state
        setFieldValue("allowedUsers", []);
    };

    return (
        <>
            {isViewMode ? null : (
                <Row className="w-100 m-auto">
                    <Col xs="12" sm="6" lg="2" className="mb-3">
                        <Form.Label style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}>{"Email"}</Form.Label>
                        <Form.Control
                            type="text"
                            value={emailSearch}
                            placeholder="Email"
                            onChange={(event) => {
                                setPage(1);
                                setEmailSearch(event.target.value.replace(/[~`%^#)()><?]+/g, ""));
                            }}
                        />
                    </Col>

                    <Col xs="12" sm="6" lg="2" className="mb-3">
                        <Form.Label style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}>{"Player Id"}</Form.Label>
                        <Form.Control
                            type="text"
                            value={playerId}
                            placeholder="Player Id"
                            onChange={(event) => {
                                const inputValue = event.target.value;

                                // Allow only numeric characters, prevent others
                                if (/^\d*$/.test(inputValue)) {
                                    setPage(1);  // Reset to page 1 when changing the player ID
                                    setPlayerId(inputValue);  // Update playerId with the numeric value
                                }
                            }}
                        />
                    </Col>

                    <Col xs="12" sm="6" lg="2" className="mb-3">
                        <Form.Label style={{ marginBottom: "0", marginRight: "15px", marginTop: "5px" }}>{"Username"}</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            placeholder="User Name"
                            onChange={(event) => {
                                setPage(1);
                                setUsername(event.target.value);
                            }}
                        />
                    </Col>

                    <Col className='col-lg-2 col-sm-6 col-12'>
                        <Form.Group className='mb-3' controlId='formGroupTier'>
                            <Form.Label className="mb-1">Tier</Form.Label>
                            <Form.Select
                                as="select"
                                placeholder="Tier"
                                value={tierSearch} // Ensure tierSearch value is bound correctly
                                onChange={(event) => {
                                    setPage(1); // Reset to the first page when changing the tier
                                    setTierSearch(event.target.value); // Set the new tier value
                                }}
                            >
                                <option id={'none'} value='all'>All</option>
                                {tierOptions?.map((tier) => (
                                    <option key={`tier-${tier?.tierId}-${tier?.level}`} id={tier?.tierId} value={tier?.level}>
                                        {tier?.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* <Col className='col-lg-2 col-sm-6 col-12'>
                        <Form.Group className='mb-3' controlId='formGroupVip'>
                            <Form.Label className="mb-1">VIP Status</Form.Label>
                            <Form.Select
                                as="select"
                                placeholder="VIP Status"
                                value={vipStatus}
                                onChange={(event) => {
                                    setPage(1);
                                    setVipStatus(event.target.value);
                                }}
                            >
                                <option value='all'>All</option>
                                <option value='approved'>Approved</option>
                                <option value='pending'>Pending</option>
                                <option value='rejected'>Rejected</option>
                            </Form.Select>
                        </Form.Group>
                    </Col> */}

                    <Col xs="12" sm="6" lg="1" className="d-flex align-items-end mt-2 mt-sm-0 mb-1">
                        <Trigger message="Reset Filters" id={"redo"} />
                        <Button
                            id={"redo"}
                            variant="success"
                            onClick={resetFilters}
                            style={{ position: "relative", top: "-14px" }}
                        >
                            <FontAwesomeIcon icon={faRedoAlt} />
                        </Button>
                    </Col>
                </Row>
            )}
            <Row>
                <Col xs="12" sm="6" lg="3" className="d-flex align-items-end  mt-2 mt-sm-0 mb-0">
                    <Trigger message="Clear All" id={"clear"} />
                    <Button
                        id={"clear"}
                        variant="primary"
                        onClick={() => handleClearAll()}
                        style={{ position: "relative", top: "15px", marginLeft: "0", boxShadow: 'none', fontWeight: '700' }}
                    >
                        Clear All
                    </Button>
                </Col>
            </Row>

            {!isViewMode && selectedUser?.length > 0 && (
                <div className="mt-4">
                    <h5>Selected User</h5>
                    <SelectedUserTable userData={selectedUser} />
                </div>
            )}

            <VIPTournamentList
                page={page}
                setLimit={setLimit}
                limit={limit}
                setPage={setPage}
                totalPages={totalPages}
                data={UserData}
                handleSelectUsers={handleSelectUsers}
                selectedUser={selectedUser}
                disabled={disabled}
                isViewMode={isViewMode}
                tournamentData={tournamentData}
                loading={loading}
                type={type}
            />
        </>
    );
};

export default AddVIPTournament;
