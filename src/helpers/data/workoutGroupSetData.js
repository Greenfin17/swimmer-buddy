// workoutGroupSetData.js

import { getSingleWorkout, getUserWorkouts } from './workoutData';
import { getGroups, cmpGroups } from './groupData';
import { getSets, cmpSets, setArrDistance } from './setData';

/* const totalDistance = (distanceArr) => {
  let returnVal = 0;
  distanceArr.forEach((unit) => {
    returnVal += unit;
  });
  return returnVal;
}; */

const getGroupSetData = (group) => new Promise((resolve, reject) => {
  getSets(group.id).then((setArr) => {
    const groupObj = {
      ...group,
      setArr
    };
    resolve(groupObj);
  }).catch((error) => reject(error));
});

const getWorkoutGroupData = (workout) => new Promise((resolve, reject) => {
  getGroups(workout.id).then((groupArr) => {
    const workoutObj = {
      ...workout,
      groupArr
    };
    resolve(workoutObj);
  }).catch((error) => reject(error));
});

const getSingleWorkoutSets = (workoutId) => new Promise((resolve, reject) => {
  getSingleWorkout(workoutId).then((workout) => getGroups(workout.id).then((groupArr) => {
    const midArr = [];
    groupArr.sort(cmpGroups);
    groupArr.forEach((group) => getSets(group.id).then((setArr) => {
      setArr.sort(cmpSets);
      const groupObj = {
        ...group,
        setArr,
        groupDistance: setArrDistance(setArr)
      };
      midArr.push(groupObj);
    }));
    const workoutDataObj = {
      ...workout,
      groupArr: midArr,
    };
    resolve(workoutDataObj);
  })).catch((error) => reject(error));
});

const getSingleWorkoutSetsLocal = (workoutArr, workoutId) => {
  let returnObj = {};
  for (let i = 0; i < workoutArr.length; i += 1) {
    if (workoutArr[i].id === workoutId) {
      returnObj = workoutArr[i];
      break;
    }
  }
  return returnObj;
};

const getWorkoutIndex = (workoutArr, workoutId) => {
  let returnVal = '-1';
  if (workoutArr) {
    for (let i = 0; i < workoutArr.length; i += 1) {
      if (workoutArr[i].id === workoutId) {
        returnVal = i;
        break;
      }
    }
  }
  return returnVal;
};

const getFullUserWorkouts = (uid) => new Promise((resolve, reject) => {
  const workoutReturnArr = [];
  getUserWorkouts(uid).then((workoutArr) => {
    workoutArr.forEach((workout) => {
      const midArr = [];
      getGroups(workout.id).then((groupArr) => {
        groupArr.sort(cmpGroups);
        groupArr.forEach((group) => getSets(group.id).then((setArr) => {
          setArr.sort(cmpSets);
          const groupObj = {
            ...group,
            setArr,
            groupDistance: setArrDistance(setArr)
          };
          midArr.push(groupObj);
        }));
        const workoutDataObj = {
          ...workout,
          groupArr: midArr,
        };
        workoutReturnArr.push(workoutDataObj);
      });
    });
    resolve(workoutReturnArr);
  }).catch((error) => reject(error));
});

export {
  getFullUserWorkouts,
  getSingleWorkoutSets,
  getSingleWorkoutSetsLocal,
  getGroupSetData,
  getWorkoutGroupData,
  getWorkoutIndex
};
