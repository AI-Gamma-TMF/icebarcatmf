import { Table } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import PaginationComponent from "../../../../../components/Pagination";

const SelectedGamesTable = ({ gamesData = [] }) => {
    const [gamesRow, setGamesRow] = useState([])
    const [limit, setLimit] = useState(15)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const updatedTotalPages = Math.ceil(gamesData?.length / limit)
        const currentRow = gamesData?.slice(limit * (page - 1), limit * page)
        setGamesRow(currentRow)
        setTotalPages(updatedTotalPages)
    }, [gamesData?.length, page, limit])

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
                        <th>Game ID</th>
                        <th>Name</th>
                        <th>Provider</th>
                    </tr>
                </thead>
                <tbody>
                    {gamesRow.map((selectedGameData, idx) => (
                        <tr key={idx}>
                            <td>{selectedGameData.masterCasinoGameId}</td>
                            <td>{selectedGameData.name}</td>
                            <td>{selectedGameData.providerName}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add pagination for selected game rows */}
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

export default SelectedGamesTable