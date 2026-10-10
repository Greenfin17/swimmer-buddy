// CollectionWorkoutsView.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button, Spinner
} from 'reactstrap';
import TitleBox from '../components/TitleBox.js';
import WorkoutCard from '../components/cards/WorkoutCard.js';
import { getCollectionWorkoutJoins } from '../helpers/data/workoutCollectionData.js';
import { getSingleCollection } from '../helpers/data/collectionData.js';

const CollectionWorkoutsView = ({
  user,
}) => {
  const [collectionWorkouts, setCollectionWorkouts] = useState([]);
  const [collection, setCollection] = useState({});
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const [trigger, setTrigger] = useState(false);

  const { id } = useParams();

  const handleAddClick = () => {
    navigate('/add-workout');
  };

  useEffect(() => {
    let mounted = true;
    // retrieving collection title
    getSingleCollection(id).then((collectionObj) => {
      if (mounted) {
        setCollection(collectionObj);
      }
    });
    const tmpArr = [];
    getCollectionWorkoutJoins(id).then((joinArr) => {
      joinArr.forEach((join) => {
        const tmpObj = {
          id: join.workout_id
        };
        tmpArr.push(tmpObj);
      });
    }).then(() => {
      if (mounted) {
        setCollectionWorkouts(tmpArr);
        setLoaded(true);
      }
    });
    return function cleanup() {
      mounted = false;
    };
  }, [trigger]);

  return (
    <div className='workouts-view'>
    <TitleBox heading1={collection.title} />
    <div className='view-button-container'>
      <Button className='btn btn-info add-workout'
      onClick={handleAddClick} >Add Workout</Button>
    </div>
    <div className='card-container workout-cards-container'>
    { !loaded && <Spinner className='collections-view-spinner' color='primary' /> }
      { user && collectionWorkouts.map((workout) => <WorkoutCard
        key={workout.id}
        workout={workout}
        user={user}
        setUserWorkouts={setCollectionWorkouts}
        collectionId={id}
        trigger={trigger}
        setTrigger={setTrigger}
        />)
      }
    </div>
  </div>
  );
};

CollectionWorkoutsView.propTypes = {
  user: PropTypes.any,
};

export default CollectionWorkoutsView;
