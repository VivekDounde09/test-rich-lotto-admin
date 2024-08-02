import React, { useEffect, useState } from 'react';
import { reactIcons } from '@/utils/icons';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  ConfirmationModal,
  CreateForm,
  EditForm,
  TablePagination,
  UserDetails,
} from '@/components';
import { getReq, postReq } from '@/utils/apiHandlers';
import toast from 'react-hot-toast';

const User = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [blockData, setBlockData] = useState(null);
  const [userData, setUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  /* eslint-disable */
  const [dataPerPage, setDataPerPage] = useState(10);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const blockMessage = selectedUser.status === 'Active' ? 'Block' : 'Unblock';
  const open = Boolean(anchorEl);

  useEffect(() => {
    getUserData();
    /* eslint-disable */
  }, [page, searchTerm, dataPerPage, openCreateForm]);

  const handleUserClick = (event, user) => {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseClick = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleEyeClick = (user) => {
    setSelectedUser(user);
    setOpenDetails(true);
  };

  const handleBlockButtonClick = (item) => {
    handleCloseClick();
    setBlockData({
      text: `Do you really want to ${blockMessage} the User?`,
      image: '/images/dashboard/blockimg.png',
      btn1Text: `Yes ${blockMessage}`,
      btn2Text: 'Cancel',
      btn1Handler: () => handleBlockEntry(item),
      btn2Handler: () => setBlockData(null),
    });
  };

  const handleBlockEntry = async (item) => {
    const { status, id } = item;
    const statusToSet = status === 'Active' ? 'Blocked' : 'Active';
    try {
      const res = await postReq(`/users/${id}/${statusToSet}`);
      if (res.status) {
        toast.success(`User status changed to ${blockMessage}`);
        getUserData();
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to update user status');
    }
    setBlockData(null);
  };

  const handleEditButtonClick = (item) => {
    handleCloseClick();
    setSelectedUser(item);
    setOpenEditForm(true);
  };

  const handleCreateBtnClick = () => {
    setOpenCreateForm(true);
  };

  const handlePageChange = (val) => {
    setPage(val);
  };

  const getUserData = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('skip', (page - 1) * dataPerPage);
      if (searchTerm) queryParams.append('search', searchTerm);
      queryParams.append('take', dataPerPage);

      const res = await getReq(`/users?page=${page}&${queryParams.toString()}`);
      if (res?.data) {
        setUserData(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch user data');
    }
  };

  const handleSearchUser = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {openDetails ? (
        <UserDetails back={setOpenDetails} userId={selectedUser.id} />
      ) : (
        <div>
          <div className="flex justify-between items-center my-[20px] ">
            <div className="flex items-center gap-5">
              <h3 className="2xl:text-32 text-24  font-medium">User</h3>
              <button
                onClick={handleCreateBtnClick}
                className="text-white font-medium py-2 px-5 rounded-[100px] text-14 bg-black font-comfortaa w-full"
              >
                Create User
              </button>
            </div>
            <div className="relative w-[400px]">
              <input
                className="bg-[#EAEAEA] placeholder:text-black  px-[18px] font-comfortaa text-[14px] font-bold text-black "
                type="text"
                placeholder="Search by Email, Name, Username"
                value={searchTerm}
                onChange={handleSearchUser}
              />
              <span className="absolute ay-center right-5 font-bold text-black text-xl">
                {reactIcons.search}
              </span>
            </div>
          </div>
          <div>
            <div className="overflow-auto rounded-xl shadow-[0_0_36.8px_0_#2D46DE33] text-black ">
              <table className=" rounded-xl  ">
                <thead className="rounded-t-xl text-[14px]  font-medium  bg-primary-1500">
                  <tr className="2xl:h-[55px] h-[45px]">
                    <th className="w-[80px]">S. No.</th>
                    <th className="w-[200px]">Name</th>
                    <th className="w-[250px] ">Email</th>
                    <th className="w-[150px] ">Username</th>
                    <th className="w-[120px]">Status</th>
                    <th className="w-[100px] ">Actions</th>
                    <th className=" rounded-tr-[12px] w-10 pr-10"></th>
                  </tr>
                </thead>
                <tbody className="rounded-b-xl">
                  {userData?.data?.map((item, index) => {
                    const serialNumber = (page - 1) * dataPerPage + index + 1;

                    return (
                      <tr
                        key={index}
                        className="bg-white font-normal font-poppins text-14 text-black h-[40px] hover:bg-[#ABD5FF42]"
                      >
                        <td className="w-[80px]">#{serialNumber}</td>
                        <td className=" w-[200px] ">
                          <div className="flex items-center  gap-2">
                            <img
                              className="h-8 w-8 object-cover rounded-full"
                              src={
                                item.profileImage || '/images/profileImage.webp'
                              }
                              alt=""
                            />
                            <p>{`${item.firstname} ${item.lastname}`}</p>
                          </div>
                        </td>
                        <td className="w-[250px] break-all">{item.email}</td>
                        <td className="w-[150px] break-all">{item.username}</td>
                        <td className="w-[120px]">
                          <div className="border border-[#FFA500] text-center font-comfortaa font-normal text-14  rounded-8">
                            {item.status}
                          </div>
                        </td>
                        <td className="w-[100px]">
                          <div className="">
                            <IconButton
                              aria-label="more"
                              id="long-button"
                              aria-controls={
                                open && selectedUserId === item.id
                                  ? 'long-menu'
                                  : undefined
                              }
                              aria-expanded={
                                open && selectedUserId === item.id
                                  ? 'true'
                                  : undefined
                              }
                              aria-haspopup="true"
                              onClick={(e) => handleUserClick(e, item)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              sx={{
                                boxShadow: 3,
                              }}
                              open={open && selectedUserId === item.id}
                              onClose={handleCloseClick}
                              PaperProps={{
                                style: {
                                  boxShadow:
                                    '0px 0px  10.5px 0px rgba(24, 8, 255, 0.03)',
                                  backgroundColor: '#white',
                                  borderRadius: '4px',
                                  translate: '-100px',
                                },
                              }}
                            >
                              <ul className="pop-up shadow-[0px_0px_10.5px_0px_#2D46DE33] rounded-10 flex flex-col  h-[100px] w-[115px] px-2">
                                <button
                                  onClick={() => handleBlockButtonClick(item)}
                                  className="hover:bg-[#EA4335E0] w-full h-full font-reemKufi font-normal text-14 flex items-center px-4 rounded-[2px]"
                                >
                                  {blockMessage}
                                </button>
                                <button
                                  onClick={() => handleEditButtonClick(item)}
                                  className="hover:bg-[#EA4335E0] w-full h-full font-reemKufi font-normal text-14 flex items-center px-4 rounded-[2px]"
                                >
                                  Edit
                                </button>
                              </ul>
                            </Menu>
                          </div>
                        </td>
                        <td className="w-10 pr-10">
                          <button
                            onClick={() => handleEyeClick(item)}
                            className="font-bold"
                          >
                            {reactIcons.eye}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <TablePagination
              page={page}
              data={userData}
              dataToShowOnPage={dataPerPage}
              setCurrentPage={handlePageChange}
            />
          </div>
        </div>
      )}
      {blockData && <ConfirmationModal modalData={blockData} />}
      {openEditForm && (
        <EditForm
          closeForm={() => setOpenEditForm(false)}
          currentUser={selectedUser}
          afterEditSuccess={getUserData}
        />
      )}
      {openCreateForm && (
        <CreateForm closeForm={() => setOpenCreateForm(false)} />
      )}
    </>
  );
};

export default User;
