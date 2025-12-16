import { Button, Col, Row, Form } from "@themesberg/react-bootstrap";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import GamesTournamentList from "./GamesTournamentList";
import SelectedGamesTable from "./SelectedGamesTable";
import useAddTournamentGames from "../../../hooks/useAddTournamentGames";
import Trigger from "../../../../../components/OverlayTrigger";

const generateProviderFilterOptions = (list) => {
    return list.map((data) => ({ label: data?.name, value: data?.masterCasinoProviderId }));
};

const generateSubCategoryOptions = (list) => {
    return list.map((data) => ({ label: data?.name?.EN, value: data?.masterGameSubCategoryId }));
};

const AddGamesForm = ({
    providerList = [],
    subCategoryList = [],
    setSelectedGames,
    selectedGames,
    disabled,
    isViewMode,
    tournamentData,
    type
}) => {
    const [providerOptions, setProviderOptions] = useState([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const {
        setLimit,
        setPage,
        totalPages,
        limit,
        page,
        GamesData,
        search,
        setSearch,
        resetFilters,
        providerFilter,
        setProviderFilter,
        subCategoryFilter,
        setSubCategoryFilter,
    } = useAddTournamentGames({ setSelectedGames, isViewMode, type });
    const [selectedGamesRow, setSelectedGamesRow] = useState([])

    useEffect(() => {
        if (type !== 'CREATE' && tournamentData?.games?.length) {
            const gameIds = tournamentData?.games?.map((game) => game?.masterCasinoGameId);
            setSelectedGames(gameIds);
            setSelectedGamesRow(tournamentData?.games);
        }
    }, [tournamentData]);

    useEffect(() => {
        if (providerOptions?.length !== providerList?.length) {
            const updatedProviderOptions = generateProviderFilterOptions(providerList);
            setProviderOptions([{ label: 'All', value: 'all' }, ...updatedProviderOptions]);
        }

        if (subCategoryOptions?.length !== subCategoryList?.length) {
            const updatedSubCategoryOptions = generateSubCategoryOptions(subCategoryList);
            setSubCategoryOptions([{ label: 'All', value: 'all' }, ...updatedSubCategoryOptions]);
        }
    }, [providerList.length, subCategoryList.length]);

    const handleSelectGames = (game) => {
        const { masterCasinoGameId: selectedGameId } = game;
        const { games: { data } } = GamesData;

        if (selectedGames?.includes(selectedGameId)) {
            const updatedGames = selectedGames.filter(id => id !== selectedGameId);
            const updateSelectedGamesRow = selectedGamesRow.filter(
                ({ masterCasinoGameId }) => masterCasinoGameId !== selectedGameId
            );
            setSelectedGames(updatedGames);
            setSelectedGamesRow(updateSelectedGamesRow);
        } else {
            const updatedGames = [...selectedGames, selectedGameId];
            const currentSelectedGame = data?.find(
                ({ masterCasinoGameId }) => masterCasinoGameId === selectedGameId
            );
            setSelectedGames(updatedGames);
            setSelectedGamesRow([...selectedGamesRow, currentSelectedGame]);
        }
    };

    const handleClearAll = () => {
        // Clear all selected games
        setSelectedGames([])
        setSelectedGamesRow([]);
    };

    return (
        <>
            {isViewMode ? '' :
                <Row className="w-100 m-auto">
                    <Col xs="12" sm="6" lg="3" className="mb-3">
                        <Form.Label
                            style={{
                                marginBottom: "0",
                                marginRight: "15px",
                                marginTop: "5px",
                            }}
                        >
                            {"Search"}
                        </Form.Label>

                        <Form.Control
                            type="search"
                            value={search}
                            placeholder="Type game name here"
                            onChange={(event) => {
                                setPage(1);
                                setSearch(event.target.value.replace(/[~`%^#)()><?]+/g, ""));
                            }}
                            disabled={disabled}
                        />
                    </Col>

                    <Col xs='12' lg='3'>
                        <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
                            <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                                {"Provider"}
                            </Form.Label>

                            <Form.Select
                                value={providerFilter}
                                onChange={(e) => {
                                    setPage(1);
                                    setProviderFilter(e.target.value);
                                }}
                                disabled={disabled}
                            >
                                {providerOptions?.map(({ label, value }) => {
                                    return (
                                        <option key={label} value={value}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </div>
                    </Col>

                    <Col xs='12' lg='3'>
                        <div className='d-flex justify-content-start align-items-center w-100 flex-wrap'>
                            <Form.Label column='sm' style={{ marginBottom: '0', marginRight: '15px' }}>
                                {"Sub-Category"}
                            </Form.Label>

                            <Form.Select
                                value={subCategoryFilter}
                                onChange={(e) => {
                                    setPage(1);
                                    setSubCategoryFilter(e.target.value);
                                }}
                                disabled={disabled}
                            >
                                {subCategoryOptions?.map(({ label, value }) => {
                                    return (
                                        <option key={label} value={value}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </div>
                    </Col>

                    <Col
                        xs="12"
                        sm="6"
                        lg="1"
                        className="d-flex align-items-end mt-2 mt-sm-0 mb-0"
                    >
                        <Trigger message="Reset Filters" id={"redo"} />
                        <Button
                            id={"redo"}
                            variant="success"
                            onClick={resetFilters}
                            disabled={disabled}
                            style={{
                                position: "relative",
                                top: "-14px"
                            }}
                        >
                            <FontAwesomeIcon icon={faRedoAlt} />
                        </Button>
                    </Col>
                    <Col xs="12" sm="6" lg="2" className="d-flex align-items-center justify-content-end pt-3 mt-sm-0 mb-0">                        <Trigger message="Clear All" id={"clear"} />
                        <Button
                            id={"clear"}
                            variant="success"
                            onClick={() => handleClearAll()}
                            style={{ marginLeft: "auto", whiteSpace: 'nowrap', boxShadow: "none", fontWeight: '700' }}                        >
                            Clear All
                        </Button>
                    </Col>
                </Row>
            }

            {!isViewMode && selectedGamesRow?.length > 0 && (
                <div className="mt-4">
                    <h5>Selected Games</h5>
                    <SelectedGamesTable gamesData={selectedGamesRow} />
                </div>
            )}

            <GamesTournamentList
                page={page}
                setLimit={setLimit}
                limit={limit}
                setPage={setPage}
                totalPages={totalPages}
                data={GamesData}
                handleSelectGames={handleSelectGames}
                selectedGames={selectedGames}
                disabled={disabled}
                isViewMode={isViewMode}
                tournamentData={tournamentData}
            />
        </>
    );
};

export default AddGamesForm;
