// collectionData.js

import axios from 'axios';
import firebaseConfig from '../apiKeys.js';

const dbUrl = firebaseConfig.databaseURL;

const getCollections = (uid) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/collection.json?orderBy="author_uid"&equalTo="${uid}"`)
    .then((response) => {
      if (response.data) {
        const responseObj = Object.values(response.data);
        resolve(responseObj);
      } else resolve([]);
    })
    .catch((error) => reject(error));
});

const getSingleCollection = (id) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/collection/${id}.json`)
    .then((response) => {
      if (response.data) {
        resolve(response.data);
      } else resolve({});
    })
    .catch((error) => reject(error));
});

const addCollection = (collectionObj) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/collection.json`, collectionObj)
    .then((response) => {
      const responseObj = { id: response.data.name };
      axios.patch(`${dbUrl}/collection/${responseObj.id}.json`, responseObj);
    })
    .then(() => getSingleCollection(collectionObj.id).then((collection) => {
      if (collection) {
        resolve(collection);
      } else resolve({});
    }))
    .catch((error) => reject(error));
});

const updateCollection = (id, collectionObj) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/collection/${id}.json`, collectionObj)
    .then((response) => {
      if (response.data) {
        resolve(response.data);
      } else resolve({});
    })
    .catch((error) => reject(error));
});

const deleteCollection = (uid, collectionId) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/collection/${collectionId}.json`)
    .then(() => getCollections(uid).then((collectionArr) => {
      if (collectionArr) {
        resolve(collectionArr);
      } else resolve([]);
    }))
    .catch((error) => reject(error));
});

export {
  getCollections, getSingleCollection,
  addCollection, updateCollection,
  deleteCollection
};
