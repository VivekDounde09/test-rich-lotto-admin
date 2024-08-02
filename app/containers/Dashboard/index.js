import * as React from 'react';
import { reactIcons } from '@/utils/icons';
import { DateRange } from '@/components';
import { useState } from 'react';
import { getReq } from '@/utils/apiHandlers';
import toast from 'react-hot-toast';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useEffect } from 'react';
import UserDetails from '@/components/UserDetails';
import { formatDateForFilter } from '@/utils/helper';

const Dashboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [totalPools, setTotalPools] = useState([]);
  const [ticketsDetails, setTicketsDetails] = useState({});
  const [selectedPool, setSelectedPool] = useState(0);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const [blankPie, setBlankPie] = useState(false);
  const [data, setData] = useState([
    { value: 0, label: 'Earning' },
    { value: 0, label: 'Winning' },
  ]);

  const size = {
    width: 350,
    height: 200,
  };
  const piePercent = (earningPercentage) => {
    if (earningPercentage !== undefined) {
      const formattedPercentage = parseFloat(earningPercentage).toFixed(1);
      return Number(formattedPercentage);
    }
  };
  const formatPercentage = (str) => {
    if (str === 'NaN') {
      return 0;
    } else {
      const num = parseFloat(str);
      return num.toFixed(2);
    }
  };
  const handleSelectPool = (e) => {
    setSelectedPool(e.target.value);
  };
  const getLeaderboard = async () => {
    const queryParams = new URLSearchParams();
    startDate && queryParams.append('fromDate', formatDateForFilter(startDate));
    endDate && queryParams.append('toDate', formatDateForFilter(endDate));
    try {
      const res = await getReq(`/tickets/users/leaderboard?${queryParams}`);
      const { data, status, error } = res;
      if (status) {
        setLeaderboardData(data);
      } else if (error) {
        toast.error('something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getTicketsDetails = async () => {
    const queryParams = new URLSearchParams();
    startDate && queryParams.append('fromDate', formatDateForFilter(startDate));
    endDate && queryParams.append('toDate', formatDateForFilter(endDate));
    try {
      const res = await getReq(`/tickets/stats?${queryParams}`);
      const { data, status, error } = res;
      if (status) {
        setTicketsDetails(data);
      } else if (error) {
        toast.error('something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalPools = async () => {
    const queryParams = new URLSearchParams();
    startDate && queryParams.append('fromDate', formatDateForFilter(startDate));
    endDate && queryParams.append('toDate', formatDateForFilter(endDate));
    try {
      const res = await getReq(`/pool/settledIds?${queryParams}`);
      const { data, status, error } = res;
      if (status) {
        setTotalPools(data);
      } else if (error) {
        toast.error('something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getPieChartData = async () => {
    setBlankPie(false);
    try {
      const res = await getReq(`/tickets/win/stats/${selectedPool}`);
      const { status, error } = res;
      if (status) {
        if (
          res?.data?.earningPercentage !== 0 &&
          res?.data?.winningPercentage !== 0
        ) {
          const updatedData = [
            {
              value: piePercent(res?.data?.earningPercentage),
              label: 'Earning',
            },
            {
              value: piePercent(res?.data?.winningPercentage),
              label: 'Winning',
            },
          ];
          setData(updatedData);
        } else {
          setBlankPie(true);
        }
      } else if (error) {
        toast.error('something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleNameClick = (id) => {
    setSelectedUserId(id);
    setOpenDetails(true);
  };
  useEffect(() => {
    getLeaderboard();
    getTicketsDetails();
    getTotalPools();
    /* eslint-disable */
  }, [startDate, endDate]);
  useEffect(() => {
    getPieChartData();
  }, [selectedPool]);
  return (
    <>
      {openDetails ? (
        <UserDetails back={setOpenDetails} userId={selectedUserId} />
      ) : (
        <div className="py-5">
          {/* heading */}
          <div className="flex justify-between items-center mb-[20px]">
            <div>
              <h3 className=" text-24 font-medium">Dashboard</h3>
            </div>
            <div className="">
              <DateRange changeDateRange={setDateRange} />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2">
              {/*cards */}
              <div className="flex flex-col gap-2  p-[18px] overflow-x-auto  bg-primary-500  rounded-[12px] shadow-[0_0_36.8px_0px_#2D46DE33]">
                {/* first */}
                <div className="bg-[url('/public/images/dashboard/background.png')] min-w-[400px]   rounded-[18px] flex flex-col ">
                  <div className="flex  items-center justify-between bg-black text-white  w-full rounded-[18px]  px-4  py-2">
                    <h1 className="font-comfortaa font-bold  text-16 ">
                      Total ticket purchase
                    </h1>
                    <img
                      className="h-10 w-10 object-cover"
                      src="/images/ticket.png"
                      alt=""
                    />
                  </div>
                  <div className="flex items-center w-full h-full  px-3 py-5  text-white font-ubuntu font-bold ">
                    <p className="font-ubuntu font-bold text-22">
                      {ticketsDetails?.totalTickets}
                    </p>
                  </div>
                </div>

                {/* second */}
                <div className="flex flex-col bg-[url('/public/images/dashboard/background.png')]  min-w-[400px] rounded-[18px]">
                  <div className="flex items-center justify-between bg-black text-white w-full rounded-[18px] px-4 py-2">
                    <h1 className="font-comfortaa font-bold  text-16">
                      Winning Distribution
                    </h1>
                    <img
                      className="h-10 w-10 object-cover"
                      src="/images/dashboard/badge.png"
                      alt=""
                    />
                  </div>
                  <div className="flex items-center h-full px-3 py-5 justify-between text-white font-ubuntu font-bold   text-22">
                    <span> ${ticketsDetails?.totalDistributedAmount}</span>
                    <span>{formatPercentage(ticketsDetails?.percentage)}%</span>
                  </div>
                </div>
              </div>

              {/* pie and table */}

              {/* pie */}
              <div className="  bg-white shadow-[0_0_36.8px_0_#2D46DE33] py-[18px] px-[22px] min-w-[320px] rounded-[12px]">
                <h1 className="font-ubuntu font-medium  text-16  mb-2">
                  Pie Chart
                </h1>
                <div className="flex flex-col shadow-[0_0_36.8px_0_#2D46DE33] h-[calc(100%-45px)] rounded-[12px] flex-1">
                  <div className="relative flex justify-between items-center bg-primary-1500  px-[20px] py-3 rounded-t-[12px]">
                    <p className="font-ubuntu font-medium text-16">Pool</p>
                    <div className="absolute right-2 top-2">
                      <div className="relative">
                        <select
                          onChange={handleSelectPool}
                          className={
                            'bg-white rounded-[60px] py-1 relative  w-[150px] outline-none px-5 appearance-none'
                          }
                          name=""
                          id=""
                        >
                          <option value="0">Select Pool</option>
                          {totalPools?.map((item, index) => (
                            <option key={index} value={item.id}>
                              Pool {item.name}
                            </option>
                          ))}
                        </select>
                        <span className="absolute ay-center right-3">
                          {reactIcons.dropdown}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center flex-1 m-3  ">
                    {/* pie chart */}
                    {blankPie ? (
                      <div className="p-24 m-5  rounded-full bg-gray-700 relative ">
                        <div className="text-white absolute ay-center ax-center">
                          <p>Earning 0%</p>
                          <p>Winning 0%</p>
                        </div>
                      </div>
                    ) : (
                      <div className="m-3">
                        <PieChart
                          colors={['#F59E0B', '#14B8A6']}
                          series={[
                            {
                              arcLabel: (item) => `${item.value}%`,
                              arcLabelMinAngle: 0,
                              data,
                            },
                          ]}
                          sx={{
                            [`& .${pieArcLabelClasses.root}`]: {
                              fill: 'white',
                              fontWeight: 'bold',
                            },
                          }}
                          {...size}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* table */}
            <div className="rounded-[12px] bg-white shadow-[0_0_36.8px_0_#2D46DE33] py-[18px] px-[22px] flex flex-col flex-1 ">
              <h1 className="font-ubuntu font-medium  text-16 mb-2">
                Leaderboard
              </h1>

              <div className="overflow-auto rounded-[12px] shadow-[0_0_36.8px_0_#2D46DE33] text-black">
                <table className="rounded-xl">
                  <thead className="rounded-t-xl 2xl:text-[16px] text-14  font-medium  bg-[#ABD5FFA1]">
                    <tr className="2xl:h-[60px] h-[45px]">
                      <th className="text-center w-[120px]">Rank</th>
                      <th className="w-[170px] text-center">Username</th>
                      <th className="text-center w-[120px]">Prize</th>
                    </tr>
                  </thead>
                  <tbody className="rounded-b-xl">
                    {leaderboardData?.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white font-normal font-poppins 2xl:text-[16px] text-14 text-black 2xl:h-[55px] h-[45px] hover:bg-[#ABD5FF42]"
                        >
                          <td className="text-center w-[120px]">
                            #{index + 1}
                          </td>
                          <td className="w-[170px] px-5">
                            <div
                              onClick={() => handleNameClick(item.id)}
                              className="flex gap-3 items-center justify-start cursor-pointer hover:underline"
                            >
                              <div className="size-10 shrink-0 rounded-full overflow-hidden">
                                <img
                                  className="object-cover h-full w-full"
                                  src={item.profileImage}
                                  alt=""
                                />
                              </div>
                              <p className="break-all">{item.username}</p>
                            </div>
                          </td>
                          <td className="text-center w-[120px]">
                            ${item.totalwonamount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
