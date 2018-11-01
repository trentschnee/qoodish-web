import React from 'react';
import { render } from 'react-dom';

import AppContainer from './containers/AppContainer';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import { BrowserRouter, Route } from 'react-router-dom';

import appReducer from './reducers/appReducer';
import sharedReducer from './reducers/sharedReducer';
import discoverReducer from './reducers/discoverReducer';
import mapsReducer from './reducers/mapsReducer';
import mapDetailReducer from './reducers/mapDetailReducer';
import spotCardReducer from './reducers/spotCardReducer';
import spotDetailReducer from './reducers/spotDetailReducer';
import reviewDetailReducer from './reducers/reviewDetailReducer';
import mapSummaryReducer from './reducers/mapSummaryReducer';
import reviewsReducer from './reducers/reviewsReducer';
import gMapReducer from './reducers/gMapReducer';
import settingsReducer from './reducers/settingsReducer';
import invitesReducer from './reducers/invitesReducer';
import profileReducer from './reducers/profileReducer';

import persistState from 'redux-localstorage';

import { createLogger } from 'redux-logger';

import(/* webpackChunkName: "firebase" */ 'firebase/app').then((firebase) => {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    databaseURL: process.env.FIREBASE_DB_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
  };
  firebase.initializeApp(config);
});

const middlewares = [];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  middlewares.push(logger);
}

const reducer = combineReducers({
  app: appReducer,
  shared: sharedReducer,
  discover: discoverReducer,
  maps: mapsReducer,
  mapDetail: mapDetailReducer,
  spotCard: spotCardReducer,
  spotDetail: spotDetailReducer,
  reviewDetail: reviewDetailReducer,
  mapSummary: mapSummaryReducer,
  reviews: reviewsReducer,
  gMap: gMapReducer,
  settings: settingsReducer,
  invites: invitesReducer,
  profile: profileReducer
});

const store = compose(persistState('app'), applyMiddleware(...middlewares))(
  createStore
)(reducer);

window.addEventListener('DOMContentLoaded', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Route component={AppContainer} />
      </BrowserRouter>
    </Provider>,
    document.querySelector('#render-target')
  );
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch((err) => {
    console.log('ServiceWorker registration failed: ', err);
  });
}
