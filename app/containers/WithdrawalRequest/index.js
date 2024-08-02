import * as React from 'react';
import { DateRange, RejectText, TablePagination } from '@/components';

import { useState, useEffect } from 'react';
import { getReq, patchReq } from '@/utils/apiHandlers';
import { formatDate, formatDateForFilter } from '@/utils/helper';
import { toast } from 'react-hot-toast';

const WithdrawalRequest = () => {
  /* eslint-disable */
  const [withdrawalRequests, setWithdrawalRequests] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  /* eslint-disable */
  const [dataType, setDataType] = useState(null);
  const [dataPerPage, setDataPerPage] = useState(8);
  const ticketsToShowOnPage = 8;
  const [reasonModal, setReasonModal] = useState(false);
  const [rejectId, setRejectId] = useState('');

  const handleApprove = async (id) => {
    try {
      const res = await patchReq(`/withdrawals/approve-request/${id}`);

      const { data, status, error } = res;
      if (status) {
        console.log(data, 'dtaa');
      } else if (error) {
        toast.error('something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejectClick = (id) => {
    console.log(id, 'id in reject click');
    setReasonModal(true);
    setRejectId(id);
  };

  const getWithdrawalRequests = async () => {
    try {
      const queryParams = new URLSearchParams();
      startDate &&
        queryParams.append('fromDate', formatDateForFilter(startDate));
      endDate &&
        queryParams.append('toDate', formatDateForFilter(endDate, true));
      dataType && queryParams.append('result', dataType);

      queryParams.append('skip', (currentPage - 1) * ticketsToShowOnPage);
      queryParams.append('take', ticketsToShowOnPage);

      // const url = `/withdrawals/payout-requests?${queryParams.toString()}`;
      const url = '/withdrawals/payout-requests';
      const res = await getReq(url);

      const { data, status, error } = res;
      if (status) {
        setWithdrawalRequests(data);
        console.log(data, 'dtaa');
      } else if (error) {
        toast.error('something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getWithdrawalRequests();
    /* eslint-disable */
  }, [currentPage, dateRange, dataType]);
  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="2xl:text-32 text-24  font-medium 2xl:py-10 py-5">
            Withdrawal Requests
          </h3>
          <div className="flex items-center justify-center">
            <DateRange changeDateRange={setDateRange} />
          </div>
        </div>
        <div>
          <div className="overflow-auto rounded-xl shadow-[0_0_36.8px_0_#2D46DE33] text-black ">
            <table className="rounded-xl">
              <thead className="rounded-t-xl 2xl:text-[16px] text-14  font-medium  bg-primary-1500">
                <tr className="2xl:h-[60px] h-[45px]">
                  <th className="w-[70px]">Sr.no</th>
                  <th className="w-[220px]">Request date/time</th>
                  <th className="w-[150px]">User</th>
                  <th className="w-[150px]">Email</th>
                  <th className="w-[160px]">Current balance</th>
                  <th className="w-[160px]">Withdraw Amount</th>
                  <th className="w-[200px] ">Action </th>
                </tr>
              </thead>
              <tbody className="rounded-b-xl">
                {withdrawalRequests?.data?.map((item, index) => {
                  const serialNumber =
                    (currentPage - 1) * dataPerPage + index + 1;

                  return (
                    <tr
                      key={index}
                      className="bg-white font-normal font-poppins text-14 text-black h-[40px] hover:bg-[#ABD5FF42]"
                    >
                      <td className="w-[70px]">#{serialNumber}</td>
                      <td className=" w-[220px] ">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="w-[150px] break-all">
                        {item.user.username}
                      </td>
                      <td className="w-[150px] break-all">{item.user.email}</td>
                      <td className="w-[160px] break-all">
                        ${item.currentAmount}
                      </td>
                      <td className="w-[160px] break-all">${item.amount}</td>
                      <td className="w-[200px]">
                        {item.requestStatus === 'Rejected' ? (
                          <button className="w-full border border-[#FFA500] text-center font-comfortaa font-normal text-14  rounded-8">
                            Rejected
                          </button>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="w-full bg-green-600 text-white px-2 py-1 rounded-5 font-medium "
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectClick(item.id)}
                              className="w-full bg-red-500 text-white px-3 py-1 rounded-5 font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                      {/* <div className="border border-[#FFA500] text-center font-comfortaa font-normal text-14  rounded-8">
                            {item.status}
                          </div> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <TablePagination
            // data={ticketsData}
            dataToShowOnPage={ticketsToShowOnPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      {reasonModal && (
        <RejectText
          setReasonModal={setReasonModal}
          id={rejectId}
          getWithdrawalRequests={getWithdrawalRequests}
        />
      )}
    </>
  );
};

export default WithdrawalRequest;
