// Routes.js
import React from 'react';
import {
  Route,
  Routes,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import Home from '../views/Home.js';
import NotFound from '../views/NotFound.js';
// import WorkoutsView from '../views/WorkoutsView.js';
import SharedWorkoutsView from '../views/SharedWorkoutsView.js';
// import WorkoutForm from '../components/forms/WorkoutForm.js';
import CollectionsView from '../views/CollectionsView.js';
import CollectionWorkoutsView from '../views/CollectionWorkoutsView.js';
import CollectionForm from '../components/forms/CollectionForm.js';
// import UserForm from '../components/forms/UserForm.js';
import ProtectedRoute from './auth/ProtectedRoute.js';
import WorkoutForm from '../components/forms/WorkoutForm.js';
import UserForm from '../components/forms/UserForm.js';
import WorkoutsView from '../views/WorkoutsView.js';

const AppRoutes = ({
  user,
  searchTerms
}) => (
  <Routes>
      <Route exact path='/'
        element={() => <Home user={user}
        searchTerms={searchTerms}/>}
      />
      <Route element={<ProtectedRoute user={user} />}>
        <Route path='/collections'
          element={<CollectionsView
            user={user} />} />
        </Route>
        <Route path='/edit-collection/:id'
          element={<CollectionForm
            user={user} />} />
        <Route path = '/collection-workouts/:id'
          element={<CollectionWorkoutsView
            user={user} />} />
        <Route path = 'add-collection'
          element={<CollectionForm
            user={user} />} />
        <Route path = '/edit-workout/:id'
          element={<WorkoutForm
            user={user} />} />
        <Route path = '/add-workout'
          element={<WorkoutForm
            user={user} />} />
        <Route path = '/account'
          element={<UserForm
            user={user} />} />
      <Route path = '/workouts'
        element={<WorkoutsView
            user={user}
            searchTerms={searchTerms} />}
      />
      <Route path='/shared-workouts'
        element={<SharedWorkoutsView
          user={user}
          searchTerms={searchTerms} />}
        />
      <Route path='*'
        element={NotFound}
      />
  </Routes>
);

AppRoutes.propTypes = {
  user: PropTypes.any,
  setUser: PropTypes.func,
  searchTerms: PropTypes.string
};

export default AppRoutes;
