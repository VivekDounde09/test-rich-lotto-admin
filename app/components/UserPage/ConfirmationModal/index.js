import React from 'react';
import PropTypes from 'prop-types';
import { reactIcons } from '@/utils/icons';

const ConfirmationModal = ({ modalData }) => {
  return (
    <div className="fixed inset-0 z-[1000]  !mt-0 grid place-items-center overflow-auto bg-black bg-opacity-70  text-black ">
      <div className="lg:w-[330px] lg:h-[290px] rounded-xl border border-slate-400 bg-white p-8 relative ">
        <div className="font-ubuntu flex flex-col items-center justify-between h-full w-full mt-2">
          <div className="">
            <h1 className=" text-center  font-normal text-20">
              {modalData?.text}
            </h1>
          </div>

          <div className="h-[70px] w-[70px] flex items-center justify-center">
            <img
              className="h-full w-full object-cover"
              src={modalData.image}
              alt=""
            />
          </div>

          <div className=" flex items-center justify-center gap-2">
            <button
              className={`${
                modalData?.btn1Text === 'Yes Block'
                  ? 'border-[#F0923B]'
                  : 'border-[#FF0000]'
              } rounded-8 border text-black text-14 py-2 px-7`}
              onClick={modalData?.btn2Handler}
            >
              {modalData?.btn2Text}
            </button>
            <button
              className={`${
                modalData?.btn1Text === 'Yes Block'
                  ? 'bg-[#F0923B]'
                  : 'bg-[#FF0000]'
              } rounded-8 border text-white text-14 py-2 px-7`}
              // className={`${
              //   modalData?.btn1Text === 'Yes Block'
              //     ? 'bg-[#F0923B]'
              //     : 'bg-[#FF0000]'
              // } rounded-8 text-white text-14 py-2 px-6`}
              onClick={modalData?.btn1Handler}
            >
              {modalData?.btn1Text}
            </button>
          </div>
        </div>

        {/* cross icon */}
        <button
          onClick={modalData?.btn2Handler}
          className="absolute text-[#1C1B1F] text-2xl top-2 right-2 "
        >
          {reactIcons.close}
        </button>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  modalData: PropTypes.object.isRequired,
};

export default ConfirmationModal;
