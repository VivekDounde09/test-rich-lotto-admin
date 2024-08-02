import { AddPool, AllCurrentPools, AllPastPool } from '@/components';
import { getReq } from '@/utils/apiHandlers';

import React, { useEffect } from 'react';
import { useState } from 'react';
import PoolsCard from './PoolsCard';
import toast from 'react-hot-toast';

const Pools = () => {
  const [openAddPool, setOpenAddPool] = useState(false);
  const [pools, setPools] = useState();
  const [openPoolDetails, setOpenPoolDetails] = useState(false);

  const getPricePool = async () => {
    try {
      const res = await getReq('/pool-configurations');
      const { data, error, status } = res;
      if (status) {
        setPools(data);
      } else if (error) {
        toast.alert(error?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPricePool();
  }, []);

  return (
    <>
      <div className="py-5">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="2xl:text-32 text-24 font-medium">Pools</h3>
          </div>
          <div className="pr-5">
            <button
              onClick={() => setOpenAddPool(true)}
              className="bg-[#FFA500]  rounded-[100px] text-white font-medium text-12 px-10 py-2 "
            >
              Add Pool
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 py-4 h-[250px] overflow-auto px-3 shadow-[0px_4.84px_12.59px_0px_#283FA333] rounded-8">
          {pools?.map((pool, i) => (
            <PoolsCard pool={pool} i={i} key={pool.id} />
          ))}
        </div>

        <div className="flex md:flex-row flex-col  w-full gap-3 ">
          <div className="md:w-1/2 w-full">
            <h1 className="pt-5 pb-4 font-poppins font-semibold text-16">
              Current Pool
            </h1>

            <AllCurrentPools
              openPoolDetails={openPoolDetails}
              setOpenPoolDetails={setOpenPoolDetails}
            />
          </div>
          <div className="md:w-1/2 w-full">
            <AllPastPool openPoolDetails={openPoolDetails} />
          </div>
        </div>
      </div>
      {openAddPool && (
        <AddPool closeForm={setOpenAddPool} getPools={getPricePool} />
      )}
    </>
  );
};

export default Pools;
