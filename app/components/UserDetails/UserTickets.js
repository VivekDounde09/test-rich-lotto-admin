import * as React from 'react';
import { TablePagination } from '@/components';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState, useEffect } from 'react';
import { getReq } from '@/utils/apiHandlers';
import { formatDate, formatDateForFilter } from '@/utils/helper';
import { toast } from 'react-hot-toast';
import { PropTypes } from 'prop-types';

const UserTickets = ({ dateRange, userId }) => {
  const [ticketsData, setTicketsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, endDate] = dateRange;
  const [dataType, setDataType] = useState(null);
  const ticketsToShowOnPage = 8;
  useEffect(() => {
    getTicketDetails();
    /* eslint-disable */
  }, [currentPage, startDate, endDate, dataType]);

  const getTicketDetails = async () => {
    try {
      const queryParams = new URLSearchParams();
      startDate &&
        queryParams.append('fromDate', formatDateForFilter(startDate));
      endDate &&
        queryParams.append('toDate', formatDateForFilter(endDate, true));
      dataType && queryParams.append('result', dataType);

      queryParams.append('skip', (currentPage - 1) * ticketsToShowOnPage);
      queryParams.append('take', ticketsToShowOnPage);
      queryParams.append('userId', userId);

      const url = `/tickets?${queryParams.toString()}`;
      const res = await getReq(url);
      const { data, status, error } = res;
      if (status) {
        setTicketsData(data);
      } else if (error) {
        toast.error('something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="2xl:text-32 text-22  font-medium 2xl:py-10 py-5">
          Ticket table
        </h3>
        <div className="flex items-center justify-center">
          <div className="mb-1">
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Result</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={dataType}
                label="Result"
                onChange={(e) => setDataType(e.target.value)}
              >
                <MenuItem>All</MenuItem>

                <MenuItem value="Won">Won</MenuItem>
                <MenuItem value="Loss">Loss</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div>
        <div className="overflow-auto rounded-xl shadow-[0_0_36.8px_0_#2D46DE33] text-black ">
          <table className="rounded-xl">
            <thead className="rounded-t-xl 2xl:text-[16px] text-14  font-medium  bg-primary-1500">
              <tr className="2xl:h-[60px] h-[45px]">
                <th className="w-[120px]">Ticket ID</th>
                <th className="w-[70px]">Pool</th>
                <th className="w-[200px]">Draw Date/Time</th>
                <th className="w-[220px]">Sequence</th>
                <th className="w-[220px]">Won Sequence</th>
                <th className="w-[120px]">Won amount</th>
              </tr>
            </thead>
            <tbody className="">
              {ticketsData?.data?.length > 0 ? (
                ticketsData?.data?.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className="bg-white font-normal font-poppins  2xl:text-[16px] text-14 text-black 2xl:h-[60px] h-[45px] hover:bg-[#ABD5FF42]"
                    >
                      <td className=" w-[120px]">{item?.id}</td>
                      <td className="w-[70px]">
                        <div className="flex items-center">
                          <div className="bg-bet-gradient h-7 w-7 rounded-full flex items-center justify-center text-white">
                            {item.name}
                          </div>
                        </div>
                      </td>
                      <td className=" w-[200px] ">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="w-[220px]">
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
                      <td className="w-[220px]">
                        <div className="flex items-center  gap-2">
                          {item?.wonSelection
                            ? item?.wonSelection
                                ?.split(',')
                                .slice(0, 5)
                                ?.map((data, index) => {
                                  return (
                                    <div
                                      className="rounded-[5px] h-7 w-7 text-primary-1400 border-2 border-primary-1400 flex items-center justify-center"
                                      key={index}
                                    >
                                      {data}
                                    </div>
                                  );
                                })
                            : 'Not declared'}
                        </div>
                      </td>
                      <td className=" w-[120px]">
                        {item.wonAmount === null ? '-' : `$${item.wonAmount}`}
                      </td>
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
          data={ticketsData}
          dataToShowOnPage={ticketsToShowOnPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

UserTickets.propTypes = {
  dateRange: PropTypes.date,
  userId: PropTypes.string.isRequired,
};

export default UserTickets;
