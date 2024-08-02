import { PoolTimer } from '@/components';
import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { patchReq } from '@/utils/apiHandlers';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { formatDateToTime } from '@/utils/helper';

const CurrentPoolCard = ({ item, handleEntryFeeClick, currentPage }) => {
  const [enabled, setEnabled] = useState(!item.pool.isActive);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Function to calculate time to expire
  const timeToExpire = (expireAt) => {
    return new Date(expireAt).getTime() - currentTime;
  };

  // Function to handle toggle button
  const handleToggleButton = () => {
    setEnabled(!enabled);
    setActiveStatus();
  };

  // Function to set active status
  const setActiveStatus = async () => {
    const data = {
      isActive: enabled, // Toggle isActive value
    };

    try {
      const res = await patchReq(`/pool/${item.pool.id}`, data);
      if (res.error) {
        toast.error(res.error.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  // Update currentTime whenever currentPage changes
  useEffect(() => {
    setCurrentTime(Date.now());
  }, [currentPage]);
  return (
    <div className="relative">
      <div
        onClick={() => handleEntryFeeClick(item)}
        className="cursor-pointer min-h-[200px] rounded-10 bg-white overflow-hidden flex items-center justify-evenly text-[#595192]"
      >
        {/* <div className="absolute ay-center left-1/3">
    <img src="/images/pool/center.png" alt="" />
  </div> */}

        <div className=" h-[200px]  relative bg-white px-5 pt-6 pl-16 flex flex-col items-center justify-center ">
          <div className="py-1  absolute top-6 -left-12 -rotate-45 bg-primary-1700">
            <div className="px-10 border-y border-dashed border-[#FFECCA]">
              <p className="text-black font-roboto text-12 font-bold">
                End time : {formatDateToTime(item.expireAt)}
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0">
            <img className="w-10" src="/images/pool/bottom.png" alt="" />
          </div>
          <div className="font-ubuntu font-medium text-14">
            <span className=" text-[#C30D81]">Users</span> : {item.totalUsers}
          </div>
          <div className="relative mt-3">
            <img
              className="h-[80px] w-[80px]"
              src="/images/pool/pool.png"
              alt=""
            />
            <p className="absolute text-white text-center ay-center ax-center font-barlow font-medium text-14">
              Pool {item.pool.name}
            </p>
          </div>
          <div className="flex items-center justify-center flex-col ">
            <p className="font-ubuntu font-medium text-12 leading-0">
              Sold Tickets
            </p>
            <p className="text-[#FE4435] leading-0">{item.totalTickets}</p>
          </div>
        </div>
        <div className="flex-1 h-[200px] bg-primary-1600 relative flex items-center justify-center flex-col">
          <div className="absolute right-0 bottom-2">
            <img className="w-10" src="/images/pool/bottomright.png" alt="" />
          </div>
          <div className="absolute ay-center -left-5">
            <img className="w-10" src="/images/pool/center.png" alt="" />
          </div>

          <div className="flex items-center mt-7 justify-center gap-2 text-[#595192] mb-5 font-medium text-20">
            <PoolTimer initialTime={timeToExpire(item.expireAt)} />
          </div>
          <div>
            <p className="bg-[#FEA036] text-white border-2 border-white rounded-[38px] px-6 py-2 cursor-pointer ">
              Entry Fees ${item.pool.entryFees}
            </p>
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-1 flex items-center justify-end flex-col ">
        <button
          onClick={handleToggleButton}
          className={`${
            enabled ? 'bg-[#FFA500]' : 'bg-[#EAEAEA]'
          } relative inline-flex h-6 w-11 items-center rounded-full border border-[#C1C1C1] `}
        >
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </button>
        <p className="font-ubuntu text-medium text-12 text-black leading-none my-1">
          Deactive Pool
        </p>
      </div>
    </div>
  );
};
CurrentPoolCard.propTypes = {
  item: PropTypes.object.isRequired,
  handleEntryFeeClick: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};
export default CurrentPoolCard;
