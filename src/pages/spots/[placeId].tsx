import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';

import CircularProgress from '@material-ui/core/CircularProgress';

import I18n from '../../utils/I18n';
import openToast from '../../actions/openToast';
import fetchSpot from '../../actions/fetchSpot';

import { ApiClient, SpotsApi } from '@yusuke-suzuki/qoodish-api-js-client';
import AuthContext from '../../context/AuthContext';
import SpotCard from '../../components/organisms/SpotCard';
import NoContents from '../../components/molecules/NoContents';
import CreateResourceButton from '../../components/molecules/CreateResourceButton';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Head from 'next/head';

const styles = {
  progress: {
    textAlign: 'center',
    paddingTop: 20
  }
};

const SpotDetailContainer = () => {
  const mapState = useCallback(
    state => ({
      currentSpot: state.spotDetail.currentSpot
    }),
    []
  );
  const { currentSpot } = useMappedState(mapState);
  const router = useRouter();
  const { placeId } = router.query;

  if (currentSpot) {
    return <SpotCard currentSpot={currentSpot} placeId={placeId} />;
  } else {
    return (
      <NoContents contentType="spot" message={I18n.t('place not found')} />
    );
  }
};

const SpotDetail = props => {
  const router = useRouter();
  const { placeId } = router.query;
  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      currentSpot: state.spotDetail.currentSpot
    }),
    []
  );
  const { currentSpot } = useMappedState(mapState);
  const { currentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  const initSpot = useCallback(async () => {
    setLoading(true);
    const apiInstance = new SpotsApi();
    const firebaseAuth = ApiClient.instance.authentications['firebaseAuth'];
    firebaseAuth.apiKey = await currentUser.getIdToken();
    firebaseAuth.apiKeyPrefix = 'Bearer';

    apiInstance.spotsPlaceIdGet(placeId, (error, data, response) => {
      setLoading(false);
      if (response.ok) {
        dispatch(fetchSpot(response.body));
      } else if (response.status == 401) {
        dispatch(openToast('Authenticate failed'));
      } else if (response.status == 404) {
        dispatch(openToast('Spot not found.'));
      } else {
        dispatch(openToast('Failed to fetch Spot.'));
      }
    });
  }, [placeId, currentUser]);

  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      return;
    }

    if (!currentSpot) {
      initSpot();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentSpot) {
      return;
    }

    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      page_location: `${process.env.NEXT_PUBLIC_ENDPOINT}/spots/${currentSpot.place_id}`,
      page_title: `${currentSpot.name} | Qoodish`
    });
  }, [currentSpot]);

  return (
    <Layout hideBottomNav={true} fullWidth={false}>
      <Head>
        {currentSpot && <title>{`${currentSpot.name} | Qoodish`}</title>}
        {currentSpot && (
          <link
            rel="canonical"
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/spots/${currentSpot.place_id}`}
          />
        )}
        {currentSpot && (
          <link
            rel="alternate"
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/spots/${currentSpot.place_id}?hl=en`}
            hrefLang="en"
          />
        )}
        {currentSpot && (
          <link
            rel="alternate"
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/spots/${currentSpot.place_id}?hl=ja`}
            hrefLang="ja"
          />
        )}
        {currentSpot && (
          <link
            rel="alternate"
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/spots/${currentSpot.place_id}`}
            hrefLang="x-default"
          />
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {currentSpot && (
          <meta
            name="keywords"
            content={`${currentSpot.name}, Qoodish, qoodish, 食べ物, グルメ, 食事, マップ, 地図, 友だち, グループ, 旅行, 観光, 観光スポット, maps, travel, food, group, trip`}
          />
        )}
        {currentSpot && (
          <meta name="title" content={`${currentSpot.name} | Qoodish`} />
        )}
        {currentSpot && (
          <meta name="description" content={currentSpot.formatted_address} />
        )}
        {currentSpot && (
          <meta property="og:title" content={`${currentSpot.name} | Qoodish`} />
        )}
        {currentSpot && (
          <meta
            property="og:description"
            content={currentSpot.formatted_address}
          />
        )}
        <meta property="og:locale" content={I18n.locale} />
        <meta property="og:site_name" content={I18n.t('meta headline')} />
        {currentSpot && (
          <meta
            property="og:url"
            content={`${process.env.NEXT_PUBLIC_ENDPOINT}/spots/${currentSpot.place_id}`}
          />
        )}
        {currentSpot && (
          <meta property="og:image" content={currentSpot.thumbnail_url_800} />
        )}
        <meta name="twitter:card" content="summary" />
        {currentSpot && (
          <meta name="twitter:image" content={currentSpot.thumbnail_url_800} />
        )}
        {currentSpot && (
          <meta
            name="twitter:title"
            content={`${currentSpot.name} | Qoodish`}
          />
        )}
        {currentSpot && (
          <meta
            name="twitter:description"
            content={currentSpot.formatted_address}
          />
        )}
      </Head>

      <div>
        {loading ? (
          <div style={styles.progress}>
            <CircularProgress />
          </div>
        ) : (
          <SpotDetailContainer {...props} />
        )}
      </div>
      {currentSpot && <CreateResourceButton />}
    </Layout>
  );
};

export default React.memo(SpotDetail);
