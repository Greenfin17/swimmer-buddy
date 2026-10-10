// GroupFormDiv.js
// Displays groups and sets in the workout form
// in separate div to the right.

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import SetGroupForm from '../forms/SetGroupForm.js';
import { getGroups, cmpGroups } from '../../helpers/data/groupData.js';

const GroupFormDiv = ({
  workoutId,
  localGroupArr,
  setLocalGroupArr,
  removeGroup,
  deletedSets,
  setDeletedSets,
}) => {
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const tmpGroupArr = [];
      getGroups(workoutId).then((groupArr) => {
        let i = 0;
        let tmpGroupObj = {};
        groupArr.sort(cmpGroups);
        // add SetArr for each set group
        groupArr.forEach((group) => {
          tmpGroupObj = { ...group };
          tmpGroupObj.setArr = [];
          tmpGroupArr.push(tmpGroupObj);
          i += 1;
          if (i === groupArr.length) {
            setLocalGroupArr(tmpGroupArr);
          }
        });
      });
    }
    return function cleanup() {
      mounted = false;
      return mounted;
    };
  }, []);

  return (
    <div className='form-group-listing'>
      <div className='form-listing-wrapper'>
      { localGroupArr.map((group, key) => <SetGroupForm
          key={key}
          index={key}
          groupId={group.id}
          workoutId={workoutId}
          localGroupArr={localGroupArr}
          setLocalGroupArr={setLocalGroupArr}
          removeGroup={removeGroup}
          deletedSets={deletedSets}
          setDeletedSets={setDeletedSets}
        />)}
      </div>
    </div>
  );
};

GroupFormDiv.propTypes = {
  workoutId: PropTypes.string,
  localGroupArr: PropTypes.array,
  setLocalGroupArr: PropTypes.func,
  formSetArr: PropTypes.array,
  setFormSetArr: PropTypes.func,
  removeGroup: PropTypes.func,
  deletedSets: PropTypes.array,
  setDeletedSets: PropTypes.func
};

export default GroupFormDiv;
