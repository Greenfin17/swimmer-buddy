// groupData.js

import axios from 'axios';
import firebaseConfig from '../apiKeys.js';

const dbUrl = firebaseConfig.databaseURL;

const cmpGroups = (groupA, groupB) => groupA.sequence - groupB.sequence;

const getGroups = (workoutId) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/group.json?orderBy="workout_id"&equalTo="${workoutId}"`)
    .then((response) => {
      const groupArr = Object.values(response.data);
      if (response.data) {
        resolve(groupArr);
      } else resolve([]);
    }).catch((error) => reject(error));
});

const getSingleGroup = (workoutId) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/group/${workoutId}.json`)
    .then((response) => {
      if (response.data) {
        resolve(response.data);
      } else resolve({});
    }).catch((error) => reject(error));
});

// Delete set, return no data
const deleteGroupND = (groupId) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/group/${groupId}.json`)
    .then(() => resolve('deleted'))
    .catch((error) => reject(error));
});

const updateGroup = (groupId, groupObj) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/group/${groupId}.json`, groupObj)
    .then((response) => {
      if (response.data) {
        resolve(response.data);
      } else resolve({});
    })
    .catch((error) => reject(error));
});

const addGroup = (groupObj) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/group.json`, groupObj)
    .then((response) => {
      const keyObj = { id: response.data.name };
      axios.patch(`${dbUrl}/group/${response.data.name}.json`, keyObj)
        .then(() => getSingleGroup(keyObj.id).then((group) => {
          resolve(group);
        }));
    }).catch((error) => reject(error));
});

export {
  cmpGroups,
  getGroups,
  getSingleGroup,
  deleteGroupND,
  updateGroup,
  addGroup
};
