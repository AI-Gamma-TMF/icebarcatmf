import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { DateRange } from 'react-date-range'
import { formatDateMDY } from '../../utils/dateFormatter'
import useOutsideClick from '../../utils/useOutsideClick'
import './DateRangePicker.scss'

const DateRangePicker = ({ state, setState, size,  startDate,endDate,_timeZoneCode}) => {
  const { ref, isVisible, setIsVisible } = useOutsideClick(false)

 return (
    <div className='custom-container'>
      <input
        readOnly
        className={
          size ? `form-control form-control-${size}` : 'custom-input-field'
        }
        onClick={() => setIsVisible(!isVisible)}
        value={`${startDate} to ${endDate}`}
      />

      {isVisible && (
        <div ref={ref} style={{ zIndex: '9999', maxWidth: '350px' }}>
          <DateRange
            editableDateInputs
            onChange={(item) => {
              setState([item.selection])
            }}
            moveRangeOnFirstSelection={false}
            ranges={state}
            maxDate={new Date()}
          />
        </div>
      )}
    </div>
  )
}

export default DateRangePicker

export const DateRangePickerWithoutInput = ({ state, setState }) => {
  const { ref, isVisible, setIsVisible } = useOutsideClick(false)
  return (
    <div className='custom-container date d-flex align-items-center'>
      <span
        className='mt-2 d-flex '
        style={{ cursor: 'pointer' }}
        onClick={() => setIsVisible(!isVisible)}
      >
        {formatDateMDY(state?.[0].startDate)} - {formatDateMDY(state?.[0].endDate)}&nbsp;  PERIOD &nbsp; <FontAwesomeIcon icon={faCalendarAlt} className='mt-1' />{' '} &nbsp;
      </span>

      {isVisible && (
        <div ref={ref} style={{ zIndex: '9999', position: 'absolute', top: '40px', right: '0px' }}>
          <DateRange
            editableDateInputs
            onChange={(item) => {
              setState([item.selection])
            }}
            moveRangeOnFirstSelection={false}
            ranges={state}
          />
        </div>
      )}
    </div>
  )
}
