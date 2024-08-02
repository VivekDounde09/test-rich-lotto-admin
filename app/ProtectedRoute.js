/* eslint-disable */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { isLoggedIn } from './utils/apiHandlers';

function ProtectedRoute({ children }) {
  console.log(isLoggedIn(), 'isLoggedIn');
  let location = useLocation();
  if (isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
ProtectedRoute.propTypes = {
  children: PropTypes.func,
};
export default ProtectedRoute;
