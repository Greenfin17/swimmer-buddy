import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.scss';
import MainApp from './App/appIndex.js';
import reportWebVitals from './reportWebVitals.js';

import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.Fragment>
    <MainApp />
  </React.Fragment>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
