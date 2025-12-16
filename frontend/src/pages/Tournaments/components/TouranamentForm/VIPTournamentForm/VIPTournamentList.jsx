import React from "react";
import { Table } from "@themesberg/react-bootstrap";
import PaginationComponent from "../../../../../components/Pagination";
import { InlineLoader } from "../../../../../components/Preloader";

const VIPTournamentList = ({
    page,
    setPage,
    limit,
    setLimit,
    data,
    totalPages,
    isViewMode,
    tournamentData,
    loading,
    handleSelectUsers,
    selectedUser,
    disabled,
}) => {

    const selectedIds = selectedUser?.map(({ userId }) => userId) || []

    const tableHeaders = [
        { labelKey: '', value: '' },
        { labelKey: 'Player Id', value: 'userId' },
        { labelKey: 'Email', value: 'email' },
        { labelKey: 'User Name', value: 'username' },
        { labelKey: 'Tier', value: 'tierName' },
    ];

    return (
        <>
            <Table
                bordered
                striped
                responsive
                hover
                size="sm"
                className="text-center mt-4"
            >
                <thead className="thead-dark">
                    <tr>
                        {tableHeaders?.map((h, idx) => (
                            <th
                                key={idx}
                                style={{
                                    cursor: 'pointer'
                                }}
                            >
                                {h.labelKey}
                            </th>
                        ))}
                    </tr>
                </thead>
                {!isViewMode && loading ? (
                    <tr>
                        <td colSpan={10} className="text-center">
                            <InlineLoader />
                        </td>
                    </tr>
                ) : (
                    <tbody>
                        {isViewMode && tournamentData?.allowedUsers?.length ? (
                            tournamentData?.allowedUsers?.map((user, index) => {
                                return (
                                    <tr key={index} className="text-center" style={{
                                        height: "40px",
                                        verticalAlign: "middle",
                                    }}>
                                        <td>
                                            <input
                                                name='selectAll'
                                                type='checkbox'
                                                className='m-1 form-check-input game-button cursor-pointer'
                                                checked={selectedIds?.includes(user?.userId)}
                                                onChange={() => { handleSelectUsers(user) }}
                                                disabled={disabled}
                                            />
                                        </td>
                                        <td>{user?.userId}</td>
                                        <td>{user?.email}</td>
                                        <td>{user?.username}</td>
                                        <td>{user?.tierName}</td>
                                    </tr>
                                );
                            })
                        ) : data?.users?.rows && data?.users?.rows?.length > 0 ? (
                            data?.users?.rows?.map((value, _index) => (
                                <tr key={value?.userId} className="text-center" style={{
                                    height: "40px",
                                    verticalAlign: "middle",
                                }}>
                                    <td>
                                        <input
                                            name='selectAll'
                                            type='checkbox'
                                            className='m-1 form-check-input game-button cursor-pointer'
                                            checked={selectedIds?.includes(value?.userId)}
                                            onChange={() => { handleSelectUsers(value) }}
                                        />
                                    </td>
                                    <td>{value?.userId}</td>
                                    <td>{value?.email}</td>
                                    <td>{value?.username}</td>
                                    <td>{value?.UserTier?.tierName}</td>
                                </tr>
                            ))
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

            {/* Pagination */}
            {!isViewMode && data?.user?.count !== 0 && (
                <PaginationComponent
                    page={data?.user?.count < page ? setPage(1) : page}
                    totalPages={totalPages}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            )}
        </>
    );
};

export default VIPTournamentList;
