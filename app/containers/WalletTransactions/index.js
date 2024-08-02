import { DateRange, TablePagination } from '@/components';
import { getReq } from '@/utils/apiHandlers';
import { formatDate, formatDateForFilter } from '@/utils/helper';
import { reactIcons } from '@/utils/icons';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const WalletTransactions = () => {
  const [transactionData, setTransactionData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  /* eslint-disable */
  const [dataPerPage, setDataPerPage] = useState(10);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  const getWalletTransactions = async () => {
    try {
      const dataToSkip = (currentPage - 1) * dataPerPage;
      const queryParams = new URLSearchParams();
      queryParams.append('skip', dataToSkip);
      queryParams.append('take', dataPerPage);
      startDate &&
        queryParams.append('fromDate', formatDateForFilter(startDate));
      endDate && queryParams.append('toDate', formatDateForFilter(endDate));
      searchTerm && queryParams.append('username', searchTerm);

      const res = await getReq(`/users/transactions?${queryParams.toString()}`);
      const { data, status, error } = res;
      if (status) {
        setTransactionData(data);
      } else if (error) {
        Array.isArray(error.message)
          ? error?.message.map((msg) => toast.error(msg))
          : toast.error(error.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };
  useEffect(() => {
    getWalletTransactions();
  }, [currentPage, startDate, endDate, searchTerm]);

  return (
    <div className="py-3 pt-5">
      {/* heading */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="2xl:text-32 text-24  font-medium">
          Wallet Transactions
        </h3>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <input
              className="bg-[#EAEAEA] w-[300px] h-10 placeholder:text-black  px-[18px] font-comfortaa text-[14px] font-bold text-black "
              type="text"
              placeholder="Search by Username"
              name="search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute ay-center right-3 font-bold text-black text-xl">
              {reactIcons.search}
            </span>
          </div>
          <div>
            <DateRange changeDateRange={setDateRange} />
          </div>
        </div>
      </div>

      <div>
        <div className=" overflow-auto  rounded-xl shadow-[0_0_36.8px_0_#2D46DE33] text-black ">
          <table className="     ">
            <thead className="text-[14px] font-medium bg-[#ABD5FFA1] mb-1">
              <tr className="2xl:h-[55px] h-[45px]">
                <th className="w-[200px]">Transaction ID</th>
                <th className="w-[200px]">User name</th>
                <th className="w-[100px]">Amount</th>
                <th className="w-[200px]">Date/Time</th>
                <th className="w-[300px]">Narration</th>
              </tr>
            </thead>
            <tbody className="">
              {transactionData?.data?.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={`${
                      item?.type !== 'Debit'
                        ? 'bg-[#91FF805C]'
                        : 'bg-[#FF00002B]'
                    }  font-normal font-poppins  text-[14px] text-black 2xl:h-[55px] h-[45px] hover:bg-[#ABD5FF42] mb-1 `}
                  >
                    <td className="w-[200px]">{item?.id || '-'}</td>
                    <td className="w-[200px] break-all">
                      {item?.wallet?.user?.username || '-'}
                    </td>
                    <td className="w-[100px] ">${item?.amount || '-'}</td>
                    <td className="w-[200px]">
                      {formatDate(item?.timestamp) || '-'}
                    </td>
                    <td className=" w-[300px]">{item?.narration || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TablePagination
          data={transactionData}
          dataToShowOnPage={dataPerPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default WalletTransactions;
