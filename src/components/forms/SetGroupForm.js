// SetGroupForm.js

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Label, Input,
} from 'reactstrap';
import SetForm from './SetForm.js';
import { getSingleGroup } from '../../helpers/data/groupData.js';
import { getSets, cmpSets } from '../../helpers/data/setData.js';

const SetGroupForm = ({
  index,
  groupId,
  localGroupArr,
  setLocalGroupArr,
  workoutId,
  removeGroup,
  deletedSets,
  setDeletedSets,
}) => {
  const [localGroup, setLocalGroup] = useState({
    comment: '',
    id: '',
    repetitions: '',
    sequence: 0,
    title: '',
    workout_id: workoutId,
    setArr: []
  });
  // trigger re-render for local hooks downstream
  const [trigger, setTrigger] = useState(false);

  const deleteSet = (setIndex) => {
    const tempLocalGroup = { ...localGroup };
    const setId = localGroup.setArr[setIndex].id;
    // save id of deleted sets for deletion
    // newly added sets have no id
    if (setId) {
      const tempDeletedSets = [...deletedSets];
      tempDeletedSets.push(setId);
      setDeletedSets(tempDeletedSets);
    }
    tempLocalGroup.setArr.splice(setIndex, 1);
    // localGroupArray is updated in useEffect
    // update display
    // save data to form
    setLocalGroup(tempLocalGroup);
    // trigger re-render
    setTrigger(!trigger);
  };

  const handleRemoveGroupClick = () => {
    removeGroup(index);
    // trigger re-render
    setTrigger(!trigger);
  };

  const handleInputChange = (e) => {
    setLocalGroup((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value ? e.target.value : '',
    }));
  };

  const addSetClick = () => {
    const sequence = localGroup.setArr.length;
    const tempGroup = { ...localGroup };
    const tempGroupArr = [...localGroupArr];
    const blankSetObj = {
      comment: '',
      id: '',
      repetitions: '',
      sequence,
      group_id: groupId,
      setArr: []
    };
    tempGroup.setArr.push(blankSetObj);
    setLocalGroup(tempGroup);
    tempGroupArr[index] = { ...tempGroup };
    setLocalGroupArr(tempGroupArr);
    setTrigger(!trigger);
  };

  // send data back to base form
  useEffect(() => {
    let mounted = true;
    const tempGroupArr = [...localGroupArr];
    const tempGroupObj = { ...localGroup };
    tempGroupArr[index] = { ...tempGroupObj };
    if (mounted) {
      setLocalGroupArr(tempGroupArr);
    }
    return function cleanup() {
      mounted = false;
    };
  }, [localGroup, trigger]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setLocalGroup(localGroupArr[index]);
    }
    return function cleanup() {
      mounted = false;
    };
  }, [trigger]);

  // render group form - launch set arrays
  useEffect(() => {
    let mounted = true;
    if (groupId) {
      let tmpSetArr = [];
      getSets(groupId).then((setArr) => {
        setArr.sort(cmpSets);
        tmpSetArr = [...setArr];
      }).then(() => getSingleGroup(groupId).then((group) => {
        const tmpGroup = { ...group };
        tmpGroup.setArr = [...tmpSetArr];
        if (mounted) {
          setLocalGroup(tmpGroup);
        }
      }));
    }
    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <div className='set-group-form-container'>
      <FormGroup className='set-localGroup-form-group'>
        <div className='row'>
          <div className='col-3'>
            <Label for='set-local Group-title'>Set Group Title</Label>
            <Input type='text' className='form-control' aria-describedby='Set Group Title'
              name='title' value={localGroup.title || ''} onChange={handleInputChange} />
          </div>
          <div className='col-1'>
            <Label for='set-localGroup-title'>Reps</Label>
            <Input type='text' className='form-control' aria-describedby='Set Group Title'
              name='repetitions' value={localGroup.repetitions || ''} onChange={handleInputChange}
               />
          </div>
          <div className='col-7'>
            <Label for='workout-description'>Comment</Label>
              <span className='add-set-icon' onClick={addSetClick}>Add Set<i className='fas fa-plus'></i></span>
            <Input type='text' className='form-control' aria-describedby='Workout Description'
              name='comment' value={localGroup.comment || ''} onChange={handleInputChange}
            />
          </div>
          <div className='col-1 remove-group'>
            <span className='remove-group-span'><i onClick={handleRemoveGroupClick} className='fas fa-trash '></i></span>
          </div>
        </div>
        <div className='row'>
          <Label className='col-2 set-distance' for='set-distance'>Distance</Label>
          <Label className='col-1 set-reps' for='set-repetitions'>Reps</Label>
          <Label className='col-3' for='set-stroke'>Stroke</Label>
          <Label className='col-3' for='set-comment'>Comment</Label>
          <Label className='col-2 set-interval-label' for='set-interval'>Interval</Label>
        </div>
        { localGroup.setArr.map((set, key) => <SetForm
          key={key} index={key}
          set={set} groupIndex={index}
          localGroup={localGroup} setLocalGroup={setLocalGroup}
          localGroupArr={localGroupArr} setLocalGroupArr={setLocalGroupArr}
          deleteSet={deleteSet} trigger={trigger} setTrigger={setTrigger}
          />) }
      </FormGroup>
    </div>
  );
};

SetGroupForm.propTypes = {
  index: PropTypes.number,
  groupId: PropTypes.string,
  localGroupArr: PropTypes.array,
  setLocalGroupArr: PropTypes.func,
  localSetGroupArr: PropTypes.array,
  setLocalSetGroupArr: PropTypes.func,
  workoutId: PropTypes.string,
  removeGroup: PropTypes.func,
  deletedSets: PropTypes.array,
  setDeletedSets: PropTypes.func,
  triggerGroup: PropTypes.bool,
  setTriggerGroup: PropTypes.func
};

export default SetGroupForm;
