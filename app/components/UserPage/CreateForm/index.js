import { reactIcons } from '@/utils/icons';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { postReq } from '@/utils/apiHandlers';
import { toast } from 'react-hot-toast';

const CreateForm = ({ closeForm }) => {
  const [form, setForm] = useState({});
  const [openEye, setOpenEye] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await postReq('/users', form);
      const { status, error } = res;
      if (status) {
        toast.success('success');
        closeForm();
      } else if (error) {
        Array.isArray(error.message)
          ? error?.message.map((msg) => toast.error(msg))
          : toast.error(error.message);
      }
    } catch (error) {
      toast.error('something went wrong');
    }
  };
  return (
    <div className="fixed inset-0 z-[1000]  !mt-0 grid place-items-center overflow-auto bg-black bg-opacity-70  text-black ">
      <div className="max-w-[420px] w-full rounded-xl bg-white relative ">
        <div className="flex  items-center px-5 py-4  justify-between ">
          <h1 className="text-18">Create User</h1>
          <button
            onClick={() => closeForm()}
            className=" text-[#1C1B1F] text-2xl top-2 right-2 shadow-[0_1px_5px_0_#0000000D] rounded-[4px]"
          >
            {reactIcons.close}
          </button>
        </div>

        <form className="p-5 border-y border-y-[#B8BABD]" action="">
          <div className="input-div">
            <label className="input-label" htmlFor="">
              First Name
            </label>
            <div className="">
              <input
                className="input-box"
                type="text"
                placeholder=""
                name="firstname"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="input-div">
            <label className="input-label" htmlFor="">
              Last Name
            </label>
            <div className="">
              <input
                className="input-box"
                type="text"
                placeholder=""
                name="lastname"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="input-div">
            <label className="input-label" htmlFor="">
              Email
            </label>
            <div className="">
              <input
                className="input-box"
                type="text"
                placeholder="abc@gmail.com"
                name="email"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="input-div">
            <label className="input-label" htmlFor="">
              Username
            </label>
            <div className="">
              <input
                className="input-box"
                type="text"
                placeholder=""
                name="username"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="input-div">
            <label className="input-label" htmlFor="">
              Password
            </label>
            <div className="relative">
              <input
                className="input-box"
                type={openEye ? 'text' : 'password'}
                placeholder="********"
                name="password"
                onChange={handleInputChange}
              />
              <span onClick={() => setOpenEye(!openEye)} className="edit-icon">
                {openEye ? reactIcons.eye : reactIcons.eyesplash}
              </span>
            </div>
          </div>
        </form>

        <div className="p-5 flex items-center justify-end gap-5">
          <button
            onClick={() => closeForm()}
            className="border-[#F0923B] rounded-8 border font-medium text-black text-14 py-2 px-7"
          >
            Cancel
          </button>
          <button
            className="bg-[#F0923B] rounded-8  text-white font-medium text-14 py-2 px-7"
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>

        {/* cross icon */}
      </div>
    </div>
  );
};
CreateForm.propTypes = {
  closeForm: PropTypes.func.isRequired,
};
export default CreateForm;
