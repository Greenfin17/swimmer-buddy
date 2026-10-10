// SharedWorkoutsView.js
// View of shared workouts

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import WorkoutCard from '../components/cards/WorkoutCard.js';
import TitleBox from '../components/TitleBox.js';
import { getPublicWorkouts } from '../helpers/data/workoutData.js';
import searchWorkouts from '../helpers/data/search.js';

const SharedWorkoutsView = ({
  user,
  searchTerms
}) => {
  const navigate = useNavigate();
  const [publicWorkouts, setPublicWorkouts] = useState([]);
  const [filterCopy, setFilterCopy] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const handleAddClick = () => {
    navigate('/add-workout');
  };

  // run search when the search terms change, run when userWorkouts is loaded
  useEffect(() => {
    if (searchTerms) {
      const tmpArr = publicWorkouts.filter((workout) => searchWorkouts(workout, searchTerms));
      setFilterCopy(tmpArr);
    }
  }, [searchTerms, publicWorkouts]);

  useEffect(() => {
    let mounted = true;
    getPublicWorkouts().then((workoutsArr) => {
      if (mounted) {
        setPublicWorkouts(workoutsArr);
        const tmpArr = [];
        workoutsArr.forEach((workout) => {
          let tmpObj = {};
          tmpObj = { ...workout };
          tmpArr.push(tmpObj);
        });
        setFilterCopy(tmpArr);
        setLoaded(true);
      }
    });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
  <div className='workouts-view'>
    <TitleBox heading1='Shared Workouts' />
    { user
      && <div className='view-button-container'>
        <Button className='btn btn-info add-workout'
        onClick={handleAddClick} >Add Workout</Button>
      </div>
    }
    <div className='card-container workout-cards-container'>
      { !loaded && <Spinner className='workout-view-spinner' color='primary' /> }
      { filterCopy.map((workout) => user?.uid !== workout.author_uid
        && <WorkoutCard
        key={workout.id}
        workout={workout}
        user={user}
        setUserWorkouts={setPublicWorkouts}
        />)
      }
    </div>
  </div>
  );
};

SharedWorkoutsView.propTypes = {
  user: PropTypes.any,
  searchTerms: PropTypes.string
};

export default SharedWorkoutsView;
