import React from 'react';
// import Menu from '@mui/material/Menu'
// import MenuItem from '@mui/material/MenuItem'
// import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
// import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded'
// import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded'
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
// import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import {
    Button,
  } from '@themesberg/react-bootstrap'
const ActionMenu = (_props) => {
    // const { gameAggregatorId,isActive,name, status ,handleStatusShow , isHidden } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl)
    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }
    // const handleClose = () => {
    //     setAnchorEl(null)
    // }
    return (
        <>
            <Button
                variant='btn text-btn'
                id='basic-button'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
                }}
            >
                {/* <MoreVertRoundedIcon /> */}
            </Button>
            {/* <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button'
                }}
            > */}
                {/* <MenuItem onClick={handleClose}>
                        <Button
                            variant='btn text-btn'
                        onClick={() => {
                            setCountryData((prev) => ({ ...prev, countryName, countryId, kycMethod: kycMethod || 0, languageId: language?.languageId }))
                            setShowKycUpdateModal(true)
                        }}
                        >
                        <BorderColorRoundedIcon />
                    <span className='text'>Edit</span>
                        </Button>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>

                        <Button
                        variant='btn text-btn'
                        onClick={() => navigate(`/admin/countries/restricted-games/${countryId}`)}
                        
                        >
                        <RemoveRedEyeRoundedIcon />
                    <span className='text'>View Blocked Games</span>
                        </Button>
                    </MenuItem>
                
                    <MenuItem onClick={handleClose}>
                        <Button
                        variant='btn text-btn'
                        
                        onClick={() => navigate(`/admin/countries/restricted-providers/${countryId}`)}
                        >
                        <RemoveRedEyeRoundedIcon />
                    <span className='text'>View Blocked Providers</span>                                      </Button>
                    </MenuItem> */}
                    {/* <MenuItem onClick={handleClose}>
                    {!status
                        ? (
                            <Button
                            variant='btn text-btn'
                            onClick={() =>
                                       handleStatusShow(
                                           gameAggregatorId,
                                           isActive,
                                            name
                                         )}
                                      hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                            >
                                <CheckCircleRoundedIcon />
                                <span className='text'>Active</span>
                            </Button>
                        )
                        : (
                        <Button
                        variant='btn text-btn'
                        onClick={() =>
                                      handleStatusShow(
                                        gameAggregatorId,
                                        isActive,
                                        name
                                      )}
                        hidden={isHidden({ module: { key: 'CasinoManagement', value: 'T' } })}
                        >
                            <CancelRoundedIcon />
                            <span className='text'>In-Active</span>
                        </Button>
                        
                    )}
                </MenuItem> */}
            {/* </Menu> */}
        </>
    )
};

export default ActionMenu;