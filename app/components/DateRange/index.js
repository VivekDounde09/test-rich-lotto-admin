import { reactIcons } from '@/utils/icons';
import React, { useState, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PropTypes } from 'prop-types';

const DateRange = ({ changeDateRange }) => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const datePickerRef = useRef();
  // [new Date(), new Date()]

  const handleCalendarIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <div className="flex">
      <div className="relative  ">
        <ReactDatePicker
          className="min-w-[340px]"
          ref={datePickerRef}
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
            changeDateRange(update);
          }}
          isClearable={true}
        />
        <span
          className="absolute ay-center left-5 text-xl cursor-pointer"
          onClick={handleCalendarIconClick}
        >
          {reactIcons.calendar}
        </span>
        <span
          onClick={handleCalendarIconClick}
          className="absolute ay-center right-3 cursor-pointer"
        >
          {reactIcons.shortDownArrow}
        </span>

        <span
          className="absolute ay-center right-9 text-black font-bold cursor-pointer"
          onClick={() => {
            setDateRange([]);
            changeDateRange([]);
          }}
        >
          {reactIcons.close}
        </span>
      </div>
    </div>
  );
};
DateRange.propTypes = {
  changeDateRange: PropTypes.func,
};
export default DateRange;
