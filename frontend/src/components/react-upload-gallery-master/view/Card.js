import React, { useState } from 'react';
import RefreshIcon from './RefreshIcon';
import { toast } from '../../Toast';
import useCheckPermission from '../../../utils/checkPermission';

const Card = ({ image, ...props }) => {
  const {
    uid,
    name,
    size,
    done,
    click,
    error,
    remove,
    source,
    upload,
    refresh,
    progress,
    uploading,
  } = image;

  const [spin, setSpin] = useState(false);

  const handleCopy = (source) => {
    navigator.clipboard
      .writeText(source)
      .then(() => toast('URL copied to clipboard', 'success'))
      .catch(() => toast('Failed to copy URL', 'error'));
  };

  const { isHidden } = useCheckPermission();

  const handleRefresh = () => {
    if (spin) return;

    setSpin(true);

    setTimeout(() => {
      setSpin(false);
      if (typeof refresh === 'function') {
        refresh();
      }
    }, 700);
  };

  return (
    <div
      {...props}
      key={uid}
      className={`rug-card ${error ? '__error' : ''}`}
    >
      {(name || size) && (
        <div className="rug-card-name" onClick={click}>
          <div>
            {name}
            <div className="rug-card-size">{size}</div>
          </div>
        </div>
      )}

      <div
        className="rug-card-copy"
        onClick={(e) => {
          e.stopPropagation();
          handleCopy(source);
        }}
        title="Copy image URL"
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: '5px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </div>

      <div
        style={{ backgroundImage: `url(${source})` }}
        onClick={click}
        className="rug-card-image"
      />

      {!done && !error && uploading && (
        <>
          <svg viewBox="0 0 36 38" className="rug-card-progress">
            <path
              className="__progress-cricle"
              style={{ strokeDasharray: `${progress}, 100` }}
              d="M18 2.5845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          <div className="rug-card-progress-count">{progress}</div>
        </>
      )}

      {!(done || error || uploading) && (
        <div onClick={upload} className="rug-card-upload-button">
          <svg viewBox="0 -5 32 52">
            <g>
              <polyline points="1 19 1 31 31 31 31 19" />
              <polyline className="__arrow" points="8 9 16 1 24 9" />
              <line className="__arrow" x1="16" x2="16" y1="1" y2="25" />
            </g>
          </svg>
        </div>
      )}

      {error && typeof refresh === 'function' && (
        <div
          onClick={handleRefresh}
          className={`rug-card-refresh ${spin ? '__spin' : ''}`}
        >
          <div style={{ padding: 7 }}>
            <RefreshIcon />
          </div>
        </div>
      )}

      <div className="rug-card-remove" onClick={remove}
        hidden={isHidden({ module: { key: "Gallery", value: "D" } })}>
        <svg className="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24">
          <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
        </svg>
      </div>
    </div>
  );
};

export default Card;
