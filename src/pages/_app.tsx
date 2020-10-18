import { AppProps } from 'next/app';
import { useEffect, useState, useCallback } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { ApiClient } from '@yusuke-suzuki/qoodish-api-js-client';
import firebase, { User } from 'firebase/app';
import 'firebase/auth';
import { amber, lightBlue } from '@material-ui/core/colors';
import getFirebaseMessaging from '../utils/getFirebaseMessaging';
import deleteRegistrationToken from '../utils/deleteRegistrationToken';
import createRegistrationToken from '../utils/createRegistrationToken';
import I18n from '../utils/I18n';
import AuthContext from '../context/AuthContext';

import { StoreContext } from 'redux-react-hook';
import configureStore from '../configureStore';
import AppPortal from '../components/AppPortal';

const { store } = configureStore();

const theme = createMuiTheme({
  palette: {
    primary: {
      light: amber[300],
      main: amber[500],
      dark: amber[700],
      contrastText: '#fff'
    },
    secondary: {
      light: lightBlue[300],
      main: lightBlue[500],
      dark: lightBlue[700],
      contrastText: '#fff'
    }
  }
});

export default function CustomApp({ Component, pageProps }: AppProps) {
  const [currentUser, setCurrentUser] = useState<User>(null);

  const initFirebase = useCallback(() => {
    firebase.initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    });
  }, []);

  const initServiceWorker = useCallback(async () => {
    const { Workbox } = await import('workbox-window');
    const wb = new Workbox('/sw.js');
    const registration = await wb.register();

    console.log(
      'ServiceWorker registration successful with scope: ',
      registration.scope
    );

    await getFirebaseMessaging();
    const messaging = firebase.messaging();
    messaging.useServiceWorker(registration);

    messaging.onTokenRefresh(async () => {
      console.log('Registration token was refreshed.');
      deleteRegistrationToken();
      createRegistrationToken();
    });
  }, []);

  const initLocale = useCallback(() => {
    const parsedUrl = new URL(window.location.href);
    const hl = parsedUrl.searchParams.get('hl');

    I18n.locale =
      hl ||
      window.navigator.language ||
      window.navigator['userLanguage'] ||
      window.navigator['browserLanguage'];
  }, []);

  const initApiClient = useCallback(() => {
    const defaultClient = ApiClient.instance;
    defaultClient.basePath = process.env.NEXT_PUBLIC_API_ENDPOINT;
  }, []);

  useEffect(() => {
    if (!firebase.apps.length) {
      initFirebase();
    }

    initLocale();
    initApiClient();

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      initServiceWorker();
    }

    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        firebase.auth().signInAnonymously();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <StoreContext.Provider value={store}>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider
          value={{
            currentUser: currentUser,
            setCurrentUser: setCurrentUser
          }}
        >
          <AppPortal>
            <Component {...pageProps} />
          </AppPortal>
        </AuthContext.Provider>
      </ThemeProvider>
    </StoreContext.Provider>
  );
}
