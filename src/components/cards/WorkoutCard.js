// WorkoutCard.js
// Display individual workout on a card

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Card, CardBody,
  CardTitle, CardSubtitle,
  Button, Input, Label, Spinner
} from 'reactstrap';
import { deleteGroupND, getGroups, cmpGroups } from '../../helpers/data/groupData.js';
import GroupCardDiv from './GroupCardDiv.js';
import { deleteSetND, getSets } from '../../helpers/data/setData.js';
import { deleteWorkout, getSingleWorkout } from '../../helpers/data/workoutData.js';
import {
  deleteJoinND, getWorkoutCollectionJoins,
  deleteWorkoutCollection, addWorkoutCollection,
  getWorkoutCollectionsCheckedArr
} from '../../helpers/data/workoutCollectionData.js';
import { getUser } from '../../helpers/data/userData.js';

const WorkoutCard = ({
  user,
  workout,
  setUserWorkouts,
  trigger,
  setTrigger
}) => {
  const [groupArr, setGroupArr] = useState([]);
  const [localWorkout, setLocalWorkout] = useState({});
  const [author, setAuthor] = useState({});
  const [groupDistanceArr, setGroupDistanceArr] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [collectionsArr, setCollectionsArr] = useState([]);
  const [initialCollectionsArr, setInitialCollectionsArr] = useState([]);
  const [toggleAddCollections, setToggleAddCollections] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = () => {
    if (workout && workout.id) {
      navigate(`/edit-workout/${workout.id}`);
    }
  };

  const handleCheckboxChange = (e, index) => {
    const tmpArr = [...collectionsArr];
    tmpArr[index].checked = e.target.checked;
    setCollectionsArr(tmpArr);
  };

  const saveCollectionChoices = (workoutId) => {
    for (let i = 0; i < initialCollectionsArr.length; i += 1) {
      if (initialCollectionsArr[i].checked === true && collectionsArr && collectionsArr[i].checked === false) {
        deleteWorkoutCollection(collectionsArr[i].join_id);
      } else if (!initialCollectionsArr[i].checked && collectionsArr && collectionsArr[i].checked === true) {
        const tmpObj = {
          author_uid: collectionsArr[i].author_uid,
          collection_id: collectionsArr[i].id,
          workout_id: workout.id
        };
        if (workoutId) {
          tmpObj.workout_id = workoutId;
        }
        addWorkoutCollection(user.uid, tmpObj);
      }
    }
  };

  const handleToggleCollections = () => {
    setToggleAddCollections(!toggleAddCollections);
  };

  const handleSubmitChoices = () => {
    saveCollectionChoices();
    setToggleAddCollections(!toggleAddCollections);
  };

  const handleDeleteClick = () => {
    groupArr.forEach((groupObj) => {
      getSets(groupObj.id).then((setArr) => {
        setArr.forEach((setObj) => {
          deleteSetND(setObj.id);
        });
      });
      deleteGroupND(groupObj.id);
    });
    if (workout) {
      const promiseArr = [];
      getWorkoutCollectionJoins(workout.id).then((joinArr) => {
        joinArr.forEach((join) => {
          promiseArr.push(deleteJoinND(join.id));
        });
        // wait for all deletions to avoid orphans displaying
        Promise.all(promiseArr).then(() => {
          deleteWorkout(workout.author_uid, workout.id).then((workoutsArr) => {
            setUserWorkouts(workoutsArr);
            setTrigger(!trigger);
          });
        });
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    if (user && workout && mounted) {
      getWorkoutCollectionsCheckedArr(user.uid, workout.id).then((responseArr) => {
        setCollectionsArr(responseArr);
        const tmpArr = [];
        for (let i = 0; i < responseArr.length; i += 1) {
          const tmpObj = { checked: false };
          tmpObj.checked = responseArr[i].checked;
          tmpArr.push(tmpObj);
        }
        setInitialCollectionsArr(tmpArr);
      });
    }
    return function cleanup() {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    let tmpTotalDistance = 0;
    groupDistanceArr.forEach((distance) => {
      tmpTotalDistance += distance;
    });
    if (mounted) {
      setTotalDistance(tmpTotalDistance);
    }
    return function cleanup() {
      mounted = false;
    };
  }, [groupDistanceArr]);

  useEffect(() => {
    let mounted = true;
    if (workout && workout.id) {
      getSingleWorkout(workout.id).then((workoutObj) => {
        if (mounted && workoutObj) {
          setLocalWorkout(workoutObj);
        }
      });
      getGroups(workout.id).then((respGroupArr) => {
        respGroupArr.sort(cmpGroups);
        if (mounted) {
          setGroupArr(respGroupArr);
          setLoaded(true);
        }
      });
    }
    return function cleanup() {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    // needed for author name
    getUser(localWorkout.author_uid).then((authorArr) => {
      if (authorArr && mounted) {
        setAuthor(authorArr[0]);
      }
    });
    return function cleanup() {
      mounted = false;
    };
  }, [localWorkout]);

  return (
    <>
      <Card className='workout-card'>
        <CardBody className='workout-card-body' >
          <CardTitle tag='h5'><div className='workout-heading row'>
            <div className='workout-title col-8'>{localWorkout.title}</div>
            <div className='col-4 workout-total-distance'>{totalDistance}
              { localWorkout.meters === 'true' ? ' Meters' : ' Yards' }</div></div></CardTitle>
          <CardSubtitle tag='h6' className='mb-2 row text-muted'>
              <div className='col-4 author-name'>{author?.displayName ? author?.displayName : author?.fullName} </div>
              <div className='col-4 author-club'>{author?.club}</div>
              <div className='col-4 author-location'>{author?.location}</div>
            </CardSubtitle>
            <div className='workout-description row'>
              <p className='col-12'>{localWorkout.description}</p>
            </div>
          { groupArr && groupArr.map((group, index) => <GroupCardDiv key={group.id}
            index={index} id={group.id} group={group}
            groupDistanceArr={groupDistanceArr}
            setGroupDistanceArr={setGroupDistanceArr} />)}
            { !loaded && <Spinner className='card-spinner' color='primary' /> }
        </CardBody>
        { user?.uid === localWorkout.author_uid
          && <div className='card-footer mt-auto card-btn-container'>
            <Button className="btn btn-info"
              onClick={handleEditClick} >Edit Workout</Button>
            <Button className="btn btn-danger"
              onClick={handleDeleteClick}>Delete Workout</Button>
          </div>
        }
        { user && user.uid !== localWorkout.author_uid
          && <div className='shared-workouts-checkbox'>
            <div className='collection-checkbox-label'
              onClick={handleToggleCollections}>
              Add to Collection(s)</div>
          { toggleAddCollections
            && <>
              <div className='checkbox-container'>
                <ul className='collection-ul'>
                  { collectionsArr.map((collection, index) => <li key={collection.id}><div
                    className='form-check' key={collection.id} >
                    <Input type='checkbox' className='form-check-input' aria-describedby='Add to Collecton'
                      name='checked' value={collection.id} key={index}
                      onChange={(e) => handleCheckboxChange(e, index)} checked={collection.checked} />
                    <Label for='collection_id'>{collection.title}</Label>
                  </div> </li>)}
                </ul>
              </div>
              <div className='card-footer mt-auto card-btn-container'>
                <Button className="btn btn-info"
                  onClick={handleSubmitChoices}>Submit Choices</Button>
              </div>
            </> }
          </div>
        }
      </Card>
    </>
  );
};

WorkoutCard.propTypes = {
  user: PropTypes.any,
  workout: PropTypes.object,
  setUserWorkouts: PropTypes.func,
  trigger: PropTypes.bool,
  setTrigger: PropTypes.func
};

export default WorkoutCard;
