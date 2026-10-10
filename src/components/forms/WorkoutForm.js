// WorkoutForm.js

import React, {
  useState, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form, FormGroup,
  Label, Input,
  Button,
} from 'reactstrap';
import GroupFormDiv from '../cards/GroupFormDiv.js';
import {
  getSets, deleteSetND,
  updateSet, addSet
} from '../../helpers/data/setData.js';
import {
  getSingleWorkout, updateWorkout,
  addWorkout
} from '../../helpers/data/workoutData.js';
import {
  updateGroup, deleteGroupND,
  addGroup
} from '../../helpers/data/groupData.js';
import { addWorkoutCollection, deleteWorkoutCollection, getWorkoutCollectionsCheckedArr } from '../../helpers/data/workoutCollectionData.js';

const WorkoutForm = ({
  user
}) => {
  const [workout, setWorkout] = useState({
    author_uid: user.uid,
    date: '',
    description: '',
    id: '',
    longcourse: 'true',
    meters: 'true',
    public: false,
    title: '',
    groupArr: []
  });
  const [localGroupArr, setLocalGroupArr] = useState([]);
  const [deletedGroups, setDeletedGroups] = useState([]);
  const [deletedSets, setDeletedSets] = useState([]);
  const [collectionsArr, setCollectionsArr] = useState([]);
  const [initialCollectionsArr, setInitialCollectionsArr] = useState([]);
  const navigate = useNavigate();

  const { id } = useParams();

  const handleInputChange = (e) => {
    setWorkout((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value ? e.target.value : '',
    }));
  };

  const handleCheckboxChange = (e, index) => {
    const tmpArr = [...collectionsArr];
    tmpArr[index].checked = e.target.checked;
    setCollectionsArr(tmpArr);
  };

  const handlePublicCheckboxChange = (e) => {
    setWorkout((prevState) => ({
      ...prevState,
      public: e.target.checked
    }));
  };

  const addGroupClick = () => {
    const sequence = localGroupArr.length;
    const tempArr = [...localGroupArr];
    const blankSetGroupObj = {
      comment: '',
      id: '',
      repetitions: '',
      sequence,
      title: '',
      workout_id: workout.id,
      setArr: []
    };
    tempArr.push(blankSetGroupObj);
    setLocalGroupArr(tempArr);
  };

  const removeGroup = (index) => {
    const tempGroupArr = [...localGroupArr];
    const groupId = localGroupArr[index].id;
    // Save to list of deleted groups if it has an id
    // i.e. it was not just added on this form.
    if (groupId) {
      const tempDeletedGroups = [...deletedGroups];
      tempDeletedGroups.push(groupId);
      setDeletedGroups(tempDeletedGroups);
    }
    tempGroupArr.splice(index, 1);
    setLocalGroupArr(tempGroupArr);
  };

  const saveCollectionChoices = (workoutId) => {
    for (let i = 0; i < initialCollectionsArr.length; i += 1) {
      if (initialCollectionsArr[i].checked === true && collectionsArr && collectionsArr[i].checked === false) {
        deleteWorkoutCollection(collectionsArr[i].join_id);
      } else if (!initialCollectionsArr[i].checked && collectionsArr && collectionsArr[i].checked === true) {
        const tmpObj = {
          author_uid: collectionsArr[i].author_uid,
          collection_id: collectionsArr[i].id,
          workout_id: id
        };
        if (workoutId) {
          tmpObj.workout_id = workoutId;
        }
        addWorkoutCollection(user.uid, tmpObj);
      }
    }
  };

  const handleCancelClick = () => {
    navigate('/workouts');
  };

  const handleSubmit = ((e) => {
    e.preventDefault();
    // retain workout id for new workouts history push
    // delete removed sets and groups
    deletedSets.forEach((setId) => deleteSetND(setId));
    deletedGroups.forEach((groupId) => {
      getSets(groupId).then((setArr) => {
        setArr.forEach((set) => deleteSetND(set.id));
        deleteGroupND(groupId);
      });
    });
    // prepare object for saving
    const tempWorkoutObj = { ...workout };
    // remove groupArr as the data has changed
    // and is stored separately in the database
    delete tempWorkoutObj.groupArr;
    setWorkout(tempWorkoutObj);
    // update if there is an Id
    if (workout.id) {
      updateWorkout(workout.id, tempWorkoutObj).then(() => {
        let groupSequence = 0;
        let setSequence = 0;
        localGroupArr.forEach((groupObj) => {
          // remove setArr from object before saving
          // add sequence number
          const tempGroupObj = { ...groupObj };
          delete tempGroupObj.setArr;
          tempGroupObj.sequence = groupSequence;
          groupSequence += 1;
          // update Group
          if (tempGroupObj.id) {
            updateGroup(tempGroupObj.id, tempGroupObj);
            setSequence = 0;
            groupObj.setArr.forEach((setObj) => {
              // add sequence number.
              const tmpSetObj = { ...setObj };
              tmpSetObj.sequence = setSequence;
              setSequence += 1;
              if (setObj.id) {
                updateSet(setObj.id, tmpSetObj);
              } else addSet(tmpSetObj);
            });
          // add group and any associated sets
          } else {
            addGroup(tempGroupObj).then((newGroup) => {
              setSequence = 0;
              groupObj.setArr.forEach((setObj) => {
                const tmpSetObj = { ...setObj };
                tmpSetObj.sequence = setSequence;
                tmpSetObj.group_id = newGroup.id;
                setSequence += 1;
                addSet(tmpSetObj);
              });
            });
          } // else addGroup
        });
      }).then(() => {
        saveCollectionChoices();
        const submitHistory = () => {
          navigate('/workouts');
        };
        // delay for Firebase writing
        setTimeout(submitHistory, 200);
      });
    // add if there is no id, we are adding a workout
    } else {
      addWorkout(tempWorkoutObj).then((workoutObj) => {
        let groupSequence = 0;
        let setSequence = 0;
        localGroupArr.forEach((groupObj) => {
          // remove setArr from object before saving
          // add sequence number
          const tempGroupObj = { ...groupObj };
          delete tempGroupObj.setArr;
          tempGroupObj.sequence = groupSequence;
          tempGroupObj.workout_id = workoutObj.id;
          groupSequence += 1;
          addGroup(tempGroupObj).then((group) => {
            setSequence = 0;
            groupObj.setArr.forEach((setObj) => {
              // add sequence number.
              const tmpSetObj = { ...setObj };
              tmpSetObj.sequence = setSequence;
              tmpSetObj.group_id = group.id;
              setSequence += 1;
              addSet(tmpSetObj);
            });
          });
        });
        saveCollectionChoices(workoutObj.id);
      }).then(() => {
        const submitHistory = () => {
          navigate('/workouts');
        };
        // delay for Firebase writing
        setTimeout(submitHistory, 500);
      });
    } // if else
  }); // handleSubmit

  useEffect(() => {
    let mounted = true;
    if (id) {
      getSingleWorkout(id).then((workoutObj) => {
        if (mounted) {
          setWorkout(workoutObj);
        }
      });
      getWorkoutCollectionsCheckedArr(user.uid, id).then((responseArr) => {
        setCollectionsArr(responseArr);
        const tmpArr = [];
        for (let i = 0; i < responseArr.length; i += 1) {
          const tmpObj = { checked: false };
          tmpObj.checked = responseArr[i].checked;
          tmpArr.push(tmpObj);
        }
        setInitialCollectionsArr(tmpArr);
      });
    } else {
      getWorkoutCollectionsCheckedArr(user.uid, id).then((responseArr) => {
        setCollectionsArr(responseArr);
        const tmpArr = [];
        for (let i = 0; i < responseArr.length; i += 1) {
          const tmpObj = { checked: false };
          tmpArr.push(tmpObj);
        }
        setInitialCollectionsArr(tmpArr);
      });
    }
    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <div className='form-container'>
      <Form className='workout-form mb-4'>
        <div className='form-group-container'>
          <FormGroup className='workout-form-group'>
            <Label for='workout-title'>Workout Title</Label>
            <Input type='text' className='form-control' aria-describedby='Workout Title'
              name='title' value={workout.title || ''} onChange={handleInputChange}
              placeholder='Enter Workout Title' />
            <Label for='workout-description'>Description</Label>
            <Input type='text' className='form-control' aria-describedby='Workout Description'
              name='description' value={workout.description || ''} onChange={handleInputChange}
              placeholder='Workout Description' />
            <Label for='longcourse'>Pool Configuration</Label>
            <Input type='select' className='form-control' aria-describedby='Pool Configuration'
              name='longcourse' value={workout.longcourse || ''} onChange={handleInputChange}
              placeholder='Pool Configuration' >
              <option defaultValue='true'>Select longcourse or shortcourse</option>
              <option value='true'>Longcourse</option>
              <option value='false'>Shortcourse</option>
            </Input>
            <Label for='meters'>Unit</Label>
            <Input type='select' className='form-control' aria-describedby='Yard or Meters'
              name='meters' value={workout.meters} onChange={handleInputChange}>
              <option defaultValue='true'>Select yards or meters</option>
              <option value='true'>Meters</option>
              <option value='false'>Yards</option>
            </Input>
            <Label for='checkbox-container'>Add to Collection(s)</Label>
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
            <div className='add-set-group-icon' onClick={addGroupClick}>Add Set Group<i className='fas fa-plus'></i></div>
            <div className='public-check-box'>
              <Input type='checkbox' className='form-check-input public-checkbox' aria-describedby='Make Public'
                name='public' value='true'
                onChange={handlePublicCheckboxChange} checked={workout.public} />
              <Label for='public-checkbox'>Make Public</Label>
            </div>
            <div className='mt-auto card-btn-container'>
              <Button className='btn btn-info btn-submit-workout'
                onClick={handleSubmit}>Submit Workout</Button>
              <Button className="btn btn-secondary btn-cancel-workout"
                onClick={handleCancelClick}>Cancel</Button>
            </div>
          </FormGroup>
          <GroupFormDiv workoutId={id}
            localGroupArr={localGroupArr}
            setLocalGroupArr={setLocalGroupArr}
            removeGroup={removeGroup}
            deletedSets={deletedSets}
            setDeletedSets={setDeletedSets}
            />
        </div>
      </Form>
    </div>
  );
};

WorkoutForm.propTypes = {
  user: PropTypes.any
};

export default WorkoutForm;
