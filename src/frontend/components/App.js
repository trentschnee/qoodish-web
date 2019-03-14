import React, { useEffect, useCallback } from 'react';
import { useDispatch, useMappedState } from 'redux-react-hook';

const Layout = React.lazy(() =>
  import(/* webpackChunkName: "layout" */ './Layout')
);

import Helmet from 'react-helmet';

import fetchMyProfile from '../actions/fetchMyProfile';
import updateLinkedProviders from '../actions/updateLinkedProviders';
import fetchNotifications from '../actions/fetchNotifications';
import fetchRegistrationToken from '../actions/fetchRegistrationToken';
import signIn from '../actions/signIn';

import getCurrentUser from '../utils/getCurrentUser';
import getFirebase from '../utils/getFirebase';
import getFirebaseAuth from '../utils/getFirebaseAuth';
import getFirebaseMessaging from '../utils/getFirebaseMessaging';
import initializeApiClient from '../utils/initializeApiClient';

import {
  UsersApi,
  DevicesApi,
  InlineObject1,
  NotificationsApi
} from 'qoodish_api';

const pushApiAvailable = () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    return true;
  } else {
    console.log('Push notification API is not available in this browser.');
    return false;
  }
};

const AppHelmet = () => {
  return (
    <Helmet
      title="Qoodish"
      link={[{ rel: 'canonical', href: process.env.ENDPOINT }]}
      meta={[
        { name: 'title', content: 'Qoodish' },
        {
          name: 'keywords',
          content:
            'Qoodish, qoodish, 食べ物, グルメ, 食事, マップ, 地図, 友だち, グループ, 旅行, 観光, 観光スポット, maps, travel, food, group, trip'
        },
        { name: 'theme-color', content: '#ffc107' },
        {
          name: 'description',
          content:
            'Qoodish では友だちとマップを作成してお気に入りのお店や観光スポットなどの情報をシェアすることができます。'
        },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Qoodish' },
        {
          name: 'twitter:description',
          content:
            'Qoodish では友だちとマップを作成してお気に入りのお店や観光スポットなどの情報をシェアすることができます。'
        },
        { name: 'twitter:image', content: process.env.SUBSTITUTE_URL },
        { property: 'og:site_name', content: 'Qoodish - マップベースド SNS' },
        { property: 'og:title', content: 'Qoodish' },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:url',
          content: process.env.ENDPOINT
        },
        { property: 'og:image', content: process.env.SUBSTITUTE_URL },
        {
          property: 'og:description',
          content:
            'Qoodish では友だちとマップを作成してお気に入りのお店や観光スポットなどの情報をシェアすることができます。'
        },
        { 'http-equiv': 'content-language', content: window.currentLocale }
      ]}
      script={[
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'http://schema.org',
            '@type': 'WebSite',
            name: 'Qoodish',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': process.env.ENDPOINT
            },
            headline: 'Qoodish | マップベースド SNS',
            image: {
              '@type': 'ImageObject',
              url: process.env.ICON_512,
              width: 512,
              height: 512
            },
            datePublished: '',
            dateModified: '',
            author: {
              '@type': 'Person',
              name: ''
            },
            publisher: {
              '@type': 'Organization',
              name: 'Qoodish',
              logo: {
                '@type': 'ImageObject',
                url: process.env.ICON_512,
                width: 512,
                height: 512
              }
            },
            description:
              'Qoodish では友だちとマップを作成してお気に入りのお店や観光スポットなどの情報をシェアすることができます。'
          })
        }
      ]}
    />
  );
};

const App = () => {
  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      registrationToken: state.app.registrationToken
    }),
    []
  );

  const { registrationToken } = useMappedState(mapState);

  const refreshRegistrationToken = useCallback(async () => {
    const firebase = await getFirebase();
    await getFirebaseMessaging();
    const messaging = firebase.messaging();

    const refreshedToken = await messaging.getToken();

    if (!refreshedToken) {
      console.log('Unable to get registration token.');
      return;
    }

    await initializeApiClient();

    const apiInstance = new DevicesApi();
    const inlineObject1 = InlineObject1.constructFromObject({
      registration_token: refreshedToken
    });

    apiInstance.devicesPost(inlineObject1, (error, data, response) => {
      if (response.ok) {
        console.log('Successfully sent registration token.');
        dispatch(fetchRegistrationToken(refreshedToken));
      } else {
        console.log('Failed to send registration token.');
      }
    });
  });

  const initMessaging = useCallback(async () => {
    if (!pushApiAvailable()) {
      return;
    }

    const firebase = await getFirebase();
    await getFirebaseMessaging();
    const messaging = firebase.messaging();

    messaging.onTokenRefresh(async () => {
      console.log('Registration token was refreshed.');
      refreshRegistrationToken();
    });
  });

  const initProfile = useCallback(async () => {
    await initializeApiClient();
    const apiInstance = new UsersApi();
    const currentUser = await getCurrentUser();

    apiInstance.usersUserIdGet(
      currentUser.uid,
      async (error, data, response) => {
        if (response.ok) {
          const user = response.body;
          dispatch(fetchMyProfile(user));
          let firebaseUser = await getCurrentUser();
          let linkedProviders = firebaseUser.providerData.map(provider => {
            return provider.providerId;
          });
          dispatch(updateLinkedProviders(linkedProviders));

          if (user.push_enabled) {
            if (!registrationToken) {
              refreshRegistrationToken();
            }
          } else {
            console.log('Push notification is prohibited.');
          }
        } else {
          console.log('Fetch profile failed.');
        }
      }
    );
  });

  const refreshNotifications = useCallback(async () => {
    await initializeApiClient();
    const apiInstance = new NotificationsApi();

    apiInstance.notificationsGet((error, data, response) => {
      if (response.ok) {
        dispatch(fetchNotifications(response.body));
      }
    });
  });

  const initUser = useCallback(async () => {
    let firebaseUser = await getCurrentUser();

    if (firebaseUser && !firebaseUser.isAnonymous) {
      initProfile();
      initMessaging();
      refreshNotifications();
      return;
    }

    if (!firebaseUser) {
      const firebase = await getFirebase();
      await getFirebaseAuth();
      await firebase.auth().signInAnonymously();
      firebaseUser = firebase.auth().currentUser;
    }

    const user = {
      uid: firebaseUser.uid,
      isAnonymous: true
    };
    dispatch(signIn(user));
  });

  useEffect(() => {
    initUser();
  }, []);

  return (
    <div>
      <AppHelmet />
      <React.Suspense fallback={null}>
        <Layout />
      </React.Suspense>
    </div>
  );
};

export default React.memo(App);
