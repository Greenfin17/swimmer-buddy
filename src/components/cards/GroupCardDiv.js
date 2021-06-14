// GroupCardDiv
// Breaking up card into components to allow update on hook array updates.
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSets } from '../../helpers/data/setData';

const GroupCardDiv = ({
  id,
  group
}) => {
  const [setArr, setSetArr] = useState([]);
  const [reloaded, setReloaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (setArr.length === 0 && group) {
      getSets(group.id).then((sets) => {
        if (mounted) {
          setSetArr(sets);
        }
      });
    }
    setReloaded(true);
    return function cleanup() {
      mounted = false;
    };
  }, [(reloaded === false)]);

  useEffect(() => {
    let mounted = true;
    if (group) {
      getSets(group.id).then((sets) => {
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
        <div className='col-4 group-title'>{group.title}</div>
        <div className='col-3 group-repetitions'>x {group.repetitions}</div>
        <div className='col-5 interval-header'>Interval</div>
        { setArr?.map((set) => <div key={set.id} className='set-data row' >
          <div className='col-4'>{set.distance} x {set.repetitions} {set.stroke}</div>
          <div className='col-6'>{set.comment}</div>
          <div className='col-2 set-interval'>{set.interval}</div>
        </div>)}
      </div>
    </div>
  );
};

GroupCardDiv.propTypes = {
  id: PropTypes.string,
  group: PropTypes.object
};

export default GroupCardDiv;
