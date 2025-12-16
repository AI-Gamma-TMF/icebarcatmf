import React, { useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-date-range';

const DateRangePicker = ({ onChange, onClose }) => {
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  const handleSelect = (ranges, event) => {
    event.stopPropagation();
    const { startDate, endDate } = ranges.selection;
    setRange({ startDate, endDate, key: 'selection' });

    if (onChange) {
      onChange({ startDate, endDate });
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const togglePicker = (e) => {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
      if (onClose) onClose();
    } else {
      setIsOpen(true);
    }
  };

  const handleApply = () => {
    setRange(range);
    setIsOpen(false);
    if (onChange) onChange(range);
    if (onClose) onClose();
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div ref={pickerRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <div
        onClick={(e) => togglePicker(e)}
        style={{
          width: '100%',
          // width: '50%',
          padding: '12px 16px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
        }}
      >
        {`${formatDate(range.startDate)} - ${formatDate(range.endDate)}`}
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1000,
            background: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            marginTop: '5px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DateRange
            ranges={[range]}
            onChange={(ranges) => handleSelect(ranges, event)}
            // months={2}
            moveRangeOnFirstSelection={false}
            // direction='horizontal'
            rangeColors={['#3f51b5']}
          />
          <div style={{ marginTop: '10px', textAlign: 'right' }}>
            <button
              onClick={handleApply}
              style={{
                padding: '8px',
                backgroundColor: '#3f51b5',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DateRangePicker;
