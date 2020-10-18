import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';

import selectMap from '../../../actions/selectMap';
import openToast from '../../../actions/openToast';
import clearMapState from '../../../actions/clearMapState';
import fetchMapReviews from '../../../actions/fetchMapReviews';
import fetchCollaborators from '../../../actions/fetchCollaborators';

import { Loader } from '@googlemaps/js-api-loader';
import { useMediaQuery, useTheme } from '@material-ui/core';
import I18n from '../../../utils/I18n';

import {
  ApiClient,
  MapsApi,
  CollaboratorsApi,
  ReviewsApi
} from '@yusuke-suzuki/qoodish-api-js-client';

import Drawer from '@material-ui/core/Drawer';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Fab from '@material-ui/core/Fab';
import switchSummary from '../../../actions/switchSummary';
import AuthContext from '../../../context/AuthContext';
import MapSummary from '../../../components/organisms/MapSummary';
import CreateResourceButton from '../../../components/molecules/CreateResourceButton';
import LocationButton from '../../../components/molecules/LocationButton';
import { useRouter } from 'next/router';
import SpotHorizontalList from '../../../components/organisms/SpotHorizontalList';
import DeleteMapDialog from '../../../components/organisms/DeleteMapDialog';
import MapSpotDrawer from '../../../components/organisms/MapSpotDrawer';
import GMap from '../../../components/organisms/GMap';
import InviteTargetDialog from '../../../components/organisms/InviteTargetDialog';
import Layout from '../../../components/Layout';
import Head from 'next/head';

const styles = {
  drawerPaperLarge: {
    zIndex: 1000
  },
  drawerPaperSmall: {
    height: '100%',
    width: '100%'
  },
  mapButtonsLarge: {
    right: 0,
    bottom: 0
  },
  mapButtonsSmall: {
    position: 'absolute',
    right: 0,
    bottom: 124
  },
  switchSummaryContainerLarge: {
    textAlign: 'center',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    top: 78
  },
  switchSummaryContainerSmall: {
    textAlign: 'center',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    top: 70
  },
  infoIcon: {
    marginRight: 6
  }
};

const MapSummaryDrawer = React.memo(() => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const mapState = useCallback(
    state => ({
      mapSummaryOpen: state.mapDetail.mapSummaryOpen
    }),
    []
  );
  const { mapSummaryOpen } = useMappedState(mapState);

  const router = useRouter();
  const { mapId } = router.query;

  return (
    <Drawer
      variant={lgUp ? 'persistent' : 'temporary'}
      anchor={lgUp ? 'left' : 'right'}
      open={lgUp ? true : mapSummaryOpen}
      PaperProps={{
        style: lgUp ? styles.drawerPaperLarge : styles.drawerPaperSmall
      }}
    >
      <MapSummary mapId={mapId} dialogMode={lgUp ? false : true} />
    </Drawer>
  );
});

const MapButtons = React.memo(props => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const { currentMap } = props;

  return (
    <div style={lgUp ? styles.mapButtonsLarge : styles.mapButtonsSmall}>
      <CreateResourceButton
        buttonForMap
        defaultCreateReview
        disabled={!(currentMap && currentMap.postable && currentMap.following)}
      />
      <LocationButton />
    </div>
  );
});

const SwitchSummaryButton = React.memo(() => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));

  const handleSummaryButtonClick = useCallback(() => {
    dispatch(switchSummary());
  }, [dispatch]);

  return (
    <div
      style={
        smUp
          ? styles.switchSummaryContainerLarge
          : styles.switchSummaryContainerSmall
      }
    >
      <Fab
        variant="extended"
        size="small"
        color="primary"
        onClick={handleSummaryButtonClick}
      >
        <InfoOutlinedIcon style={styles.infoIcon} />
        {I18n.t('summary')}
      </Fab>
    </div>
  );
});

