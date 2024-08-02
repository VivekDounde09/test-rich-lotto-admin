import { getReq, patchReq } from '@/utils/apiHandlers';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Settings = () => {
  /* eslint-disable*/
  const [number, setNumber] = useState('');

  const handleOnChange = (e) => {
    const { value } = e.target;
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setNumber(value);
    } else {
      e.target.value = '';
    }
  };

  const getWinningDistribution = async () => {
    try {
      const res = await getReq('/system/settings');

      const { data, error, status } = res;
      if (status) {
        if (data[0].selection !== null && data[0].selection !== '') {
          setNumber(data[0].selection);
        } else {
          setNumber(data[0].default);
        }
      } else if (error) {
        toast.alert(error?.message);
      }
    } catch (error) {
      toast.error('something went wrong');
    }
  };

  const setWinningDistribution = async () => {
    if (number === '') {
      toast.error("Winning Distribution can't be empty");
      return;
    }
    const data = {
      data: [
        {
          settingId: 1,
          enable: true,
          selection: number,
        },
      ],
    };
    try {
      const res = await patchReq('/system/settings', data);
      const { status, error } = res;
      if (status) {
        toast.success('Winning distribution % changed successfully');
      } else {
        toast.error(res.error);
      }
      getWinningDistribution();
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };
  useEffect(() => {
    getWinningDistribution();
  }, []);
  return (
    <div className="flex flex-col text-black   my-5 ">
      <h1 className="2xl:text-32 text-24 pb-5 font-medium">Settings</h1>
      <div className="shadow-[0px_0px_36.8px_0px_#2D46DE33] rounded-10 p-5">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 object-cover"
            src="/images/dashboard/badge.png"
            alt=""
          />
          <p className="font-bold font-ubuntu text-black text-20">
            Winning Distribution
          </p>
        </div>
        <div className="flex items-center justify-between gap-5 py-10">
          <p className="font-medium font-ubuntu text-[#384D6C] text-18">
            Winning Distribution
          </p>
          <div className="relative flex-1 text-[#384D6C]">
            <input
              className="input-box"
              type="text"
              placeholder=""
              onChange={handleOnChange}
              value={number}
            />
            <div className="absolute right-0 ay-center p-2 border-l border-[#B8BABD] text-[#B8B8B8]">
              %
            </div>
          </div>
          <button
            onClick={setWinningDistribution}
            className="font-mont font-bold  text-12 border rounded-[111px] bg-[#FFA500] text-white py-2 px-10"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
