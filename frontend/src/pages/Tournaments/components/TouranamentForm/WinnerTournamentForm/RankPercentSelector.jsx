import React, { useEffect, useState } from "react";
import {
    Col,
    Row,
    Form as BForm,
    Button,
    Table
} from '@themesberg/react-bootstrap'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Trigger from "../../../../../components/OverlayTrigger";

const generatePlayerRankMapFromWinnerPercentage = (winnerPercentage) => {
    const playerRankMap = [];
    let previousPercentage = winnerPercentage[0];
    let playerCount = 0;

    winnerPercentage.forEach((percent, index) => {
        if (previousPercentage === percent) {

            playerCount = playerCount + 1;
            if (index + 1 === winnerPercentage.length) {
                playerRankMap.push({
                    playerCount,
                    rankPercentage: Math.round(previousPercentage * playerCount),
                });
            }
        }
        else {
            playerRankMap.push({
                playerCount,
                rankPercentage: Math.round(previousPercentage * playerCount),
            });
            if (index + 1 === winnerPercentage.length) {
                playerCount = 1

                playerRankMap.push({
                    playerCount: 1,
                    rankPercentage: Math.round(percent * playerCount),
                });

            }
            playerCount = 1;
        }
        previousPercentage = percent;
    });
    return playerRankMap;
};

const calculateWinnerPercentage = (playerRankMap) => {
    const winnerPercentage = [];

    playerRankMap.forEach(({ playerCount,
        rankPercentage }) => {

        let amountPercentagePerPlayer = rankPercentage / playerCount;
        amountPercentagePerPlayer = Number(amountPercentagePerPlayer.toFixed(2));
        for (let i = 1; i <= playerCount; i++) {
            winnerPercentage.push(amountPercentagePerPlayer);
        }
    });
    return winnerPercentage;
}

