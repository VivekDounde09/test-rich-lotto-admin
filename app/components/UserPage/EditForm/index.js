import { patchReq } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import PropTypes from 'prop-types';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const EditForm = ({ closeForm, currentUser, afterEditSuccess }) => {
  const [openEye, setOpenEye] = useState(false);
  const [form, setForm] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  useEffect(() => {
    setForm(currentUser);
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = currentUser.id;
    try {
      const res = await patchReq(`/users/${userId}`, form);
      const { status, error } = res;
      if (status) {
        closeForm();
        afterEditSuccess();
        toast.success('User data updated successfully');
      } else if (error) {
        Array.isArray(error.message)
          ? error?.message.map((msg) => toast.error(msg))
          : toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something Went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000]  !mt-0 grid place-items-center overflow-auto bg-black bg-opacity-70  text-black ">
      <div className="max-w-[420px] w-full rounded-xl bg-white relative ">
        <div className="flex  items-center px-5 py-4  justify-between ">
          <h1 className="text-18">Edit</h1>
          <button
            onClick={() => closeForm()}
            className=" text-[#1C1B1F] text-2xl top-2 right-2 shadow-[0_1px_5px_0_#0000000D] rounded-[4px]"
          >
            {reactIcons.close}
          </button>
        </div>

        <form
          className="p-5 border-y border-y-[#B8BABD]"
          action=""
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e);
            }
          }}
        >
          <div className="input-div">
            <label className="input-label" htmlFor="">
              First Name
            </label>
            <div className="relative">
              <input
                className="input-box"
                type="text"
                placeholder="User First Name"
                value={form?.firstname}
                onChange={handleInputChange}
                name="firstname"
              />
              <span className="edit-icon">{reactIcons.edit2}</span>
            </div>
          </div>
          <div className="input-div">
            <label className="input-label" htmlFor="">
              Last Name
            </label>
            <div className="relative">
              <input
                className="input-box"
                type="text"
                placeholder="User Last Name"
                value={form?.lastname}
                onChange={handleInputChange}
                name="lastname"
              />
              <span className="edit-icon">{reactIcons.edit2}</span>
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
                placeholder="Enter Password"
                onChange={handleInputChange}
                name="password"
              />
              <span onClick={() => setOpenEye(!openEye)} className="edit-icon">
                {openEye ? reactIcons.eye : reactIcons.eyesplash}
              </span>
            </div>
          </div>
          <div className="p-5 flex items-center justify-end gap-5">
            <button
              onClick={() => closeForm()}
              className="border-[#F0923B] rounded-8 border font-medium text-black text-14 py-2 px-7"
            >
              Cancel
            </button>
            <button
              className="bg-[#F0923B] rounded-8  text-white font-medium text-14 py-2 px-7"
              type="submit"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditForm.propTypes = {
  closeForm: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  afterEditSuccess: PropTypes.func.isRequired,
};

export default EditForm;
