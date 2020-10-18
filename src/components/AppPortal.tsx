import { useRouter } from 'next/router';
import React, { Fragment, useCallback, useContext, useEffect } from 'react';
import { useDispatch } from 'redux-react-hook';
import locationChange from '../actions/locationChange';
import AuthContext from '../context/AuthContext';
import { UsersApi, ApiClient } from '@yusuke-suzuki/qoodish-api-js-client';
import fetchMyProfile from '../actions/fetchMyProfile';

type Props = {
  children: any;
};

export default function AppPortal(props: Props) {
  const { children } = props;

  const { currentUser } = useContext(AuthContext);

  const dispatch = useDispatch();
  const router = useRouter();

  const getProfile = useCallback(async () => {
    const apiInstance = new UsersApi();
    const firebaseAuth = ApiClient.instance.authentications['firebaseAuth'];
    firebaseAuth.apiKey = await currentUser.getIdToken();
    firebaseAuth.apiKeyPrefix = 'Bearer';

    apiInstance.usersUserIdGet(currentUser.uid, (error, data, response) => {
      if (response.ok) {
        dispatch(fetchMyProfile(response.body));
      } else {
        console.log('Fetch profile failed.');
      }
    });
  }, [dispatch, currentUser]);

  const handleRouteChange = useCallback(
    url => {
      console.log('App is changing to: ', url);
      dispatch(locationChange(url));
    },
    [dispatch]
  );

  useEffect(() => {
    if (currentUser && !currentUser.isAnonymous) {
      getProfile();
    }
  }, [currentUser]);

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  return <Fragment>{children}</Fragment>;
}
