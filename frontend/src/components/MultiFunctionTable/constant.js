import React from 'react';
import moment from 'moment';
import Trigger from '../OverlayTrigger';
import { Button } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheckSquare, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { useNavigate , Link } from 'react-router-dom';
import { AdminRoutes } from '../../routes';
import useCheckPermission from '../../utils/checkPermission';
// Wrap the columns definition in a function to access hooks like useNavigate
export const useAllColumns = (handleStatusShow) => {
    const navigate = useNavigate();
    const { isHidden } = useCheckPermission()
    return [
        {id:'userId', accessorKey: 'userId', header: 'ID', enableResizing: true },
        {
            id:'email',
            accessorKey: 'email',
            header: 'Email',
            enableResizing: true,
            cell: ({ row }) => {
                const actioneeEmail = row.original.email;
                const userId = row.original.userId; // ensure `userId` exists in your data
                return isHidden({ module: { key: "Users", value: "R" } }) ? (
                    actioneeEmail
                ) : (
                    <Link to={`/admin/player-details/${userId}`}    className="text-link d-inline-block text-truncate">{actioneeEmail}</Link>
                );
            },
        },
        {
            id:'createdAt',
            accessorKey: 'createdAt',
            header: 'Registration Date',
            enableResizing: true,
            cell: info => {
                const date = info.getValue();
                return date ? moment(date).format('MM/DD/YYYY') : 'NA';
            },
        },
        {
            id:'username',
            accessorKey: 'username',
            header: 'Username',
            enableResizing: true,
            cell: info => info.getValue() || 'NA',
        },
        {
            id:'firstName',
            accessorKey: 'firstName',
            header: 'Name',
            enableResizing: true,
            cell: info => info.getValue() || 'NA',
        },
        {
            id: 'scBalance',
            // accessorKey:'scBalance',
            header: 'SC Balance',
            accessorFn: row => row.userWallet?.scBalance,
            enableResizing: true,
        },
        {
            id: 'totalPurchaseAmount',
            header: 'Total Purchase Amount',
            accessorFn: row => row.UserReport?.totalPurchaseAmount,
            enableResizing: true,
        },
        {
            id: 'totalRedemptionAmount',
            header: 'Total Redemption Amount',
            accessorFn: row => row.UserReport?.totalRedemptionAmount,
            enableResizing: true,
        },
        {
            id: 'playThrough',
            header: 'Play Through',
            accessorFn: row => row.UserReport?.playThrough,
            enableResizing: true,
        },
        {
            id:'lastLoginDate',
            accessorKey: 'lastLoginDate',
            header: 'Last Login',
            enableResizing: true,
            cell: info => {
                const date = info.getValue();
                return date ? moment(date).format('MM/DD/YYYY') : 'NA';
            },
        },
        {
            id: 'tierName',
            header: 'Tier Name',
            accessorFn: row => row.UserTier?.tierName || 'NA',
            enableResizing: true,
        },
        {
            id: 'rsg',
            // accessorKey:'rsg',
            header: 'RSG',
            enableResizing: true,
            cell: ({ row }) => {
                const value = row.original.rsg?.type || 'NA';
                const msg = row.original.rsg?.message  
                const player = row.original;
                return (<>
                    {value != undefined ?
                        <>
                            <Trigger message={msg} id={`${player.userId}-rsg-msg`} />
                            <span id={`${player.userId}-rsg-msg`}>{value}</span>
                        </>
                        : <span>NA</span>}
                </>
                );
            },
        },
        {
            id:'status',
            accessorKey: 'status',
            header: 'Status',
            enableResizing: true,
            cell: info => {
                const status = info.getValue(); // e.g., 'Active', 'Inactive', etc.
               
                const className = status === 'Active' ? 'text-success' : 'text-danger';

                return <span className={className}>{status}</span>;
            },
        },
        {
            id: 'action',
            header: 'Action',
            enableResizing: true,
            cell: ({ row }) => {
                const player = row.original;
                const detailPath = `${AdminRoutes.PlayerDetails.split(':')[0]}${player.userId}`;

                return (
                    <>
                        <Trigger message="View" id={`${player.userId}-view`} />
                        <Button
                            id={`${player.userId}-view`}
                            className="m-1"
                            size="sm"
                            variant="info"
                            onClick={() => navigate(detailPath)}
                        >
                            <FontAwesomeIcon icon={faEye} />
                        </Button>

                        <div
                            id={`contextMenu-${player.userId}`}
                            style={{
                                position: 'fixed',
                                display: 'none',
                                backgroundColor: 'white',
                                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: '5px',
                                padding: '5px',
                                zIndex: 9999,
                            }}
                        >
                            <div
                                onClick={() => {
                                    window.open(detailPath, '_blank');
                                    document.getElementById(`contextMenu-${player.userId}`).style.display = 'none';
                                }}
                                style={{ cursor: 'pointer', padding: '5px' }}
                            >
                                Open in new tab
                            </div>
                        </div>

                        {player.status !== 'Active' ? (
                            <>
                                <Trigger message="Set Status" id={`${player.userId}-active`} />
                                <Button
                                    id={`${player.userId}-active`}
                                    className="m-1"
                                    size="sm"
                                    variant="success"
                                    onClick={() => handleStatusShow(player.userId, player.status, player.statusDetails, player)}
                                >
                                    <FontAwesomeIcon icon={faCheckSquare} />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Trigger message="Set Status" id={`${player.userId}-inactive`} />
                                <Button
                                    id={`${player.userId}-inactive`}
                                    className="m-1"
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleStatusShow(player.userId, player.status, player.statusDetails, player)}
                                >
                                    <FontAwesomeIcon icon={faWindowClose} />
                                </Button>
                            </>
                        )}
                    </>
                );
            },
        },
    ];
};


export const initialSet = {
    idSearch: null,
    emailSearch: '',
    firstNameSearch: '',
    lastNameSearch: '',
    userNameSearch: '',
    phoneSearch: '',
    tierSearch: '',
    affiliateIdSearch: '',
    regIpSearch: '',
    lastIpSearch: '',
    statusSearch: 'all',
    filterBy: '',
    operator: '',
    value: ''
}