import { isYupError, parseYupError } from '@/utils/Yup';
import { postReq } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import { poolCreationSchema } from '@/utils/validation';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { DAYS } from '@/utils/constants';

const AddPool = ({ closeForm, getPools }) => {
  const [enabled, setEnabled] = useState(false);
  const [checkedWeeks, setCheckedWeeks] = useState([]);
  const [form, setForm] = useState({});
  const [formError, setFormError] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'entryFees') {
      if (/^\d*\.?\d*$/.test(value)) {
        // If the value contains only numerical characters or decimal values, update the form state
        setForm({ ...form, [name]: value });
      }
    } else {
      if (/^\d*$/.test(value)) {
        // If the value contains only numerical characters, update the form state
        setForm({ ...form, [name]: value });
      }
    }
  };

  const convertTime = (hrs, min) => {
    let time = 0;
    hrs ? (time += hrs * 3600000) : time;
    min ? (time += min * 60000) : time;
    return time;
  };

  const getPick = (from, till) => {
    const len = Number(till) - Number(from);
    if (len >= 5) {
      let num = [];
      for (let i = from; i <= till; i++) {
        num.push(Number(i));
      }
      return num;
    } else {
      toast.error('Sequence should be greater than 5');
      return 0;
    }
  };

  const handleCheckUncheck = (e, val) => {
    const name = val.key;
    const checked = e.target.checked;
    let newVal = [...checkedWeeks];
    const index = newVal.indexOf(name);

    if (checked && index === -1) {
      newVal.push(name);
    } else if (!checked && index !== -1) {
      newVal.splice(index, 1);
    }
    setCheckedWeeks(newVal);
  };

  const handleSubmit = async () => {
    try {
      await poolCreationSchema.validate(form, { abortEarly: false });

      const duration = convertTime(form.hours, form.minutes);
      let picks = getPick(form.firstNumber, form.lastNumber);
      if (picks === 0) {
        return;
      }
      const _data = {
        schedule: checkedWeeks,
        picks,
        prize: 20, // remove it after api chnage
        isActive: enabled,
        entryFees: Number(form?.entryFees),
        duration,
        name: form?.name,
      };

      const res = await postReq('/pool-configurations', _data);
      const { status, error } = res;

      if (status) {
        setForm({});
        toast.success('Pool Created successfuly');
        getPools();
        closeForm();
      } else if (error) {
        Array.isArray(error.message)
          ? error?.message.map((msg) => toast.error(msg))
          : toast.error(error.message);
      }
    } catch (error) {
      if (isYupError(error)) {
        setFormError(parseYupError(error));
      } else {
        console.log(error);
      }
    }
  };

  const handleAllCheck = (e) => {
    const checked = e.target.checked;
    const weeks = [];
    if (checked) {
      DAYS.map((day) => {
        weeks.push(day.key);
      });
    }

    setCheckedWeeks(weeks);
  };

  return (
    <div className="fixed inset-0 z-[1000]  !mt-0 grid place-items-center overflow-auto bg-black bg-opacity-70  text-black ">
      <div className="max-w-[420px] w-full rounded-xl bg-white relative ">
        <div className=" relative flex  items-center px-5 py-4  justify-center ">
          <h1 className="text-20 font-ubuntu font-medium text-center">
            Add Pool
          </h1>
          <button
            onClick={() => closeForm()}
            className="absolute right-3 top-3 text-[#1C1B1F] text-2xl shadow-[0_1px_5px_0_#0000000D] rounded-[4px]"
          >
            {reactIcons.close}
          </button>
        </div>

        <form className="p-5 border-y  border-y-[#B8BABD]" action="">
          <div className="flex items-center justify-end mb-3">
            <div className="flex gap-1">
              <p>Activate</p>
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevents navigation
                  setEnabled(!enabled);
                }}
                onChange={setEnabled}
                className={`${
                  enabled ? 'bg-[#FFA500]' : 'bg-[#EAEAEA]'
                } relative inline-flex h-6 w-11 items-center rounded-full border-[#C1C1C1] border`}
              >
                <span
                  className={`${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="input-label ">Week Day</p>

              <div className="flex items-center justify-center gap-2">
                <input
                  className="h-[18px] w-[18px]"
                  name="checkbox"
                  type="checkbox"
                  onClick={handleAllCheck}
                />
                <label htmlFor="checkbox">All</label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                return (
                  <>
                    <div
                      className="flex items-center justify-center gap-1"
                      key={day.key}
                    >
                      <input
                        className=" h-[20px] w-[20px]"
                        id={day.label}
                        name={day.key}
                        type="checkbox"
                        checked={checkedWeeks.includes(day.key)}
                        onChange={(e) => {
                          handleCheckUncheck(e, day);
                        }}
                      />
                      <label
                        className="font-poppins bg-[#D1D1D6] rounded px-1"
                        htmlFor={day.label}
                      >
                        {day.label}
                      </label>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div className="input-div mt-5">
            <label className="input-label" htmlFor="">
              Name
            </label>
            <div className="relative">
              <input
                className="input-box"
                type="text"
                placeholder="Enter Pool Name"
                onChange={handleInputChange}
                name="name"
                value={form.name || ''}
              />
            </div>
            <div className="error">
              {formError.entryFees && (
                <div className="form-eror">{formError.entryFees}</div>
              )}
            </div>
          </div>
          <div className="mt-5">
            <p className="input-label">Duration</p>
            <div className="flex items-center gap-5 ">
              <input
                className="input-box"
                type="text"
                placeholder="Enter Here Hour"
                onChange={handleInputChange}
                name="hours"
                value={form.hours || ''}
                min={0}
              />
              <input
                className="input-box"
                type="text"
                placeholder="Enter Here Minute"
                onChange={handleInputChange}
                name="minutes"
                value={form.minutes || ''}
                min={0}
              />
            </div>
            {/* <div className="error">
              {formError.hours ||
                (formError.minutes && (
                  <div className="form-eror">
                    {formError.hours || formError.minutes}
                  </div>
                ))}
            </div> */}
          </div>

          <div className="input-div mt-5">
            <label className="input-label" htmlFor="">
              Entry Fees
            </label>
            <div className="relative">
              <input
                className="input-box"
                type="text"
                placeholder="Enter Here Fees"
                onChange={handleInputChange}
                name="entryFees"
                value={form.entryFees || ''}
                min={0}
              />
              <div className="edit-icon flex items-center justify-center h-[39px] border-l border-[#ABB1BB]">
                <span className="pl-3 pr-2">{reactIcons.dollar}</span>
              </div>
            </div>
            <div className="error">
              {formError.entryFees && (
                <div className="form-eror">{formError.entryFees}</div>
              )}
            </div>
          </div>

          <div className="mt-5">
            <p className="input-label">Numbers</p>
            <div className="flex items-center gap-3 ">
              <input
                className="input-box"
                type="text"
                placeholder="First Number"
                onChange={handleInputChange}
                name="firstNumber"
                value={form.firstNumber || ''}
                min={0}
              />
              <p className="font-ubuntu font-normal text-16 text-[#C2BEBE]">
                To
              </p>
              <input
                className="input-box"
                type="text"
                placeholder="Last Number"
                onChange={handleInputChange}
                name="lastNumber"
                value={form.lastNumber || ''}
                min={form.firstNumber}
              />
            </div>
            <div className="error">
              {formError.lastNumber ||
                (formError.firstNumber && (
                  <div className="form-eror">
                    {formError.lastNumber || formError.firstNumber}
                  </div>
                ))}
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
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

AddPool.propTypes = {
  closeForm: PropTypes.func.isRequired,
  getPools: PropTypes.func.isRequired,
};

export default AddPool;
