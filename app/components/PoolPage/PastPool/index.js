import * as React from 'react';
import { reactIcons } from '@/utils/icons';
import PropTypes from 'prop-types';

import { formatDate } from '@/utils/helper';
import { useState } from 'react';
import { useEffect } from 'react';
import { TablePagination } from '@/components';
import toast from 'react-hot-toast';
import { getReq } from '@/utils/apiHandlers';

const PastPool = ({ closeDetails, poolData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  /* eslint-disable */
  const [dataPerPage, setDataPerPage] = useState(8);
  const [ticketData, setTicketData] = useState({});


  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
  };


  const getPoolTickets = async () => {
    const dataToSkip = (currentPage - 1) * dataPerPage;
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('take', dataPerPage);
      queryParams.append('skip', dataToSkip);
      const res = await getReq(`/tickets/pool/${poolData.pool.id}?${queryParams}`);

      const { data, error, status } = res;
      if (status) {
        setTicketData(data);
      } else if (error) {
        toast.alert(error?.message);
      }
    } catch (error) {
      console.log(error, 'error')
      toast.error('something went wrong');
    }
  };

  useEffect(() => {
    getPoolTickets();
  }, [currentPage]);

  return (
    <div className="flex flex-col shadow-[0px_4.84px_12.59px_0px_#283FA333] rounded-10 p-3 gap-3">
      <div className="flex items-center">
        <button
          onClick={() => closeDetails(false)}
          className="p-2 rounded-full bg-[#EDEDFF]"
        >
          <span className="text-2xl"> {reactIcons.longBack}</span>
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 p-2 mt-2 shadow-[0px_4.94px_12.85px_0px_#283FA333] rounded-10">
        <div className="flex flex-col relative rounded-8 min-w-[150px]">
          <img
            className="h-full absolute w-full object-cover rounded-8 z-0"
            src="/images/cardBg.png"
            alt=""
          />
          <div className="flex items-center justify-between bg-[#CAE5FF] z-10 rounded-8 py-2 px-3">
            <p className="font-comfortaa font-bold text-[10px] text-black">
              Pool End Time
            </p>
            <img src="/images/pool/details/clock.png" alt="" />
          </div>
          <div className=" z-10 p-3">
            <p className="font-ubuntu font-bold text-14 text-white">
              {formatTime(poolData?.expireAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-col relative rounded-8 min-w-[150px]">
          <img
            className="h-full absolute w-full object-cover rounded-8 z-0"
            src="/images/cardBg.png"
            alt=""
          />
          <div className="flex items-center justify-between bg-[#CAE5FF] z-10 rounded-8 py-2 px-3">
            <p className="font-comfortaa font-bold text-[10px] text-black">
              Pool Name
            </p>
            <img src="/images/pool/details/pool.png" alt="" />
          </div>
          <div className=" z-10 p-3">
            <p className="font-ubuntu font-bold text-14 text-white">
              {poolData?.pool?.name}
            </p>
          </div>
        </div>
        <div className="flex flex-col relative rounded-8 min-w-[150px]">
          <img
            className="h-full absolute w-full object-cover rounded-8 z-0"
            src="/images/cardBg.png"
            alt=""
          />
          <div className="flex items-center justify-between bg-[#CAE5FF] z-10 rounded-8 py-2 px-3">
            <p className="font-comfortaa font-bold text-[10px] text-black">
              Entry Fees
            </p>
            <img src="/images/pool/details/ticket.png" alt="" />
          </div>
          <div className=" z-10 p-3">
            <p className="font-ubuntu font-bold text-14 text-white">
              {poolData?.pool?.entryFees}
            </p>
          </div>
        </div>
        <div className="flex flex-col relative rounded-8 min-w-[150px]">
          <img
            className="h-full absolute w-full object-cover rounded-8 z-0"
            src="/images/cardBg.png"
            alt=""
          />
          <div className="flex items-center justify-between bg-[#CAE5FF] z-10 rounded-8 py-2 px-3">
            <p className="font-comfortaa font-bold text-[10px] text-black">
              Users
            </p>
            <img src="/images/pool/details/user.png" alt="" />
          </div>
          <div className=" z-10 p-3">
            <p className="font-ubuntu font-bold text-14 text-white">
              {poolData?.totalUsers}
            </p>
          </div>
        </div>
        <div className="flex flex-col relative rounded-8 min-w-[150px]">
          <img
            className="h-full absolute w-full object-cover rounded-8 z-0"
            src="/images/cardBg.png"
            alt=""
          />
          <div className="flex items-center justify-between bg-[#CAE5FF] z-10 rounded-8 py-2 px-3">
            <p className="font-comfortaa font-bold text-[10px] text-black">
              Total Tickets
            </p>
            <img src="/images/pool/details/cash.png" alt="" />
          </div>
          <div className=" z-10 p-3">
            <p className="font-ubuntu font-bold text-14 text-white">
              {poolData?.totalTickets}
            </p>
          </div>
        </div>

        <div className="flex flex-col relative rounded-8 min-w-[150px]">
          <img
            className="h-full absolute w-full object-cover rounded-8 z-0"
            src="/images/cardBg.png"
            alt=""
          />
          <div className="flex items-center justify-between bg-[#CAE5FF] z-10 rounded-8 py-2 px-3">
            <p className="font-comfortaa font-bold text-[10px] text-black">
              Won Sequence
            </p>
            <img src="/images/pool/details/pool.png" alt="" />
          </div>
          <div className=" z-10 p-3">
            <p className="font-ubuntu font-bold text-14 text-white flex gap-1">
              {poolData?.pool?.wonSelection
                ?.split(',')
                .filter((data) => data.trim() !== '')
                ?.map((data, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-bet-gradient h-6 w-6 rounded-full flex items-center justify-center text-white"
                    >
                      <span className="text-12">{data}</span>
                    </div>
                  );
                })}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="overflow-auto rounded-xl shadow-[0_0_36.8px_0_#2D46DE33] text-black ">
          <table className="rounded-xl">
            <thead className="rounded-t-xl text-[14px]  font-medium  bg-primary-1500">
              <tr className="2xl:h-[60px] h-[45px]">
                <th className="w-[100px]">Ticket ID</th>
                <th className="w-[180px]">Username</th>
                <th className="w-[190px]">Draw Date/Time</th>
                <th className="w-[230px]">Sequence</th>
                <th className="w-[90px]">Won/Lost</th>
              </tr>
            </thead>
            <tbody className="">
              {ticketData?.data?.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="bg-white font-normal font-poppins text-[14px] text-black 2xl:h-[60px] h-[45px] hover:bg-[#ABD5FF42]"
                  >
                    <td className=" w-[100px]">{item?.id}</td>
                    <td className=" w-[180px] break-all">
                      {item?.user.username}
                    </td>

                    <td className=" w-[190px] ">
                      {formatDate(item?.createdAt)}
                    </td>
                    <td className="w-[230px]">
                      <div className="flex items-center  gap-2">
                        {item?.selection?.split(',')?.map((data, index) => {
                          return (
                            <div
                              className="bg-bet-gradient h-7 w-7 rounded-full flex items-center justify-center text-white"
                              key={index}
                            >
                              {data}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className=" w-[90px]">{item?.result}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TablePagination
          data={ticketData}
          dataToShowOnPage={dataPerPage}
          setCurrentPage={setCurrentPage}
        />

      </div>
    </div>
  );
};

PastPool.propTypes = {
  closeDetails: PropTypes.func,
  poolData: PropTypes.array.isRequired,
};
export default PastPool;
