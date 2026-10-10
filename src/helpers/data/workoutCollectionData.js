// workoutCollectionData.js

import axios from 'axios';
import firebaseConfig from '../apiKeys.js';
import { getSingleWorkout } from './workoutData.js';
import { getCollections } from './collectionData.js';

const dbUrl = firebaseConfig.databaseURL;

const getCollectionWorkoutJoins = (collectionId) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/workout_collection.json?orderBy="collection_id"&equalTo="${collectionId}"`)
    .then((response) => {
      if (response) {
        const responseArr = Object.values(response.data);
        resolve(responseArr);
      } else resolve([]);
    })
    .catch((error) => reject(error));
});

const getWorkoutCollectionJoins = (workoutId) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/workout_collection.json?orderBy="workout_id"&equalTo="${workoutId}"`)
    .then((response) => {
      if (response) {
        const responseArr = Object.values(response.data);
        resolve(responseArr);
      } else resolve([]);
    })
    .catch((error) => reject(error));
});

// delete join, return no data
const deleteJoinND = (joinId) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/workout_collection/${joinId}.json`)
    .then(() => resolve('deleted'))
    .catch((error) => reject(error));
});

const getCollectionWorkouts = (collectionId) => new Promise((resolve, reject) => {
  const workoutArr = [];
  axios.get(`${dbUrl}/workout_collection.json?orderBy="collection_id"&equalTo="${collectionId}"`)
    .then((response) => {
      const responseArr = Object.values(response.data);
      responseArr.forEach((joinObj) => {
        getSingleWorkout(joinObj.workout_id).then((workoutObj) => {
          workoutArr.push(workoutObj);
        });
      }).then(() => {
        resolve(workoutArr);
      });
    })
    .catch((error) => reject(error));
});

const getWorkoutCollectionsCheckedArr = (uid, workoutId) => new Promise((resolve, reject) => {
  Promise.all([getCollections(uid), getWorkoutCollectionJoins(workoutId)])
    .then(([collections, joins]) => {
      const workoutCollectionsArr = collections.map((collection) => {
        let checked = false;
        let joinId = '';
        // for loop to allow break statement
        for (let i = 0; i < joins.length; i += 1) {
          if (joins[i].collection_id === collection.id) {
            checked = true;
            joinId = joins[i].id;
            break;
          }
        }
        const tmpObj = {
          ...collection,
          checked,
          join_id: joinId
        };
        return tmpObj;
      });
      resolve(workoutCollectionsArr);
    }).catch((error) => reject(error));
});

const updateWorkoutCollection = (joinId, joinObj) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/workout_collections/${joinId}.json`, joinObj)
    .then((response) => {
      if (response) {
        resolve(response.data);
      } else resolve('');
    })
    .catch((error) => reject(error));
});

const addWorkoutCollection = (uid, joinObj) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/workout_collection.json`, joinObj)
    .then((response) => {
      const keyObj = { id: response.data.name };
      axios.patch(`${dbUrl}/workout_collection/${response.data.name}.json`, keyObj)
        .then(() => getCollections(uid).then((collectionArr) => {
          if (collectionArr) {
            resolve(collectionArr);
          } else resolve({});
        }));
    }).catch((error) => reject(error));
});

const deleteWorkoutCollection = (joinId, workoutId) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/workout_collection/${joinId}.json`)
    .then(() => getWorkoutCollectionJoins(workoutId).then((collectionArr) => {
      if (collectionArr) {
        resolve(collectionArr);
      } else resolve({});
    }))
    .catch((error) => reject(error));
});

export {
  getCollectionWorkouts, getCollectionWorkoutJoins,
  getWorkoutCollectionJoins, getWorkoutCollectionsCheckedArr,
  updateWorkoutCollection, addWorkoutCollection,
  deleteWorkoutCollection, deleteJoinND
};
