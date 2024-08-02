import React, { useState, useEffect } from 'react';
import { getReq } from '@/utils/apiHandlers';
import { PropTypes } from 'prop-types';
import { TablePaginationArray } from '@/components';
import toast from 'react-hot-toast';

const SequenceTable = ({ userId }) => {
  const [ticketSequence, setTicketSequence] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  /* eslint-disable */
  const [dataPerPage, setDataPerPage] = useState(8);

  const getPoolSequence = async () => {
    try {
      const res = await getReq(`/tickets/sequence/${userId}`);
      const { data, error, status } = res;
      if (status) {
        setTicketSequence(data);
      } else if (error) {
        toast.alert(error?.message);
      }
    } catch (error) {
      toast.error('something went wrong');
    }
  };

  useEffect(() => {
    getPoolSequence();
  }, []);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = ticketSequence?.data?.slice(
    indexOfFirstData,
    indexOfLastData,
  );

  return (
    <div>
      <div className="overflow-auto rounded-xl shadow-[0_0_36.8px_0_#2D46DE33] text-black ">
        <table className="rounded-xl">
          <thead className="rounded-t-xl text-14  font-medium  bg-primary-1500">
            <tr className="2xl:h-[60px] h-[45px]">
              <th className="w-[250px]">Sequence</th>
              <th className="w-[100px]">Users</th>
              <th className="w-[150px]">Betted Amount</th>
              <th className="w-[150px]">% of Total Collection</th>
            </tr>
          </thead>
          <tbody className="">
            {currentData?.map((item, index) => {
              return (
                <tr
                  key={index}
                  className="bg-white font-normal font-poppins text-14 text-black py-2 2xl:h-[60px] h-[45px]  hover:bg-[#ABD5FF42]"
                >
                  <td className="w-[250px]">
                    <div className="flex items-center  gap-2">
                      {item?.sequence?.split(',')?.map((data, index) => {
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
                  <td className=" w-[100px]">{item.totalUsers}</td>
                  <td className=" w-[150px]">{item.totalBetAmount}</td>
                  <td className=" w-[150px] ">
                    {item.percentageOfTotalCollection}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <TablePaginationArray
        data={ticketSequence}
        dataToShowOnPage={dataPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

SequenceTable.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default SequenceTable;
