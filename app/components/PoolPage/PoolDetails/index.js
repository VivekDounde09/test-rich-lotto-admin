import * as React from 'react';
import { reactIcons } from '@/utils/icons';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDate, formatDateToTime } from '@/utils/helper';
import { getReq, patchReq, postReq } from '@/utils/apiHandlers';
import toast from 'react-hot-toast';
import { SequenceTable, TablePagination } from '@/components';

const PoolDetails = ({
  pool,
  closeDetails,
  setConfirmPool,
  getCurrentPools,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  /* eslint-disable */
  const [dataPerPage, setDataPerPage] = useState(8);
  const [enabled, setEnabled] = useState(!pool.pool.isSystemSettle);
  const [tabber, setTabber] = useState(1);
  const [numbers, setNumbers] = useState(['', '', '', '', '']);
  const [ticketData, setTicketData] = useState([]);

  const handleChange = (index, value) => {
    if (/^\d+$/.test(value) && Number(value) > 0) {
      const newNumbers = [...numbers];
      newNumbers[index] = value;
      setNumbers(newNumbers);
    } else if (value === '') {
      const newNumbers = [...numbers];
      newNumbers[index] = value;
      setNumbers(newNumbers);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const stringResult = numbers.join(',');

    if (numbers.some((number) => number === '')) {
      toast.error('All fields are required');
    } else {
      handleConfirmBtn(stringResult);
    }
  };
  const handleTabber = (id) => {
    setTabber(id);
  };

  const handleConfirmBtn = (stringResult) => {
    setConfirmPool({
      text: 'Are you sure you want to open this Sequence For Pool 1',

      btn1Text: 'Yes, I Confirm',
      btn2Text: 'Cancel',
      btn1Handler: () => postManualSequence(stringResult),
      btn2Handler: () => setConfirmPool(null),
    });
  };

  const postManualSequence = async (stringResult) => {
    setConfirmPool(null);
    closeDetails();
    getCurrentPools()
    

    const sequence = {
      wonSelection: stringResult,
    };
    try {
      const res = await postReq(`/win/${pool.pool.id}`, sequence);
      const { status, error } = res;
      if (status) {
        toast.success('Won Selection set successfully');
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };
  const handleToggle = () => {
    setEnabled(!enabled);
      manualSettlement();
    
  };
  const manualSettlement = async () => {
    if (enabled) {
      const data = {
        isSystemSettle: true,
      };
      try {
        const res = await patchReq(`/pool/settle/${pool.pool.id}`, data);
        console.log(res, 'resss')
        if (res.error) {
          toast.error(res.error.message);
        }
      } catch (err) {
        console.log(err);
        toast.error(err);
      }
    } else {
      const data = {
        isSystemSettle: false,
      };
      try {
        const res = await patchReq(`/pool/${pool.pool.id}`, data);
        if (res.error) {
          toast.error(res.error);
        }
      } catch (err) {
        console.log(err);
        toast.error(err);
      }
    }
  };

  const getPoolTickets = async () => {
    const dataToSkip = (currentPage - 1) * dataPerPage;
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('take', dataPerPage);
      queryParams.append('skip', dataToSkip);
      const res = await getReq(`/tickets/pool/${pool.pool.id}?${queryParams}`);

      const { data, error, status } = res;
      if (status) {
        setTicketData(data);
      } else if (error) {
        toast.alert(error?.message);
      }
    } catch (error) {
      toast.error('something went wrong');
    }
  };

  useEffect(() => {
    getPoolTickets();
  }, [currentPage]);
  useEffect(() => {
    if (pool.pool.wonSelection !== null) {
      const selectedNumbers = pool.pool.wonSelection.split(',');
      setNumbers(selectedNumbers);
    }
  }, []);

  return (
    <div className="flex flex-col shadow-[0px_4.84px_12.59px_0px_#283FA333] rounded-10 p-3 gap-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => closeDetails()}
          className="p-2 rounded-full bg-[#EDEDFF]"
        >
          <span className="text-2xl"> {reactIcons.longBack}</span>
        </button>
        <div className="flex items-center justify-center flex-col">
          <p>Manual Settlement</p>
          <button
            onClick={handleToggle}
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
        </div>
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
              End Time
            </p>
            <img src="/images/pool/details/clock.png" alt="" />
          </div>
          <div className=" z-10 p-3">
            <p className="font-ubuntu font-bold text-14 text-white">
              {formatDateToTime(pool.expireAt)}
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
              {pool.pool.name}
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
              Sold Tickets
            </p>
            <img src="/images/pool/details/ticket.png" alt="" />
          </div>
          <div className=" z-10 p-3">
            <p className="font-ubuntu font-bold text-14 text-white">
              {pool.totalTickets}
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
            <img src="/images/pool/details/cash.png" alt="" />
          </div>
          <div className=" z-10 p-3">
            <p className="font-ubuntu font-bold text-14 text-white">
              {pool.pool.entryFees}
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
              {pool.totalUsers}
            </p>
          </div>
        </div>
      </div>
      {enabled && (
        <div className="p-2 shadow-[0_0_36.8px_0_#2D46DE33] flex gap-4 flex-col rounded-10">
          <h1 className="font-ubuntu font-normal text-20">Enter Sequence</h1>
          <div className="flex gap-4">
            <form className="flex gap-1" onSubmit={handleSubmit}>
              {numbers.map((number, index) => (
                <input
                  className="py-1 px-3 text-14 border border-[#D1D5DB] rounded bg-white"
                  key={index}
                  type="text"
                  value={number}
                  onChange={(event) => handleChange(index, event.target.value)}
                />
              ))}
              <button
                type="submit"
                className="py-2 px-6 bg-[#F0923B] rounded-8 text-white font-ubuntu font-medium text-14"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="flex items-center justify-end">
        <div className=" max-w-[250px] border-2 px-3 py-1 rounded-10 border-primary-1200 font-ubuntu text-white font-normal text-14  flex items-center justify-between bg-[#1A1A1A]">
          <button
            onClick={() => handleTabber(1)}
            className={`${
              tabber === 1 && 'bg-primary-1200 text-black'
            } rounded-8 px-7 py-1 active`}
          >
            Tickets
          </button>
          <button
            onClick={() => handleTabber(2)}
            className={`${
              tabber === 2 && 'bg-primary-1200 text-black'
            } rounded-8 px-7 py-1 active`}
          >
            Sequence
          </button>
        </div>
      </div>

      {tabber === 1 && (
        <div>
          <div className="overflow-auto rounded-xl shadow-[0_0_36.8px_0_#2D46DE33] text-black ">
            <table className="rounded-xl">
              <thead className="rounded-t-xl text-[14px]  font-medium  bg-primary-1500">
                <tr className="2xl:h-[60px] h-[45px]">
                  <th className="w-[100px] ">Ticket ID</th>
                  <th className="w-[120px]">Username</th>
                  <th className="w-[190px]">Draw Date/Time</th>
                  <th className="w-[250px]">Sequence</th>
                </tr>
              </thead>
              <tbody className="">
                {ticketData?.data?.length > 0 ? (
                  ticketData?.data?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="bg-white font-normal font-poppins text-[14px] text-black 2xl:h-[55px] h-[45px] hover:bg-[#ABD5FF42]"
                      >
                        <td className=" w-[100px]">{item.id}</td>
                        <td className=" w-[120px] break-all">
                          {item?.user?.username}
                        </td>

                        <td className=" w-[190px] ">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="w-[250px]">
                          <div className="flex items-center  gap-2">
                            {item?.selection?.split(',').map((data, index) => {
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
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="text-center py-2">No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <TablePagination
            data={ticketData}
            dataToShowOnPage={dataPerPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {tabber === 2 && <SequenceTable userId={pool.pool.id} />}
    </div>
  );
};

PoolDetails.propTypes = {
  pool: PropTypes.object.isRequired,
  closeDetails: PropTypes.func,
  setConfirmPool: PropTypes.func,
  getCurrentPools: PropTypes.func,
};
export default PoolDetails;
