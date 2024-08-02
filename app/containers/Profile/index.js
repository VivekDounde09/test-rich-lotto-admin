import { PreviewImage } from '@/components';
import { isYupError, parseYupError } from '@/utils/Yup';
import { getReq, patchReq, postFile, postReq } from '@/utils/apiHandlers';
import { reactIcons } from '@/utils/icons';
import {
  passwordValidationSchema,
  profileValidationSchema,
} from '@/utils/validation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const initialState = {
  newPassword: '',
  oldPassword: '',
  confirmPassword: '',
};

const Profile = () => {
  const [openPassword, setOpenPassword] = useState(false);
  const [currentEye, setCurrentEye] = useState(false);
  const [newEye, setNewEye] = useState(false);
  const [confirmEye, setConfirmEye] = useState(false);
  const [editFirst, setEditFirst] = useState(false);
  const [editLast, setEditLast] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const [form, setForm] = useState(initialState);
  const [formError, setFormError] = useState({});
  const [formOne, setFormOne] = useState({});
  const [formOneError, setFormOneError] = useState({});
  const getProfileData = async () => {
    try {
      const res = await getReq('/admin');
      const { data, status, error } = res;
      if (status) {
        setFormOne(data);
      } else if (error) {
        Array.isArray(error.message)
          ? error?.message.map((msg) => toast.error(msg))
          : toast.error(error.message);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFormError({ ...formError, [name]: '' });
  };
  const handleOneInputChange = (e) => {
    const { name, value } = e.target;
    setFormOne({ ...formOne, [name]: value });
    setFormOneError({ ...formOneError, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await passwordValidationSchema.validate(form, {
        abortEarly: false,
      });
      const res = await postReq('/admin/change-password', form);
      const { status, error } = res;
      if (status) {
        toast.success('password changed successfully');
        setForm(initialState);
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
  const handleNameSubmit = async (e) => {
    e.preventDefault();
    try {
      await profileValidationSchema.validate(formOne, {
        abortEarly: false,
      });
      const res = await patchReq('/admin', formOne);
      const { status, error } = res;
      if (status) {
        toast.success('Profile Updated successfully');
        getProfileData();
        setFormOneError(initialState);
      } else if (error) {
        Array.isArray(error.message)
          ? error?.message.map((msg) => toast.error(msg))
          : toast.error(error.message);
      }
    } catch (error) {
      if (isYupError(error)) {
        setFormOneError(parseYupError(error));
      } else {
        console.log(error);
      }
    }
  };
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFileFile] = useState(null);
  const handlePreviewImage = (e) => {
    const file = e.target.files[0];
    if (file.size > 6291456) {
      toast.error('file size should be less than 2MB');
      return;
    }
    setSelectedFileFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const handleProfileImage = async () => {
    try {
      let fileImg = new FormData();
      fileImg.append('file', selectedFile);
      const response = await postFile('/upload', fileImg);
      const { status, data, error } = response;
      if (status) {
        uploadProfileImage(data?.url.split('/').pop());
      } else if (error) {
        Array.isArray(error.message)
          ? error?.message.map((msg) => toast.error(msg))
          : toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const uploadProfileImage = async (url) => {
    const toastId = toast.loading('Uploading...');
    const data = {
      profileImage: url,
    };
    try {
      const res = await postReq('/admin/profile-image', data);
      const { status, error } = res;
      if (status) {
        toast.success('Image uploaded Successfully');
        getProfileData();
      } else if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.log(error);
    }
    toast.dismiss(toastId);
  };

  useEffect(() => {
    getProfileData();
  }, []);
  return (
    <>
      {previewImage && (
        <PreviewImage
          previewImage={previewImage}
          close={setPreviewImage}
          handleProfileImage={handleProfileImage}
        />
      )}
      <div className="flex flex-col text-black   my-5 ">
        <h1 className="2xl:text-32 text-24 pb-5 font-medium">Profile</h1>
        <div className="shadow-[0px_0px_36.8px_0px_#2D46DE33] rounded-10 p-5">
          <div className="">
            <div className="flex items-center justify">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="size-24 shadow-[0px_3px_43px_0px_#0C00FF1A] overflow-hidden rounded-full">
                    <img
                      className="size-full object-cover"
                      src={formOne?.profileImage}
                      alt="Profile Image"
                    />
                  </div>
                  <label className="h-full w-full" htmlFor="profilePicUpload">
                    <div className="absolute cursor-pointer top-0 right-0 bg-[#FFA500] p-2 rounded-full  h-7 w-7 flex items-center justify-center">
                      <span className="text-xl cursor-pointer">
                        {reactIcons.edit}
                      </span>
                      <input
                        type="file"
                        id="profilePicUpload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handlePreviewImage}
                      />
                    </div>
                  </label>
                </div>

                <div className="flex items-start flex-col gap-2">
                  <p className="font-mont text-16 font-bold">
                    {formOne?.firstname} {formOne?.lastname}
                  </p>
                  <p className="font-poppins text-16 font-normal text-[#505050]">
                    {formOne?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {!openPassword ? (
            <form
              onSubmit={handleNameSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit(e)}
            >
              <div className="mt-10  grid grid-cols-2 gap-x-5">
                <div className="input-div">
                  <label className="input-label text-[#384D6C]" htmlFor="">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      className="input-box"
                      type="text"
                      disabled={editFirst ? false : true}
                      placeholder=""
                      name="firstname"
                      onChange={handleOneInputChange}
                      value={formOne?.firstname}
                    />
                    <span
                      onClick={() => setEditFirst(!editFirst)}
                      className="edit-icon cursor-pointer"
                    >
                      {!editFirst && reactIcons.edit2}
                    </span>
                  </div>
                </div>
                <div className="input-div">
                  <label className="input-label text-[#384D6C]" htmlFor="">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      className="input-box"
                      type="text"
                      disabled={editLast ? false : true}
                      placeholder=""
                      name="lastname"
                      onChange={handleOneInputChange}
                      value={formOne?.lastname}
                    />
                    <span
                      onClick={() => setEditLast(!editLast)}
                      className="edit-icon cursor-pointer"
                    >
                      {!editLast && reactIcons.edit2}
                    </span>
                  </div>
                </div>
                <div className="input-div">
                  <label className="input-label text-[#384D6C]" htmlFor="">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className="input-box"
                      type="text"
                      disabled={editEmail ? false : true}
                      placeholder=""
                      name="email"
                      onChange={handleOneInputChange}
                      value={formOne?.email}
                    />
                    <span
                      onClick={() => setEditEmail(!editEmail)}
                      className="edit-icon cursor-pointer"
                    >
                      {!editEmail && reactIcons.edit2}
                    </span>
                    <div className="error">
                      {formOneError?.email && (
                        <div className="form-eror">{formOneError?.email}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span
                  onClick={() => setOpenPassword(true)}
                  className="font-poppins cursor-pointer font-medium  text-12 border rounded-[111px] border-[#FFA500] text-[#202020] py-2 px-3"
                >
                  Change Password
                </span>
                <button className="font-mont font-bold  text-12 border rounded-[111px] bg-[#FFA500] text-white py-2 px-10">
                  Update
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            >
              <div className="mt-10  grid grid-cols-2 gap-x-5">
                <div>
                  <div className="input-div">
                    <label className="input-label text-[#384D6C]" htmlFor="">
                      Old Password
                    </label>
                    <div className="relative">
                      <input
                        className="input-box"
                        type={!currentEye ? 'password' : 'text'}
                        placeholder="Old Password"
                        name="oldPassword"
                        onChange={handleInputChange}
                        value={form?.oldPassword}
                      />
                      <span
                        onClick={() => setCurrentEye(!currentEye)}
                        className="edit-icon cursor pointer"
                      >
                        {!currentEye ? reactIcons.eyesplash : reactIcons.eye}
                      </span>
                    </div>
                  </div>
                  <div className="error">
                    {formError.oldPassword && (
                      <div className="form-eror">{formError.oldPassword}</div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="input-div">
                    <label className="input-label text-[#384D6C]" htmlFor="">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        className="input-box"
                        type={!newEye ? 'password' : 'text'}
                        placeholder="New Password"
                        name="newPassword"
                        onChange={handleInputChange}
                        value={form?.newPassword}
                      />
                      <span
                        onClick={() => setNewEye(!newEye)}
                        className="edit-icon"
                      >
                        {!newEye ? reactIcons.eyesplash : reactIcons.eye}
                      </span>
                    </div>
                    <div className="error">
                      {formError.newPassword && (
                        <div className="form-eror">{formError.newPassword}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="input-div">
                    <label className="input-label text-[#384D6C]" htmlFor="">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        className="input-box"
                        type={!confirmEye ? 'password' : 'text'}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        onChange={handleInputChange}
                        value={form?.confirmPassword}
                      />
                      <span
                        onClick={() => setConfirmEye(!confirmEye)}
                        className="edit-icon"
                      >
                        {!confirmEye ? reactIcons.eyesplash : reactIcons.eye}
                      </span>
                    </div>
                  </div>
                  <div className="error">
                    {formError.confirmPassword && (
                      <div className="form-eror">
                        {formError.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setOpenPassword(false)}
                  className="font-poppins cursor-pointer font-medium  text-12 border rounded-[111px] border-[#FFA500] text-[#202020] py-2 px-6"
                >
                  Back
                </button>
                <button className="font-mont font-bold  text-12 border rounded-[111px] bg-[#FFA500] text-white py-2 px-6">
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