const RankPercentSelector = ({ setFieldValue, numberOfWinners, tournamentData, isDisabled }) => {
    const [playerCount, setPlayerCount] = useState();
    const [rankPercentage, setRankPercentage] = useState();
    const [totalData, setTotalData] = useState({ playerTotal: 0, percentageTotal: 0 });
    const [playerRankMap, setPlayerRankMap] = useState([]);
    const [editedRowIndex, setEditedRowIndex] = useState(null);
    // const [winnerPercentage, setWinnerPercentage] = useState([]);
    const [error, setError] = useState();


    const resetCountAndRank = () => {
        setPlayerCount('');
        setRankPercentage('');
    }
    const validateData = () => {
        if (playerRankMap?.length) {

            // if (winnerPercentage.some(percent => percent < 1)) {
            //     setError('Per player % should not be less than 1.');
            //     return;
            // }

            if (totalData.playerTotal > numberOfWinners || totalData.playerTotal < numberOfWinners) {
                setError(`Total player should be equal to number of winners(${numberOfWinners})`);
                return;
            }

            if (totalData.percentageTotal > 100 || totalData.percentageTotal < 100) {
                setError('Total winning % should be equal to 100.');
                return;
            }


        }
        setError();

    }

    useEffect(() => {
        if (tournamentData) {
            const { winnerPercentage = [] } = tournamentData;
            if (winnerPercentage.length) {
                const rankMap = generatePlayerRankMapFromWinnerPercentage(winnerPercentage);
                if (rankMap && rankMap.length) {
                    setPlayerRankMap(rankMap);
                    updateTotalCount(rankMap)
                }
            }
        }
    }, [tournamentData])

    useEffect(() => {
        validateData();
    }, [totalData.playerTotal, totalData.percentageTotal, playerRankMap.length, numberOfWinners]);

    const updateTotalCount = (updatedPlayerRankMap) => {

        let playerTotal = 0;
        let percentageTotal = 0;
        updatedPlayerRankMap.forEach((rankObject) => {
            playerTotal = playerTotal + rankObject.playerCount;
            percentageTotal = percentageTotal + rankObject.rankPercentage;

        })

        setTotalData({ playerTotal, percentageTotal });
    }

    const handleAddRank = () => {
        const updatedPlayerRankMap = [...playerRankMap, {
            playerCount,
            rankPercentage
        }]

        updateTotalCount(updatedPlayerRankMap)
        setPlayerRankMap(updatedPlayerRankMap);
        const updatedWinnerPercentage = calculateWinnerPercentage(updatedPlayerRankMap);
        setFieldValue('winnerPercentage', updatedWinnerPercentage);
        // setWinnerPercentage(updatedWinnerPercentage)
        resetCountAndRank();
    }

    const handleOnEdit = ({ editObject, editRowIndex }) => {
        setPlayerCount(editObject.playerCount);
        setRankPercentage(editObject.rankPercentage);
        setEditedRowIndex(editRowIndex + 1);

        const updatedPlayerRankMap = [...playerRankMap];
        updateTotalCount(updatedPlayerRankMap);
    }

    const handleOnDelete = ({ deletedIndex }) => {
        const updatedPlayerRankMap = playerRankMap.filter((data, index) => index !== deletedIndex);
        setPlayerRankMap(updatedPlayerRankMap);
        updateTotalCount(updatedPlayerRankMap);
        const updatedWinnerPercentage = calculateWinnerPercentage(updatedPlayerRankMap);
        setFieldValue('winnerPercentage', updatedWinnerPercentage);
        // setWinnerPercentage(updatedWinnerPercentage)
    }

    const handleUpdateRank = () => {
        const updatedPlayerRankMap = [...playerRankMap];
        updatedPlayerRankMap[editedRowIndex - 1] = {
            ...updatedPlayerRankMap[editedRowIndex - 1],
            playerCount,
            rankPercentage
        }

        setPlayerRankMap(updatedPlayerRankMap);
        updateTotalCount(updatedPlayerRankMap);


        const updatedWinnerPercentage = calculateWinnerPercentage(updatedPlayerRankMap);
        setFieldValue('winnerPercentage', updatedWinnerPercentage);
        // setWinnerPercentage(updatedWinnerPercentage)
        resetCountAndRank();
        setEditedRowIndex(null);
    }

    return <div className='mt-3 my class'>

        <Row className='mt-3'>
            <BForm.Label>
                {editedRowIndex ? `Editing Rank ${editedRowIndex}:` : `Rank ${playerRankMap.length + 1}: Add Player Count and winning amount %`}
            </BForm.Label>
            <Col md={5} sm={12}>
                <BForm.Label>
                    {`Enter number of Player for Rank ${editedRowIndex ? editedRowIndex : playerRankMap.length + 1}`}
                    <span className='text-danger'> *</span>
                </BForm.Label>
                <BForm.Control
                    type='number'
                    id={`playerCount`}
                    min='1'
                    max='100'
                    name={`playerCount`}
                    onKeyDown={(e) => {
                        if (["e", ".", "-"].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    placeholder={`Enter player count`}
                    value={playerCount}
                    disabled={isDisabled}
                    onChange={(e) => {
                        if (e.target.value) {
                            setPlayerCount(Number(e.target.value))

                        } else {
                            setPlayerCount();
                        }
                    }}

                />
            </Col>
            <Col md={5} sm={12}>
                <BForm.Label>
                    {`Enter winning % for Rank ${editedRowIndex ? editedRowIndex : playerRankMap.length + 1}`}
                    <span className='text-danger'> *</span>
                </BForm.Label>
                <BForm.Control
                    type='number'
                    id={`rankPercentage`}
                    min='1'
                    max='100'
                    name={`rankPercentage`}
                    onKeyDown={(e) => {
                        if (["e", ".", "-"].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    placeholder={`Enter rank winning %`}
                    value={rankPercentage}
                    disabled={isDisabled}
                    onChange={(e) => {
                        if (e.target.value) {
                            setRankPercentage(Number(e.target.value))
                        } else {
                            setRankPercentage();
                        }
                    }}

                />
            </Col>
            <Col md={2} sm={12}>{
                editedRowIndex ? <Button variant='secondary' className="btn-align" onClick={handleUpdateRank} type='button'>Update</Button> :
                    <Button variant='secondary' className="btn-align" onClick={handleAddRank} type='button' disabled={!playerCount || !rankPercentage || isDisabled}>Add</Button>
            }</Col>
        </Row>
        <Table bordered striped responsive hover size='sm' className='text-center mt-4'>
            <thead className='thead-dark'>
                <tr>
                    <th>
                        Rank
                    </th>
                    <th>
                        Player Count
                    </th>
                    <th>
                        Winning %
                    </th>
                    {!isDisabled && <th>
                        Action
                    </th>}
                </tr>
            </thead>

            <tbody>
                {playerRankMap.length > 0 && playerRankMap.map((playerRankObject, index) => {
                    return (
                        <tr key={`playerRank-${index}`}
                        >
                            <td>{index + 1}</td>
                            <td>{playerRankObject.playerCount}</td>
                            <td>{playerRankObject.rankPercentage}</td>
                            {!isDisabled && <td>
                                <Trigger message={'Edit'} id={`playerRank-${index}`} />
                                <Button
                                    id={`playerRank-${index}`}
                                    size='sm'
                                    variant='warning'
                                    className="me-2"
                                    onClick={() => {
                                        handleOnEdit({ editObject: playerRankObject, editRowIndex: index });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button>

                                <Trigger message={'Delete'} id={`playerRankDelete-${index}`} />
                                <Button
                                    id={`playerRankDelete-${index}`}
                                    size='sm'
                                    variant='warning'
                                    onClick={() => {
                                        handleOnDelete({ deletedIndex: index });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>

                            </td>}
                        </tr>
                    )
                })
                }
                {playerRankMap.length > 0 && <tr
                >

                    <td></td>
                    <td>Total Player - {totalData.playerTotal}</td>
                    <td>Total Percentage - {totalData.percentageTotal}</td>
                    {!isDisabled && <td></td>}
                </tr>
                }

                {playerRankMap?.length === 0 &&
                    <tr>
                        <td colSpan={4} className='text-danger text-center'>
                            Please add rank data first.
                        </td>
                    </tr>}


            </tbody>
        </Table>
        {error && <div className='text-danger'> {error}</div>}
    </div>
}

export default RankPercentSelector;