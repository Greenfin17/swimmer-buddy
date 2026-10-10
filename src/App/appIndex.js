import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleAuthProvider, onAuthStateChanged, getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../helpers/apiKeys.js';
import NavBar from '../components/NavBar.js';
import { addUser, getUser } from '../helpers/data/userData.js';
import Routes from '../helpers/Routes.js';

function MainApp() {
  const provider = new GoogleAuthProvider();
  const appInit = initializeApp(firebaseConfig);
  const authInit = getAuth(appInit);
  const [user, setUser] = useState(null);
  const [searchTerms, setSearchTerms] = useState('');

  useEffect(() => {
    onAuthStateChanged(authInit, (authed) => {
      if (authed) {
        const userinfoobj = {
          fullname: authed.displayname,
          profileimage: authed.photourl,
          uid: authed.uid,
          username: authed.email.split('@')[0],
          id: '',
          displayname: '',
          club: '',
          location: ''
        };
        getUser(authed.uid).then((userresp) => {
          if (userresp.length < 1) {
            addUser(userinfoobj);
          } else {
            setUser(userresp[0]);
          }
        });
      } else if (user || user === null) {
        setUser(false);
      }
    });
  }, []);

  return (
    <div className='App'>
      <Router>
        <NavBar user={user}
          setSearchTerms={setSearchTerms}
          authInit = {authInit}
          provider = {provider}/>
        <Routes
          user={user}
          setUser={setUser}
          searchTerms={searchTerms}
        />
      </Router>
    </div>
  );
}

export default MainApp;
