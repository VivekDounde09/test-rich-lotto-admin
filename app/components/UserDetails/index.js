import * as React from 'react';
// import { ticketTable } from '@/utils/constants';
import { useState, useEffect } from 'react';
import { DateRange, TablePagination } from '..';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
import { reactIcons } from '@/utils/icons';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { getReq } from '@/utils/apiHandlers';
import { formatDate, formatDateForFilter } from '@/utils/helper';
import UserTickets from './UserTickets';

const UserDetails = ({ back, userId }) => {
  const [ticketData, setTicketData] = useState({});
  const [transactionData, setTransactionData] = useState({});
  const [paymentData, setPaymentData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  /* eslint-disable */
  const [dataPerPage, setDataPerPage] = useState(10);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const [tabber, setTabber] = useState(1);
  const [userBalance, setUserBalance] = useState('');

  const handleTabber = (id) => {
    setTabber(id);
  };

  const getUserBalance = async () => {
    try {
      const res = await getReq(`/users/${userId}`);

      const { data, error, status } = res;
      if (status) {
        setUserBalance(data?.wallet[0].amount);
      } else if (error) {
        toast.alert(error?.message);
      }
    } catch (error) {
      toast.error('something went wrong');
    }
  };

  useEffect(() => {
    getTicketDetails();
    getUserBalance();
    /* eslint-disable */
  }, []);

  useEffect(() => {
    tabber === 2 && getTransactionDetails();
    tabber === 3 && getPaymentsDetails();
  }, [tabber, currentPage, startDate, endDate]);

  const getTicketDetails = async () => {
    try {
      const res = await getReq(`/tickets/${userId}`);
      const { data, error, status } = res;
      if (status) {
        setTicketData(data);
      } else if (error) {
        Array.isArray(error.message)
          ? error?.message.map((msg) => toast.error(msg))
          : toast.error(error.message);
      }
    } catch (error) {
      toast.error('something went wrong');
    }
  };

  const getTransactionDetails = async () => {
    const dataToSkip = (currentPage - 1) * dataPerPage;
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      queryParams.append('skip', dataToSkip);
      queryParams.append('take', dataPerPage);
      startDate &&
        queryParams.append('fromDate', formatDateForFilter(startDate));
      endDate && queryParams.append('toDate', formatDateForFilter(endDate));

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
      console.log(error);
      toast.error('something went wrong');
    }
  };
  const getPaymentsDetails = async () => {
    const dataToSkip = (currentPage - 1) * dataPerPage;
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      queryParams.append('skip', dataToSkip);
      queryParams.append('take', dataPerPage);
      startDate &&
        queryParams.append('fromDate', formatDateForFilter(startDate));
      endDate && queryParams.append('toDate', formatDateForFilter(endDate));

      const res = await getReq(
        `/users/transactions/payment?${queryParams.toString()}`,
      );
      const { data, status, error } = res;
      if (status) {
        setPaymentData(data);
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
  return (
    <div className="py-5">
      {/* headingg   */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h3 className="2xl:text-32 text-24  font-medium flex gap-2 items-center ">
            <button
              onClick={() => back(false)}
              className="bg-[#EDEDFF] rounded-full p-2 flex items-center justify-center"
            >
              {reactIcons.arrowLeft}
            </button>
            Balance :{' '}
            <span className="text-[#FFA500]">
              ${userBalance?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </span>
          </h3>
        </div>
        <div className="">
          <DateRange changeDateRange={setDateRange} />
        </div>
      </div>

      {/* tabber */}
      <div className=" mb-[20px] max-w-[400px] border-2 px-3 py-1 rounded-10 border-primary-1200 font-ubuntu text-white font-normal text-14  flex items-center justify-between bg-[#1A1A1A]">
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
          Transactions
        </button>
        <button
          onClick={() => handleTabber(3)}
          className={`${
            tabber === 3 && 'bg-primary-1200 text-black'
          } rounded-8 px-7 py-1 active`}
        >
          Payments
        </button>
      </div>
      {tabber === 1 && (
        <div>
          {/* Cards */}
          <div className="mb-[20px] grid grid-cols-3 items-center gap-[25px]    bg-primary-500 p-[15px] rounded-[12px] shadow-[0_0_36.8px_0px_#2D46DE33]">
            {/* first */}
            <div className="bg-[url('/public/images/dashboard/background.png')]  min-w-[300px] rounded-[18px] flex flex-col ">
              <div className="flex  items-center justify-between bg-black text-white  w-full rounded-[18px]  px-[20px] py-[8px]">
                <h1 className="font-comfortaa font-bold text-14 ">
                  Total ticket
                </h1>
                <img
                  className="h-8 w-8 object-cover"
                  src="/images/ticket.png"
                  alt=""
                />
              </div>
              <div className="flex items-center w-full h-full  p-[15px]  text-white font-ubuntu font-bold ">
                <p className="font-ubuntu font-bold text-22">
                  {ticketData?.totalTicket}
                </p>
              </div>
            </div>
            {/* second */}
            <div className="bg-[url('/public/images/dashboard/background.png')]  min-w-[300px] rounded-[18px] flex flex-col ">
              <div className="flex  items-center justify-between bg-black text-white  w-full rounded-[18px]  px-[20px] py-[8px]">
                <h1 className="font-comfortaa font-bold text-14 ">
                  Won Counts
                </h1>
                <img
                  className="h-8 w-8 object-cover"
                  src="/images/cards/woncounts.png"
                  alt=""
                />
              </div>
              <div className="flex items-center  w-full h-full  p-[15px]  text-white font-ubuntu font-bold ">
                <p className="font-ubuntu font-bold text-22">
                  {ticketData?.wonCount}
                </p>
              </div>
            </div>
            {/* third */}
            <div className="bg-[url('/public/images/dashboard/background.png')]  min-w-[300px] rounded-[18px] flex flex-col ">
              <div className="flex  items-center justify-between bg-black text-white  w-full rounded-[18px]  px-[20px] py-[8px]">
                <h1 className="font-comfortaa font-bold text-14 ">
                  Lost Counts
                </h1>
                <img
                  className="h-8 w-8 object-cover"
                  src="/images/cards/lostcounts.png"
                  alt=""
                />
              </div>
              <div className="flex items-center  w-full h-full  p-[15px]  text-white font-ubuntu font-bold ">
                <p className="font-ubuntu font-bold text-22">
                  {ticketData?.lossCount}
                </p>
              </div>
            </div>
            {/* fourth */}
            <div className="bg-[url('/public/images/dashboard/background.png')]  min-w-[300px] rounded-[18px] flex flex-col ">
              <div className="flex  items-center justify-between bg-black text-white  w-full rounded-[18px]  px-[20px] py-[8px]">
                <h1 className="font-comfortaa font-bold text-14 ">
                  Total Tickets Amount
                </h1>
                <img
                  className="h-8 w-8 object-cover"
                  src="/images/ticket.png"
                  alt=""
                />
              </div>
              <div className="flex items-center w-full h-full  p-[15px]  text-white font-ubuntu font-bold ">
                <p className="font-ubuntu font-bold text-22">
                  ${ticketData?.totalTicketAmount}
                </p>
              </div>
            </div>
            {/* fifth */}
            <div className="bg-[url('/public/images/dashboard/background.png')]  min-w-[300px] rounded-[18px] flex flex-col ">
              <div className="flex  items-center justify-between bg-black text-white  w-full rounded-[18px]  px-[20px] py-[8px]">
                <h1 className="font-comfortaa font-bold text-14 ">
                  Total winnings Amount
                </h1>
                <img
                  className="h-8 w-8 object-cover"
                  src="/images/cards/winnings.png"
                  alt=""
                />
              </div>
              <div className="flex items-center  w-full h-full  p-[15px]  text-white font-ubuntu font-bold ">
                <p className="font-ubuntu font-bold text-22">
                  ${ticketData?.totalWinningAmount}
                </p>
              </div>
            </div>
          </div>
          <div>
            <UserTickets userId={userId} dateRange={dateRange} />
          </div>
        </div>
      )}
      {tabber === 2 && (
        <div>
          <div className=" overflow-auto  rounded-xl shadow-[0_0_36.8px_0_#2D46DE33] text-black ">
            <table className="     ">
              <thead className="text-14 font-medium bg-[#ABD5FFA1] mb-1">
                <tr className="2xl:h-[60px] h-[45px]">
                  <th className="w-[200px]">Transaction ID</th>
                  <th className="w-[200px]">Date/Time</th>
                  <th className="w-[150px]">Amount</th>
                  <th className="w-[300px]">Narration</th>
                </tr>
              </thead>
              <tbody className="">
                {transactionData?.data?.length > 0 ? (
                  transactionData?.data?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className={`${
                          item?.type === 'Credit'
                            ? 'bg-[#91FF805C]'
                            : 'bg-[#FF00002B]'
                        }  font-normal font-poppins  text-14 text-black 2xl:h-[60px] h-[45px] hover:bg-[#ABD5FF42] mb-1 `}
                      >
                        <td className="w-[200px]">{item?.id || '-'}</td>
                        <td className="w-[200px]">
                          {formatDate(item?.timestamp) || '-'}
                        </td>
                        <td className="w-[150px] ">${item?.amount || '-'}</td>
                        <td className=" w-[300px]">{item?.narration || '-'}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="py-3 text-center">No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <TablePagination
            data={transactionData}
            dataToShowOnPage={dataPerPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {tabber === 3 && (
        <div>
          <div className="overflow-auto rounded-xl shadow-[0_0_36.8px_0_#2D46DE33] text-black ">
            <table className="rounded-xl">
              <thead className="rounded-t-xl text-14  font-medium  bg-primary-1500">
                <tr className="2xl:h-[60px] h-[45px]">
                  <th className="w-[200px]">Transaction ID</th>
                  <th className="w-[210px]">Date/Time</th>
                  <th className="w-[130px]">Amount</th>
                  <th className="w-[100px]">Type</th>
                  <th className="w-[100px]">Status</th>
                  <th className="w-[120px]">Narration</th>
                </tr>
              </thead>
              <tbody className="">
                {paymentData?.data?.length > 0 ? (
                  paymentData?.data?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="bg-white font-normal font-poppins text-14 text-black 2xl:h-[60px] h-[45px] hover:bg-[#ABD5FF42]"
                      >
                        <td className=" w-[200px]">{item?.id || '-'}</td>
                        <td className=" w-[210px]">
                          {formatDate(item?.timestamp) || '-'}
                        </td>
                        <td className=" w-[130px]">${item?.amount || '-'}</td>
                        <td
                          className={`${
                            item?.type === 'Debit'
                              ? 'text-[#FF8080]'
                              : 'text-[#2EBA18]'
                          } w-[100px] font-normal font-poppins text-[16px]  h-[55px]  `}
                        >
                          {item?.type || '-'}
                        </td>
                        <td className=" w-[100px]">{item?.status || '-'}</td>

                        <td className="w-[120px]">{item?.narration || '-'}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="py-3 text-center">No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <TablePagination
            data={paymentData}
            dataToShowOnPage={dataPerPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

UserDetails.propTypes = {
  back: PropTypes.func,
  userId: PropTypes.string,
};

export default UserDetails;
