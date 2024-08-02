import { DateRange, PastPool, TablePagination } from '@/components';
import { getReq } from '@/utils/apiHandlers';
import { formatDateForFilter, formatDateToTime } from '@/utils/helper';
import React, { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { PropTypes } from 'prop-types';
import { useRef } from 'react';

const AllPastPool = ({ openPoolDetails }) => {
  const [openPastPool, setOpenPastPool] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allPastPools, setAllPastPools] = useState([]);
  const [selectedPastPool, setSelectedPastPool] = useState([]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  /* eslint-disable */
  const [dataPerPage, setDataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const [divPosition, setDivPosition] = useState(0);

  const handlePastPoolClick = (data) => {
    setOpenPastPool(true);
    setSelectedPastPool(data);
  };

  const getPastPools = async () => {
    setLoading(true);
    const dataToSkip = (currentPage - 1) * dataPerPage;
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('skip', dataToSkip);
      queryParams.append('take', dataPerPage);
      if (startDate)
        queryParams.append('fromDate', formatDateForFilter(startDate));
      if (endDate) queryParams.append('toDate', formatDateForFilter(endDate));

      const res = await getReq(`/pool/expired?${queryParams.toString()}`);
      const { data, error, status } = res;
      if (status) {
        setAllPastPools(data);
      } else if (error) {
        toast.alert(error?.message);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPastPools();
  }, [startDate, endDate, openPoolDetails, currentPage]);

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollTop + e.target.clientHeight;
    setDivPosition(scrollPosition);
  };

  useEffect(() => {
    const currentDropdown = dropdownRef.current;
    if (currentDropdown) {
      currentDropdown.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentDropdown) {
        currentDropdown.removeEventListener('scroll', handleScroll);
      }
    };
  }, [openPastPool]);

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.scrollTo({
        top: divPosition - 340,
        behavior: 'auto',
      });
    }
  }, [openPastPool]);

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    }
  }, [currentPage]);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="pt-5 pb-4 font-poppins font-semibold text-16">
          Past Pool
        </h1>
        <div className="z-50">
          <DateRange changeDateRange={setDateRange} />
        </div>
      </div>
      {!openPastPool ? (
        <div
          ref={dropdownRef}
          className=" rounded-10 p-3 gap-5 flex flex-col max-h-[350px] overflow-y-auto shadow-[0px_4.8px_12.49px_0px_#283FA333]"
        >
          {!loading &&
            allPastPools?.data?.length > 0 &&
            allPastPools?.data?.map((item, index) => (
              <div
                onClick={() => handlePastPoolClick(item)}
                key={index}
                className="cursor-pointer min-h-[200px] rounded-10 bg-primary-1600 overflow-hidden flex items-center justify-evenly text-[#595192]"
              >
                {/* <div className="absolute ay-center left-1/3">
          <img src="/images/pool/center.png" alt="" />
        </div> */}

                <div className=" h-[200px] relative bg-white px-5 pt-6 pl-16 flex flex-col items-center justify-center ">
                  <div className="py-1  absolute top-7 -left-12 -rotate-45 bg-primary-1700">
                    <div className="px-10 border-y border-dashed border-[#FFECCA]">
                      <p className="text-black font-roboto text-12 font-bold">
                        End time : {formatDateToTime(item.expireAt)}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0">
                    <img
                      className="w-10"
                      src="/images/pool/bottom.png"
                      alt=""
                    />
                  </div>
                  <div className="font-ubuntu font-medium text-14">
                    <span className=" text-[#C30D81]">Users </span> :{' '}
                    {item.totalUsers}
                  </div>
                  <div className="relative mb-10 mt-2">
                    <img
                      className="h-[80px] w-[80px]"
                      src="/images/pool/pool.png"
                      alt=""
                    />
                    <p className="absolute text-white text-center ay-center ax-center font-barlow font-medium text-14">
                      Pool {item.pool.name}
                    </p>
                  </div>
                </div>
                <div className="flex-1 h-[200px] bg-primary-1600 relative flex items-center justify-center flex-col">
                  <div className="absolute ay-center -left-5">
                    <img
                      className="w-10"
                      src="/images/pool/center.png"
                      alt=""
                    />
                  </div>
                  <div className="absolute right-0 bottom-2">
                    <img
                      className="w-10"
                      src="/images/pool/bottomright.png"
                      alt=""
                    />
                  </div>

                  <div className="flex flex-col items-center  justify-center gap-2 text-[#595192] mb-5 font-medium text-20">
                    <div className="font-ubuntu text-16 font-normal">
                      Total Tickets:
                      <span className="text-[#FE4435]">
                        {' '}
                        {item?.totalTickets}
                      </span>
                    </div>
                    <div className="font-ubuntu text-20 font-normal">
                      Won Sequence
                    </div>
                    <div className="flex items-center mt-2  gap-2">
                      {item?.pool?.wonSelection
                        ?.split(',')
                        .filter((data) => data.trim() !== '')
                        ?.map((data, index) => {
                          return (
                            <div
                              className="bg-bet-gradient h-8 w-8 rounded-full flex items-center justify-center text-white"
                              key={index}
                            >
                              <span className="font-poppins font-medium text-12">
                                {data}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div>
                    <p className="bg-[#FEA036] text-white border-2 border-white rounded-[38px] px-6 py-2">
                      Entry Fees ${item?.pool?.entryFees}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          <TablePagination
            data={allPastPools}
            page={currentPage}
            dataToShowOnPage={dataPerPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      ) : (
        <PastPool poolData={selectedPastPool} closeDetails={setOpenPastPool} />
      )}
    </>
  );
};

AllPastPool.propTypes = {
  openPoolDetails: PropTypes.bool.isRequired,
};
export default AllPastPool;
