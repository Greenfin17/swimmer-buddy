// GroupCardDiv
// Breaking up card into components to allow update on hook array updates.
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSets, setArrDistance, cmpSets } from '../../helpers/data/setData.js';

const GroupCardDiv = ({
  id,
  group,
  index,
  groupDistanceArr,
  setGroupDistanceArr,
}) => {
  const [setArr, setSetArr] = useState([]);

  // calculate workout total distance
  // todo: user must enter a repetition value
  useEffect(() => {
    let mounted = true;
    if (group) {
      const tmpGroupDistance = setArrDistance(setArr);
      const tmpGroupDistanceArr = [...groupDistanceArr];
      tmpGroupDistanceArr[index] = tmpGroupDistance * group.repetitions;
      if (mounted) {
        setGroupDistanceArr(tmpGroupDistanceArr);
      }
    }
    return function cleanup() {
      mounted = false;
    };
  }, [setArr]);

  useEffect(() => {
    let mounted = true;
    if (group) {
      getSets(group.id).then((sets) => {
        // put sets in order
        sets.sort(cmpSets);
        if (mounted) {
          setSetArr(sets);
        }
      });
    }
    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <div className='group-data' id={`group-data-${id}`}>
      <div className='row group-header'>
        <div className='col-3 group-title'>{group.title}</div>
        <div className='col-1 group-repetitions'>x {group.repetitions}</div>
        <div className='col-5 group-repetitions'>{group.comment}</div>
        <div className='col-3 interval-header'>Interval</div>
        { setArr?.map((set) => <div key={set.id} className='set-data row' >
          <div className='col-4'>{set.distance}{ set.distance ? ' x' : '' } {set.repetitions} {set.stroke}</div>
          <div className='col-6'>{set.comment}</div>
          <div className='col-2 set-interval'>{set.interval}</div>
        </div>)}
      </div>
    </div>
  );
};

GroupCardDiv.propTypes = {
  id: PropTypes.string,
  group: PropTypes.object,
  index: PropTypes.number,
  groupDistanceArr: PropTypes.array,
  setGroupDistanceArr: PropTypes.func
};

export default GroupCardDiv;
