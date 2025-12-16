import React, { useEffect, useState } from "react";
import { Table } from "@themesberg/react-bootstrap";
import PaginationComponent from "../../../../../components/Pagination";

const SelectedUserTable = ({ userData = [] }) => {
    const [userRow, setUserRow] = useState([])
    const [limit, setLimit] = useState(15)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const updatedTotalPages = Math.ceil(userData?.length / limit)
        const currentRow = userData?.slice(limit * (page - 1), limit * page)
        setUserRow(currentRow)
        setTotalPages(updatedTotalPages)
    }, [userData?.length, page, limit])

    return (
        <>
            <Table
                bordered
                striped
                responsive
                hover
                size="sm"
                className="text-center mt-2"
            >
                <thead className="thead-dark">
                    <tr>
                        <th>USER ID</th>
                        <th>USERNAME</th>
                        <th>EMAIL</th>
                        <th>TIER NAME</th>
                    </tr>
                </thead>
                <tbody>
                    {userRow?.map((user, idx) => (
                        <tr key={idx}>
                            <td>{user?.userId}</td>
                            <td>{user?.username}</td>
                            <td>{user?.email}</td>
                            <td>{user?.tierName || user?.UserTier?.tierName}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add pagination for selected user rows */}
            <PaginationComponent
                page={page}
                totalPages={totalPages}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
            />

        </>
    )
}

export default SelectedUserTable