const MapDetail = props => {
  const { currentUser } = useContext(AuthContext);
  const [googleMapsApiLoaded, setGoogleMapsApiLoaded] = useState<boolean>(
    false
  );
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const dispatch = useDispatch();
  const router = useRouter();
  const { mapId } = router.query;

  const mapState = useCallback(
    state => ({
      currentMap: state.mapDetail.currentMap
    }),
    []
  );
  const { currentMap } = useMappedState(mapState);

  const initGoogleMapsApi = useCallback(async () => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry'],
      region: 'JP',
      language: 'ja'
    });
    await loader.load();

    setGoogleMapsApiLoaded(true);
  }, []);

  const initMap = useCallback(async () => {
    const apiInstance = new MapsApi();
    const firebaseAuth = ApiClient.instance.authentications['firebaseAuth'];
    firebaseAuth.apiKey = await currentUser.getIdToken();
    firebaseAuth.apiKeyPrefix = 'Bearer';

    apiInstance.mapsMapIdGet(mapId, (error, data, response) => {
      if (response.ok) {
        dispatch(selectMap(response.body));
      } else if (response.status == 401) {
        dispatch(openToast('Authenticate failed'));
      } else if (response.status == 404) {
        router.push('');
        dispatch(openToast(I18n.t('map not found')));
      } else {
        dispatch(openToast('Failed to fetch Map.'));
      }
    });
  }, [dispatch, router, mapId, currentUser]);

  const initMapReviews = useCallback(async () => {
    const apiInstance = new ReviewsApi();
    const firebaseAuth = ApiClient.instance.authentications['firebaseAuth'];
    firebaseAuth.apiKey = await currentUser.getIdToken();
    firebaseAuth.apiKeyPrefix = 'Bearer';

    apiInstance.mapsMapIdReviewsGet(mapId, {}, (error, data, response) => {
      if (response.ok) {
        dispatch(fetchMapReviews(response.body));
      }
    });
  }, [dispatch, mapId, currentUser]);

  const initFollowers = useCallback(async () => {
    const apiInstance = new CollaboratorsApi();
    const firebaseAuth = ApiClient.instance.authentications['firebaseAuth'];
    firebaseAuth.apiKey = await currentUser.getIdToken();
    firebaseAuth.apiKeyPrefix = 'Bearer';

    apiInstance.mapsMapIdCollaboratorsGet(mapId, (error, data, response) => {
      if (response.ok) {
        dispatch(fetchCollaborators(response.body));
      } else {
        console.log('API called successfully. Returned data: ' + data);
      }
    });
  }, [mapId, currentUser]);

  useEffect(() => {
    if (googleMapsApiLoaded) {
      return;
    }

    initGoogleMapsApi();
  }, []);

  useEffect(() => {
    if (!currentUser || !currentUser.uid) {
      return;
    }
    initMap();
    initMapReviews();
    initFollowers();

    return () => {
      dispatch(clearMapState());
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentMap) {
      return;
    }

    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID, {
      page_location: `${process.env.NEXT_PUBLIC_ENDPOINT}/maps/${currentMap.id}`,
      page_title: `${currentMap.name} | Qoodish`
    });
  }, [currentMap]);

  return (
    <Layout hideBottomNav={true} fullWidth={true}>
      <Head>
        {currentMap && <title>{`${currentMap.name} | Qoodish`}</title>}
        {currentMap && (
          <link
            rel="canonical"
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/maps/${currentMap.id}`}
          />
        )}
        {currentMap && (
          <link
            rel="alternate"
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/maps/${currentMap.id}?hl=en`}
            hrefLang="en"
          />
        )}
        {currentMap && (
          <link
            rel="alternate"
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/maps/${currentMap.id}?hl=ja`}
            hrefLang="ja"
          />
        )}
        {currentMap && (
          <link
            rel="alternate"
            href={`${process.env.NEXT_PUBLIC_ENDPOINT}/maps/${currentMap.id}`}
            hrefLang="x-default"
          />
        )}
        {currentMap && currentMap.private && (
          <meta name="robots" content="noindex" />
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {currentMap && (
          <meta
            name="keywords"
            content={`${currentMap.name}, Qoodish, qoodish, 食べ物, グルメ, 食事, マップ, 地図, 友だち, グループ, 旅行, 観光, 観光スポット, maps, travel, food, group, trip`}
          />
        )}
        {currentMap && (
          <meta name="title" content={`${currentMap.name} | Qoodish`} />
        )}
        {currentMap && (
          <meta name="description" content={currentMap.description} />
        )}
        {currentMap && (
          <meta property="og:title" content={`${currentMap.name} | Qoodish`} />
        )}
        {currentMap && (
          <meta property="og:description" content={currentMap.description} />
        )}
        <meta property="og:locale" content={I18n.locale} />
        <meta property="og:site_name" content={I18n.t('meta headline')} />
        {currentMap && (
          <meta
            property="og:url"
            content={`${process.env.NEXT_PUBLIC_ENDPOINT}/maps/${currentMap.id}`}
          />
        )}
        {currentMap && (
          <meta property="og:image" content={currentMap.thumbnail_url_800} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        {currentMap && (
          <meta name="twitter:image" content={currentMap.thumbnail_url_800} />
        )}
        {currentMap && (
          <meta name="twitter:title" content={`${currentMap.name} | Qoodish`} />
        )}
        {currentMap && (
          <meta name="twitter:description" content={currentMap.description} />
        )}
      </Head>

      {lgUp ? (
        <div>
          <MapSummaryDrawer {...props} />
          {googleMapsApiLoaded && <GMap />}
          <MapButtons currentMap={currentMap} />
        </div>
      ) : (
        <div>
          <SwitchSummaryButton />
          {googleMapsApiLoaded && <GMap />}
          <MapButtons currentMap={currentMap} />
          <SpotHorizontalList />
          <MapSummaryDrawer {...props} />
        </div>
      )}
      <DeleteMapDialog mapId={mapId} />
      <InviteTargetDialog mapId={mapId} />
      {!lgUp && <MapSpotDrawer mapId={mapId} />}
    </Layout>
  );
};

export default React.memo(MapDetail);
