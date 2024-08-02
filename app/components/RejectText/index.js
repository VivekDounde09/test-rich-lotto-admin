import { reactIcons } from '@/utils/icons';
import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { patchReq } from '@/utils/apiHandlers';
import toast from 'react-hot-toast';

const RejectText = ({ setReasonModal, id, getWithdrawalRequests }) => {
  const [textData, setTextData] = useState();
  console.log(id, 'id in reject modal');

  const handleChange = (e) => {
    setTextData(e.target.value);
  };
  const handleReject = async (id) => {
    try {
      const res = await patchReq(`/withdrawals/reject-request/${id}`);
      const { status, error } = res;
      if (status) {
        toast.success('Request Rejected');
      } else if (error) {
        toast.error('something went wrong');
      }
    } catch (error) {
      console.log(error);
    }
    setReasonModal(false);
    getWithdrawalRequests();
  };
  return (
    <div className="fixed inset-0 z-[1000]  !mt-0 grid place-items-center overflow-auto bg-black bg-opacity-70  text-black ">
      <div className="lg:w-[360px]  lg:h-[250px] rounded-xl border border-slate-400 bg-white p-4 relative ">
        <div className="font-ubuntu flex flex-col  h-full w-full mt-2">
          <h1 className="font-ubuntu text-center  font-normal text-20 pb-2">
            Enter Reason
          </h1>

          <div className="py-2">
            <textarea
              className="text-black border border-black w-full p-2 rounded-10"
              name=""
              id=""
              cols=""
              rows="4"
              value={textData}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-end gap-3 py-3">
            <button
              onClick={() => handleReject(id)}
              className="bg-green-600 text-white px-2 py-1 rounded-5 font-medium"
            >
              Confirm
            </button>
            <button
              onClick={() => setReasonModal(false)}
              className="bg-red-500 text-white px-3 py-1 rounded-5 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* cross icon */}
        <button
          onClick={() => setReasonModal(false)}
          className="absolute text-[#1C1B1F] text-2xl top-2 right-2 "
        >
          {reactIcons.close}
        </button>
      </div>
    </div>
  );
};
RejectText.propTypes = {
  id: PropTypes.string.isRequired,
  setReasonModal: PropTypes.func.isRequired,
  getWithdrawalRequests: PropTypes.func.isRequired,
};
export default RejectText;
