import React, { memo, useCallback, useContext, useEffect } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';

import ExploreIcon from '@material-ui/icons/Explore';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import FiberNewIcon from '@material-ui/icons/FiberNew';
import Typography from '@material-ui/core/Typography';

import I18n from '../../utils/I18n';

import fetchActiveMaps from '../../actions/fetchActiveMaps';
import fetchRecentMaps from '../../actions/fetchRecentMaps';

import { ApiClient, MapsApi } from '@yusuke-suzuki/qoodish-api-js-client';
import AuthContext from '../../context/AuthContext';
import { useTheme, useMediaQuery } from '@material-ui/core';
import MapCollection from '../../components/organisms/MapCollection';
import SkeletonMapCollection from '../../components/organisms/SkeletonMapCollection';
import PickUpMap from '../../components/organisms/PickUpMap';
import RecentReviews from '../../components/organisms/RecentReviews';
import TrendingMaps from '../../components/organisms/TrendingMaps';
import TrendingSpots from '../../components/organisms/TrendingSpots';
import CreateResourceButton from '../../components/molecules/CreateResourceButton';
import Layout from '../../components/Layout';
import Head from 'next/head';

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 40
  },
  rankingContainer: {
    marginTop: 40,
    marginBottom: 20
  },
  mapsContainer: {
    marginBottom: 40
  },
  gridHeader: {
    width: '100%',
    display: 'inline-flex',
    marginBottom: 15
  },
  headerIcon: {
    marginRight: 10
  }
};

const MapContainer = React.memo(props => {
  const { maps } = props;

  return maps.length > 0 ? (
    <MapCollection maps={maps} horizontal />
  ) : (
    <SkeletonMapCollection horizontal />
  );
});

export default memo(function Discover() {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const { currentUser } = useContext(AuthContext);

  const dispatch = useDispatch();
  const mapState = useCallback(
    state => ({
      activeMaps: state.discover.activeMaps,
      recentMaps: state.discover.recentMaps
    }),
    []
  );
  const { activeMaps, recentMaps } = useMappedState(mapState);

  const initActiveMaps = useCallback(async () => {
    const apiInstance = new MapsApi();
    const firebaseAuth = ApiClient.instance.authentications['firebaseAuth'];
    firebaseAuth.apiKey = await currentUser.getIdToken();
    firebaseAuth.apiKeyPrefix = 'Bearer';
    const opts = {
      active: true
    };

    apiInstance.mapsGet(opts, (error, data, response) => {
      if (response.ok) {
        const maps = response.body;
        dispatch(fetchActiveMaps(maps));
      } else {
        console.log(error);
      }
    });
  }, [dispatch, currentUser]);

  const initRecentMaps = useCallback(async () => {
    const apiInstance = new MapsApi();
    const firebaseAuth = ApiClient.instance.authentications['firebaseAuth'];
    firebaseAuth.apiKey = await currentUser.getIdToken();
    firebaseAuth.apiKeyPrefix = 'Bearer';
    const opts = {
      recent: true
    };

    apiInstance.mapsGet(opts, (error, data, response) => {
      if (response.ok) {
        const maps = response.body;
        dispatch(fetchRecentMaps(maps));
      } else {
        console.log(error);
      }
    });
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      return;
    }
    initActiveMaps();
    initRecentMaps();
  }, [currentUser]);

  useEffect(() => {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      page_location: `${process.env.NEXT_PUBLIC_ENDPOINT}/discover`,
      page_title: `${I18n.t('discover')} | Qoodish`
    });
  }, []);

  return (
    <Layout hideBottomNav={false} fullWidth={false}>
      <Head>
        <title>{`${I18n.t('discover')} | Qoodish`}</title>
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/discover`}
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/discover?hl=en`}
          hrefLang="en"
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/discover?hl=ja`}
          hrefLang="ja"
        />
        <link
          rel="alternate"
          href={`${process.env.NEXT_PUBLIC_ENDPOINT}/discover`}
          hrefLang="x-default"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="Qoodish, qoodish, 食べ物, グルメ, 食事, マップ, 地図, 友だち, グループ, 旅行, 観光, maps, travel, food, group, trip"
        />
        <meta name="title" content={`${I18n.t('discover')} | Qoodish`} />
        <meta name="description" content={I18n.t('meta description')} />
        <meta property="og:title" content={`${I18n.t('discover')} | Qoodish`} />
        <meta property="og:description" content={I18n.t('meta description')} />
        <meta property="og:locale" content={I18n.locale} />
        <meta property="og:site_name" content={I18n.t('meta headline')} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_ENDPOINT}/discover`}
        />
        <meta property="og:image" content={process.env.NEXT_PUBLIC_OGP_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={process.env.NEXT_PUBLIC_OGP_IMAGE}
        />
        <meta
          name="twitter:title"
          content={`${I18n.t('discover')} | Qoodish`}
        />
        <meta name="twitter:description" content={I18n.t('meta description')} />
      </Head>

      <div style={styles.container}>
        <Typography
          variant="subtitle1"
          gutterBottom
          color="textSecondary"
          style={styles.gridHeader}
        >
          <ExploreIcon style={styles.headerIcon} /> {I18n.t('pick up')}
        </Typography>
        <br />
        <PickUpMap />
      </div>

      <div style={styles.container}>
        <Typography
          variant="subtitle1"
          gutterBottom
          color="textSecondary"
          style={styles.gridHeader}
        >
          <FiberNewIcon style={styles.headerIcon} /> {I18n.t('recent reports')}
        </Typography>
        <br />
        <RecentReviews />
      </div>

      <div style={styles.container}>
        <Typography
          variant="subtitle1"
          gutterBottom
          color="textSecondary"
          style={styles.gridHeader}
        >
          <WhatshotIcon style={styles.headerIcon} /> {I18n.t('active maps')}
        </Typography>
        <MapContainer maps={activeMaps} />
      </div>

      <div style={styles.container}>
        <Typography
          variant="subtitle1"
          gutterBottom
          color="textSecondary"
          style={styles.gridHeader}
        >
          <FiberNewIcon style={styles.headerIcon} /> {I18n.t('recent maps')}
        </Typography>
        <MapContainer maps={recentMaps} />
      </div>

      {!mdUp && (
        <div>
          <div style={styles.rankingContainer}>
            <TrendingMaps />
          </div>

          <div style={styles.rankingContainer}>
            <TrendingSpots />
          </div>
        </div>
      )}

      {smUp && <CreateResourceButton />}
    </Layout>
  );
});
