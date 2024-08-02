import { Deposit, Withdrawal } from '@/components';
import React, { useState } from 'react';

const Payments = () => {
  const [tabber, setTabber] = useState(1);

  const handleTabber = (id) => {
    setTabber(id);
  };

  return (
    <div className="py-5">
      {/* heading */}
      <div className="flex justify-between items-center mb-[10px]">
        <h3 className="2xl:text-32 text-24 font-medium">Payment</h3>
      </div>

      {/* tabber */}
      <div className="flex itc justify-between">
        <div className=" mb-[20px] max-w-[270px] border-2 px-3 py-1 rounded-10 border-primary-1200 font-ubuntu text-white font-normal text-14  flex items-center justify-between bg-[#1A1A1A]">
          <button
            onClick={() => handleTabber(1)}
            className={`${
              tabber === 1 && 'bg-primary-1200 text-black'
            } rounded-8 px-7 py-1 active`}
          >
            Withdraw
          </button>
          <button
            onClick={() => handleTabber(2)}
            className={`${
              tabber === 2 && 'bg-primary-1200 text-black'
            } rounded-8 px-7 py-1 active`}
          >
            Deposit
          </button>
        </div>
      </div>
      {tabber === 1 && <Withdrawal />}
      {tabber === 2 && <Deposit />}
    </div>
  );
};

export default Payments;
