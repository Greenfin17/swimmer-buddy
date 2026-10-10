import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import signOutApp from '../../helpers/auth/signOut.js';

const LogoutButton = ({
  authInit
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    signOutApp(authInit).then(() => {
      navigate('/');
    });
  };

  return (
    <div>
    <button id="google-auth" className="btn btn-danger btn-sm"
      onClick={handleClick}>
      <i className="fas fa-sign-out-alt logout"
        onClick={handleClick}></i><br />Log Out</button>
    </div>
  );
};

LogoutButton.propTypes = {
  authInit: PropTypes.object,
};

export default LogoutButton;
