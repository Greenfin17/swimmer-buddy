// WorkoutsView.js
// View of workouts

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'reactstrap';
import WorkoutCard from '../components/cards/WorkoutCard.js';
import TitleBox from '../components/TitleBox.js';
import { getPublicWorkouts, getUserWorkouts } from '../helpers/data/workoutData.js';
import searchWorkouts from '../helpers/data/search.js';

const WorkoutsView = ({
  user,
  searchTerms,
}) => {
  const navigate = useNavigate();
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [filterCopy, setFilterCopy] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const handleAddClick = () => {
    navigate('/add-workout');
  };

  // run search when the search terms change, run when userWorkouts is loaded
  useEffect(() => {
    if (searchTerms) {
      const tmpArr = userWorkouts.filter((workout) => searchWorkouts(workout, searchTerms));
      setFilterCopy(tmpArr);
    }
  }, [searchTerms, userWorkouts]);

  useEffect(() => {
    let mounted = true;
    if (user) {
      getUserWorkouts(user.uid).then((workoutsArr) => {
        if (mounted) {
          setUserWorkouts(workoutsArr);
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
    } else {
      getPublicWorkouts().then((workoutsArr) => {
        if (mounted) {
          setUserWorkouts(workoutsArr);
          setLoaded(true);
        }
      });
    }
    return function cleanup() {
      mounted = false;
    };
  }, [trigger]);

  return (
  <div className='workouts-view'>
    <TitleBox heading1='Workouts' />
    { user
      && <div className='view-button-container'>
        <Button className='btn btn-info add-workout'
        onClick={handleAddClick} >Add Workout</Button>
      </div>
    }
    <div className='card-container workout-cards-container'>
      { !loaded && <Spinner className='workout-view-spinner' color='primary' /> }
      { filterCopy.map((workout) => <WorkoutCard
        key={workout.id}
        workout={workout}
        user={user}
        setUserWorkouts={setUserWorkouts}
        trigger={trigger}
        setTrigger={setTrigger}
        />)
      }
    </div>
  </div>
  );
};

WorkoutsView.propTypes = {
  user: PropTypes.any,
  searchTerms: PropTypes.string,
};

export default WorkoutsView;
