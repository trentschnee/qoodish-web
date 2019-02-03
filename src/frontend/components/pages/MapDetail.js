import React, { useCallback, useEffect } from 'react';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

import loadable from '@loadable/component';

import ApiClient from '../../utils/ApiClient';
import selectMap from '../../actions/selectMap';
import openToast from '../../actions/openToast';
import requestCurrentPosition from '../../actions/requestCurrentPosition';
import requestMapCenter from '../../actions/requestMapCenter';
import fetchSpots from '../../actions/fetchSpots';
import clearMapState from '../../actions/clearMapState';
import fetchMapReviews from '../../actions/fetchMapReviews';
import fetchCollaborators from '../../actions/fetchCollaborators';

import I18n from '../../utils/I18n';

const GMap = loadable(() =>
  import(/* webpackChunkName: "gmap" */ '../organisms/GMap')
);
const MapSummary = loadable(() =>
  import(/* webpackChunkName: "map_summary" */ '../organisms/MapSummary')
);
const MapBottomSeat = loadable(() =>
  import(/* webpackChunkName: "map_bottom_seat" */ '../organisms/MapBottomSeat')
);
const DeleteMapDialog = loadable(() =>
  import(/* webpackChunkName: "delete_map_dialog" */ '../organisms/DeleteMapDialog')
);
const InviteTargetDialog = loadable(() =>
  import(/* webpackChunkName: "invite_target_dialog" */ '../organisms/InviteTargetDialog')
);
const SpotCard = loadable(() =>
  import(/* webpackChunkName: "spot_card" */ '../organisms/SpotCard')
);

import Helmet from 'react-helmet';
import Drawer from '@material-ui/core/Drawer';

const styles = {
  containerLarge: {},
  containerSmall: {
    position: 'fixed',
    top: 56,
    left: 0,
    bottom: 71,
    right: 0,
    display: 'block',
    width: '100%'
  },
  drawerPaperLarge: {},
  drawerPaperSmall: {
    height: '100%'
  }
};

const dispatchGtag = map => {
  gtag('config', process.env.GA_TRACKING_ID, {
    page_path: `/maps/${map.id}`,
    page_title: `${map.name} | Qoodish`
  });
};

const MapDetailHelmet = props => {
  const map = props.map;

  return (
    <Helmet
      title={`${map.name} | Qoodish`}
      link={[
        { rel: 'canonical', href: `${process.env.ENDPOINT}/maps/${map.id}` }
      ]}
      meta={[
        map.private ? { name: 'robots', content: 'noindex' } : {},
        { name: 'title', content: `${map.name} | Qoodish` },
        {
          name: 'keywords',
          content: `${
            map.name
          }, Qoodish, qoodish, 食べ物, グルメ, 食事, マップ, 地図, 友だち, グループ, 旅行, 観光, 観光スポット, maps, travel, food, group, trip`
        },
        { name: 'description', content: map.description },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${map.name} | Qoodish` },
        { name: 'twitter:description', content: map.description },
        { name: 'twitter:image', content: map.image_url },
        { property: 'og:title', content: `${map.name} | Qoodish` },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:url',
          content: `${process.env.ENDPOINT}/maps/${map.id}`
        },
        { property: 'og:image', content: map.image_url },
        {
          property: 'og:description',
          content: map.description
        }
      ]}
    />
  );
};

const MapSummaryDrawer = props => {
  const large = useMediaQuery('(min-width: 600px)');
  const mapState = useCallback(
    state => ({
      mapSummaryOpen: state.mapDetail.mapSummaryOpen
    }),
    []
  );
  const { mapSummaryOpen } = useMappedState(mapState);

  return (
    <Drawer
      variant={large ? 'persistent' : 'temporary'}
      anchor={large ? 'left' : 'bottom'}
      open={large ? true : mapSummaryOpen}
      PaperProps={{
        style: large ? styles.drawerPaperLarge : styles.drawerPaperSmall
      }}
    >
      <MapSummary
        mapId={props.params.primaryId}
        dialogMode={large ? false : true}
      />
    </Drawer>
  );
};

const MapDetail = props => {
  const large = useMediaQuery('(min-width: 600px)');
  const dispatch = useDispatch();

  const mapState = useCallback(
    state => ({
      currentMap: state.mapDetail.currentMap,
      history: state.shared.history,
      currentLocation: state.shared.currentLocation
    }),
    []
  );
  const { currentMap, history, currentLocation } = useMappedState(mapState);

  const initMap = useCallback(async () => {
    const client = new ApiClient();
    let response = await client.fetchMap(props.params.primaryId);
    if (response.ok) {
      let map = await response.json();
      dispatch(selectMap(map));
      dispatchGtag(map);

      if (map.base.place_id) {
        dispatch(requestMapCenter(map.base.lat, map.base.lng));
      } else {
        dispatch(requestCurrentPosition());
      }
    } else if (response.status == 401) {
      dispatch(openToast('Authenticate failed'));
    } else if (response.status == 404) {
      history.push('');
      dispatch(openToast(I18n.t('map not found')));
    } else {
      dispatch(openToast('Failed to fetch Map.'));
    }
  });

  const initSpots = useCallback(async () => {
    const client = new ApiClient();
    let response = await client.fetchSpots(props.params.primaryId);
    if (response.ok) {
      let spots = await response.json();
      dispatch(fetchSpots(spots));
    }
  });

  const initMapReviews = useCallback(async () => {
    const client = new ApiClient();
    let response = await client.fetchMapReviews(props.params.primaryId);
    if (response.ok) {
      let reviews = await response.json();
      dispatch(fetchMapReviews(reviews));
    }
  });

  const initFollowers = useCallback(async () => {
    const client = new ApiClient();
    let response = await client.fetchCollaborators(props.params.primaryId);
    if (response.ok) {
      let followers = await response.json();
      dispatch(fetchCollaborators(followers));
    }
  });

  const refreshMap = useCallback(() => {
    initMap();
    initSpots();
    initMapReviews();
    initFollowers();
  });

  useEffect(
    () => {
      refreshMap();
      return () => {
        dispatch(clearMapState());
      };
    },
    [currentLocation.pathname]
  );

  return (
    <div>
      {currentMap && <MapDetailHelmet map={currentMap} />}
      {large ? (
        <div>
          <MapSummaryDrawer {...props} />
          <GMap />
        </div>
      ) : (
        <div>
          <div style={large ? styles.containerLarge : styles.containerSmall}>
            <GMap />
          </div>
          <MapBottomSeat map={currentMap} />
          <MapSummaryDrawer {...props} />
        </div>
      )}
      <DeleteMapDialog mapId={props.params.primaryId} />
      <InviteTargetDialog mapId={props.params.primaryId} />
      <SpotCard mapId={props.params.primaryId} />
    </div>
  );
};

export default React.memo(MapDetail);
