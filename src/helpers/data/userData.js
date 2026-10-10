import axios from 'axios';
import firebaseConfig from '../apiKeys.js';

const dbUrl = firebaseConfig.databaseURL;

const getUser = (userId) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/user.json?orderBy="uid"&equalTo="${userId}"`)
    .then((response) => {
      // There should be only one value, using array response
      // in case of a duplicate entry for the user
      const userArr = Object.values(response.data);
      if (response.data) {
        resolve(userArr);
      } else resolve([]);
    }).catch((error) => reject(error));
});

const addUser = (userObj) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/user.json`, userObj)
    .then((response) => {
      const keyObj = { id: response.data.name };
      axios.patch(`${dbUrl}/user/${response.data.name}.json`, keyObj)
        .then(() => getUser(keyObj.uid).then((user) => {
          if (user) {
            resolve(user);
          } else resolve({});
        }));
    }).catch((error) => reject(error));
});

const updateUser = (userId, userObj) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}./user/${userId}.json`, userObj)
    .then(() => getUser(userId).then((user) => {
      resolve(user);
    })).catch((error) => reject(error));
});

export {
  getUser, addUser,
  updateUser
};
