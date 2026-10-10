import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import signIn from '../../helpers/auth/signIn.js';

const LoginButton = ({
  authInit,
  provider
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    signIn(authInit, provider);
    navigate('/');
  };

  return (
    <div>
      <button name='google-auth' className='btn btn-danger'
        onClick={handleClick}>GOOGLE LOGIN
      </button>
    </div>
  );
};

LoginButton.propTypes = {
  authInit: PropTypes.object,
  provider: PropTypes.object
};

export default LoginButton;
