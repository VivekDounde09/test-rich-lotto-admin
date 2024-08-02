import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { patchReq } from '@/utils/apiHandlers';

function PoolsCard({ pool }) {
  const { entryFees, schedule, isActive, picks, duration, name } = pool;
  const [enabled, setEnabled] = useState(isActive);
  const displayNumbers = () => {
    let result = [];
    for (let i = 0; i < Math.min(3, picks.length); i++) {
      result.push(
        <div
          className="flex justify-center items-center h-7 w-7 rounded-full bg-primary-1600 text-[#595192]"
          key={picks[i]}
        >
          {picks[i]}
        </div>,
      );
    }
    if (picks.length > 5) {
      result.push('... ');
    }
    for (let i = Math.max(picks.length - 2, 3); i < picks.length; i++) {
      result.push(
        <div
          className="flex justify-center items-center h-7 w-7 rounded-full bg-primary-1600 text-[#595192]"
          key={picks[i]}
        >
          {picks[i] + ' '}
        </div>,
      );
    }

    return result;
  };

  const handleActiveDectiveClick = async () => {
    try {
      const res = await patchReq(`/pool-configurations/${pool.id}`, {
        isActive: !enabled,
      });
      const { status } = res;
      if (status) {
        setEnabled(!enabled);
      }
    } catch (error) {
      console.error(error);
    }
  };

  function convertMsToDHMString(durationInMs) {
    // Calculate total seconds
    var totalSeconds = Math.floor(durationInMs / 1000);

    // Calculate days
    var days = Math.floor(totalSeconds / (3600 * 24));
    totalSeconds %= 3600 * 24;

    // Calculate hours
    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;

    // Calculate minutes
    var minutes = Math.floor(totalSeconds / 60);

    // Construct the string
    var result = '';
    if (days > 0) {
      result += days + (days > 1 ? ' days ' : ' day ');
    }
    if (hours > 0) {
      result += hours + ' hrs ';
    }
    if (minutes > 0 || (days === 0 && hours === 0)) {
      // Show minutes if it's non-zero or if there are no days and hours
      result += minutes + ' min';
    }

    return result;
  }

  return (
    <div className="rounded-[10px] flex flex-col max-w-[300px] shadow-[0px_5px_13px_0px_#283FA333] min-w-[250px]">
      <div className="rounded-t-[10px] flex items-center justify-between  bg-primary-1700 p-2 px-4">
        <div>
          <h1 className="font-ubuntu font-medium text-16">Pool {name}</h1>
        </div>
        <div>
          <button
            onClick={() => handleActiveDectiveClick()}
            // onChange={setEnabled}
            className={`${
              enabled ? 'bg-[#FFA500]' : 'bg-[#EAEAEA]'
            } relative inline-flex h-6 w-11 items-center rounded-full border-[#C1C1C1] border`}
          >
            <span
              className={`${
                enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-3 w-3 transform rounded-full bg-white transition`}
            />
          </button>
        </div>
      </div>
      <div className="flex flex-col p-2 gap-2 ">
        <div className="">
          <p className="text-16 font-ubuntu font-normal">
            Entry Fees <span className="font-bold">${entryFees}</span>
          </p>
          <p className="text-16 font-ubuntu font-normal">
            Duration:{' '}
            <span className="font-bold">{convertMsToDHMString(duration)}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 w-full justify-between">
          {displayNumbers()}
        </div>
        <div className="flex flex-wrap gap-2">
          {schedule?.map((day) => (
            <div className="bg-[#FFA50036] rounded px-1 py-[2px]" key={day}>
              <p className="text-[#5949B3]">{day.slice(0, 3)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

PoolsCard.propTypes = {
  pool: PropTypes.object,
  i: PropTypes.number,
};

export default PoolsCard;
