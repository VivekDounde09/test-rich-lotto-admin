import { DateRange, TablePagination } from '@/components';
import { getReq } from '@/utils/apiHandlers';
import { formatDate, formatDateForFilter } from '@/utils/helper';
import { reactIcons } from '@/utils/icons';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Deposit = () => {
  const [currentPage, setCurrentPage] = useState(1);
  /* eslint-disable */
  const [dataPerPage, setDataPerPage] = useState(8);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const [searchTerm, setSearchTerm] = useState('');
  const [withdrawData, setWithdrawData] = useState({});

  const handleSearchUser = (e) => {
    setSearchTerm(e.target.value);
  };

  const getWithdrawDetails = async () => {
    const dataToSkip = (currentPage - 1) * dataPerPage;
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('username', searchTerm);
      queryParams.append('skip', dataToSkip);
      queryParams.append('take', dataPerPage);
      queryParams.append('context', 'Deposit');
      startDate &&
        queryParams.append('fromDate', formatDateForFilter(startDate));
      endDate && queryParams.append('toDate', formatDateForFilter(endDate));

      const res = await getReq(
        `/users/transactions/payment?${queryParams.toString()}`,
      );
      const { data, status, error } = res;
      if (status) {
        setWithdrawData(data);
      } else if (error) {
        Array.isArray(error.message)
          ? error?.message.map((msg) => toast.error(msg))
          : toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('something went wrong');
    }
  };

  useEffect(() => {
    getWithdrawDetails();
    /* eslint-disable */
  }, [currentPage, searchTerm, startDate, endDate]);
  return (
    <div className="py-5">
      {/* heading */}
      <div className="flex justify-end items-center mb-[10px] mt-[-80px]">
        <div className="flex gap-2 items-center">
          <div className="relative h-10">
            <input
              className="bg-[#EAEAEA] w-[300px] h-10 placeholder:text-black  px-[18px] font-comfortaa text-[14px] font-bold text-black "
              type="text"
              placeholder="Search by Username"
              value={searchTerm}
              onChange={handleSearchUser}
            />
            <span className="absolute ay-center right-3 font-bold text-black text-xl">
              {reactIcons.search}
            </span>
          </div>
          <div className="">
            <DateRange changeDateRange={setDateRange} />
          </div>
        </div>
      </div>

      <div>
        <div className=" overflow-auto  rounded-xl shadow-[0_0_36.8px_0_#2D46DE33] text-black ">
          <table className="     ">
            <thead className="text-14 font-medium bg-[#ABD5FFA1] mb-1">
              <tr className="2xl:h-[60px] h-[45px]">
                <th className="w-[200px]">Transaction ID</th>
                <th className="w-[190px]">User name</th>

                <th className="w-[190px]">Date/Time</th>
                <th className="w-[120px]">Amount</th>
                <th className="w-[120px] ">Status</th>

                <th className="w-[120px] ">Narration</th>
              </tr>
            </thead>
            <tbody className="">
              {withdrawData && withdrawData?.data?.length > 0 ? (
                withdrawData?.data?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="font-normal font-poppins  text-14 text-black 2xl:h-[60px] h-[45px] hover:bg-[#ABD5FF42] mb-1"
                    >
                      <td className="w-[200px]">{item.id}</td>
                      <td className="w-[190px] ">
                        {item?.wallet?.user?.username}
                      </td>

                      <td className="w-[190px]">
                        {formatDate(item?.timestamp)}
                      </td>
                      <td className="w-[120px] ">${item.amount}</td>
                      <td className="w-[120px] ">{item.status}</td>

                      <td className=" w-[120px]">{item.narration}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="text-center py-3">No Data Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          data={withdrawData}
          dataToShowOnPage={dataPerPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Deposit;
