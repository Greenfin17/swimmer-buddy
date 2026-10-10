// setData.js

import axios from 'axios';
import firebaseConfig from '../apiKeys.js';

const dbUrl = firebaseConfig.databaseURL;

const cmpSets = (setA, setB) => setA.sequence - setB.sequence;

const setArrDistance = (setArr) => {
  let totalDistance = 0;
  let distance = 0;
  let reps = 0;
  setArr.forEach((set) => {
    distance = Number(set.distance);
    reps = Number(set.repetitions);
    if (Number.isInteger(distance) && Number.isInteger(reps)) {
      totalDistance += (distance * reps);
    }
  });
  return totalDistance;
};

const cloneSetData = (refArr, copyArr) => {
  copyArr.forEach((set) => {
    let tempSet = {};
    tempSet = { ...set };
    refArr.push(tempSet);
  });
};
const getSingleSet = (setId) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/set/${setId}.json`)
    .then((response) => {
      if (response.data) {
        resolve(response.data);
      } else resolve({});
    })
    .catch((error) => reject(error));
});

const getSets = (groupId) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/set.json?orderBy="group_id"&equalTo="${groupId}"`)
    .then((response) => {
      const setArr = Object.values(response.data);
      if (response.data) {
        resolve(setArr);
      } else resolve([]);
    }).catch((error) => reject(error));
});

// Delete set, return no data
const deleteSetND = (setId) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/set/${setId}.json`)
    .then(() => resolve('deleted'))
    .catch((error) => reject(error));
});

const updateSet = (setId, setObj) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/set/${setId}.json`, setObj)
    .then((response) => {
      if (response.data) {
        resolve(response.data);
      } else resolve({});
    })
    .catch((error) => reject(error));
});

const addSet = (setObj) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/set.json`, setObj)
    .then((response) => {
      const keyObj = { id: response.data.name };
      axios.patch(`${dbUrl}/set/${response.data.name}.json`, keyObj)
        .then(() => getSingleSet(keyObj.id).then((set) => {
          resolve(set);
        }));
    }).catch((error) => reject(error));
});

export {
  getSets, getSingleSet,
  cmpSets,
  cloneSetData,
  setArrDistance,
  deleteSetND,
  updateSet,
  addSet
};
