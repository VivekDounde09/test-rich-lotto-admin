import React from 'react';
import { Loading } from '@/components';
import loadable from '../utils/loadable';

// Login Page
export const Login = loadable(() => import('./Login'), {
  fallback: <Loading />,
});
// Dashboard Page
export const AdminDashboard = loadable(() => import('./AdminDashboard'), {
  fallback: <Loading />,
});
// Dashboard Page
export const Dashboard = loadable(() => import('./Dashboard'), {
  fallback: <Loading />,
});
// settings Page
export const Settings = loadable(() => import('./Settings'), {
  fallback: <Loading />,
});
// Profile Page
export const Profile = loadable(() => import('./Profile'), {
  fallback: <Loading />,
});
// tickets Page
export const Tickets = loadable(() => import('./Tickets'), {
  fallback: <Loading />,
});

//User Page
export const User = loadable(() => import('./User'), {
  fallback: <Loading />,
});

//pools page
export const Pools = loadable(() => import('./Pools'), {
  fallback: <Loading />,
});

//payments page
export const Payments = loadable(() => import('./Payments'), {
  fallback: <Loading />,
});
//bonus page
export const Bonus = loadable(() => import('./Bonus'), {
  fallback: <Loading />,
});
// Static Pages
export const NotFound = loadable(() => import('./NotFound'), {
  fallback: <Loading />,
});
