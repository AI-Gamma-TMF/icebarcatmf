import React from "react";
import { Table } from "@themesberg/react-bootstrap";
import PaginationComponent from "../../../../../components/Pagination";
import { InlineLoader } from "../../../../../components/Preloader";

const GamesTournamentList = ({
    page,
    setLimit,
    limit,
    setPage,
    totalPages,
    loading,
    data,
    handleSelectGames,
    selectedGames,
    disabled,
    isViewMode,
    tournamentData
}) => {
    const tableHeaders = [
        { labelKey: '', value: '' },
        { labelKey: 'Game id', value: 'masterCasinoGameId' },
        { labelKey: 'Name', value: 'name' },
        { labelKey: 'Provider Name', value: 'providerName' },
    ]

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
                {loading ?
                    (<tr>
                        <td colSpan={10} className="text-center">
                            <InlineLoader />
                        </td>
                    </tr>) :
                    <tbody>
                        {isViewMode && tournamentData?.games?.length ?
                            tournamentData?.games?.map((game, index) => {
                                return (
                                    <tr key={index} className="text-center" style={{
                                        height: "40px",
                                        verticalAlign: "middle",
                                    }}>
                                        <td><input
                                            name='selectAll'
                                            type='checkbox'
                                            className='m-1 form-check-input  game-button cursor-pointer'
                                            checked={selectedGames?.includes(game?.masterCasinoGameId)}
                                            onChange={() => { handleSelectGames(game) }}
                                            disabled={disabled}
                                        /></td>
                                        <td>{game?.masterCasinoGameId}</td>
                                        <td>{game?.name}</td>
                                        <td>{game?.providerName}</td>
                                    </tr>
                                )
                            }) : data?.games?.data && data?.games?.data?.length > 0 ? (
                                data?.games?.data?.map((value, index) => (
                                    <tr key={index} className="text-center" style={{
                                        height: "40px",
                                        verticalAlign: "middle",
                                    }}>
                                        <td><input
                                            name='selectAll'
                                            type='checkbox'
                                            className='m-1 form-check-input  game-button cursor-pointer'
                                            checked={selectedGames?.includes(value?.masterCasinoGameId)}
                                            onChange={() => { handleSelectGames(value) }}
                                        /></td>
                                        <td>{value?.masterCasinoGameId}</td>
                                        <td>{value?.name}</td>
                                        <td>{value?.providerName}</td>
                                    </tr>
                                )
                                )
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-danger text-center">
                                        No data Found
                                    </td>
                                </tr>
                            )}
                    </tbody>
                }
            </Table>



            {!isViewMode && data?.games?.count !== 0 && (
                <PaginationComponent
                    page={data?.games?.count < page ? setPage(1) : page}
                    totalPages={totalPages}
                    setPage={setPage}
                    limit={limit}
                    setLimit={setLimit}
                />
            )}

        </>
    );
};

export default GamesTournamentList;
