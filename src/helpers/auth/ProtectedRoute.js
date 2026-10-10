import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

const AuthorizedRoute = ({
  user
}) => {
  if (!user) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet / >;
};

AuthorizedRoute.propTypes = {
  user: PropTypes.object
};

export default AuthorizedRoute;
