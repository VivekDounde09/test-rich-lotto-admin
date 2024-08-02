import { reactIcons } from '@/utils/icons';
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
const Dropdown = ({ title, items, className }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Cookies.remove('__adminAuthToken');
    Cookies.remove(`${process.env.APP_ENV}__admin__isLoggedIn`);
    navigate('/login');
  };

  return (
    <div className={className}>
      <div className="flex px-[14px] gap-3 items-center justify-between ">
        <span className="text-16 font-bold font-comfortaa">{title}</span>
        <span
          onClick={toggleMenu}
          className={`text-20 cursor-pointer ${isOpen ? 'rotate-180' : ''}`}
        >
          {reactIcons.dropdown}
        </span>
      </div>
      {isOpen && (
        <div className="mt-5">
          {items.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              end
              className={({ isActive }) =>
                `${
                  isActive
                    ? `flex items-center gap-3 2xl:p-4 p-3 px-[14px] rounded-8  ${
                        link.text !== 'Logout' && 'bg-primary-700'
                      } `
                    : 'flex items-center gap-3 2xl:p-4 p-3 px-[14px] rounded-8'
                }`
              }
              onClick={link.text === 'Logout' ? () => handleLogout() : ''}
            >
              <img className="size-6 object-contain" src={link.icon} alt="" />
              <span className="2xl:text-16 text-14">{link.text}</span>{' '}
              <span className="-rotate-90 ml-auto text-16 text-[#1C1B1F]">
                {reactIcons.arrowdown}
              </span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
Dropdown.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string,
      icon: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const AdminDashboard = () => {
  const navLinks = [
    {
      to: '/',
      icon: '/images/icons/dashboard.png',
      text: 'Dashboard',
    },
    {
      to: 'user',
      icon: '/images/icons/users.png',
      text: 'Users',
    },
    {
      to: 'tickets',
      icon: '/images/icons/tickets.png',
      text: 'Tickets',
    },

    {
      to: '/pools',
      icon: '/images/icons/lottery.png',
      text: 'Pools',
    },
    {
      to: '/payments',
      icon: '/images/icons/income.png',
      text: 'Payments',
    },
    {
      to: '/wallet-transactions',
      icon: '/images/icons/exchange.png',
      text: 'Wallet Transactions',
    },
    {
      to: '/withdrawal-request',
      icon: '/images/icons/withdraw.png',
      text: 'Withdrawal Requests',
    },
    {
      to: '/bonus',
      icon: '/images/icons/bonus.png',
      text: 'Bonus',
    },
  ];
  const navLinks2 = [
    {
      to: '/profile',
      icon: '/images/icons/profile.png',
      text: 'Profile',
    },
    {
      to: '/settings',
      icon: '/images/icons/setting.png',
      text: 'Settings',
    },
    {
      icon: '/images/icons/logout.png',
      text: 'Logout',
    },
  ];

  return (
    <>
      <main className="flex h-[100dvh]">
        <div className="2xl:w-[320px] w-[275px]  py-5 min-h-screen box-shadow px-4 ">
          <div className="flex items-center justify-center border-b border-[#CFCFCF] pb-10 pt-5">
            <img src="/images/logo.png" className="w-[150px] mx-auto" alt="" />
          </div>

          <div className="flex flex-col h-[calc(100dvh-200px)] overflow-auto mt-5">
            <Dropdown title="Menu" items={navLinks} />
            <Dropdown className="mt-7" title="General" items={navLinks2} />
          </div>
        </div>
        <div className="flex-1 px-5 overflow-auto">
          <div className="flex 2xl:py-5 py-2 border-b border-b-border gap-3 justify-end items-center">
            <div className="2xl:size-[52px] size-[40px] rounded-full overflow-hidden">
              <img src="/images/profile.png" alt="" />
            </div>
            <div className="">
              <h4 className="font-poppins text-16 font-semibold">Admin</h4>
              <h5 className="text-primary-200 font-comfortaa font-bold"></h5>
            </div>
            {/* <span className="lg:pl-4">{reactIcons.arrowdown}</span> */}
          </div>
          <div className="flex-1 ">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
