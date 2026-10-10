// Home.js

import React from 'react';
import PropTypes from 'prop-types';
import TitleBox from '../components/TitleBox.js';

const Home = ({
  user,
}) => {
  const title = 'Swimmer Buddy';
  const subTitle = 'Organize your Workouts';

  return (
    <div className='home-page-container'>
    <TitleBox
      heading1={title}
      heading2={subTitle} />
    { user
      && <>
      <p className='home-welcome'>Welcome {user.fullName}!</p>
      </>
    }
    { !user
      && <>
        <h5 className='home-sign-in'>Sign in to view your workouts</h5>
      </>
    }
    </div>
  );
};

Home.propTypes = {
  user: PropTypes.any
};

export default Home;
