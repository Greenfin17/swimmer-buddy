// workoutData.js

import axios from 'axios';
import firebaseConfig from '../apiKeys.js';

const dbUrl = firebaseConfig.databaseURL;

const getSingleWorkout = (workoutId) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/workout/${workoutId}.json`)
    .then((response) => {
      if (response.data) {
        resolve(response.data);
      } else resolve({});
    })
    .catch((error) => reject(error));
});

const getWorkouts = () => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/workout.json`)
    .then((response) => {
      const workoutArr = Object.values(response.data);
      if (response.data) {
        resolve(workoutArr);
      } else resolve({});
    })
    .catch((error) => reject(error));
});

const getUserWorkouts = (uid) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/workout.json?orderBy="author_uid"&equalTo="${uid}"`)
    .then((response) => {
      const workoutArr = Object.values(response.data);
      if (response.data) {
        resolve(workoutArr);
      } else resolve([]);
    }).catch((error) => reject(error));
});

const getPublicWorkouts = () => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/workout.json?orderBy="public"&equalTo=true`)
    .then((response) => {
      const workoutArr = Object.values(response.data);
      if (response.data) {
        resolve(workoutArr);
      } else resolve([]);
    }).catch((error) => reject(error));
});

const updateWorkout = (workoutId, workoutObj) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/workout/${workoutId}.json`, workoutObj)
    .then((response) => {
      if (response) {
        resolve(response.data);
      } else resolve('');
    })
    .catch((error) => reject(error));
});
const addWorkout = (workoutObj) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/workout.json`, workoutObj)
    .then((response) => {
      const keyObj = { id: response.data.name };
      axios.patch(`${dbUrl}/workout/${response.data.name}.json`, keyObj)
        .then(() => getSingleWorkout(keyObj.id).then((workout) => {
          if (workout) {
            resolve(workout);
          } else resolve({});
        }));
    }).catch((error) => reject(error));
});

const deleteWorkout = (uid, workoutId) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/workout/${workoutId}.json`)
    .then(() => getUserWorkouts(uid).then((workoutArr) => {
      if (workoutArr) {
        resolve(workoutArr);
      } else resolve([]);
    }))
    .catch((error) => reject(error));
});

export {
  getSingleWorkout, getWorkouts, getUserWorkouts,
  updateWorkout, addWorkout, deleteWorkout,
  getPublicWorkouts
};
