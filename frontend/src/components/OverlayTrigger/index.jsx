import React from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import './style.css'

const Trigger = ({ message, id }) => {
  return (
    // <OverlayTrigger
    //   placement='bottom'
    //   delay={{ show: 100, hide: 200 }}
    //   overlay={<Tooltip style={{ margin: 0 }}>{message}</Tooltip>}
    // >
    //   {children}
    // </OverlayTrigger>
    <ReactTooltip className='react-tooltip' anchorId={id} place='bottom' content={message} />
  );
};

export default Trigger;
